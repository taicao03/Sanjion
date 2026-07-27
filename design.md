# FE Sanjion Pro — UI/UX Design System & Architecture Specification (Bản Nâng Cấp "Atelier Edition")

Tài liệu thiết kế chi tiết về Giao diện (UI), Trải nghiệm người dùng (UX), Design System và Định hướng phát triển Frontend cho Nền tảng Ôn luyện **Sanjion Frontend Developer** (**FE Sanjion Pro**).

---

## 0. Định Hướng Thiết Kế (Design Direction)

Bản thiết kế gốc dùng tông hồng - tím - vàng dạng glassmorphism sáng màu — đây là phong cách rất phổ biến hiện nay (gradient rực rỡ + card kính mờ), dễ khiến sản phẩm trông giống hàng loạt app học tập/gamification khác trên thị trường, chưa toát lên được vị thế "luyện thi Senior nghiêm túc".

**Ý tưởng cốt lõi mới: "Editor Noir"** — lấy cảm hứng trực tiếp từ chính công cụ mà một FE Senior dùng hằng ngày: nền IDE tối, thanh title bar, git diff, terminal prompt, syntax highlight. Đây không phải chọn màu tối cho "sang", mà vì bản thân **thế giới của người dùng (lập trình viên)** đã là dark editor — thiết kế trung thực với chất liệu gốc sẽ đẳng cấp hơn bất kỳ gradient trang trí nào.

- **Trước**: Nền trắng hồng, card kính mờ, gradient rực rỡ, pháo hoa confetti.
- **Sau**: Nền canvas tối như một IDE cao cấp (nghĩ tới cảm giác của Linear, Vercel Dashboard, VS Code Dark+ được tinh chỉnh thủ công), điểm nhấn màu được dùng **rất tiết chế**, mỗi màu mang đúng một ý nghĩa chức năng (giống convention màu trong git diff / test runner), chữ số liệu được canh chỉnh như một bảng điều khiển kỹ thuật thật sự.

**Signature element (điểm nhấn duy nhất khiến sản phẩm được ghi nhớ):** _"The Ledger Line"_ — mọi tiến độ, streak, điểm số được biểu diễn dưới dạng dòng diff kiểu Git (`+ đã giải`, `- còn thiếu`) thay vì thanh progress bar bo tròn thông thường. Đây là chi tiết duy nhất được phép "chơi", còn lại toàn bộ giao diện giữ kỷ luật và tối giản.

---

## 1. Design System & Style Guide (Tông "Editor Noir")

### 🎨 Color Palette — Bảng màu Token (đặt tên theo chức năng, không đặt tên theo cảm tính)

| Token                    | Hex       | Vai trò                                                                                                             |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `Canvas / Ink-950`       | `#0B0D11` | Nền chính toàn app, giống nền editor                                                                                |
| `Surface / Slate-900`    | `#161B22` | Nền Card, Sidebar, Modal — viền tách lớp bằng hairline `1px solid rgba(255,255,255,0.06)`, **không dùng blur kính** |
| `Border / Line-800`      | `#232A35` | Đường viền, dải phân cách, ô lưới heatmap rỗng                                                                      |
| `Text / Paper-50`        | `#EDEFF2` | Chữ chính                                                                                                           |
| `Text muted / Slate-400` | `#8B94A3` | Chữ phụ, placeholder, timestamp                                                                                     |
| `Accent · Compile Gold`  | `#C9962C` | **Chỉ dùng cho**: Streak 🔥, Điểm kinh nghiệm ⭐, huy hiệu thành tích                                               |
| `Accent · Pass Green`    | `#2FAE79` | **Chỉ dùng cho**: Test pass, câu trả lời đúng, trạng thái "Đã làm"                                                  |
| `Accent · Senior Indigo` | `#5B54D9` | **Chỉ dùng cho**: Trợ lý AI Sanjioner, cấp độ Expert, System Design                                                 |
| `Accent · Fail Rust`     | `#C1553B` | **Chỉ dùng cho**: Test fail, câu sai, cảnh báo thời gian sắp hết                                                    |

> Nguyên tắc: mỗi màu accent gắn chặt với **một** ý nghĩa duy nhất, giống quy ước màu trong git diff / terminal — người dùng học convention một lần và dùng suốt hành trình, không có màu nào "trang trí thuần túy".

### 🔤 Typography & Font System

- **Display (tiêu đề lớn, Hero, tên cấp độ)**: `Fraunces` (serif có cá tính, trọng lượng Black/Medium) — dùng **hạn chế**, chỉ cho 1-2 vị trí nổi bật mỗi màn hình, tạo cảm giác "ấn phẩm chuyên môn cao cấp" thay vì sans-serif bo tròn mềm mại.
- **UI Font (nút, nhãn, đoạn văn)**: `Inter` — giữ nguyên vì đã tối ưu cho UI mật độ cao.
- **Code & Mono Font**: `JetBrains Mono` — dùng cho Monaco Editor, Console, và toàn bộ số liệu (điểm số, đếm ngược, streak) để mọi con số trông như dữ liệu hệ thống thật, không phải icon trang trí.

