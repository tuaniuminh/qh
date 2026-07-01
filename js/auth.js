// ============================================================
// AUTH.JS - Hệ thống xác thực mật khẩu (SHA-256)
// ============================================================
//
// ⚙️  THAY ĐỔI MẬT KHẨU:
//   1. Mở trình duyệt, vào trang web, mở DevTools Console (F12)
//   2. Chạy lệnh sau để lấy hash của mật khẩu mới:
//
//   AuthSystem.generateHash('mật_khẩu_của_bạn').then(h => console.log(h))
//
//   3. Sao chép chuỗi hash (64 ký tự) và thay vào PASSWORD_HASH bên dưới.
//   4. Lưu file và deploy lại.
//
// 🔑 Mật khẩu hiện tại: Minh231099@96
// ============================================================

const AuthSystem = {

  // ── SHA-256 hash của mật khẩu mặc định "MenControl@2024" ──
  // Thay chuỗi này bằng hash mật khẩu mới của bạn
  PASSWORD_HASH: '2a4553ae34d0b9311a051ebbc896b6906d8c49b7034bfb40dfeb4cf24c9e9354',

  SESSION_KEY:   'mc_auth_ok',
  REMEMBER_KEY:  'mc_auth_remember',
  REMEMBER_DAYS: 7, // Nhớ mật khẩu trong 7 ngày nếu chọn "Nhớ tôi"

  // ── Sinh SHA-256 từ chuỗi bất kỳ ──
  async generateHash(text) {
    const encoded = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // ── Kiểm tra mật khẩu ──
  async verify(inputPassword) {
    const hash = await this.generateHash(inputPassword.trim());
    return hash === this.PASSWORD_HASH;
  },

  // ── Kiểm tra session / remember ──
  isAuthenticated() {
    if (sessionStorage.getItem(this.SESSION_KEY) === '1') return true;

    const rememberUntil = localStorage.getItem(this.REMEMBER_KEY);
    if (rememberUntil && Date.now() < parseInt(rememberUntil, 10)) {
      sessionStorage.setItem(this.SESSION_KEY, '1');
      return true;
    }
    return false;
  },

  // ── Lưu phiên đăng nhập ──
  saveSession(remember) {
    sessionStorage.setItem(this.SESSION_KEY, '1');
    if (remember) {
      const until = Date.now() + this.REMEMBER_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(this.REMEMBER_KEY, String(until));
    }
  },

  // ── Đăng xuất ──
  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.REMEMBER_KEY);
    location.reload();
  },

  // ── Khởi động: kiểm tra rồi hiển thị gate hoặc app ──
  init() {
    if (this.isAuthenticated()) {
      this.showApp();
    } else {
      this.showGate();
    }
  },

  // ── Hiện app chính ──
  showApp() {
    const gate = document.getElementById('auth-gate');
    const app  = document.getElementById('app');
    if (gate) {
      gate.style.opacity = '0';
      gate.style.transform = 'scale(0.97)';
      gate.style.transition = 'all 0.4s ease';
      setTimeout(() => { gate.style.display = 'none'; }, 400);
    }
    if (app) {
      app.style.display = '';
      setTimeout(() => {
        app.style.opacity = '1';
        app.style.transform = 'none';
        // Boot the main app
        if (typeof App !== 'undefined') App.init();
      }, 50);
    }
  },

  // ── Hiện màn hình nhập mật khẩu ──
  showGate() {
    const app  = document.getElementById('app');
    if (app) app.style.display = 'none';

    const gate = document.getElementById('auth-gate');
    if (!gate) return;
    gate.style.display = 'flex';
    setTimeout(() => {
      gate.style.opacity = '1';
      gate.style.transform = 'scale(1)';
    }, 50);

    const form     = document.getElementById('auth-form');
    const input    = document.getElementById('auth-input');
    const btn      = document.getElementById('auth-btn');
    const remember = document.getElementById('auth-remember');
    const errEl    = document.getElementById('auth-error');
    const eyeBtn   = document.getElementById('auth-eye');

    // Toggle show/hide password
    if (eyeBtn) {
      eyeBtn.addEventListener('click', () => {
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        eyeBtn.textContent = isText ? '👁️' : '🙈';
      });
    }

    // Input events
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.handleSubmit(input, remember, btn, errEl);
        if (errEl) errEl.style.display = 'none';
      });
      input.addEventListener('input', () => {
        if (errEl) errEl.style.display = 'none';
      });
      setTimeout(() => input.focus(), 300);
    }

    if (btn) {
      btn.addEventListener('click', () => this.handleSubmit(input, remember, btn, errEl));
    }

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        this.handleSubmit(input, remember, btn, errEl);
      });
    }
  },

  // ── Xử lý submit ──
  async handleSubmit(input, remember, btn, errEl) {
    const password = input ? input.value : '';
    if (!password) {
      this.shakeInput(input, errEl, 'Vui lòng nhập mật khẩu');
      return;
    }

    // Loading state
    if (btn) { btn.disabled = true; btn.textContent = '🔄 Đang xác thực...'; }
    if (input) input.disabled = true;

    const ok = await this.verify(password);

    if (ok) {
      const shouldRemember = remember ? remember.checked : false;
      this.saveSession(shouldRemember);

      if (btn) { btn.textContent = '✅ Thành công!'; btn.style.background = 'linear-gradient(135deg,#4ade80,#059669)'; }
      setTimeout(() => this.showApp(), 600);
    } else {
      if (btn) { btn.disabled = false; btn.textContent = '🔓 Mở khóa'; }
      if (input) { input.disabled = false; input.value = ''; input.focus(); }
      this.shakeInput(input, errEl, '❌ Mật khẩu không đúng. Thử lại.');
    }
  },

  shakeInput(input, errEl, msg) {
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    if (input) {
      input.classList.add('auth-shake');
      setTimeout(() => input.classList.remove('auth-shake'), 500);
    }
  }
};
