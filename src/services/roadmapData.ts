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
      'Form Validation & State Basics in React'
    ],
    nodes: [
      {
        id: 'node-css-spec',
        title: '🎯 Bài 1: CSS Specificity & Thứ Tự Ưu Tiên Style',
        description: 'Hiểu rõ quy tắc tính điểm Specificity để ghi đè style sạch sẽ, không lạm dụng !important',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionId: 'rm-html-01',
        estimatedMinutes: 10
      },
      {
        id: 'node-css-flex',
        title: '💻 Bài 2: CSS Flexbox & Grid Centering Layout',
        description: 'Viết CSS helper căn giữa hoàn toàn phần tử cả chiều ngang lẫn chiều dọc bằng Flexbox',
        type: 'CODING_PRACTICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-css-02',
        estimatedMinutes: 12
      },
      {
        id: 'node-js-array',
        title: '💻 Bài 3: Thao Tác Mảng JS ES6+ (Array Methods)',
        description: 'Viết hàm lọc và nhân đôi số chẵn với filter & map chuẩn ES6+',
        type: 'CODING_PRACTICE',
        difficulty: 'EASY',
        questionId: 'rm-js-array-01',
        estimatedMinutes: 12
      },
      {
        id: 'node-dom-event',
        title: '📖 Bài 4: Event Bubbling & Event Delegation trong DOM',
        description: 'Phân tích cơ chế lan truyền sự kiện và ứng dụng Event Delegation tối ưu bộ nhớ RAM',
        type: 'THEORY',
        difficulty: 'EASY',
        questionId: 'rm-dom-01',
        estimatedMinutes: 15
      },
      {
        id: 'node-js-hoisting',
        title: '🎯 Bài 5: Phân Biệt var, let, const & Cơ Chế Hoisting',
        description: 'Phân tích phạm vi Block-scope vs Function-scope và hiện tượng Temporal Dead Zone (TDZ)',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        questionId: 'rm-js-var-let',
        estimatedMinutes: 10
      },
      {
        id: 'node-dom-form',
        title: '💻 Bài 6: Lấy Dữ Liệu Form HTML & Validation',
        description: 'Viết hàm kiểm tra định dạng email và xử lý dữ liệu form bằng JavaScript',
        type: 'CODING_PRACTICE',
        difficulty: 'EASY',
        questionId: 'rm-dom-form',
        estimatedMinutes: 12
      }
    ]
  },
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
      'Rules of Hooks & React Component Lifecycle'
    ],
    nodes: [
      {
        id: 'node-closure-counter',
        title: '💻 Bài 7: Tạo Hàm Closure Đếm Số (Counter Closure)',
        description: 'Thực hành tạo hàm closure riêng biệt lưu trữ lexical environment',
        type: 'CODING_PRACTICE',
        difficulty: 'EASY',
        questionId: 'rm-js-01',
        estimatedMinutes: 15
      },
      {
        id: 'node-event-loop',
        title: '🎯 Bài 8: Thứ Tự Chạy Trong Event Loop (Microtask vs Macrotask)',
        description: 'Đoán chính xác thứ tự log console giữa Promise microtask và setTimeout macrotask',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-async-01',
        estimatedMinutes: 15
      },
      {
        id: 'node-debounce',
        title: '💻 Bài 9: Tự Viết Hàm Debounce & Throttle Function',
        description: 'Thực hành viết custom Debounce hoãn gọi hàm ô tìm kiếm autocomplete',
        type: 'CODING_PRACTICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-js-debounce',
        estimatedMinutes: 20
      },
      {
        id: 'node-usememo-usecallback',
        title: '📖 Bài 10: Phân Biệt useMemo vs useCallback Trong React',
        description: 'Phân tích bản chất ghi nhớ kết quả tính toán vs ghi nhớ định nghĩa hàm',
        type: 'THEORY',
        difficulty: 'HARD',
        questionId: 'rm-react-02',
        estimatedMinutes: 18
      },
      {
        id: 'node-ts-utility',
        title: '💻 Bài 11: Sử Dụng Utility Types TypeScript (Omit, Pick)',
        description: 'Tạo type mới bằng cách trích xuất và loại bỏ thuộc tính nhạy cảm với TypeScript',
        type: 'CODING_PRACTICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-ts-01',
        estimatedMinutes: 15
      },
      {
        id: 'node-react-rules',
        title: '🎯 Bài 12: React Rules of Hooks & Lifecycle',
        description: 'Nắm vững quy tắc vàng gọi Hooks ở Top-Level của Function Component',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-react-rules',
        estimatedMinutes: 12
      }
    ]
  },
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
      'Senior Code Review & Memory Leak Debugging'
    ],
    nodes: [
      {
        id: 'node-uselocalstorage',
        title: '💻 Bài 13: Viết Custom Hook useLocalStorage trong React',
        description: 'Luyện tập tạo custom hook đồng bộ React State với LocalStorage trình duyệt',
        type: 'CODING_PRACTICE',
        difficulty: 'MEDIUM',
        questionId: 'rm-react-01',
        estimatedMinutes: 20
      },
      {
        id: 'node-deep-clone',
        title: '💻 Bài 14: Viết Hàm deepClone(obj) Đệ Quy Chuẩn JS',
        description: 'Sao chép sâu Object/Array lồng nhau mà không làm ảnh hưởng tham chiếu ban đầu',
        type: 'CODING_PRACTICE',
        difficulty: 'HARD',
        questionId: 'rm-js-02',
        estimatedMinutes: 25
      },
      {
        id: 'node-virtual-list',
        title: '💻 Bài 15: Xây Dựng Thuật Toán Virtual Windowing (Virtual List)',
        description: 'Luyện tập thuật toán Virtual List chỉ render phần tử có trong Viewport',
        type: 'CODING_PRACTICE',
        difficulty: 'HARD',
        questionId: 'rm-perf-virtual-list',
        estimatedMinutes: 30
      },
      {
        id: 'node-fe-sec',
        title: '🎯 Bài 16: Phòng Chống Tấn Công XSS & Khởi Tạo Content Security Policy',
        description: 'Phân tích lỗ hổng Injection và sử dụng DOMPurify làm sạch HTML',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'HARD',
        questionId: 'rm-sec-01',
        estimatedMinutes: 20
      },
      {
        id: 'node-core-web-vitals',
        title: '📖 Bài 17: Tối Ưu Chỉ Số Core Web Vitals (LCP, INP, CLS)',
        description: 'Chiến lược tối ưu hóa Critical Rendering Path và giải phóng Long Tasks',
        type: 'THEORY',
        difficulty: 'HARD',
        questionId: 'rm-perf-vitals-theory',
        estimatedMinutes: 22
      },
      {
        id: 'node-polyfill-promise',
        title: '💻 Bài 18: Tự Triển Khai Polyfill Promise.all',
        description: 'Viết hàm customPromiseAll xử lý mảng Promise bất đồng bộ chuẩn Polyfill',
        type: 'CODING_PRACTICE',
        difficulty: 'EXPERT',
        questionId: 'rm-async-02',
        estimatedMinutes: 30
      }
    ]
  },
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
      'Concurrency Control Task Queue & Design System Tokens'
    ],
    nodes: [
      {
        id: 'node-system-design',
        title: '📖 Bài 19: Frontend System Design Scale 1M+ Realtime Users',
        description: 'Thiết kế kiến trúc WebSockets, Offline Persistence & Client-side Caching',
        type: 'THEORY',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-01',
        estimatedMinutes: 30
      },
      {
        id: 'node-event-emitter',
        title: '💻 Bài 20: Xây Dựng Typed Custom Event Emitter Engine',
        description: 'Thực hành viết Pub/Sub Event System hỗ trợ on, emit, off listeners',
        type: 'CODING_PRACTICE',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-event-emitter',
        estimatedMinutes: 35
      },
      {
        id: 'node-micro-frontends',
        title: '🎯 Bài 21: Kiến Trúc Micro-Frontends & Module Federation',
        description: 'Phân tích mô hình Host App vs Remote App và dynamic container loading',
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-mfe',
        estimatedMinutes: 20
      },
      {
        id: 'node-memory-leaks',
        title: '📖 Bài 22: Tối Ưu Hóa Memory Leaks & Memory Profiling FE',
        description: 'Phát hiện Detached DOM Trees & sử dụng Chrome DevTools Heap Snapshot',
        type: 'THEORY',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-memory',
        estimatedMinutes: 25
      },
      {
        id: 'node-concurrency-queue',
        title: '💻 Bài 23: Viết Custom Task Queue Concurrency Control',
        description: 'Giới hạn số lượng Promise API request chạy song song chống quá tải server',
        type: 'CODING_PRACTICE',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-task-queue',
        estimatedMinutes: 30
      },
      {
        id: 'node-design-system',
        title: '📖 Bài 24: Thiết Kế Design System & Enterprise Architecture',
        description: 'Quy trình tạo Design Tokens và áp dụng mô hình Atomic Design',
        type: 'THEORY',
        difficulty: 'EXPERT',
        questionId: 'rm-arch-design-system',
        estimatedMinutes: 25
      }
    ]
  }
];