---

## 2. Cấu Trúc Các Màn Hình & Layout Components

### 🧭 Header & Navigation Bar (`Navbar.tsx`)

- **Logo & Thương hiệu**: `FE Sanjion PRO` dạng wordmark Fraunces, không dùng icon trái tim; thay bằng dấu `>` kiểu con trỏ terminal đứng trước tên, gợi ý "đang chạy phiên luyện tập".
- **Thanh trạng thái kết nối** dạng chấm trạng thái kiểu server monitor:
  - `● Supabase API Connected` — chấm `Pass Green`.
  - `● Local Sandbox Mode` — chấm `Slate-400`, không nhấp nháy.
- **Navigation Tabs**: dạng tab file kiểu editor (giống tab mở file trong VS Code), tab đang chọn có gạch chân `Compile Gold` mảnh 2px, nền không đổi màu.
- **User Widgets**:
  - **Nút "Thi Thử Sanjion"**: viền `Compile Gold` 1px, nền trong suốt, chữ gold — không dùng fill đầy màu.
  - **Streak Counter**: số hiển thị bằng `JetBrains Mono`, đơn vị 🔥 chỉ là hậu tố nhỏ, không phóng to.
  - **Experience Points**: hiển thị dạng `+120 XP` theo màu Compile Gold, giống dòng log hệ thống.

---

### 📊 Trang Tổng Quan (`Dashboard View`)

1. **Hero Banner**: nền `Ink-950` phẳng, không gradient; điểm nhấn duy nhất là một dòng terminal prompt lớn dạng Fraunces: _"sanjion@fe ~ % ready for senior review"_, con trỏ nhấp nháy chậm.
2. **Top Stats Overview Grid**: 4 ô số liệu dạng bảng điều khiển tối giản — số lớn `JetBrains Mono`, nhãn nhỏ `Slate-400`, không icon nền màu, chỉ 1 chấm màu accent nhỏ ở góc trên mỗi ô theo đúng ý nghĩa chức năng của nó.
3. **Tiến Độ Sanjion Theo Cấp Độ**: thay ProgressBar bo tròn bằng **Ledger Line** — mỗi cấp độ là một dòng đơn `+ đã giải 24` (xanh) `- còn lại 6` (mờ), độ dài đoạn `+` biểu diễn tỉ lệ hoàn thành bằng chính chiều dài ký tự.
4. **Biểu Đồ Phân Phối Kỹ Năng** (`CategoryBreakdownChart.tsx`): Recharts với bảng màu 4 accent ở trên, nền chart trong suốt, không viền tròn dày.
5. **Nhật Ký Hoạt Động 28 Ngày** (`StreakHeatmap.tsx`): ô vuông từ `Line-800` (trống) → `Pass Green` đậm dần theo số câu giải trong ngày, giống hệt heatmap contribution của GitHub — chất liệu quen thuộc, đáng tin cậy với dân kỹ thuật.

---

### 📚 Trang Ngân Hàng Câu Hỏi Sanjion (`Questions Bank View`)

- **Bộ Lọc Đa Chiều** (`FilterBar.tsx`):
  - Ô tìm kiếm dạng thanh lệnh: placeholder `grep --topic "..."`.
  - Danh mục chủ đề hiển thị dạng tag viền mảnh, không nền màu đặc.
  - Pills cấp độ dùng đúng 1 trong 4 accent màu theo bảng token, không pha trộn thêm màu khác.
  - Tabs trạng thái Tất cả / Đã làm / Chưa làm dạng underline, không pill nền.
- **Thẻ Câu Hỏi** (`QuestionCard.tsx`): nền `Surface / Slate-900`, viền hairline, hover chỉ sáng viền nhẹ (`border-color` đổi sang accent tương ứng độ khó) — không đổ bóng màu, không nâng thẻ lên (no lift/scale trên hover).

---

### ⚡ Workspace Làm Bài & Biên Dịch Code (`CodeEditorWorkspace.tsx`)

Layout chia đôi màn hình, toàn bộ nền `Ink-950`, đúng cảm giác một IDE thật:

#### Bên Trái: Đề Bài & Gemini AI Sanjioner

