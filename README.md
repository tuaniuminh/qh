# MenControl Pro 🏆

> Ứng dụng PWA giáo dục sức khỏe nam giới — Kỹ năng kiểm soát chuyên sâu

## 🌐 Truy cập

**GitHub Pages:** `https://<username>.github.io/<repo-name>/`

## 🔐 Đăng nhập

Ứng dụng được bảo vệ bằng mật khẩu (SHA-256). Liên hệ chủ sở hữu để lấy mật khẩu.

## 📱 Tính năng

- 📚 **5 Module lý thuyết** — Cơ PC, Thang hưng phấn, Kegel, Reverse Kegel, Chăm sóc đối tác
- 🎯 **Thực hành mô phỏng** — 6 giai đoạn với hướng dẫn thời gian thực
- ⏭️ **Bước tiếp / Giai đoạn tiếp** — Chủ động điều hướng buổi tập
- 💪 **Timer Kegel** — 4 chương trình từ cơ bản đến nâng cao
- 📈 **Nhật ký tiến trình** — Theo dõi hành trình cải thiện
- 🖥️ **Responsive** — Sidebar desktop, bottom nav mobile
- 📱 **PWA** — Cài đặt như app native, hoạt động offline
- 🔐 **Bảo mật** — Mật khẩu SHA-256

## 🚀 Deploy lên GitHub Pages

### Lần đầu
```bash
git init
git add .
git commit -m "feat: MenControl Pro v1.0.3"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### Bật GitHub Pages
1. Vào repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Nhấn **Save**
5. Sau ~2 phút: `https://<username>.github.io/<repo-name>/`

### Cập nhật sau này
```bash
git add .
git commit -m "fix: mô tả thay đổi"
git push
```

## 📦 Cấu trúc

```
qh/
├── index.html          # Entry point + Auth gate
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (cache versioned)
├── .nojekyll           # Tắt Jekyll processing
├── css/
│   └── style.css       # Design system
└── js/
    ├── version.js      # Quản lý phiên bản + changelog
    ├── auth.js         # Bảo vệ mật khẩu SHA-256
    ├── app.js          # Main controller
    ├── simulation.js   # Engine mô phỏng
    ├── kegel-timer.js  # Kegel timer
    └── storage.js      # LocalStorage
```

## 🔄 Đổi mật khẩu

1. Mở Console (F12) trên trang web
2. Chạy: `AuthSystem.generateHash('mật_khẩu_mới').then(h => console.log(h))`
3. Sao chép hash → paste vào `js/auth.js` dòng `PASSWORD_HASH`
4. Push lên GitHub

## 📊 Phiên bản

Xem changelog đầy đủ trong `js/version.js` hoặc click badge **VER x.x.x PRO** trong app.
