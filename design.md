# FE Sanjion Pro - UI/UX Design System & Architecture Specification

Tài liệu thiết kế chi tiết về Giao diện (UI), Trải nghiệm người dùng (UX), Design System và Định hướng phát triển Frontend cho Nền tảng Ôn luyện **Sanjion Frontend Developer** (**FE Sanjion Pro**).

---

## 1. Design System & Style Guide (Tông Màu Hồng - Trắng - Tím - Vàng)

### 🎨 Color Palette (Bảng màu Chủ đạo - Warm Pink & Gold Aesthetic)

Dự án áp dụng phong cách **Bright Glassmorphism** với tông màu Nền Trắng Hồng ấm áp (`Rose-50` / `White`) kết hợp các dải màu accent rực rỡ tượng trưng cho nhiệt huyết học tập và thành công:

- **Background & Canvas**:
  - `Rose-50 / White` (`#fff1f2` / `#ffffff`): Nền chính sáng tạo cảm giác thân thiện, tích cực.
  - `White Glass` (`bg-white/80 backdrop-blur-md`): Nền cho các thẻ Card, Modal và Sidebar.
  - `Pink-100 / Purple-100` (`#fce7f3` / `#f3e8ff`): Đường viền (Border) và đường phân cách nhã nhặn.
- **Accent Colors (Màu nhấn theo chức năng)**:
  - **Hồng Nổi Bật (Pink Gradient - `from-pink-500 to-rose-500`)**: Nhận diện thương hiệu chính **FE Sanjion Pro**, nút bấm Action chính, tab đang chọn.
  - **Tím Sang Trọng (Purple Accent - `#8b5cf6` / `#7c3aed`)**: Trợ lý **Gemini AI Sanjioner**, Cấp độ Cực khó (Expert), chủ đề System Design Sanjion.
  - **Vàng Hoàng Kim (Gold Accent - `#eab308` / `#f59e0b`)**: Chuỗi ngày học Streak (🔥), Thi thử Sanjion 45 phút, Điểm thưởng (⭐).
  - **Trắng Sữa & Trắng Tinh (Pure & Creamy White)**: Thẻ bài tập, ô nhập liệu và khung giải thuật.

### 🔤 Typography & Font System
- **UI Font**: `Inter` (Google Fonts) - Đạt chuẩn tỉ lệ hiển thị sắc nét trên cả màn hình Retina và Mobile.
- **Code & Mono Font**: `Fira Code` / `JetBrains Mono` - Hiển thị mã nguồn, Monaco Editor và Console output.

---

## 2. Cấu Trúc Các Màn Hình & Layout Components

### 🧭 Header & Navigation Bar (`Navbar.tsx`)
- **Logo & Thương Hiệu**: `FE Sanjion PRO` với biểu tượng trái tim / code cách điệu trong khung gradient Hồng - Tím.
- **Trạng thái kết nối API**:
  - `🟢 Supabase API Connected`: Kết nối thành công Cloud PostgreSQL Database.
  - `⚡ Local Sandbox Mode`: Chạy dữ liệu offline an toàn.
- **Navigation Tabs**: Chuyển đổi mượt mà giữa **Dashboard**, **Ngân Hàng Câu Hỏi Sanjion**, **Câu Hỏi Đã Lưu**.
- **User Widgets**:
  - **Nút "Thi Thử Sanjion"**: Viền Vàng Hoàng Kim (Gold), khởi động Modal giả lập Sanjion 45 phút.
  - **Streak Counter (🔥)**: Biểu tượng lửa Vàng rực rỡ.
  - **Experience Points (⭐)**: Điểm thưởng tích lũy Sanjion.

---

### 📊 Trang Tổng Quan (`Dashboard View`)
1. **Hero Welcome Banner**: Banner Gradient Hồng - Tím - Vàng rực rỡ, chào mừng ứng viên Sanjion.
2. **Top Stats Overview Grid**: 4 thẻ thống kê (Chuỗi ngày học Vàng, Số câu Sanjion đã giải, Điểm kinh nghiệm, Cấp độ mục tiêu Sanjion Senior).
3. **Tiến Độ Sanjion Theo Cấp Độ**: ProgressBar hiển thị phần trăm hoàn thành câu hỏi ở từng cấp độ (Easy, Medium, Hard, Expert).
4. **Biểu Đồ Phân Phối Kỹ Năng (`CategoryBreakdownChart.tsx`)**: Trực quan hóa bằng **Recharts** với các tone màu Hồng, Tím, Vàng.
5. **Nhật Ký Hoạt Động 28 Ngày (`StreakHeatmap.tsx`)**: Lịch hoạt động với các ô vuông màu Hồng - Vàng rực rỡ.

