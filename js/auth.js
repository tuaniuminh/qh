// ============================================================
// AUTH.JS - Xác thực SHA-256 + WebAuthn (Face ID / Vân tay)
// ============================================================
//
// ⚙️  THAY ĐỔI MẬT KHẨU:
//   AuthSystem.generateHash('mật_khẩu_mới').then(h => console.log(h))
//   → Thay chuỗi hash vào PASSWORD_HASH bên dưới.
//
// 🔑 Mật khẩu hiện tại: Minh231099@96
// ============================================================

const AuthSystem = {

  PASSWORD_HASH:  '2a4553ae34d0b9311a051ebbc896b6906d8c49b7034bfb40dfeb4cf24c9e9354',
  SESSION_KEY:    'mc_auth_ok',
  REMEMBER_KEY:   'mc_auth_remember',
  BIOMETRIC_KEY:  'mc_biometric_cred',   // lưu credentialId (base64)
  REMEMBER_DAYS:  7,

  // ════════════════════════════════════════
  //  UTILITIES
  // ════════════════════════════════════════

  async generateHash(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  },

  async verify(pw) {
    return (await this.generateHash(pw.trim())) === this.PASSWORD_HASH;
  },

  // ── ArrayBuffer ↔ Base64 helpers ──
  _ab2b64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  },
  _b642ab(b64) {
    const bin = atob(b64);
    return Uint8Array.from(bin, c => c.charCodeAt(0)).buffer;
  },

  // ════════════════════════════════════════
  //  SESSION
  // ════════════════════════════════════════

  isAuthenticated() {
    if (sessionStorage.getItem(this.SESSION_KEY) === '1') return true;
    const until = localStorage.getItem(this.REMEMBER_KEY);
    if (until && Date.now() < parseInt(until, 10)) {
      sessionStorage.setItem(this.SESSION_KEY, '1');
      return true;
    }
    return false;
  },

  saveSession(remember) {
    sessionStorage.setItem(this.SESSION_KEY, '1');
    if (remember) {
      localStorage.setItem(this.REMEMBER_KEY,
        String(Date.now() + this.REMEMBER_DAYS * 864e5));
    }
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    location.reload();
  },

  // ════════════════════════════════════════
  //  WEBAUTHN — BIOMETRIC
  // ════════════════════════════════════════

  // Kiểm tra thiết bị hỗ trợ sinh trắc học không
  async isBiometricAvailable() {
    if (!window.PublicKeyCredential) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch { return false; }
  },

  // Đã đăng ký sinh trắc học chưa
  hasBiometricEnrolled() {
    return !!localStorage.getItem(this.BIOMETRIC_KEY);
  },

  // Tên hiển thị theo thiết bị
  getBiometricLabel() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return { icon: '󠀠', label: 'Face ID', short: 'Face ID' };
    if (/Android/.test(ua))      return { icon: '👆', label: 'Vân tay / Khuôn mặt', short: 'Sinh trắc học' };
    if (/Mac/.test(ua))          return { icon: '👆', label: 'Touch ID', short: 'Touch ID' };
    return { icon: '🔐', label: 'Sinh trắc học', short: 'Sinh trắc học' };
  },

  // ── ĐĂNG KÝ (sau khi đăng nhập mật khẩu thành công) ──
  async registerBiometric() {
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId    = crypto.getRandomValues(new Uint8Array(16));

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'MenControl Pro',
            id:   location.hostname   // 'tuaniuminh.github.io' hoặc 'localhost'
          },
          user: {
            id:          userId,
            name:        'user@mencontrol',
            displayName: 'MenControl User'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7  },  // ES256
            { type: 'public-key', alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',  // chỉ Face ID / vân tay máy
            userVerification:        'required',
            residentKey:             'preferred'
          },
          timeout: 60000
        }
      });

      // Lưu credentialId
      localStorage.setItem(this.BIOMETRIC_KEY, this._ab2b64(credential.rawId));
      return true;
    } catch (err) {
      console.warn('[Auth] Biometric register failed:', err.name, err.message);
      return false;
    }
  },

  // ── XÁC THỰC SINH TRẮC HỌC ──
  async authenticateBiometric() {
    const credIdB64 = localStorage.getItem(this.BIOMETRIC_KEY);
    if (!credIdB64) return false;

    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{
            type: 'public-key',
            id:   this._b642ab(credIdB64),
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      });

      return !!assertion;
    } catch (err) {
      console.warn('[Auth] Biometric auth failed:', err.name, err.message);
      return false;
    }
  },

  // Xóa đăng ký sinh trắc học
  removeBiometric() {
    localStorage.removeItem(this.BIOMETRIC_KEY);
  },

  // ════════════════════════════════════════
  //  APP LIFECYCLE
  // ════════════════════════════════════════

  async init() {
    if (this.isAuthenticated()) {
      this.showApp();
    } else {
      await this.showGate();
    }
  },

  showApp() {
    const gate = document.getElementById('auth-gate');
    const app  = document.getElementById('app');
    if (gate) {
      gate.style.opacity   = '0';
      gate.style.transform = 'scale(0.97)';
      gate.style.transition = 'all 0.4s ease';
      setTimeout(() => { gate.style.display = 'none'; }, 400);
    }
    if (app) {
      app.style.display = '';
      setTimeout(() => {
        app.style.opacity   = '1';
        app.style.transform = 'none';
        if (typeof App !== 'undefined') App.init();
      }, 50);
    }
  },

  // ════════════════════════════════════════
  //  GATE UI
  // ════════════════════════════════════════

  async showGate() {
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';

    const gate = document.getElementById('auth-gate');
    if (!gate) return;
    gate.style.display = 'flex';
    setTimeout(() => { gate.style.opacity='1'; gate.style.transform='scale(1)'; }, 50);

    // Kiểm tra biometric song song với render
    const [bioAvailable] = await Promise.all([this.isBiometricAvailable()]);
    const bioEnrolled    = this.hasBiometricEnrolled();
    const bio            = this.getBiometricLabel();

    // Render nội dung card
    const card = gate.querySelector('.auth-card');
    if (card) {
      card.innerHTML = this._buildCardHTML(bioAvailable, bioEnrolled, bio);
      this._bindCardEvents(bioAvailable, bioEnrolled, bio);

      // Auto trigger biometric nếu đã đăng ký
      if (bioAvailable && bioEnrolled) {
        setTimeout(() => this._triggerBiometric(), 400);
      }
    }
  },

  // ── HTML của card ──
  _buildCardHTML(bioAvailable, bioEnrolled, bio) {
    const showBioFirst = bioAvailable && bioEnrolled;

    return `
      <div class="auth-logo">
        <div class="auth-logo-icon">⚡</div>
        <div class="auth-logo-name">MenControl Pro</div>
        <div class="auth-logo-sub">Kiểm soát hoàn hảo</div>
      </div>

      <h1 class="auth-title">🔐 Đăng nhập</h1>
      <p class="auth-sub">Xác thực để truy cập ứng dụng</p>

      ${showBioFirst ? `
        <!-- BIOMETRIC PRIMARY -->
        <button class="bio-main-btn" id="auth-bio-btn">
          <span class="bio-main-icon">${bio.icon}</span>
          <span class="bio-main-label">Mở khóa bằng ${bio.label}</span>
          <span class="bio-main-hint">Chạm để xác thực</span>
        </button>

        <div class="auth-divider" style="margin:18px 0">
          <div class="auth-divider-line"></div>
          <div class="auth-divider-text">hoặc dùng mật khẩu</div>
          <div class="auth-divider-line"></div>
        </div>
      ` : ''}

      <!-- PASSWORD FORM -->
      <form id="auth-form" autocomplete="off" novalidate
            style="${showBioFirst ? 'display:none' : ''}">
        <div class="auth-field">
          <label class="auth-field-label" for="auth-input">Mật khẩu</label>
          <div class="auth-input-wrap">
            <input type="password" id="auth-input"
                   placeholder="Nhập mật khẩu..."
                   autocomplete="current-password" spellcheck="false"/>
            <button type="button" id="auth-eye"
                    title="Hiện/ẩn mật khẩu" aria-label="Toggle password">🙈</button>
          </div>
        </div>

        <div id="auth-error" role="alert"></div>

        <label class="auth-remember" for="auth-remember">
          <input type="checkbox" id="auth-remember"/>
          <span class="auth-remember-label">Nhớ tôi trong 7 ngày</span>
        </label>

        <button type="submit" id="auth-btn">🔓 Mở khóa</button>
      </form>

      ${showBioFirst ? `
        <button class="auth-toggle-pw" id="auth-toggle-pw">🔑 Dùng mật khẩu</button>
      ` : (bioAvailable ? `
        <button class="auth-toggle-pw" id="auth-toggle-pw" style="margin-top:16px">
          ${bio.icon} Mở khóa bằng ${bio.short}
        </button>
      ` : '')}

      <div class="auth-divider" style="margin-top:${showBioFirst ? '0' : '20px'}">
        <div class="auth-divider-line"></div>
        <div class="auth-divider-text">Chỉ dành cho người được ủy quyền</div>
        <div class="auth-divider-line"></div>
      </div>
      <div class="auth-lock-icon">
        <span>🛡️</span>
        <span class="auth-lock-text">SHA-256 · WebAuthn · Dữ liệu lưu trên thiết bị</span>
      </div>
    `;
  },

  // ── Bind events sau khi render ──
  _bindCardEvents(bioAvailable, bioEnrolled, bio) {
    const form      = document.getElementById('auth-form');
    const input     = document.getElementById('auth-input');
    const btn       = document.getElementById('auth-btn');
    const remember  = document.getElementById('auth-remember');
    const errEl     = document.getElementById('auth-error');
    const eyeBtn    = document.getElementById('auth-eye');
    const bioBtn    = document.getElementById('auth-bio-btn');
    const toggleBtn = document.getElementById('auth-toggle-pw');

    // Eye toggle
    if (eyeBtn && input) {
      eyeBtn.addEventListener('click', () => {
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        eyeBtn.textContent = isText ? '👁️' : '🙈';
      });
    }

    // Password input events
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this._submitPassword(input, remember, btn, errEl);
        if (errEl) errEl.style.display = 'none';
      });
      input.addEventListener('input', () => {
        if (errEl) errEl.style.display = 'none';
      });
      // Chỉ auto-focus khi biometric không có
      if (!bioEnrolled) setTimeout(() => input.focus(), 300);
    }

    // Submit
    if (btn) btn.addEventListener('click', () => this._submitPassword(input, remember, btn, errEl));
    if (form) form.addEventListener('submit', e => { e.preventDefault(); this._submitPassword(input, remember, btn, errEl); });

    // Biometric button
    if (bioBtn) bioBtn.addEventListener('click', () => this._triggerBiometric());

    // Toggle show/hide password form
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const showBioFirst = bioEnrolled && bioAvailable;
        if (showBioFirst) {
          // Đang xem bio → toggle sang pw
          const pwForm = document.getElementById('auth-form');
          const bioButton = document.getElementById('auth-bio-btn');
          const isHidden = pwForm.style.display === 'none';
          if (isHidden) {
            pwForm.style.display = '';
            if (bioButton) bioButton.style.display = 'none';
            toggleBtn.textContent = `${bio.icon} Dùng ${bio.short}`;
            setTimeout(() => input && input.focus(), 100);
          } else {
            pwForm.style.display = 'none';
            if (bioButton) bioButton.style.display = '';
            toggleBtn.textContent = '🔑 Dùng mật khẩu';
          }
        } else {
          // Đang xem pw → trigger biometric
          this._triggerBiometric();
        }
      });
    }
  },

  // ── Trigger biometric xác thực ──
  async _triggerBiometric() {
    const bioBtn = document.getElementById('auth-bio-btn');
    const errEl  = document.getElementById('auth-error');
    const bio    = this.getBiometricLabel();

    if (bioBtn) {
      bioBtn.classList.add('bio-btn--loading');
      bioBtn.querySelector('.bio-main-label').textContent = 'Đang xác thực...';
      bioBtn.querySelector('.bio-main-hint').textContent  = `Dùng ${bio.label} của bạn`;
      bioBtn.disabled = true;
    }

    try {
      const ok = await this.authenticateBiometric();
      if (ok) {
        this.saveSession(true); // Luôn remember khi dùng biometric
        if (bioBtn) {
          bioBtn.classList.remove('bio-btn--loading');
          bioBtn.classList.add('bio-btn--success');
          bioBtn.querySelector('.bio-main-label').textContent = '✅ Xác thực thành công!';
        }
        setTimeout(() => this.showApp(), 600);
      } else {
        this._bioFailed(bioBtn, bio, errEl, 'Xác thực không thành công. Thử lại hoặc dùng mật khẩu.');
      }
    } catch {
      this._bioFailed(bioBtn, bio, errEl, 'Xác thực bị hủy.');
    }
  },

  _bioFailed(bioBtn, bio, errEl, msg) {
    if (bioBtn) {
      bioBtn.classList.remove('bio-btn--loading');
      bioBtn.disabled = false;
      bioBtn.querySelector('.bio-main-label').textContent = `Mở khóa bằng ${bio.label}`;
      bioBtn.querySelector('.bio-main-hint').textContent  = 'Chạm để xác thực';
    }
    if (errEl) { errEl.textContent = `⚠️ ${msg}`; errEl.style.display = 'block'; }
  },

  // ── Submit mật khẩu ──
  async _submitPassword(input, remember, btn, errEl) {
    const password = input ? input.value : '';
    if (!password) { this._shake(input, errEl, 'Vui lòng nhập mật khẩu'); return; }

    if (btn) { btn.disabled = true; btn.textContent = '🔄 Đang xác thực...'; }
    if (input) input.disabled = true;

    const ok = await this.verify(password);

    if (ok) {
      const shouldRemember = remember ? remember.checked : false;
      this.saveSession(shouldRemember);
      if (btn) {
        btn.textContent = '✅ Thành công!';
        btn.style.background = 'linear-gradient(135deg,#4ade80,#059669)';
      }

      // Sau khi đăng nhập mật khẩu OK → hỏi có muốn bật sinh trắc học không
      const bioAvailable = await this.isBiometricAvailable();
      const bioEnrolled  = this.hasBiometricEnrolled();
      if (bioAvailable && !bioEnrolled) {
        setTimeout(() => this._offerBiometricSetup(), 700);
      } else {
        setTimeout(() => this.showApp(), 600);
      }
    } else {
      if (btn) { btn.disabled = false; btn.textContent = '🔓 Mở khóa'; }
      if (input) { input.disabled = false; input.value = ''; input.focus(); }
      this._shake(input, errEl, '❌ Mật khẩu không đúng. Thử lại.');
    }
  },

  // ── Hỏi có muốn bật biometric sau đăng nhập thành công ──
  async _offerBiometricSetup() {
    const bio = this.getBiometricLabel();
    const overlay = document.createElement('div');
    overlay.className = 'bio-setup-overlay';
    overlay.innerHTML = `
      <div class="bio-setup-card">
        <div class="bio-setup-icon">${bio.icon}</div>
        <h3 class="bio-setup-title">Bật ${bio.label}?</h3>
        <p class="bio-setup-desc">
          Lần sau bạn có thể mở khóa bằng ${bio.label} — nhanh hơn, không cần nhớ mật khẩu.
        </p>
        <button class="bio-setup-btn" id="bio-setup-yes">
          ✅ Bật ${bio.short}
        </button>
        <button class="bio-setup-skip" id="bio-setup-skip">Bỏ qua</button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('bio-setup-overlay--show'), 50);

    document.getElementById('bio-setup-yes').addEventListener('click', async () => {
      const yesBtn = document.getElementById('bio-setup-yes');
      yesBtn.textContent = '⏳ Đang đăng ký...';
      yesBtn.disabled = true;

      const success = await this.registerBiometric();
      overlay.remove();

      if (success) {
        this._toast(`✅ ${bio.label} đã được bật thành công!`);
      } else {
        this._toast(`⚠️ Không thể bật ${bio.label}. Dùng mật khẩu như thường.`);
      }
      setTimeout(() => this.showApp(), 400);
    });

    document.getElementById('bio-setup-skip').addEventListener('click', () => {
      overlay.remove();
      this.showApp();
    });
  },

  _toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  _shake(input, errEl, msg) {
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    if (input) {
      input.classList.add('auth-shake');
      setTimeout(() => input.classList.remove('auth-shake'), 500);
    }
  },

  // Backward compat
  async handleSubmit(input, remember, btn, errEl) {
    return this._submitPassword(input, remember, btn, errEl);
  },

  shakeInput(input, errEl, msg) { return this._shake(input, errEl, msg); }
};
