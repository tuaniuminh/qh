# ============================================================
# deploy.ps1 - Script deploy MenControl Pro lên GitHub Pages
# Chạy: .\deploy.ps1
# ============================================================

param(
    [string]$Message = "",
    [string]$Repo = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MenControl Pro - GitHub Pages Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "   Tải tại: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Lấy version hiện tại từ version.js
$versionFile = Join-Path $PSScriptRoot "js\version.js"
$version = "unknown"
if (Test-Path $versionFile) {
    $content = Get-Content $versionFile -Raw
    if ($content -match "VERSION:\s+'([^']+)'") {
        $version = $Matches[1]
    }
}
Write-Host "📦 Phiên bản: v$version" -ForegroundColor Green

# Commit message
if (-not $Message) {
    $Message = "deploy: MenControl Pro v$version"
}

# Kiểm tra xem repo đã được khởi tạo chưa
$isGitRepo = Test-Path (Join-Path $PSScriptRoot ".git")

if (-not $isGitRepo) {
    Write-Host ""
    Write-Host "🔧 Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main

    if (-not $Repo) {
        Write-Host ""
        $Repo = Read-Host "📡 Nhập URL GitHub repo (vd: https://github.com/username/mencontrol.git)"
    }

    git remote add origin $Repo
    Write-Host "✅ Remote đã được thêm: $Repo" -ForegroundColor Green
}

# Add và commit
Write-Host ""
Write-Host "📝 Staging files..." -ForegroundColor Yellow
git add -A

Write-Host "💾 Committing: $Message" -ForegroundColor Yellow
git commit -m $Message

# Push
Write-Host ""
Write-Host "🚀 Đang push lên GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ Deploy thành công!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏱️  GitHub Pages sẽ sẵn sàng sau ~2 phút" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔧 Bật GitHub Pages (lần đầu):" -ForegroundColor Yellow
    Write-Host "   1. Vào repo → Settings → Pages" -ForegroundColor White
    Write-Host "   2. Source: Deploy from a branch" -ForegroundColor White
    Write-Host "   3. Branch: main / (root) → Save" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push thất bại! Kiểm tra:" -ForegroundColor Red
    Write-Host "   - Đã đăng nhập GitHub chưa? (git config user.name)" -ForegroundColor Yellow
    Write-Host "   - URL repo có đúng không?" -ForegroundColor Yellow
    Write-Host "   - Chạy: git remote -v để kiểm tra" -ForegroundColor Yellow
}
