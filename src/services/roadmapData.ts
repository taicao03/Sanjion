import { Question, DifficultyLevel } from '../types';

export interface LearningNode {
  id: string;
  title: string;
  description: string;
  type: 'THEORY' | 'MULTIPLE_CHOICE' | 'CODING_PRACTICE';
  difficulty: DifficultyLevel;
  questionId: string;
  estimatedMinutes: number;
}

export interface RoadmapStage {
  id: string;
  level: 'Junior' | 'Mid-level' | 'Senior' | 'Architect';
  levelNumber: number;
  title: string;
  subtitle: string;
  badgeColor: string;
  gradient: string;
  iconName: string;
  targetSkills: string[];
  nodes: LearningNode[];
}

export const ROADMAP_STAGES: RoadmapStage[] = [
  // =====================================================================
  // STAGE 1: JUNIOR (20 bài)
  // =====================================================================
  {
    id: 'stage-junior',
    level: 'Junior',
    levelNumber: 1,
    title: 'Cấp Độ 1: Junior / Fresher Developer',
    subtitle: 'Nền móng vững chắc: HTML5, CSS3, Flexbox/Grid, JS Core, Scope & DOM Events',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    gradient: 'from-emerald-500 to-teal-600',
    iconName: 'Sprout',
    targetSkills: [
      'HTML5 Semantics & Accessibility (a11y)',
      'CSS Specificity, Flexbox & CSS Grid Layout',
      'JavaScript Core: Scope, Hoisting, Array Methods',
      'DOM Manipulation & Event Propagation (Bubbling/Delegation)',
      'Form Validation & State Basics in React',
      'Responsive Design & CSS Variables',
      'Git Workflow & Basic CLI Commands',
      'HTTP Basics & REST API Concepts',
    ],
    nodes: [
      { id: 'node-css-spec', title: '🎯 Bài 1: CSS Specificity & Thứ Tự Ưu Tiên Style', description: 'Hiểu rõ quy tắc tính điểm Specificity để ghi đè style sạch sẽ, không lạm dụng !important', type: 'MULTIPLE_CHOICE', difficulty: 'EASY', questionId: 'rm-html-01', estimatedMinutes: 10 },
      { id: 'node-css-flex', title: '💻 Bài 2: CSS Flexbox & Grid Centering Layout', description: 'Viết CSS helper căn giữa hoàn toàn phần tử cả chiều ngang lẫn chiều dọc bằng Flexbox', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-css-02', estimatedMinutes: 12 },
      { id: 'node-js-array', title: '💻 Bài 3: Thao Tác Mảng JS ES6+ (Array Methods)', description: 'Viết hàm lọc và nhân đôi số chẵn với filter & map chuẩn ES6+', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-js-array-01', estimatedMinutes: 12 },
      { id: 'node-dom-event', title: '📖 Bài 4: Event Bubbling & Event Delegation trong DOM', description: 'Phân tích cơ chế lan truyền sự kiện và ứng dụng Event Delegation tối ưu bộ nhớ RAM', type: 'THEORY', difficulty: 'EASY', questionId: 'rm-dom-01', estimatedMinutes: 15 },
      { id: 'node-js-hoisting', title: '🎯 Bài 5: Phân Biệt var, let, const & Cơ Chế Hoisting', description: 'Phân tích phạm vi Block-scope vs Function-scope và hiện tượng Temporal Dead Zone (TDZ)', type: 'MULTIPLE_CHOICE', difficulty: 'EASY', questionId: 'rm-js-var-let', estimatedMinutes: 10 },
      { id: 'node-dom-form', title: '💻 Bài 6: Lấy Dữ Liệu Form HTML & Validation', description: 'Viết hàm kiểm tra định dạng email và xử lý dữ liệu form bằng JavaScript', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-dom-form', estimatedMinutes: 12 },
      { id: 'node-html-semantic', title: '📖 Bài 7: HTML5 Semantic Elements & Accessibility', description: 'Phân tích vai trò của các thẻ semantic như header, main, article và thuộc tính ARIA', type: 'THEORY', difficulty: 'EASY', questionId: 'rm-html-semantic', estimatedMinutes: 12 },
      { id: 'node-css-grid', title: '💻 Bài 8: CSS Grid Layout - Xây Dựng Dashboard Layout', description: 'Sử dụng CSS Grid để tạo bố cục trang dashboard 12 cột responsive', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-css-grid', estimatedMinutes: 15 },
      { id: 'node-js-string', title: '💻 Bài 9: Xử Lý String ES6+ (Template Literals & Methods)', description: 'Sử dụng Template Literals, padStart, trim, split, replace để xử lý chuỗi', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-js-string', estimatedMinutes: 10 },
      { id: 'node-js-object', title: '🎯 Bài 10: Object Destructuring & Spread/Rest Operator', description: 'Nắm vững cú pháp Destructuring, Spread (...) và Rest trong ES6+', type: 'MULTIPLE_CHOICE', difficulty: 'EASY', questionId: 'rm-js-object', estimatedMinutes: 10 },
      { id: 'node-css-variables', title: '📖 Bài 11: CSS Custom Properties (Variables) & Theming', description: 'Khai báo và sử dụng CSS Variables để xây dựng hệ thống màu sắc linh hoạt', type: 'THEORY', difficulty: 'EASY', questionId: 'rm-css-variables', estimatedMinutes: 12 },
      { id: 'node-dom-query', title: '💻 Bài 12: DOM Querying & Element Manipulation', description: 'Sử dụng querySelector, getElementById, classList để thao tác DOM hiệu quả', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-dom-query', estimatedMinutes: 12 },
      { id: 'node-js-function', title: '🎯 Bài 13: Arrow Functions & this Context Binding', description: 'Phân biệt hàm thông thường và arrow function về this binding trong các ngữ cảnh khác nhau', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-js-function', estimatedMinutes: 12 },
      { id: 'node-http-basics', title: '📖 Bài 14: HTTP Methods & REST API Fundamentals', description: 'Hiểu rõ HTTP GET/POST/PUT/DELETE, Status Codes và cách gọi API với fetch()', type: 'THEORY', difficulty: 'EASY', questionId: 'rm-http-basics', estimatedMinutes: 15 },
      { id: 'node-git-basics', title: '🎯 Bài 15: Git Workflow - Commit, Branch & Merge', description: 'Nắm vững quy trình làm việc với Git: branch, commit, merge và rebase cơ bản', type: 'MULTIPLE_CHOICE', difficulty: 'EASY', questionId: 'rm-git-basics', estimatedMinutes: 10 },
      { id: 'node-js-error', title: '💻 Bài 16: Xử Lý Lỗi try/catch & Custom Error', description: 'Viết hàm xử lý ngoại lệ với try/catch/finally và tạo lớp Custom Error', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-js-error', estimatedMinutes: 12 },
      { id: 'node-css-responsive', title: '📖 Bài 17: Responsive Design & Media Queries', description: 'Kỹ thuật viết CSS responsive Mobile-First với breakpoints và Media Queries', type: 'THEORY', difficulty: 'MEDIUM', questionId: 'rm-css-responsive', estimatedMinutes: 15 },
      { id: 'node-js-map-set', title: '💻 Bài 18: Map & Set Data Structures trong JavaScript', description: 'Sử dụng Map và Set để lưu trữ dữ liệu hiệu quả hơn Object/Array thông thường', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-js-map-set', estimatedMinutes: 15 },
      { id: 'node-browser-storage', title: '🎯 Bài 19: LocalStorage vs SessionStorage vs Cookies', description: 'Phân biệt 3 cơ chế lưu trữ phía client về vòng đời, dung lượng và phạm vi', type: 'MULTIPLE_CHOICE', difficulty: 'EASY', questionId: 'rm-browser-storage', estimatedMinutes: 10 },
      { id: 'node-js-regex', title: '💻 Bài 20: Regular Expressions (RegEx) Cơ Bản', description: 'Viết biểu thức chính quy để kiểm tra định dạng số điện thoại và URL hợp lệ', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-js-regex', estimatedMinutes: 15 },
    ]
  },

  // =====================================================================
  // STAGE 2: MID-LEVEL (20 bài)
  // =====================================================================
  {
    id: 'stage-mid',
    level: 'Mid-level',
    levelNumber: 2,
    title: 'Cấp Độ 2: Mid-Level Developer',
    subtitle: 'Nắm chủ JS Closures, Event Loop Queues, React Hooks & TypeScript Safety',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    gradient: 'from-blue-500 to-indigo-600',
    iconName: 'Zap',
    targetSkills: [
      'JS Async: Promises, Async/Await, Microtasks vs Macrotasks',
      'Closures & Memory Lexical Scope Retention',
      'React Hooks: useMemo, useCallback, useRef & Custom Hooks',
      'TypeScript: Generics, Utility Types (Omit, Pick, Partial)',
      'Rules of Hooks & React Component Lifecycle',
      'State Management Patterns & Context API',
      'Testing: Unit Test với Jest & React Testing Library',
      'Build Tools: Vite, Webpack Basics & Tree Shaking',
    ],
    nodes: [
      { id: 'node-closure-counter', title: '💻 Bài 1: Tạo Hàm Closure Đếm Số (Counter Closure)', description: 'Thực hành tạo hàm closure riêng biệt lưu trữ lexical environment', type: 'CODING_PRACTICE', difficulty: 'EASY', questionId: 'rm-js-01', estimatedMinutes: 15 },
      { id: 'node-event-loop', title: '🎯 Bài 2: Thứ Tự Chạy Trong Event Loop (Microtask vs Macrotask)', description: 'Đoán chính xác thứ tự log console giữa Promise microtask và setTimeout macrotask', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-async-01', estimatedMinutes: 15 },
      { id: 'node-debounce', title: '💻 Bài 3: Tự Viết Hàm Debounce & Throttle Function', description: 'Thực hành viết custom Debounce hoãn gọi hàm ô tìm kiếm autocomplete', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-js-debounce', estimatedMinutes: 20 },
      { id: 'node-usememo-usecallback', title: '📖 Bài 4: Phân Biệt useMemo vs useCallback Trong React', description: 'Phân tích bản chất ghi nhớ kết quả tính toán vs ghi nhớ định nghĩa hàm', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-react-02', estimatedMinutes: 18 },
      { id: 'node-ts-utility', title: '💻 Bài 5: Sử Dụng Utility Types TypeScript (Omit, Pick)', description: 'Tạo type mới bằng cách trích xuất và loại bỏ thuộc tính nhạy cảm với TypeScript', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-ts-01', estimatedMinutes: 15 },
      { id: 'node-react-rules', title: '🎯 Bài 6: React Rules of Hooks & Lifecycle', description: 'Nắm vững quy tắc vàng gọi Hooks ở Top-Level của Function Component', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-react-rules', estimatedMinutes: 12 },
      { id: 'node-ts-generics', title: '💻 Bài 7: TypeScript Generics & Conditional Types', description: 'Viết hàm generic type-safe hoạt động với mọi kiểu dữ liệu', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-ts-generics', estimatedMinutes: 18 },
      { id: 'node-react-useref', title: '📖 Bài 8: useRef & forwardRef - Quản Lý DOM Refs', description: 'Sử dụng useRef để lưu giá trị mutable mà không trigger re-render và forwardRef', type: 'THEORY', difficulty: 'MEDIUM', questionId: 'rm-react-useref', estimatedMinutes: 15 },
      { id: 'node-promise-chain', title: '💻 Bài 9: Promise Chaining & Async/Await Pattern', description: 'Viết hàm xử lý chuỗi API call tuần tự và song song với async/await', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-promise-chain', estimatedMinutes: 20 },
      { id: 'node-context-api', title: '🎯 Bài 10: React Context API & useContext Hook', description: 'Phân tích khi nào nên dùng Context API thay vì Props Drilling để chia sẻ state', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-context-api', estimatedMinutes: 12 },
      { id: 'node-js-prototype', title: '📖 Bài 11: Prototype Chain & Class Inheritance JS', description: 'Phân tích cơ chế kế thừa Prototypal và cú pháp ES6 Class trong JavaScript', type: 'THEORY', difficulty: 'MEDIUM', questionId: 'rm-js-prototype', estimatedMinutes: 18 },
      { id: 'node-ts-interface', title: '🎯 Bài 12: TypeScript Interface vs Type Alias', description: 'Phân biệt Interface và Type Alias: khi nào dùng cái nào và sự khác biệt cốt lõi', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-ts-interface', estimatedMinutes: 12 },
      { id: 'node-jest-unit-test', title: '💻 Bài 13: Viết Unit Tests với Jest & Mocking', description: 'Viết bài test kiểm tra hàm pure function và mock API calls với jest.fn()', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-jest-test', estimatedMinutes: 20 },
      { id: 'node-react-reducer', title: '📖 Bài 14: useReducer Pattern & Flux Architecture', description: 'Khi nào nên dùng useReducer thay vì useState và tại sao Flux Pattern giúp predictable state', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-react-reducer', estimatedMinutes: 18 },
      { id: 'node-module-bundler', title: '🎯 Bài 15: Vite vs Webpack - Build Tools & Tree Shaking', description: 'So sánh kiến trúc Vite (ESM native) vs Webpack (CommonJS bundle) và kỹ thuật Tree Shaking', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-module-bundler', estimatedMinutes: 12 },
      { id: 'node-curry-compose', title: '💻 Bài 16: Currying & Function Composition FP', description: 'Viết hàm curry() và compose() chuẩn Functional Programming', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-curry-compose', estimatedMinutes: 20 },
      { id: 'node-react-memo', title: '📖 Bài 17: React.memo & Optimization Rendering Tree', description: 'Phân tích khi nào React.memo có ích và khi nào nó phản tác dụng (premature optimization)', type: 'THEORY', difficulty: 'MEDIUM', questionId: 'rm-react-memo', estimatedMinutes: 15 },
      { id: 'node-ts-discriminated', title: '🎯 Bài 18: TypeScript Discriminated Unions & Type Guards', description: 'Sử dụng Discriminated Union patterns để viết type-safe state machines', type: 'MULTIPLE_CHOICE', difficulty: 'HARD', questionId: 'rm-ts-discriminated', estimatedMinutes: 15 },
      { id: 'node-lazy-import', title: '💻 Bài 19: Code Splitting & Lazy Import với React.lazy', description: 'Triển khai Code Splitting với React.lazy + Suspense để giảm kích thước bundle', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-lazy-import', estimatedMinutes: 15 },
      { id: 'node-array-sort-search', title: '💻 Bài 20: Thuật Toán Sắp Xếp & Tìm Kiếm trong JS', description: 'Implement Binary Search và Custom Comparator Sort cho mảng đối tượng phức tạp', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-array-sort', estimatedMinutes: 18 },
    ]
  },

  // =====================================================================
  // STAGE 3: SENIOR (20 bài)
  // =====================================================================
  {
    id: 'stage-senior',
    level: 'Senior',
    levelNumber: 3,
    title: 'Cấp Độ 3: Senior Developer',
    subtitle: 'Làm chủ Web Performance, Core Web Vitals, Virtual List & Polyfill Engine',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
    gradient: 'from-purple-600 to-pink-600',
    iconName: 'Award',
    targetSkills: [
      'Core Web Vitals Optimization (LCP, INP, CLS)',
      'Virtual List / Windowing render 100,000+ items',
      'Frontend Security: XSS, CSRF, DOMPurify, CSP',
      'Polyfill Implementation: Custom Promise.all & Deep Clone',
      'Senior Code Review & Memory Leak Debugging',
      'Web Workers & Offscreen Canvas',
      'Service Workers & PWA Architecture',
      'Advanced State Management (Redux Toolkit / Zustand)',
    ],
    nodes: [
      { id: 'node-uselocalstorage', title: '💻 Bài 1: Viết Custom Hook useLocalStorage trong React', description: 'Luyện tập tạo custom hook đồng bộ React State với LocalStorage trình duyệt', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-react-01', estimatedMinutes: 20 },
      { id: 'node-deep-clone', title: '💻 Bài 2: Viết Hàm deepClone(obj) Đệ Quy Chuẩn JS', description: 'Sao chép sâu Object/Array lồng nhau mà không làm ảnh hưởng tham chiếu ban đầu', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-js-02', estimatedMinutes: 25 },
      { id: 'node-virtual-list', title: '💻 Bài 3: Xây Dựng Thuật Toán Virtual Windowing (Virtual List)', description: 'Luyện tập thuật toán Virtual List chỉ render phần tử có trong Viewport', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-perf-virtual-list', estimatedMinutes: 30 },
      { id: 'node-fe-sec', title: '🎯 Bài 4: Phòng Chống Tấn Công XSS & Khởi Tạo Content Security Policy', description: 'Phân tích lỗ hổng Injection và sử dụng DOMPurify làm sạch HTML', type: 'MULTIPLE_CHOICE', difficulty: 'HARD', questionId: 'rm-sec-01', estimatedMinutes: 20 },
      { id: 'node-core-web-vitals', title: '📖 Bài 5: Tối Ưu Chỉ Số Core Web Vitals (LCP, INP, CLS)', description: 'Chiến lược tối ưu hóa Critical Rendering Path và giải phóng Long Tasks', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-perf-vitals-theory', estimatedMinutes: 22 },
      { id: 'node-polyfill-promise', title: '💻 Bài 6: Tự Triển Khai Polyfill Promise.all', description: 'Viết hàm customPromiseAll xử lý mảng Promise bất đồng bộ chuẩn Polyfill', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-async-02', estimatedMinutes: 30 },
      { id: 'node-web-worker', title: '📖 Bài 7: Web Workers & Offscreen Computation', description: 'Đưa tính toán nặng sang Web Worker để giải phóng Main Thread khỏi bị block', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-web-worker', estimatedMinutes: 20 },
      { id: 'node-intersection-observer', title: '💻 Bài 8: Lazy Loading với IntersectionObserver API', description: 'Viết hàm Lazy Load hình ảnh khi scroll vào viewport sử dụng IntersectionObserver', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-intersection', estimatedMinutes: 18 },
      { id: 'node-csrf-security', title: '🎯 Bài 9: CSRF Attack & SameSite Cookie Defense', description: 'Phân tích cơ chế tấn công CSRF và cách phòng thủ với SameSite Cookie và CSRF Token', type: 'MULTIPLE_CHOICE', difficulty: 'HARD', questionId: 'rm-csrf-sec', estimatedMinutes: 18 },
      { id: 'node-redux-toolkit', title: '📖 Bài 10: Redux Toolkit & RTK Query Pattern', description: 'Thiết kế slice, thunk async actions và caching strategy với RTK Query', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-redux-toolkit', estimatedMinutes: 22 },
      { id: 'node-pwa-service-worker', title: '💻 Bài 11: Service Worker & PWA Offline Caching', description: 'Viết Service Worker cơ bản với chiến lược Cache-First để app hoạt động offline', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-pwa-sw', estimatedMinutes: 25 },
      { id: 'node-react-error-boundary', title: '🎯 Bài 12: React Error Boundaries & Fallback UI', description: 'Triển khai Error Boundary để bắt lỗi runtime và hiển thị giao diện fallback graceful', type: 'MULTIPLE_CHOICE', difficulty: 'MEDIUM', questionId: 'rm-error-boundary', estimatedMinutes: 12 },
      { id: 'node-memoize', title: '💻 Bài 13: Viết Hàm memoize() Cache Kết Quả Hàm', description: 'Implement hàm memoize với Map cache để tối ưu hàm tính toán đắt đỏ', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-memoize', estimatedMinutes: 20 },
      { id: 'node-bundle-analysis', title: '📖 Bài 14: Bundle Analysis & Performance Budget', description: 'Phân tích bundle size với webpack-bundle-analyzer và thiết lập Performance Budget', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-bundle-analysis', estimatedMinutes: 18 },
      { id: 'node-observer-pattern', title: '💻 Bài 15: Observer Design Pattern Implementation', description: 'Implement Observer pattern với WeakRef để tránh memory leak trong subscriptions', type: 'CODING_PRACTICE', difficulty: 'HARD', questionId: 'rm-observer-pattern', estimatedMinutes: 22 },
      { id: 'node-ssr-hydration', title: '🎯 Bài 16: SSR vs SSG vs CSR - Rendering Strategies', description: 'So sánh ba chiến lược rendering: Server-Side, Static Generation và Client-Side', type: 'MULTIPLE_CHOICE', difficulty: 'HARD', questionId: 'rm-ssr-strategies', estimatedMinutes: 15 },
      { id: 'node-zustand', title: '📖 Bài 17: Zustand vs Jotai vs Valtio State Management', description: 'So sánh kiến trúc và trade-off của các thư viện state management hiện đại', type: 'THEORY', difficulty: 'HARD', questionId: 'rm-zustand-compare', estimatedMinutes: 20 },
      { id: 'node-image-optimization', title: '💻 Bài 18: Image Optimization & Next-Gen Formats', description: 'Implement responsive images với srcset, sizes, lazy loading và format WebP/AVIF', type: 'CODING_PRACTICE', difficulty: 'MEDIUM', questionId: 'rm-image-opt', estimatedMinutes: 15 },
      { id: 'node-a11y-audit', title: '🎯 Bài 19: Accessibility (a11y) WCAG 2.1 Standards', description: 'Audit và fix các lỗi accessibility: keyboard nav, ARIA labels, color contrast', type: 'MULTIPLE_CHOICE', difficulty: 'HARD', questionId: 'rm-a11y-wcag', estimatedMinutes: 15 },
      { id: 'node-generator-iterator', title: '💻 Bài 20: Generator Functions & Custom Iterator Protocol', description: 'Viết Custom Iterator với Symbol.iterator và Generator function để xử lý infinite sequences', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-generator', estimatedMinutes: 25 },
    ]
  },

  // =====================================================================
  // STAGE 4: ARCHITECT (20 bài)
  // =====================================================================
  {
    id: 'stage-architect',
    level: 'Architect',
    levelNumber: 4,
    title: 'Cấp Độ 4: Staff / Lead / Architect',
    subtitle: 'Thiết kế Kiến Trúc Frontend Enterprise, Micro-Frontends & High Concurrency Engine',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    gradient: 'from-amber-500 via-rose-500 to-purple-600',
    iconName: 'Crown',
    targetSkills: [
      'Frontend System Design & State Normalization O(1)',
      'High Frequency WebSocket Event Batching & Memory Profiling',
      'Micro-Frontends Architecture & Module Federation (Host vs Remote)',
      'Typed Custom Pub/Sub Event Emitter Engine',
      'Concurrency Control Task Queue & Design System Tokens',
      'Monorepo Architecture & Nx/Turborepo',
      'GraphQL Federation & Apollo Client Caching',
      'Frontend Security Architecture & OWASP Top 10',
    ],
    nodes: [
      { id: 'node-system-design', title: '📖 Bài 1: Frontend System Design Scale 1M+ Realtime Users', description: 'Thiết kế kiến trúc WebSockets, Offline Persistence & Client-side Caching', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-arch-01', estimatedMinutes: 30 },
      { id: 'node-event-emitter', title: '💻 Bài 2: Xây Dựng Typed Custom Event Emitter Engine', description: 'Thực hành viết Pub/Sub Event System hỗ trợ on, emit, off listeners', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-arch-event-emitter', estimatedMinutes: 35 },
      { id: 'node-micro-frontends', title: '🎯 Bài 3: Kiến Trúc Micro-Frontends & Module Federation', description: 'Phân tích mô hình Host App vs Remote App và dynamic container loading', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-arch-mfe', estimatedMinutes: 20 },
      { id: 'node-memory-leaks', title: '📖 Bài 4: Tối Ưu Hóa Memory Leaks & Memory Profiling FE', description: 'Phát hiện Detached DOM Trees & sử dụng Chrome DevTools Heap Snapshot', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-arch-memory', estimatedMinutes: 25 },
      { id: 'node-concurrency-queue', title: '💻 Bài 5: Viết Custom Task Queue Concurrency Control', description: 'Giới hạn số lượng Promise API request chạy song song chống quá tải server', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-arch-task-queue', estimatedMinutes: 30 },
      { id: 'node-design-system', title: '📖 Bài 6: Thiết Kế Design System & Enterprise Architecture', description: 'Quy trình tạo Design Tokens và áp dụng mô hình Atomic Design', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-arch-design-system', estimatedMinutes: 25 },
      { id: 'node-monorepo', title: '🎯 Bài 7: Monorepo Strategy - Nx vs Turborepo vs pnpm Workspaces', description: 'So sánh kiến trúc và trade-off khi tổ chức multi-package repository quy mô lớn', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-monorepo', estimatedMinutes: 18 },
      { id: 'node-graphql-federation', title: '📖 Bài 8: GraphQL Federation & Schema Stitching', description: 'Kiến trúc GraphQL Federation chia schema thành nhiều subgraph service độc lập', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-graphql-fed', estimatedMinutes: 25 },
      { id: 'node-proxy-pattern', title: '💻 Bài 9: JavaScript Proxy & Reflect API - Meta-programming', description: 'Sử dụng Proxy để intercept object operations và tạo reactive data systems', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-js-proxy', estimatedMinutes: 25 },
      { id: 'node-cicd-fe', title: '🎯 Bài 10: CI/CD Pipeline cho Frontend - GitHub Actions & Preview Deploy', description: 'Thiết kế pipeline tự động: lint, test, build và preview deployment khi mở PR', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-cicd-fe', estimatedMinutes: 18 },
      { id: 'node-owasp', title: '📖 Bài 11: OWASP Top 10 Frontend Security Checklist', description: 'Kiểm toán bảo mật Frontend theo OWASP: Injection, Broken Auth, SSRF, IDOR', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-owasp-fe', estimatedMinutes: 25 },
      { id: 'node-state-machine', title: '💻 Bài 12: Finite State Machine Implementation (XState Pattern)', description: 'Viết State Machine đơn giản quản lý trạng thái loading/success/error của form', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-state-machine', estimatedMinutes: 30 },
      { id: 'node-websocket-batching', title: '🎯 Bài 13: WebSocket Message Batching & Backpressure Control', description: 'Thiết kế cơ chế batching tin nhắn WebSocket tần số cao với requestAnimationFrame', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-ws-batching', estimatedMinutes: 20 },
      { id: 'node-apollo-cache', title: '📖 Bài 14: Apollo Client Cache Normalization & Optimistic UI', description: 'Phân tích cơ chế cache chuẩn hóa của Apollo và pattern Optimistic Response', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-apollo-cache', estimatedMinutes: 22 },
      { id: 'node-ast-transform', title: '💻 Bài 15: AST Traversal & Custom Babel Plugin', description: 'Viết Babel plugin transform đơn giản phân tích và biến đổi AST của mã nguồn JS', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-ast-babel', estimatedMinutes: 35 },
      { id: 'node-feature-flag', title: '🎯 Bài 16: Feature Flag Architecture & A/B Testing Frontend', description: 'Thiết kế hệ thống Feature Toggle cấu hình runtime không cần redeploy', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-feature-flag', estimatedMinutes: 18 },
      { id: 'node-wasm', title: '📖 Bài 17: WebAssembly (WASM) & Compute-Intensive Tasks', description: 'Khi nào cần dùng WebAssembly thay JavaScript và cách tích hợp WASM module vào React app', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-wasm', estimatedMinutes: 20 },
      { id: 'node-crypto-api', title: '💻 Bài 18: Web Crypto API & Client-Side Encryption', description: 'Sử dụng SubtleCrypto API để hash dữ liệu và tạo HMAC signature phía client', type: 'CODING_PRACTICE', difficulty: 'EXPERT', questionId: 'rm-crypto-api', estimatedMinutes: 25 },
      { id: 'node-dx-engineering', title: '🎯 Bài 19: Developer Experience (DX) Engineering', description: 'Đánh giá và cải thiện DX: ESLint config, Husky pre-commit hooks, Storybook', type: 'MULTIPLE_CHOICE', difficulty: 'EXPERT', questionId: 'rm-dx-eng', estimatedMinutes: 18 },
      { id: 'node-arch-review', title: '📖 Bài 20: Conducting Technical Architecture Reviews', description: 'Quy trình dẫn dắt Architecture Review: RFC process, ADR documents, Trade-off analysis', type: 'THEORY', difficulty: 'EXPERT', questionId: 'rm-arch-review', estimatedMinutes: 25 },
    ]
  },
];
