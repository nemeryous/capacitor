# QR Attendance System

Ứng dụng điểm danh bằng mã QR được xây dựng với React và Capacitor, cho phép scan mã QR để ghi nhận sự có mặt của sinh viên.

## Tính năng chính

- 📱 Giao diện thân thiện, dễ sử dụng
- 📷 Quét mã QR thông qua camera thiết bị
- 💾 Lưu trữ dữ liệu điểm danh cục bộ
- 📊 Xuất dữ liệu điểm danh dưới dạng CSV
- 📱 Hỗ trợ cả iOS và Android thông qua Capacitor

## Công nghệ sử dụng

- React + Vite: Framework frontend
- @zxing/library: Thư viện quét mã QR
- Capacitor: Framework đa nền tảng mobile
- LocalStorage: Lưu trữ dữ liệu điểm danh

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js phiên bản 14 trở lên
- iOS: Xcode 12 trở lên (cho phát triển iOS)
- Android: Android Studio (cho phát triển Android)

### Các bước cài đặt

1. Clone repository:

```bash
git clone [repository-url]
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy ứng dụng trên web:

```bash
npm run dev
```

4. Build và chạy trên iOS:

```bash
npx cap sync ios
npx cap open ios
```

## Cấu trúc thư mục

```
src/
├── App.jsx           # Component chính của ứng dụng
├── components/       # Các component tái sử dụng
├── assets/          # Tài nguyên tĩnh
└── ...
```

## Quyền truy cập

Ứng dụng yêu cầu các quyền sau:

- Camera: Để quét mã QR
- Storage: Để lưu trữ dữ liệu điểm danh