---

### 📚 Trang Ngân Hàng Câu Hỏi Sanjion (`Questions Bank View`)
- **Bộ Lọc Đa Chiều (`FilterBar.tsx`)**:
  - Ô tìm kiếm từ khóa full-text câu hỏi Sanjion.
  - Thanh cuộn danh mục chủ đề (JavaScript Core, ReactJS, HTML/CSS, Web Performance, System Design Sanjion).
  - Pills lọc theo cấp độ Dễ/Trung bình/Khó/Cực khó màu Hồng - Tím - Vàng.
  - Tabs chọn trạng thái Tất cả / Đã làm / Chưa làm.
- **Thẻ Câu Hỏi Sanjion (`QuestionCard.tsx`)**: Card màu trắng hồng mềm mại, hiển thị Icon loại câu hỏi Sanjion, Badge độ khó, nút lưu Bookmark.

---

### ⚡ Workspace Làm Bài & Biên Dịch Code (`CodeEditorWorkspace.tsx`)
Layout chia đôi màn hình tông Hồng - Trắng - Tím:

#### Bên Trái: Đề Bài & Gemini AI Sanjioner
- **Tab 1: Đề bài Sanjion**: Render nội dung bài tập Sanjion, Form trắc nghiệm, hoặc Khung nhập tự luận.
- **Tab 2: Lời Giải Mẫu**: Bài giải chi tiết chuẩn Senior Sanjion.
- **Tab 3: AI Nhận Xét (`Gemini AI Sanjioner`)**:
  - Bảng nhận xét phong cách Tím - Hồng cao cấp: Điểm số / 10, Nhận xét Sanjion, Điểm mạnh, Ý còn thiếu và Bài trả lời mẫu chuẩn Sanjioner.

#### Bên Phải: Trình Soạn Thảo Monaco Editor & Console
- **Monaco Editor**: Soạn thảo mã nguồn JS.
- **Test Runner & Console**:
  - Nút **"Nộp & Chạy Test Code"** gradient Hồng - Tím.
  - Pháo hoa **Canvas Confetti** xuất hiện khi giải bài Sanjion chính xác!

---

### ⏱️ Modal Thi Thử Sanjion (`MockInterviewModal.tsx`)
- Giả lập buổi Sanjion thực tế trong **45 phút**.
- Chọn ngẫu nhiên **5 câu hỏi Sanjion** (Lý thuyết, Trắc nghiệm, Coding).
- Đồng hồ đếm ngược viền Vàng Hoàng Kim.

---

### 🔑 Modal Cấu Hình Gemini API (`ApiKeyModal.tsx`)
- Nhập API Key miễn phí từ Google AI Studio cho tính năng AI Sanjioner.

---

## 3. Micro-Interactions & UX Optimization

1. **Bright Glassmorphism**: Thẻ trắng mờ `bg-white/80 backdrop-blur-md` nổi bật trên nền Gradient Hồng - Tím - Vàng.
2. **Hover Animations**: Hiệu ứng hover viền hồng mượt mà (`hover:border-pink-300`, `hover:shadow-pink-500/10`).
3. **Feedback Visuals**: Pháo hoa ăn mừng khi vượt qua câu hỏi Sanjion.

---

## 4. Định Hướng Nâng Cấp Giao Diện Tương Lai (UI Roadmap)

- [ ] **Certificate Generator**: Xuất chứng nhận hoàn thành khóa Sanjion Frontend màu Hồng Gold sang trọng.
- [ ] **Voice Answer Recording**: Thu âm giọng nói trả lời bài Sanjion cho AI Gemini phân tích.
- [ ] **Community Discussion Thread**: Thảo luận giữa các ứng viên Sanjion.
