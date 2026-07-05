// ============================================================
// VERSION.JS - Hệ thống quản lý phiên bản
// ============================================================
// Tăng VERSION mỗi khi có thay đổi để trình duyệt xóa cache cũ.
// Format: MAJOR.MINOR.PATCH
//   MAJOR - Thay đổi lớn (tính năng mới hoàn toàn)
//   MINOR - Tính năng mới / cải tiến đáng kể
//   PATCH - Sửa lỗi / chỉnh sửa nhỏ
// ============================================================

const AppVersion = {
  VERSION:      '1.0.5',
  BUILD_DATE:   '2026-07-05',
  CODENAME:     'PRO',
  CACHE_KEY:    'mc_version_seen',

  // Lịch sử cập nhật
  CHANGELOG: [
    {
      version:  '1.0.5',
      date:     '2026-07-05',
      type:     'update',
      changes: [
        '⚔️ Thêm module Lý thuyết Thực chiến toàn trình (5 giai đoạn chi tiết)',
        '🗺️ Bản đồ toàn buổi quan hệ với thời gian từng giai đoạn',
        '📊 Bảng tham chiếu nhanh HP → Cơ PC → Hành động',
        '🚨 Hướng dẫn chi tiết vùng ngưỡng 6-7-8/10',
        '👑 Kỹ thuật 9-1, thở đồng bộ, đổi tư thế, chăm sóc đối tác'
      ]
    },
    {
      version:  '1.0.4',
      date:     '2026-07-01',
      type:     'fix',
      changes: [
        '🔧 Sửa lỗi 404 khi mở từ màn hình chính trên GitHub Pages',
        '📱 Tạo icon PWA (192px + 512px) hiển thị đúng trên màn hình chính',
        '🌏 Sửa Service Worker dùng đường dẫn tương đối cho GitHub Pages /qh/',
        '🔗 Cập nhật manifest.json: start_url, scope, apple-touch-icon'
      ]
    },
    {
      version:  '1.0.3',
      date:     '2026-07-01',
      type:     'update',
      changes: [
        '🔐 Thêm hệ thống bảo vệ mật khẩu SHA-256',
        '📊 Hiển thị số phiên bản và kiểm tra cập nhật',
        '🔄 Cache-busting tự động theo phiên bản',
        '🌐 Cấu hình GitHub Pages deployment'
      ]
    },
    {
      version:  '1.0.2',
      date:     '2026-07-01',
      type:     'update',
      changes: [
        '⏭ Thêm nút Bước tiếp theo / Giai đoạn tiếp trong thực hành',
        '🖥️ Layout responsive tự động cho Desktop (sidebar 240px)',
        '📱 Bottom nav giữ nguyên trên Mobile/Tablet',
        '🎨 Cải thiện giao diện nhiều trang'
      ]
    },
    {
      version:  '1.0.1',
      date:     '2026-07-01',
      type:     'release',
      changes: [
        '🏠 Dashboard tổng quan với thống kê tiến trình',
        '📚 5 Module lý thuyết chi tiết (Cơ PC, Kegel, Reverse Kegel...)',
        '🎯 Chế độ mô phỏng thực hành 6 giai đoạn',
        '💪 Timer luyện tập Kegel 4 cấp độ',
        '📈 Nhật ký theo dõi tiến trình',
        '📱 PWA - cài đặt như app native'
      ]
    },
    {
      version:  '1.0.0',
      date:     '2026-07-01',
      type:     'release',
      changes: [
        '🚀 Khởi tạo dự án MenControl Pro',
        '⚡ Kiến trúc PWA cơ bản'
      ]
    }
  ],

  // Lấy phiên bản rút gọn để hiển thị trên badge
  getShortLabel() {
    return `VER ${this.VERSION} ${this.CODENAME}`;
  },

  // Kiểm tra có phiên bản mới không (so với lần cuối user thấy)
  hasNewVersion() {
    const seen = localStorage.getItem(this.CACHE_KEY);
    return seen !== this.VERSION;
  },

  // Đánh dấu user đã xem phiên bản hiện tại
  markSeen() {
    localStorage.setItem(this.CACHE_KEY, this.VERSION);
  },

  // Xóa toàn bộ cache của Service Worker và reload
  async forceUpdate() {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    window.location.reload(true);
  },

  // Hiện modal thông tin phiên bản
  showModal() {
    this.markSeen();
    const isNew = document.getElementById('version-modal');
    if (isNew) isNew.remove();

    const typeColors = { release: '#4ade80', update: '#60a5fa', fix: '#f472b6' };
    const typeLabels = { release: 'PHIÊN BẢN MỚI', update: 'CẬP NHẬT', fix: 'SỬA LỖI' };

    const changelogHTML = this.CHANGELOG.map((entry, i) => `
      <div class="ver-entry ${i === 0 ? 'ver-entry--current' : ''}">
        <div class="ver-entry-header">
          <div class="ver-entry-title">
            <span class="ver-num">v${entry.version}</span>
            <span class="ver-type" style="background:${(typeColors[entry.type] || '#6c63ff')}22;color:${typeColors[entry.type] || '#6c63ff'};border:1px solid ${typeColors[entry.type] || '#6c63ff'}44">
              ${typeLabels[entry.type] || entry.type.toUpperCase()}
            </span>
            ${i === 0 ? '<span class="ver-current-badge">Hiện tại</span>' : ''}
          </div>
          <span class="ver-date">${entry.date}</span>
        </div>
        <ul class="ver-changes">
          ${entry.changes.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const modal = document.createElement('div');
    modal.id = 'version-modal';
    modal.innerHTML = `
      <div class="ver-overlay" id="ver-overlay-bg">
        <div class="ver-card">
          <div class="ver-card-header">
            <div class="ver-title-group">
              <div class="ver-badge-lg">${this.getShortLabel()}</div>
              <div class="ver-subtitle">MenControl Pro · Lịch sử cập nhật</div>
            </div>
            <button class="ver-close-btn" id="ver-close">✕</button>
          </div>

          <div class="ver-build-info">
            <span>🗓️ Build: ${this.BUILD_DATE}</span>
            <span>⚡ PWA Ready</span>
            <span>🔐 SHA-256</span>
          </div>

          <div class="ver-changelog">
            ${changelogHTML}
          </div>

          <div class="ver-actions">
            <button class="ver-update-btn" id="ver-update-btn">
              🔄 Xóa cache & Cập nhật ngay
            </button>
            <button class="ver-close-light" id="ver-close-light">Đóng</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Events
    document.getElementById('ver-close').addEventListener('click', () => modal.remove());
    document.getElementById('ver-close-light').addEventListener('click', () => modal.remove());
    document.getElementById('ver-overlay-bg').addEventListener('click', e => {
      if (e.target.id === 'ver-overlay-bg') modal.remove();
    });
    document.getElementById('ver-update-btn').addEventListener('click', async () => {
      const btn = document.getElementById('ver-update-btn');
      btn.textContent = '⏳ Đang xóa cache...';
      btn.disabled = true;
      await this.forceUpdate();
    });
  }
};