- **Tab 1 — Đề bài Sanjion**: nội dung dạng tài liệu kỹ thuật, code block dùng `JetBrains Mono` trên nền `Surface`.
- **Tab 2 — Lời Giải Mẫu**: cùng hệ thống, đánh dấu bằng nhãn nhỏ viền `Pass Green`.
- **Tab 3 — AI Nhận Xét** (`Gemini AI Sanjioner`): trình bày như một **code review comment** thật (giống comment trong Pull Request): avatar nhỏ + tên "Gemini Sanjioner", nội dung nhận xét theo khối, điểm số hiển thị dạng `8.5 / 10` bằng Mono, dùng đúng một viền `Senior Indigo` mảnh bên trái khối thay vì nền tím đầy.

#### Bên Phải: Trình Soạn Thảo Monaco Editor & Console

- **Monaco Editor**: theme tối tuỳ biến đồng bộ 4 accent ở trên (không dùng theme mặc định của Monaco).
- **Test Runner & Console**:
  - Nút **"Nộp & Chạy Test Code"**: nền `Pass Green` đặc khi hover sẵn sàng chạy, còn lại viền mảnh.
  - Kết quả test hiển thị dạng dòng diff thật: `✓ 4 passed` (xanh) / `✗ 1 failed` (rust) — **bỏ hiệu ứng pháo hoa confetti**, thay bằng một dòng log ngắn gọn xuất hiện mượt trong Console: `✓ All tests passed — nice work.` Sự tiết chế ở đây chính là điều làm nó trông "đẳng cấp": không cần hiệu ứng ăn mừng phô trương để xác nhận thành công.

---

### ⏱️ Modal Thi Thử Sanjion (`MockInterviewModal.tsx`)

- Giả lập buổi phỏng vấn thực tế trong **45 phút**.
- Chọn ngẫu nhiên **5 câu hỏi Sanjion** (Lý thuyết, Trắc nghiệm, Coding).
- Đồng hồ đếm ngược dạng số Mono lớn, màu chuyển từ `Paper-50` → `Compile Gold` (còn 5 phút) → `Fail Rust` (còn 1 phút), không viền vàng bao quanh khung.

---

### 🔑 Modal Cấu Hình Gemini API (`ApiKeyModal.tsx`)

- Nhập API Key miễn phí từ Google AI Studio cho tính năng AI Sanjioner, ô nhập dạng input kiểu terminal (nền `Surface`, con trỏ Mono).

---

## 3. Micro-Interactions & UX Optimization

1. **Editor Noir Surface**: thẻ `Surface / Slate-900` với viền hairline `rgba(255,255,255,0.06)`, tuyệt đối không dùng `backdrop-blur` — độ sâu tạo bằng chênh lệch độ sáng nền, không tạo bằng kính mờ.
2. **Hover Animations**: chỉ đổi màu viền theo đúng accent ngữ nghĩa của phần tử, thời lượng transition ngắn (120–150ms), không scale/nâng thẻ.
3. **Feedback Visuals**: thay pháo hoa bằng một dòng log console xuất hiện + gạch dưới `Pass Green` chớp nhẹ một lần duy nhất — ăn mừng bằng sự chính xác của dữ liệu, không bằng hiệu ứng thị giác ồn ào.
4. **Reduced motion**: toàn bộ animation tôn trọng `prefers-reduced-motion`; con trỏ nhấp nháy ở Hero và mọi transition tắt khi được yêu cầu.

---

## 4. Định Hướng Nâng Cấp Giao Diện Tương Lai (UI Roadmap)

- [ ] **Certificate Generator**: chứng nhận dạng "compiled artifact" — bố cục như một trang tài liệu kỹ thuật trang trọng (giấy chứng nhận kiểu letterhead công ty luật/kiến trúc), điểm nhấn duy nhất là con dấu `Compile Gold` embossed, không dùng gradient hồng-gold.
- [ ] **Voice Answer Recording**: giao diện ghi âm dạng waveform Mono đơn sắc trên nền `Surface`.
- [ ] **Community Discussion Thread**: hiển thị dạng thread bình luận kiểu Pull Request/Issue, mỗi bình luận có viền trái mảnh theo màu vai trò người viết (Mentor = Indigo, Học viên = Paper-50).

---

### Tóm tắt lý do thay đổi

Bảng màu hồng-tím-vàng gradient + glass ban đầu là một công thức rất phổ biến trong các app học tập hiện nay, dễ hoà lẫn. Bản "Editor Noir" giữ lại đúng 3 vai trò màu gốc (thành tích = vàng, AI/Expert = tím, còn lại thêm xanh cho "đúng"/"đã làm" và đỏ gạch cho "sai"/"khó") nhưng gắn chúng vào ngôn ngữ hình ảnh thật của dân lập trình (git diff, terminal, PR comment, GitHub heatmap) thay vì trang trí gradient — đây là nơi sự "đẳng cấp" đến từ: tính chính xác, tiết chế, và trung thực với chất liệu của chính sản phẩm.
