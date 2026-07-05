// ============================================================
// AUTH.JS - Xác thực SHA-256 + WebAuthn (Face ID / Vân tay)
// v1.0.7
// ============================================================
//
// ⚙️  THAY ĐỔI MẬT KHẨU:
//   AuthSystem.generateHash('mật_khẩu_mới').then(h => console.log(h))
//   → Thay chuỗi hash vào PASSWORD_HASH bên dưới.
//
// 🔑 Mật khẩu hiện tại: Minh231099@96
// ============================================================

const AuthSystem = {

  PASSWORD_HASH:      '2a4553ae34d0b9311a051ebbc896b6906d8c49b7034bfb40dfeb4cf24c9e9354',
  SESSION_KEY:        'mc_auth_ok',
  REMEMBER_KEY:       'mc_auth_remember',
  BIOMETRIC_KEY:      'mc_biometric_cred',    // credentialId (base64)
  BIOMETRIC_REQ_KEY:  'mc_biometric_always',  // "1" = yêu cầu mỗi lần mở
  REMEMBER_DAYS:      7,

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

  // Có session hợp lệ không?
  hasValidSession() {
    if (sessionStorage.getItem(this.SESSION_KEY) === '1') return true;
    const until = localStorage.getItem(this.REMEMBER_KEY);
    if (until && Date.now() < parseInt(until, 10)) {
      sessionStorage.setItem(this.SESSION_KEY, '1');
      return true;
    }
    return false;
  },

  // Yêu cầu Face ID mỗi lần không?
  isBiometricRequired() {
    return localStorage.getItem(this.BIOMETRIC_REQ_KEY) === '1';
  },

  setBiometricRequired(val) {
    if (val) localStorage.setItem(this.BIOMETRIC_REQ_KEY, '1');
    else      localStorage.removeItem(this.BIOMETRIC_REQ_KEY);
  },

  saveSession(remember) {
    sessionStorage.setItem(this.SESSION_KEY, '1');
    if (remember) {
      localStorage.setItem(this.REMEMBER_KEY,
        String(Date.now() + this.REMEMBER_DAYS * 864e5));
    }
  },

  clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
  },

  logout() {
    this.clearSession();
    location.reload();
  },

  // ════════════════════════════════════════
  //  WEBAUTHN
  // ════════════════════════════════════════

  async isBiometricAvailable() {
    try {
      if (!window.PublicKeyCredential) return false;
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch { return false; }
  },

  hasBiometricEnrolled() {
    return !!localStorage.getItem(this.BIOMETRIC_KEY);
  },

  getBiometricLabel() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/i.test(ua)) return { icon: '🔒', label: 'Face ID',             short: 'Face ID' };
    if (/Android/i.test(ua))     return { icon: '👆', label: 'Vân tay / Khuôn mặt', short: 'Sinh trắc học' };
    if (/Mac/i.test(ua))         return { icon: '👆', label: 'Touch ID',             short: 'Touch ID' };
    return                              { icon: '🔐', label: 'Sinh trắc học',         short: 'Sinh trắc học' };
  },

  // ── Đăng ký sinh trắc học ──
  async registerBiometric() {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp:  { name: 'MenControl Pro', id: location.hostname },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: 'user@mencontrol',
            displayName: 'MenControl User'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7   },  // ES256
            { type: 'public-key', alg: -257 }   // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification:        'required',
            residentKey:             'preferred'
          },
          timeout: 60000
        }
      });
      localStorage.setItem(this.BIOMETRIC_KEY, this._ab2b64(credential.rawId));
      return true;
    } catch (err) {
      console.warn('[Auth] Register failed:', err.name);
      return false;
    }
  },

  // ── Xác thực sinh trắc học ──
  async authenticateBiometric() {
    const credB64 = localStorage.getItem(this.BIOMETRIC_KEY);
    if (!credB64) return false;
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{
            type: 'public-key',
            id:   this._b642ab(credB64),
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      });
      return !!assertion;
    } catch (err) {
      console.warn('[Auth] Auth failed:', err.name);
      return false;
    }
  },

  // ── Xóa đăng ký ──
  removeBiometric() {
    localStorage.removeItem(this.BIOMETRIC_KEY);
    this.setBiometricRequired(false);
  },

  // ════════════════════════════════════════
  //  APP LIFECYCLE
  // ════════════════════════════════════════

  async init() {
    const enrolled    = this.hasBiometricEnrolled();
    const bioRequired = this.isBiometricRequired();
    const hasSession  = this.hasValidSession();

    // Nếu yêu cầu face ID mỗi lần → luôn hiện gate dù có session
    if (bioRequired && enrolled) {
      await this.showGate();
      return;
    }

    // Có session hợp lệ → vào thẳng
    if (hasSession) {
      this.showApp();
      return;
    }

    await this.showGate();
  },

  showApp() {
    const gate = document.getElementById('auth-gate');
    const app  = document.getElementById('app');
    if (gate) {
      gate.style.opacity    = '0';
      gate.style.transform  = 'scale(0.97)';
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
    setTimeout(() => { gate.style.opacity = '1'; gate.style.transform = 'scale(1)'; }, 50);

    // Kiểm tra thiết bị
    const bioAvailable = await this.isBiometricAvailable();
    const bioEnrolled  = this.hasBiometricEnrolled();
    const bio          = this.getBiometricLabel();

    const card = gate.querySelector('.auth-card');
    if (card) {
      card.innerHTML = this._buildCardHTML(bioAvailable, bioEnrolled, bio);
      this._bindCardEvents(bioAvailable, bioEnrolled, bio);

      // Auto-trigger biometric nếu đã đăng ký
      if (bioAvailable && bioEnrolled) {
        setTimeout(() => this._triggerBiometric(bio), 600);
      }
    }
  },

  // ── Build HTML cho card ──
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
        <button class="bio-main-btn" id="auth-bio-btn">
          <span class="bio-main-icon">${bio.icon}</span>
          <span class="bio-main-label">Mở khóa bằng ${bio.label}</span>
          <span class="bio-main-hint">Chạm để xác thực ngay</span>
        </button>
        <div class="auth-divider" style="margin:16px 0 14px">
          <div class="auth-divider-line"></div>
          <div class="auth-divider-text">hoặc dùng mật khẩu</div>
          <div class="auth-divider-line"></div>
        </div>
      ` : bioAvailable ? `
        <div class="bio-available-hint">
          ${bio.icon} <strong>${bio.label}</strong> khả dụng — <a href="#" id="auth-setup-bio-link">Bật ngay</a>
        </div>
      ` : ''}

      <!-- PASSWORD FORM -->
      <form id="auth-form" autocomplete="off" novalidate
            ${showBioFirst ? 'style="display:none"' : ''}>
        <div class="auth-field">
          <label class="auth-field-label" for="auth-input">Mật khẩu</label>
          <div class="auth-input-wrap">
            <input type="password" id="auth-input"
                   placeholder="Nhập mật khẩu..."
                   autocomplete="current-password" spellcheck="false"/>
            <button type="button" id="auth-eye" aria-label="Toggle password">🙈</button>
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
        <button class="auth-toggle-pw" id="auth-toggle-pw">🔑 Dùng mật khẩu thay thế</button>
      ` : ''}

      <div class="auth-divider" style="margin-top:16px">
        <div class="auth-divider-line"></div>
        <div class="auth-divider-text">Chỉ dành cho người được ủy quyền</div>
        <div class="auth-divider-line"></div>
      </div>
      <div class="auth-lock-icon">
        <span>🛡️</span>
        <span class="auth-lock-text">SHA-256 · WebAuthn · Dữ liệu trên thiết bị của bạn</span>
      </div>
    `;
  },

  // ── Bind events ──
  _bindCardEvents(bioAvailable, bioEnrolled, bio) {
    const form      = document.getElementById('auth-form');
    const input     = document.getElementById('auth-input');
    const btn       = document.getElementById('auth-btn');
    const remember  = document.getElementById('auth-remember');
    const errEl     = document.getElementById('auth-error');
    const eyeBtn    = document.getElementById('auth-eye');
    const bioBtn    = document.getElementById('auth-bio-btn');
    const toggleBtn = document.getElementById('auth-toggle-pw');
    const setupLink = document.getElementById('auth-setup-bio-link');

    // Eye toggle
    if (eyeBtn && input) {
      eyeBtn.addEventListener('click', () => {
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        eyeBtn.textContent = isText ? '👁️' : '🙈';
      });
    }

    // Password events
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this._submitPassword(input, remember, btn, errEl);
        if (errEl) errEl.style.display = 'none';
      });
      input.addEventListener('input', () => {
        if (errEl) errEl.style.display = 'none';
      });
      if (!bioEnrolled) setTimeout(() => input.focus(), 300);
    }

    if (btn) btn.addEventListener('click', () => this._submitPassword(input, remember, btn, errEl));
    if (form) form.addEventListener('submit', e => { e.preventDefault(); this._submitPassword(input, remember, btn, errEl); });

    // Bio button
    if (bioBtn) bioBtn.addEventListener('click', () => this._triggerBiometric(bio));

    // Toggle pw / bio
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const pwForm  = document.getElementById('auth-form');
        const bioBtnEl = document.getElementById('auth-bio-btn');
        const isHidden = pwForm.style.display === 'none';
        pwForm.style.display   = isHidden ? '' : 'none';
        if (bioBtnEl) bioBtnEl.style.display = isHidden ? 'none' : '';
        toggleBtn.textContent = isHidden ? `${bio.icon} Dùng ${bio.short}` : '🔑 Dùng mật khẩu thay thế';
        if (isHidden && input) setTimeout(() => input.focus(), 100);
      });
    }

    // Setup link (bật biometric từ màn hình đăng nhập)
    if (setupLink) {
      setupLink.addEventListener('click', async (e) => {
        e.preventDefault();
        // Phải đăng nhập mật khẩu trước
        if (form) form.style.display = '';
        setupLink.closest('.bio-available-hint').style.display = 'none';
        if (input) setTimeout(() => input.focus(), 100);
        // Mark intent to setup biometric after login
        sessionStorage.setItem('mc_intent_setup_bio', '1');
      });
    }
  },

  // ── Trigger biometric ──
  async _triggerBiometric(bio) {
    bio = bio || this.getBiometricLabel();
    const bioBtn = document.getElementById('auth-bio-btn');
    const errEl  = document.getElementById('auth-error');

    if (bioBtn) {
      bioBtn.classList.add('bio-btn--loading');
      bioBtn.querySelector('.bio-main-label').textContent = 'Đang xác thực...';
      bioBtn.querySelector('.bio-main-hint').textContent  = `Dùng ${bio.label} của bạn`;
      bioBtn.disabled = true;
    }

    try {
      const ok = await this.authenticateBiometric();
      if (ok) {
        this.saveSession(false); // session ngắn (đến khi đóng tab)
        if (bioBtn) {
          bioBtn.classList.remove('bio-btn--loading');
          bioBtn.classList.add('bio-btn--success');
          bioBtn.querySelector('.bio-main-label').textContent = '✅ Xác thực thành công!';
        }
        setTimeout(() => this.showApp(), 500);
      } else {
        this._bioFailed(bioBtn, bio, errEl, 'Không xác thực được. Thử lại hoặc dùng mật khẩu.');
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
      bioBtn.querySelector('.bio-main-hint').textContent  = 'Chạm để thử lại';
    }
    if (errEl) { errEl.textContent = `⚠️ ${msg}`; errEl.style.display = 'block'; }
    // Hiện form mật khẩu tự động
    const pwForm = document.getElementById('auth-form');
    if (pwForm) pwForm.style.display = '';
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

      // Kiểm tra nên hỏi setup biometric không
      const bioAvailable   = await this.isBiometricAvailable();
      const bioEnrolled    = this.hasBiometricEnrolled();
      const intentSetupBio = sessionStorage.getItem('mc_intent_setup_bio') === '1';

      if (bioAvailable && (!bioEnrolled || intentSetupBio)) {
        sessionStorage.removeItem('mc_intent_setup_bio');
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

  // ── Hỏi bật biometric ──
  async _offerBiometricSetup() {
    const bio = this.getBiometricLabel();
    const overlay = document.createElement('div');
    overlay.className = 'bio-setup-overlay';
    overlay.innerHTML = `
      <div class="bio-setup-card">
        <div class="bio-setup-icon">${bio.icon}</div>
        <h3 class="bio-setup-title">Bật ${bio.label}?</h3>
        <p class="bio-setup-desc">
          Lần sau mở app sẽ tự động yêu cầu xác thực ${bio.label} — bảo mật hơn, không cần nhập mật khẩu.
        </p>
        <button class="bio-setup-btn" id="bio-setup-yes">
          ✅ Bật ${bio.short} ngay
        </button>
        <button class="bio-setup-skip" id="bio-setup-skip">Không, để sau</button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('bio-setup-overlay--show'), 50);

    document.getElementById('bio-setup-yes').addEventListener('click', async () => {
      const yesBtn = document.getElementById('bio-setup-yes');
      yesBtn.textContent = '⏳ Đang đăng ký...';
      yesBtn.disabled = true;

      const success = await this.registerBiometric();
      if (success) {
        // Tự động bật "yêu cầu mỗi lần"
        this.setBiometricRequired(true);
        this._toast(`✅ ${bio.label} đã được bật! Lần sau sẽ tự động yêu cầu.`);
      } else {
        this._toast(`⚠️ Không thể bật ${bio.label}. Kiểm tra cài đặt thiết bị.`);
      }
      overlay.remove();
      setTimeout(() => this.showApp(), 400);
    });

    document.getElementById('bio-setup-skip').addEventListener('click', () => {
      overlay.remove();
      this.showApp();
    });
  },

  // ════════════════════════════════════════
  //  SETTINGS PANEL (gọi từ app.js)
  // ════════════════════════════════════════

  async renderSettingsPanel() {
    const bioAvailable = await this.isBiometricAvailable();
    const bioEnrolled  = this.hasBiometricEnrolled();
    const bioRequired  = this.isBiometricRequired();
    const bio          = this.getBiometricLabel();

    return `
      <!-- PHIÊN ĐĂNG NHẬP -->
      <div class="settings-section-title">Phiên đăng nhập</div>
      <div class="settings-item">
        <span>✅ Đã xác thực</span>
        <span class="settings-badge settings-badge--green">Đang hoạt động</span>
      </div>

      <!-- SINH TRẮC HỌC -->
      <div class="settings-section-title" style="margin-top:16px">${bio.icon} ${bio.label}</div>

      ${!bioAvailable ? `
        <div class="settings-item settings-item--muted">
          <span>⚠️ Thiết bị không hỗ trợ sinh trắc học</span>
        </div>
      ` : bioEnrolled ? `
        <div class="settings-item">
          <span>Trạng thái</span>
          <span class="settings-badge settings-badge--green">✅ Đã đăng ký</span>
        </div>

        <div class="settings-item settings-toggle-row">
          <div>
            <div class="settings-toggle-label">Yêu cầu ${bio.short} mỗi lần mở</div>
            <div class="settings-toggle-sub">Bảo mật cao hơn — luôn xác thực khi mở app</div>
          </div>
          <label class="settings-switch">
            <input type="checkbox" id="bio-require-toggle" ${bioRequired ? 'checked' : ''}/>
            <span class="settings-switch-slider"></span>
          </label>
        </div>

        <button class="settings-btn settings-btn--test" id="bio-test-btn">
          ${bio.icon} Thử xác thực ngay
        </button>

        <button class="settings-btn settings-btn--danger" id="bio-remove-btn">
          🗑️ Xóa ${bio.short} đã đăng ký
        </button>
      ` : `
        <div class="settings-item settings-item--muted">
          <span>Chưa đăng ký ${bio.label}</span>
          <span class="settings-badge">Chưa bật</span>
        </div>
        <button class="settings-btn settings-btn--primary" id="bio-setup-btn">
          ${bio.icon} Bật ${bio.label} ngay
        </button>
      `}

      <!-- ĐĂNG XUẤT -->
      <div class="settings-section-title" style="margin-top:16px">Tài khoản</div>
      <button class="settings-btn settings-btn--danger" id="settings-logout-btn">
        🔒 Đăng xuất
      </button>

      <div class="settings-footer">
        MenControl Pro · Bảo vệ bởi SHA-256 + WebAuthn<br>
        Dữ liệu lưu trên thiết bị của bạn
      </div>
    `;
  },

  // Bind events trong settings panel
  async bindSettingsEvents(bio) {
    bio = bio || this.getBiometricLabel();

    // Toggle "yêu cầu mỗi lần"
    const toggle = document.getElementById('bio-require-toggle');
    if (toggle) {
      toggle.addEventListener('change', () => {
        this.setBiometricRequired(toggle.checked);
        this._toast(toggle.checked
          ? `✅ Sẽ yêu cầu ${bio.short} mỗi lần mở app`
          : `ℹ️ Đã tắt yêu cầu ${bio.short} bắt buộc`);
      });
    }

    // Test biometric
    const testBtn = document.getElementById('bio-test-btn');
    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        testBtn.disabled = true;
        testBtn.textContent = '⏳ Đang xác thực...';
        const ok = await this.authenticateBiometric();
        testBtn.disabled = false;
        testBtn.textContent = `${bio.icon} Thử xác thực ngay`;
        this._toast(ok ? `✅ ${bio.label} hoạt động tốt!` : `❌ Xác thực không thành công`);
      });
    }

    // Remove biometric
    const removeBtn = document.getElementById('bio-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (confirm(`Xóa ${bio.label} đã đăng ký?\nBạn sẽ cần dùng mật khẩu để đăng nhập.`)) {
          this.removeBiometric();
          this._toast(`🗑️ Đã xóa ${bio.label}`);
          // Re-render settings
          document.getElementById('settings-overlay') &&
            document.getElementById('settings-overlay').remove();
          if (typeof App !== 'undefined') App.showSettings();
        }
      });
    }

    // Setup biometric
    const setupBtn = document.getElementById('bio-setup-btn');
    if (setupBtn) {
      setupBtn.addEventListener('click', async () => {
        setupBtn.disabled = true;
        setupBtn.textContent = '⏳ Đang đăng ký...';
        const ok = await this.registerBiometric();
        if (ok) {
          this.setBiometricRequired(true);
          this._toast(`✅ ${bio.label} đã được bật thành công!`);
          document.getElementById('settings-overlay') &&
            document.getElementById('settings-overlay').remove();
          if (typeof App !== 'undefined') App.showSettings();
        } else {
          setupBtn.disabled = false;
          setupBtn.textContent = `${bio.icon} Bật ${bio.label} ngay`;
          this._toast(`❌ Không thể đăng ký. Kiểm tra cài đặt thiết bị.`);
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('settings-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) this.logout();
      });
    }
  },

  // ════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════

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

  // backward compat
  async handleSubmit(i, r, b, e) { return this._submitPassword(i, r, b, e); },
  shakeInput(i, e, m)             { return this._shake(i, e, m); }
};
