# 💖 Sanjion Pro - Nền Tảng Ôn Luyện Sanjion Frontend Developer Senior

**Sanjion Pro** là nền tảng luyện tập kiến thức tuyển dụng Sanjion Frontend Engineer hàng đầu, thiết kế theo chuẩn phỏng vấn của các tập đoàn công nghệ lớn (*Google, Meta, Shopee, VNG*). Hệ thống tích hợp **Google Gemini 2.0 Flash AI** và cSDL **Supabase PostgreSQL Cloud**.

---

## ⚡ Các Câu Lệnh Dự Án (CLI Commands)

### 1. 🚀 Chạy Môi Trường Phát Triển (Dev Server)
```bash
npm run dev
```
Trang web sẽ chạy tại đường dẫn: `http://localhost:5173`.

---

### 🪄 2. Sinh Hàng Loạt Câu Hỏi Bài Tập Bằng Gemini AI (Batch Generator)
Sử dụng câu lệnh sau để tự động khởi chạy **Google Gemini 2.0 Flash AI** sản sinh hàng loạt bài tập Sanjion mới (*JavaScript Core, ReactJS, HTML/CSS, Web Performance, System Design...*) và lưu trực tiếp vào file `supabase/seed.sql`:

```bash
npm run generate-questions
```

> **Mẹo**: Sau khi chạy câu lệnh trên, bạn chỉ cần copy nội dung file [`supabase/seed.sql`](./supabase/seed.sql) dán vào **Supabase SQL Editor** và bấm **RUN** để cập nhật câu hỏi mới lên Database Cloud!

---

### 🛠️ 3. Kiểm Tra TypeScript Type Safety
```bash
npx tsc --noEmit
```

---

### 📦 4. Build Sản Phẩm Production
```bash
npm run build
```

---

## ⚙️ Cấu Hình Môi Trường (`.env.local`)

Tạo file `.env.local` ở thư mục gốc dự án:

```env

---

## 🌟 Các Tính Năng Nổi Bật

- 🤖 **AI Sanjioner (Gemini 2.0 Flash)**: Chấm bài tự luận, nhận xét ưu/nhược điểm và đưa ra đáp án chuẩn Senior.
- ⚡ **Auto Key Rotation**: Hỗ trợ dán nhiều API Key phân cách bởi dấu phẩy để dùng AI thoải mái cả ngày.
- 🎯 **Ma Trận Phân Cấp Độ Khó**: 4 cấp độ bài tập phân hóa rõ ràng (*EASY, MEDIUM, HARD, EXPERT*).
- ☁️ **Supabase Cloud Sync**: Tự động lưu tiến độ, câu hỏi AI và điểm thưởng cá nhân vĩnh viễn trên Cloud.
- 🏆 **Popup Chúc Mừng & Chuyển Bài**: Tự động chuyển câu hỏi tiếp theo cùng trình độ khi trả lời đúng.
- 💻 **Monaco Code Editor & Test Runner**: Gõ code JS và chạy thử test cases trực tiếp trên trình duyệt.
- 📱 **Mobile Responsive**: Giao diện di động mượt mà kèm thanh Bottom Nav Bar chuẩn Native.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend Core**: React 18, TypeScript, Vite.
- **Styling**: Tailwind CSS, Vanilla CSS (Theme Pink-White-Purple-Gold).
- **AI Engine**: Google Gen AI SDK (`@google/genai` - `gemini-2.0-flash`).
- **Backend & Database**: Supabase Client SDK, PostgreSQL Database.
- **Code Editor**: Monaco Editor (`@monaco-editor/react`).
- **Charts & Animations**: Recharts, Canvas Confetti, Lucide Icons.
