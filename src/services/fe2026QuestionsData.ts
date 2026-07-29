export interface FE2026Question {
  id: string;
  title: string;
  topic: 'React 19' | 'Next.js 15+' | 'Performance & INP' | 'System Design' | 'Modern CSS' | 'AI & Web Architecture' | 'JavaScript & TS';
  difficulty: 'Junior' | 'Middle' | 'Senior' | 'Tech Lead';
  questionText: string;
  speechText: string; // Tailored natural speaking text for Web Speech API
  codeTemplate?: string;
  keyPointsToCover: string[];
  expectedKeywords: string[];
  techLeadModelAnswer: string;
}

export const FE_2026_QUESTION_BANK: FE2026Question[] = [
  {
    id: 'fe2026-react19-compiler',
    title: 'React 19 Compiler (Forget React.memo & useMemo)',
    topic: 'React 19',
    difficulty: 'Senior',
    questionText: 'Trong phiên bản React 19, React Compiler (Forget) đã tự động hóa cơ chế memoization. Hãy giải thích cơ chế tự động tối ưu của React Compiler hoạt động như thế nào ở mức AST/Build-time? Liệu các hook truyền thống như `useMemo`, `useCallback`, `React.memo` có còn cần thiết trong năm 2026 hay không?',
    speechText: 'Trong phiên bản React 19, React Compiler đã tự động hóa cơ chế memoization. Hãy giải thích cơ chế tự động tối ưu của React Compiler ở mức AST và Build-time. Liệu các hook truyền thống như useMemo, useCallback và React memo có còn cần thiết trong năm 2026 hay không?',
    codeTemplate: `// Ví dụ về Component xử lý bảng dữ liệu lớn trong React 19
import { useState } from 'react';

export function UserList({ users, filterText }: { users: Array<{ id: string; name: string }>; filterText: string }) {
  // Hãy giải thích liệu cách viết này trong React 19 có bị re-render thừa hay không
  const filteredUsers = users.filter(u => u.name.includes(filterText));

  return (
    <ul>
      {filteredUsers.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}`,
    keyPointsToCover: [
      'React Compiler phân tích AST (Abstract Syntax Tree) trong quá trình Babel/Vite compile',
      'Tự động theo dõi các dependency và biến đổi component thành code đã được memoize tỉ mỉ (fine-grained memoization)',
      'useMemo/useCallback/React.memo không còn bắt buộc viết thủ công, giảm boilerplate code',
      'Lưu ý về side-effects và Immutability rules mà React Compiler yêu cầu'
    ],
    expectedKeywords: ['React Compiler', 'AST', 'Memoization', 'Babel Plugin', 'Side-effects', 'Immutability', 'Re-render'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **Cơ chế hoạt động của React Compiler:**
   - React Compiler là một build-time compiler (thường qua Babel/SWC/Vite plugin) phân tích cây cú pháp AST của mã nguồn.
   - Nó tự động chèn mã memoization ở mức vi mô (fine-grained value & JSX element caching) cho các biểu thức và component mà không cần lập trình viên tự gọi \`useMemo\` hay \`useCallback\`.

2. **Số phận của \`useMemo\`, \`useCallback\` & \`React.memo\` năm 2026:**
   - **Không còn bắt buộc:** Trong 95% trường hợp phát triển ứng dụng thông thường, các hook này bị coi là **boilerplate thừa** vì Compiler đã xử lý tối ưu hơn hẳn con người.
   - **Trường hợp ngoại lệ:** Vẫn có thể dùng \`useMemo\` khi làm việc với các thư viện cũ chưa tương thích Compiler hoặc khi cần ép buộc duy trì reference identity đặc thù cho Web Workers / WebAssembly.

3. **Yêu cầu quan trọng với lập trình viên:**
   - Tuân thủ nghiêm ngặt **Rules of React** (Pure functions, Không mutate props/state trực tiếp, không gọi side-effects trong lúc render) để Compiler hoạt động chính xác.`
  },
  {
    id: 'fe2026-next15-ppr',
    title: 'Next.js 15 Partial Prerendering (PPR) & Dynamic IO',
    topic: 'Next.js 15+',
    difficulty: 'Tech Lead',
    questionText: 'Partial Prerendering (PPR) trong Next.js 15 kết hợp sức mạnh của Static Site Generation (SSG) và Server-Side Rendering (SSR) trong cùng một HTTP response như thế nào? Hãy vẽ mô hình luồng truyền tải dữ liệu và cách tích hợp `<Suspense>` để đạt chỉ số TTFB (Time to First Byte) tiệm cận 0ms.',
    speechText: 'Partial Prerendering trong Next.js 15 kết hợp sức mạnh của SSG và SSR trong cùng một HTTP response như thế nào? Hãy giải thích cách tích hợp Suspense để đạt chỉ số TTFB tiệm cận 0 millisecond.',
    codeTemplate: `// app/dashboard/page.tsx - Next.js 15 PPR Example
import { Suspense } from 'react';

export const experimental_ppr = true; // Bật PPR

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Khung tĩnh (Static Shell) */}
      <aside className="bg-slate-900 p-4">
        <h2>Static Sidebar</h2>
      </aside>

      {/* Khung động (Dynamic Stream) */}
      <main>
        <Suspense fallback={<p>Loading user feed...</p>}>
          <DynamicUserFeed />
        </Suspense>
      </main>
    </div>
  );
}`,
    keyPointsToCover: [
      'PPR gửi Static Shell (HTML tĩnh đã compile trước ở build time) ngay lập tức cho client',
      'Song song đó, server mở kết nối HTTP streaming qua React Suspense boundary để stream các đoạn HTML động',
      'Giúp TTFB siêu nhanh như tĩnh nhưng nội dung vẫn là realtime/personalized',
      'Khác biệt với SSR truyền thống (phải đợi toàn bộ API mới trả response)'
    ],
    expectedKeywords: ['Partial Prerendering', 'PPR', 'Static Shell', 'HTTP Streaming', 'Suspense', 'TTFB', 'Dynamic IO'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **Bản chất Kiến trúc PPR (Partial Prerendering):**
   - PPR chia layout thành **Static Shell** (phần tĩnh như Navbar, Sidebar, Skeleton) và **Dynamic Holes** (các vùng động bọc trong \`<Suspense>\`).
   - Ở giai đoạn Build time, Static Shell được pre-render thành HTML tĩnh nằm trên Edge CDN.

2. **Luồng HTTP Response Streaming:**
   - Khi user truy cập, Edge CDN lập tức trả về **Static Shell** (TTFB chỉ vài ms).
   - Server đồng thời thực thi các Server Components động bên trong \`<Suspense>\` và dùng HTTPChunked Transfer Encoding để stream mã HTML/React Server Component Payload trực tiếp vào trang web mà không làm gián đoạn UI.

3. **Lợi ích chiến lược cho FE 2026:**
   - Tối ưu chỉ số Core Web Vitals (đặc biệt LCP và INP) lên điểm tối đa 100/100 trên Lighthouse mà vẫn duy trì dữ liệu Real-time cho người dùng.`
  },
  {
    id: 'fe2026-inp-performance',
    title: 'Tối ưu chỉ số INP (Interaction to Next Paint) & LoAF 2026',
    topic: 'Performance & INP',
    difficulty: 'Senior',
    questionText: 'INP (Interaction to Next Paint) là chỉ số thay thế cho FID trong Core Web Vitals. Hãy giải thích sự khác biệt giữa INP và FID. Nếu trang web của bạn bị cảnh báo INP yếu (> 200ms) do main-thread bận xử lý dữ liệu lớn, bạn dùng công cụ API nào (ví dụ `scheduler.yield()`, `requestIdleCallback`, Web Workers) để chia nhỏ Long Tasks?',
    speechText: 'INP Interaction to Next Paint là chỉ số Core Web Vitals cực kỳ quan trọng. Hãy giải thích sự khác biệt giữa INP và FID. Khi main thread bị nghẽn dẫn tới INP yếu trên 200 milliseconds, bạn dùng giải pháp nào để giải phóng main thread?',
    codeTemplate: `// Ví dụ hàm xử lý dữ liệu nặng làm nghẽn UI
async function handleHeavyFilter(items: Array<any>) {
  // TODO: Hãy tái cấu trúc hàm này để không block Main Thread và tối ưu INP < 50ms
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(heavyProcess(items[i]));
  }
  return results;
}`,
    keyPointsToCover: [
      'FID chỉ đo độ trễ của tương tác ĐẦU TIÊN, trong khi INP đo độ trễ phản hồi của TẤT CẢ các tương tác trong toàn bộ phiên truy cập',
      'INP bao gồm: Input Delay + Processing Time + Presentation Delay',
      'Dùng `await scheduler.yield()` để chủ động trả lại quyền kiểm soát cho Main Thread vẽ khung hình (paint next frame)',
      'Chuyển tính toán nặng sang Web Worker hoặc OffscreenCanvas'
    ],
    expectedKeywords: ['INP', 'Interaction to Next Paint', 'Long Tasks', 'scheduler.yield()', 'Main Thread', 'Presentation Delay', 'Web Worker'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **So sánh INP vs FID:**
   - **FID (First Input Delay):** Chỉ đo khoảng thời gian từ khi user click lần đầu tiên cho đến khi Main thread rảnh để BẮT ĐẦU xử lý handler.
   - **INP (Interaction to Next Paint):** Đo tổng khoảng thời gian từ khi user click/gõ/chạm cho tới khi **kết quả trực quan mới nhất được vẽ lên màn hình** (Paint frame), đo lường xuyên suốt toàn bộ lifecycle của trang.

2. **Chiến lược xử lý Long Tasks với \`scheduler.yield()\`:**
\`\`\`ts
async function handleHeavyFilter(items: Array<any>) {
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(heavyProcess(items[i]));
    // Sau mỗi 100 phần tử, yield lại cho trình duyệt vẽ UI frame mới
    if (i % 100 === 0 && 'scheduler' in window && 'yield' in (window as any).scheduler) {
      await (window as any).scheduler.yield();
    }
  }
  return results;
}
\`\`\`

3. **Các giải pháp bổ trợ:**
   - Áp dụng \`useTransition\` / \`useDeferredValue\` trong React để đánh dấu ưu tiên thấp cho state update.
   - Sử dụng Long Animation Frames API (LoAF) trong Chrome DevTools để giám sát nguyên nhân gây trễ frame.`
  },
  {
    id: 'fe2026-microfrontend-federation',
    title: 'Micro-Frontends với Module Federation 2.0 & Runtime Sharing',
    topic: 'System Design',
    difficulty: 'Tech Lead',
    questionText: 'Trong kiến trúc Enterprise Micro-Frontend 2026, Module Federation 2.0 đã giải quyết vấn đề chia sẻ dependency (Shared Dependencies), version mismatch và CSS isolation như thế nào? Làm sao thiết kế hệ thống Micro-Frontend chịu tải lớn mà không gặp hiện tượng "Dependency Hell" hoặc Flash of Unstyled Content (FOUC)?',
    speechText: 'Trong kiến trúc Enterprise Micro Frontend 2026, Module Federation 2.0 đã giải quyết vấn đề chia sẻ dependency và cách ly CSS như thế nào? Làm sao thiết kế hệ thống Micro Frontend mà không gặp hiện tượng Dependency Hell?',
    codeTemplate: `// modulefederation.config.js - Remote App 2.0
module.exports = {
  name: 'checkoutApp',
  filename: 'remoteEntry.js',
  exposes: {
    './CheckoutCart': './src/components/CheckoutCart.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
  },
};`,
    keyPointsToCover: [
      'Module Federation 2.0 cho phép chia sẻ code ở Runtime giữa các ứng dụng độc lập mà không cần rebuild Host App',
      'Singleton strategy & Fallback versioning xử lý xung đột phiên bản React/React-DOM',
      'Shadow DOM hoặc CSS Modules/Tailwind Prefix để cách ly style triệt để',
      'Dynamic Remote Loading & Error Boundary fallback cho khả năng chịu lỗi (Resilience)'
    ],
    expectedKeywords: ['Module Federation 2.0', 'Micro-Frontends', 'Shared Dependencies', 'Singleton', 'FOUC', 'Runtime Loading', 'Isolation'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **Cơ chế Singleton & Runtime Version Negotiator:**
   - Module Federation 2.0 kiểm tra ở runtime phiên bản của các shared package (\`react\`, \`react-dom\`, \`design-system\`). Nếu Host và Remote khớp Semantic Version, nó tái sử dụng instance đã tải trong bộ nhớ.
   - Nếu có version mismatch nghiêm trọng, MF 2.0 tự động kích hoạt **Fallback Mechanism** để nạp gói riêng mà không làm đứt gãy ứng dụng.

2. **Giải pháp CSS Isolation & Ngăn chặn FOUC:**
   - Áp dụng **Scoped CSS / CSS Modules** hoặc Tailwind với custom prefix per micro-app.
   - Khi load Remote Component, kèm theo manifest CSS để pre-load style trước khi component mount vào DOM cây chính.

3. **Chiến lược Fault Tolerance:**
   - Luôn bọc Remote Component trong **React Error Boundary** để nếu một Micro-app bị sự cố server/CDN thì các phần khác của trang web vẫn hoạt động bình thường.`
  },
  {
    id: 'fe2026-modern-css-subgrid',
    title: 'Modern CSS 2026: Container Queries, `:has()`, Subgrid & Anchor Positioning',
    topic: 'Modern CSS',
    difficulty: 'Middle',
    questionText: 'CSS hiện đại năm 2026 đã loại bỏ sự phụ thuộc vào JavaScript cho nhiều hiệu ứng UI phức tạp. Hãy giải thích sức mạnh của CSS `:has()` pseudo-class và CSS Container Queries (thay vì Media Queries). Cho ví dụ thực tế nơi `:has()` thay thế 100% logic quản lý State bằng JS.',
    speechText: 'CSS hiện đại năm 2026 đã loại bỏ sự phụ thuộc vào JavaScript cho nhiều hiệu ứng UI phức tạp. Hãy giải thích sức mạnh của CSS has pseudo class và Container Queries thay thế cho Media Queries truyền thống.',
    codeTemplate: `/* Đặt style đổi màu Card Header khi Card Body chứa thông báo lỗi bằng CSS :has() */
.card:has(.error-message) .card-header {
  /* Điền CSS tại đây */
  background-color: #ef4444;
  color: #ffffff;
}

/* Đặt Container Query cho Card khi chiều rộng container > 400px */
@container (min-width: 400px) {
  .card-content {
    display: flex;
    flex-direction: row;
  }
}`,
    keyPointsToCover: [
      'CSS `:has()` hoạt động như một "parent selector" cho phép chọn phần tử cha dựa trên phần tử con hoặc phần tử kề sau',
      'Container Queries định kiểu UI dựa trên kích thước của CONTAINER chứa nó chứ không phụ thuộc vào kích thước toàn màn hình (Viewport/Media Query)',
      'Subgrid giữ sự đồng bộ layout lưới giữa các phần tử con lồng nhau nhiều cấp',
      'Anchor Positioning giúp đặt vị trí Popover/Tooltip bám theo phần tử gốc mà không cần thư viện Popper.js/Floating-UI'
    ],
    expectedKeywords: ['CSS :has()', 'Container Queries', 'Subgrid', 'Anchor Positioning', 'Parent Selector', 'Media Queries', 'Layout'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **Sức mạnh của CSS \`:has()\` (The Parent Selector):**
   - Cho phép chọn phần tử cha dựa trên trạng thái của con: ví dụ \`form:has(input:invalid)\` để đổi viền toàn bộ Form mà không cần dùng JS \`onChange\` listener.
   - Thay thế các thư viện quản lý UI state rườm rà.

2. **Container Queries vs Media Queries:**
   - **Media Queries:** Phụ thuộc vào viewport màn hình. Nếu component nằm trong Sidebar hẹp, Media Query vẫn nhận kích thước màn hình lớn làm vỡ giao diện.
   - **Container Queries (\`@container\`):** Định hình component linh hoạt dựa trên diện tích vùng chứa thực tế của nó. Giúp tạo **Modular Design System** thực sự đáp ứng chuẩn 2026.`
  },
  {
    id: 'fe2026-ai-wasm-client',
    title: 'Tích hợp AI Client-Side (WebGPU, Wasm LLMs & Streaming UI)',
    topic: 'AI & Web Architecture',
    difficulty: 'Tech Lead',
    questionText: 'Xu hướng Web AI 2026 hướng tới việc chạy các mô hình AI trực tiếp ở Client qua WebGPU & WebAssembly (ví dụ WebLLM, Transformers.js) hoặc nhận Server-Sent Events (SSE) streaming UI. Hãy trình bày kiến trúc xử lý Streamed UI response và cách quản lý bộ nhớ RAM/VRAM ở Browser để ứng dụng không bị tràn bộ nhớ (Out of Memory).',
    speechText: 'Xu hướng Web AI 2026 hướng tới việc chạy các mô hình AI trực tiếp ở Client qua WebGPU và WebAssembly. Hãy trình bày kiến trúc xử lý Streamed UI response và cách quản lý bộ nhớ ở Browser để không bị tràn bộ nhớ.',
    codeTemplate: `// Client-side Streaming Response Processor
async function renderAIStream(responseStream: ReadableStream) {
  const reader = responseStream.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // TODO: Cập nhật UI linh hoạt mà không gây xé hình hay giật lag
  }
}`,
    keyPointsToCover: [
      'WebGPU cho phép truy cập trực tiếp GPU của máy người dùng để tăng tốc suy luận AI (Inference) ngay tại Browser',
      'Sử dụng Web Workers để đưa mô hình AI ra khỏi Main Thread',
      'Kỹ thuật Chunked SSE / WebSockets cho Streaming Dynamic Components',
      'Quản lý bộ nhớ VRAM/RAM: Unload model tensors khi chuyển trang, giới hạn token buffer'
    ],
    expectedKeywords: ['WebGPU', 'WebAssembly', 'Wasm', 'Streaming UI', 'Server-Sent Events', 'Web Workers', 'VRAM', 'Memory Management'],
    techLeadModelAnswer: `### Đáp Án Mẫu Chuẩn Tech Lead FE 2026:
1. **Kiến trúc WebAI Hybrid 2026:**
   - **Client-side WebGPU:** Sử dụng GPU của client qua WebGPU cho các tác vụ nhạy cảm riêng tư hoặc offline (Zero API cost).
   - **Server Streaming (SSE / Vercel AI SDK):** Trả dữ liệu token từng chuỗi và render theo thời gian thực.

2. **Quản lý Bộ nhớ & Tối ưu UI:**
   - Chạy toàn bộ tiến trình nạp mô hình AI trong **Web Worker** để không bao giờ làm đơ UI Main Thread.
   - Áp dụng **Virtual Windowing / Virtual List** đối với các hội thoại AI cực dài để giải phóng các node DOM không còn hiển thị.`
  }
];
