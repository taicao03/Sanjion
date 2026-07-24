import { Category, Question, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: '',
  username: '',
  fullName: 'Chưa Đăng Nhập',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unauthenticated',
  streakCount: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  targetLevel: 'Senior',
  totalPoints: 0,
  role: 'USER',
  email: '',
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-html-css',
    name: '1. HTML5 & CSS3 Core',
    slug: 'html-css',
    description: 'Semantic HTML, Accessibility (a11y), Flexbox, Grid, Specificity & CSS Variables',
    iconName: 'Palette',
    orderIndex: 1,
  },
  {
    id: 'cat-js-core',
    name: '2. JavaScript Core & ES6+',
    slug: 'javascript-core',
    description: 'Variables Scope, Closures, Prototypes, Array Methods, Destructuring & Modules',
    iconName: 'Code2',
    orderIndex: 2,
  },
  {
    id: 'cat-async-js',
    name: '3. Async JS & Event Loop',
    slug: 'async-js',
    description: 'Promises, Async/Await, Microtasks vs Macrotasks & Event Loop Queue Mechanics',
    iconName: 'Zap',
    orderIndex: 3,
  },
  {
    id: 'cat-react-hooks',
    name: '4. ReactJS & Modern Hooks',
    slug: 'reactjs-hooks',
    description: 'Virtual DOM, Hooks (useState, useEffect, useMemo, useCallback, useRef), Reconciliation & Custom Hooks',
    iconName: 'Atom',
    orderIndex: 4,
  },
  {
    id: 'cat-typescript',
    name: '5. TypeScript & Type Safety',
    slug: 'typescript',
    description: 'Interfaces vs Types, Generics, Utility Types (Pick, Omit, Partial, Record), Type Guards',
    iconName: 'Code2',
    orderIndex: 5,
  },
  {
    id: 'cat-performance-sec',
    name: '6. Web Performance & Security',
    slug: 'web-performance',
    description: 'Core Web Vitals, Debounce/Throttle, Lazy Loading, XSS, CORS, CSRF & Virtual List',
    iconName: 'Zap',
    orderIndex: 6,
  },
];

export const MOCK_QUESTIONS: Question[] = [
  // ==========================================
  // LEVEL 1: HTML5 & CSS3 CORE (EASY -> HARD)
  // ==========================================
  {
    id: 'rm-html-01',
    categoryId: 'cat-html-css',
    title: 'CSS Specificity (Độ ưu tiên CSS)',
    slug: 'css-specificity-understanding',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    content: 'Theo chuẩn CSS3 (Roadmap.sh), giữa 4 selector dưới đây, selector nào có độ ưu tiên (Specificity) CAO NHẤT khi áp dụng style?',
    explanation: `**Giải thích chi tiết về CSS Specificity:**

Thứ tự ưu tiên CSS (Specificity Weighting):
1. **Inline styles** (\`style="..."\`): (1, 0, 0, 0)
2. **IDs** (\`#header\`): (0, 1, 0, 0)
3. **Classes, Attributes, Pseudo-classes** (\`.btn\`, \`[type="text"]\`, \`:hover\`): (0, 0, 1, 0)
4. **Elements & Pseudo-elements** (\`div\`, \`h1\`, \`::before\`): (0, 0, 0, 1)

Selector \`#nav ul li.active a\` có:
- 1 ID (\`#nav\`) -> 100
- 1 Class (\`.active\`) -> 10
- 3 Elements (\`ul\`, \`li\`, \`a\`) -> 3
=> Total Specificity = **(0, 1, 1, 3)** (Cao nhất trong các phương án).`,
    options: [
      { id: 'opt-1', text: 'div.container ul.menu li a:hover', is_correct: false },
      { id: 'opt-2', text: '#nav ul li.active a', is_correct: true },
      { id: 'opt-3', text: 'body #content div.text', is_correct: false },
      { id: 'opt-4', text: '.header .nav .item.active', is_correct: false },
    ],
    points: 10,
    viewCount: 142,
    createdAt: '2026-07-22',
    tags: ['CSS', 'Specificity', 'Roadmap.sh'],
  },
  {
    id: 'rm-css-02',
    categoryId: 'cat-html-css',
    title: 'CSS Flexbox Centering (Căn giữa phần tử)',
    slug: 'css-flexbox-centering',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm CSS helper nhận vào một element wrapper và sử dụng Flexbox để căn giữa hoàn toàn (cả chiều ngang lẫn chiều dọc) một div con.',
    explanation: `**Giải thích chi tiết:**
Để căn giữa phần tử trong Flexbox:
- \`display: flex;\` biến container thành flex container.
- \`justify-content: center;\` căn giữa theo trục chính (Main Axis - chiều ngang mặc định).
- \`align-items: center;\` căn giữa theo trục phụ (Cross Axis - chiều dọc).`,
    starterCode: `function getFlexCenterStyles() {
  // TODO: Viết các thuộc tính CSS Flexbox để căn giữa hoàn toàn div con cả chiều ngang lẫn chiều dọc
  return {
    display: 'flex',
    // Điền thuộc tính căn giữa tại đây...
  };
}`,
    testCases: [
      { input: 'const s = getFlexCenterStyles(); return s.display;', expected: 'flex' },
      { input: 'const s = getFlexCenterStyles(); return s.justifyContent;', expected: 'center' },
      { input: 'const s = getFlexCenterStyles(); return s.alignItems;', expected: 'center' },
    ],
    points: 15,
    viewCount: 215,
    createdAt: '2026-07-22',
    tags: ['CSS', 'Flexbox', 'Layout'],
  },

  {
    id: 'rm-js-array-01',
    categoryId: 'cat-js-core',
    title: 'Lọc và Nhân Đôi Số Chẵn Trong Mảng JS (Array Methods)',
    slug: 'javascript-array-filter-double-even',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `processEvenNumbers(numbers)` nhận vào một mảng số nguyên, lọc ra các số chẵn và nhân đôi giá trị của chúng rồi trả về mảng kết quả.',
    explanation: '### Giải thích phương thức mảng JS:\nSử dụng kết hợp `filter(n => n % 2 === 0)` để lấy số chẵn và `map(n => n * 2)` để nhân đôi từng số.',
    starterCode: `function processEvenNumbers(numbers) {
  // TODO: Viết hàm lọc ra các số chẵn trong mảng và nhân đôi giá trị của chúng
  if (!Array.isArray(numbers)) return [];
  
  // Triển khai logic tại đây...
}`,
    testCases: [
      { input: 'return JSON.stringify(processEvenNumbers([1, 2, 3, 4, 5, 6]));', expected: '[4,8,12]' },
      { input: 'return JSON.stringify(processEvenNumbers([7, 9, 11]));', expected: '[]' }
    ],
    points: 10,
    viewCount: 180,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Array Methods', 'Junior']
  },
  {
    id: 'rm-dom-01',
    categoryId: 'cat-js-core',
    title: 'Cơ Chế Event Bubbling & Event Delegation trong DOM',
    slug: 'dom-event-bubbling-delegation-mechanics',
    difficulty: 'EASY',
    type: 'THEORY',
    content: '### Đề Bài Lý Thuyết DOM Events:\n\n1. Phân tích nguyên lý **Event Bubbling (Nổi bọt sự kiện)** khi người dùng nhấp chuột vào một phần tử con trong DOM tree.\n2. Kỹ thuật **Event Delegation (Ủy quyền sự kiện)** là gì? Tại sao Event Delegation giúp tối ưu hiệu năng bộ nhớ khi ứng dụng hiển thị danh sách 1,000 thẻ `<li>`?',
    explanation: '### Lời Giải Chi Tiết DOM Events:\n- **Event Bubbling**: Sự kiện bắt đầu từ phần tử đích (target element) rồi nổi bọt ngược lên các phần tử cha (`parent -> body -> document -> window`).\n- **Event Delegation**: Gắn duy nhất 1 Event Listener lên container cha (thay vì 1,000 listener lên từng `<li>`), dùng `event.target` để xác định phần tử con được nhấp. Giảm thiểu bộ nhớ RAM đáng kể.',
    points: 10,
    viewCount: 290,
    createdAt: '2026-07-24',
    tags: ['DOM', 'Event Bubbling', 'Event Delegation', 'Junior']
  },

  // ==========================================
  // LEVEL 2: JAVASCRIPT CORE & ES6+ (EASY -> EXPERT)
  // ==========================================
  {
    id: 'rm-js-01',
    categoryId: 'cat-js-core',
    title: 'Tạo hàm Closure đếm số (Counter Closure)',
    slug: 'javascript-closure-counter',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm \`createCounter(initialValue)\` sử dụng Closure trong JavaScript để trả về một object gồm 3 phương thức: \`increment()\`, \`decrement()\`, và \`getValue()\`.',
    explanation: `**Giải thích về Closure trong JS:**
Closure là khả năng một hàm con truy cập và ghi nhớ phạm vi lexical scope (các biến bên ngoài) của nó ngay cả khi hàm cha đã thực thi xong.

Trong bài tập này, biến \`count\` nằm riêng biệt trong closure scope của mỗi lần gọi \`createCounter\`.`,
    starterCode: `function createCounter(initialValue = 0) {
  let count = initialValue;

  // TODO: Sử dụng Closure để trả về object chứa 3 hàm: increment(), decrement(), getValue()
  return {
    increment: () => {
      // Viết logic tăng count...
    },
    decrement: () => {
      // Viết logic giảm count...
    },
    getValue: () => count
  };
}`,
    testCases: [
      { input: 'const c = createCounter(5); c.increment(); return c.getValue();', expected: 6 },
      { input: 'const c = createCounter(10); c.decrement(); c.decrement(); return c.getValue();', expected: 8 },
    ],
    points: 10,
    viewCount: 310,
    createdAt: '2026-07-22',
    tags: ['JavaScript', 'Closure', 'ES6'],
  },
  {
    id: 'rm-js-02',
    categoryId: 'cat-js-core',
    title: 'Viết hàm Deep Clone Object trong JS',
    slug: 'javascript-deep-clone',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm \`deepClone(obj)\` đệ quy để sao chép sâu một Object/Array mà không làm ảnh hưởng tới tham chiếu đối tượng ban đầu.',
    explanation: `**Giải thích kỹ thuật Deep Clone:**
- Shallow copy (\`Object.assign\` hay \`...\`) chỉ sao chép các property ở tầng đầu tiên. Đối với các lồng ghép sâu (nested objects/arrays), nó vẫn giữ nguyên tham chiếu (reference).
- Hàm \`deepClone\` sử dụng đệ quy (recursion): Kiểm tra nếu giá trị là Array thì tạo Array mới, nếu là Object thì duyệt qua key bằng \`for...in\` và tiếp tục gọi lại \`deepClone\`.`,
    starterCode: `function deepClone(obj) {
  // TODO: Viết hàm sao chép sâu (deep clone) đệ quy cho Object/Array
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Triển khai logic đệ quy tại đây...
}`,
    testCases: [
      { input: 'const original = { a: 1, b: { c: 2 } }; const cloned = deepClone(original); cloned.b.c = 99; return original.b.c;', expected: 2 },
      { input: 'const arr = [1, [2, 3]]; const cloned = deepClone(arr); cloned[1][0] = 50; return arr[1][0];', expected: 2 },
    ],
    points: 25,
    viewCount: 412,
    createdAt: '2026-07-22',
    tags: ['JavaScript', 'Deep Clone', 'Recursion', 'Roadmap.sh'],
  },

  // ==========================================
  // LEVEL 3: ASYNC JS & EVENT LOOP (MEDIUM -> EXPERT)
  // ==========================================
  {
    id: 'rm-async-01',
    categoryId: 'cat-async-js',
    title: 'Thứ tự chạy trong Event Loop (Microtask vs Macrotask)',
    slug: 'event-loop-microtask-macrotask-order',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Đoạn mã JS sau xuất ra console theo thứ tự nào?\n\n```javascript\nconsole.log("1");\nsetTimeout(() => console.log("2"), 0);\nPromise.resolve().then(() => console.log("3"));\nconsole.log("4");\n```',
    explanation: `**Giải thích thứ tự Event Loop:**
1. **Synchronous code** chạy trước: \`console.log("1")\` -> xuất \`1\`, \`console.log("4")\` -> xuất \`4\`.
2. **Microtask Queue** (Promise.then, queueMicrotask) có độ ưu tiên cao hơn Macrotask Queue: \`Promise.resolve().then(...)\` xuất \`3\`.
3. **Macrotask Queue** (setTimeout, setInterval, I/O) chạy sau cùng: \`setTimeout\` xuất \`2\`.

=> Kết quả ra console chuẩn là: **1, 4, 3, 2**.`,
    options: [
      { id: 'opt-a1', text: '1, 2, 3, 4', is_correct: false },
      { id: 'opt-a2', text: '1, 4, 3, 2', is_correct: true },
      { id: 'opt-a3', text: '1, 4, 2, 3', is_correct: false },
      { id: 'opt-a4', text: '3, 1, 4, 2', is_correct: false },
    ],
    points: 15,
    viewCount: 520,
    createdAt: '2026-07-22',
    tags: ['Async JS', 'Event Loop', 'Promises', 'Microtask'],
  },
  {
    id: 'rm-async-02',
    categoryId: 'cat-async-js',
    title: 'Tự triển khai Promise.all (Polyfill Promise.all)',
    slug: 'polyfill-promise-all',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm \`customPromiseAll(promises)\` nhận vào một mảng chứa các Promise và trả về một Promise mới giải quyết thành mảng kết quả theo đúng thứ tự ban đầu.',
    explanation: `**Giải thích Polyfill Promise.all:**
1. Trả về một \`new Promise((resolve, reject) => ...)\`.
2. Nếu mảng đầu vào rỗng, \`resolve([])\` ngay lập tức.
3. Duyệt mảng \`promises\`, sử dụng biến \`completedCount\` đếm số Promise hoàn thành.
4. Lưu kết quả vào đúng chỉ mục \`results[index] = val\` (không dùng \`push\` vì các Promise có thể resolve bất đồng bộ không theo thứ tự thời gian).
5. Khi \`completedCount === promises.length\`, gọi \`resolve(results)\`. Nếu có bất kỳ Promise nào bị reject, lập tức gọi \`reject(error)\`.`,
    starterCode: `function customPromiseAll(promises) {
  // TODO: Viết hàm Polyfill tự triển khai Promise.all
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    // Triển khai logic đếm số Promise hoàn thành tại đây...
  });
}`,
    testCases: [
      { input: 'const p1 = Promise.resolve(10); const p2 = Promise.resolve(20); return customPromiseAll([p1, p2]).then(res => res[0] + res[1]);', expected: 30 },
    ],
    points: 35,
    viewCount: 380,
    createdAt: '2026-07-22',
    tags: ['Async JS', 'Promise.all', 'Polyfill', 'Expert'],
  },

  // ==========================================
  // LEVEL 4: REACTJS & MODERN HOOKS (EASY -> EXPERT)
  // ==========================================
  {
    id: 'rm-react-01',
    categoryId: 'cat-react-hooks',
    title: 'Viết Custom Hook useLocalStorage trong React',
    slug: 'react-custom-hook-uselocalstorage',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm custom hook \`useLocalStorage(key, initialValue)\` để đồng bộ state của React với LocalStorage trình duyệt.',
    explanation: `**Giải thích thiết kế Custom Hook \`useLocalStorage\`:**
- Khi khởi tạo state, đọc giá trị từ \`localStorage.getItem(key)\`. Nếu chưa có, sử dụng \`initialValue\`.
- Tạo hàm wrapper \`setValue\` tự động cập nhật cả React State lẫn đồng bộ lưu vào \`localStorage.setItem(key, JSON.stringify(val))\`.`,
    starterCode: `function useLocalStorage(key, initialValue) {
  // TODO: Viết custom hook đọc/ghi giá trị vào LocalStorage
  const getStored = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  let state = getStored();

  const setStored = (value) => {
    // Đã đồng bộ lưu vào localStorage...
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, setStored];
}`,
    testCases: [
      { input: 'const [val, setVal] = useLocalStorage("test_key", "hello"); return val;', expected: 'hello' },
    ],
    points: 15,
    viewCount: 680,
    createdAt: '2026-07-22',
    tags: ['ReactJS', 'Custom Hooks', 'LocalStorage'],
  },
  {
    id: 'rm-react-02',
    categoryId: 'cat-react-hooks',
    title: 'Phân biệt useMemo vs useCallback trong React',
    slug: 'usememo-vs-usecallback-difference',
    difficulty: 'HARD',
    type: 'THEORY',
    content: 'Trình bày sự khác biệt cốt lõi về bản chất, cú pháp và trường hợp sử dụng chuẩn (Best Practice) giữa \`useMemo\` và \`useCallback\` trong ReactJS.',
    explanation: `**So sánh chi tiết useMemo vs useCallback:**

| Tiêu chí | \`useMemo\` | \`useCallback\` |
| :--- | :--- | :--- |
| **Mục đích** | Ghi nhớ (cache) **kết quả giá trị tính toán** của một hàm đắt đỏ. | Ghi nhớ (cache) **bản thân định nghĩa hàm** (function instance). |
| **Giá trị trả về** | Trả về kết quả của hàm \`fn()\`. | Trả về chính hàm \`fn\`. |
| **Trường hợp dùng** | Tối ưu phép toán phức tạp (vd: lọc 10.000 phần tử mảng). | Tránh re-render các component con khi truyền callback props (\`React.memo\`). |

**Quy tắc rút gọn:**
\`useCallback(fn, deps)\` tương đương với \`useMemo(() => fn, deps)\`.`,
    points: 25,
    viewCount: 890,
    createdAt: '2026-07-22',
    tags: ['ReactJS', 'Performance', 'useMemo', 'useCallback'],
  },

  // ==========================================
  // LEVEL 5: TYPESCRIPT & TYPE SAFETY (MEDIUM -> EXPERT)
  // ==========================================
  {
    id: 'rm-ts-01',
    categoryId: 'cat-typescript',
    title: 'Sử dụng Utility Type Omit & Pick trong TS',
    slug: 'typescript-utility-types-omit-pick',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm TypeScript helper \`sanitizeUser(user)\` nhận vào một đối tượng User chứa thông tin nhạy cảm và trích xuất chỉ giữ lại các trường không nhạy cảm (\`id\`, \`name\`, \`email\`).',
    explanation: `**Giải thích Utility Types trong TypeScript:**
- \`Pick<T, K>\`: Tạo một type mới bằng cách chọn ra các thuộc tính \`K\` từ Type \`T\`.
- \`Omit<T, K>\`: Tạo một type mới bằng cách loại bỏ các thuộc tính \`K\` khỏi Type \`T\`.`,
    starterCode: `function sanitizeUser(user) {
  // TODO: Trích xuất chỉ giữ lại các trường id, name, email từ user object
  
}`,
    testCases: [
      { input: 'const u = { id: 1, name: "Alice", email: "a@b.com", passwordHash: "secret123" }; const clean = sanitizeUser(u); return clean.passwordHash === undefined;', expected: true },
      { input: 'const u = { id: 2, name: "Bob", email: "b@b.com" }; const clean = sanitizeUser(u); return clean.name;', expected: 'Bob' },
    ],
    points: 15,
    viewCount: 450,
    createdAt: '2026-07-22',
    tags: ['TypeScript', 'Utility Types', 'Type Safety'],
  },

  // ==========================================
  // LEVEL 6: WEB PERFORMANCE & SECURITY (HARD -> EXPERT)
  // ==========================================
  {
    id: 'rm-perf-01',
    categoryId: 'cat-performance-sec',
    title: 'Viết hàm Debounce tối ưu tìm kiếm (Search Debounce)',
    slug: 'javascript-debounce-function-implementation',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm \`debounce(func, delay)\` để hoãn việc thực thi hàm \`func\` cho đến khi người dùng ngừng thao tác nhập liệu sau khoảng thời gian \`delay\` ms.',
    explanation: `**Giải thích cơ chế Debounce:**
- Debounce đảm bảo rằng một hàm chỉ được thực thi sau khi đã qua một khoảng thời gian chờ chỉ định kể từ lần gọi cuối cùng.
- Ứng dụng phổ biến: Ô tìm kiếm gợi ý (Autocomplete), Resize cửa sổ trình duyệt, Scroll event.`,
    starterCode: `function debounce(func, delay = 300) {
  // TODO: Viết hàm hoãn thực thi debounce sử dụng setTimeout và clearTimeout
  let timerId = null;

  return function (...args) {
    // Viết logic xóa timer cũ và khởi tạo timer mới tại đây...
  };
}`,
    testCases: [
      { input: 'let count = 0; const fn = debounce(() => { count++; }, 50); fn(); fn(); fn(); return count;', expected: 0 },
    ],
    points: 25,
    viewCount: 920,
    createdAt: '2026-07-22',
    tags: ['Performance', 'Debounce', 'Roadmap.sh', 'Optimization'],
  },

  // ==========================================
  // ROADMAP SPECIALIZED QUESTIONS (A TO Z PATH)
  // ==========================================
  {
    id: 'rm-js-debounce',
    categoryId: 'cat-js-core',
    title: 'Viết Custom Debounce & Throttle Function',
    slug: 'custom-debounce-throttle-implementation',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `createDebounce(fn, delay)` hoãn việc gọi hàm `fn` sau `delay` ms và trả về kết quả số lần đã hoãn.',
    explanation: `**Giải thích kỹ thuật Debounce:**\nDebounce xóa timer cũ nếu nhận sự kiện mới trước khi timer chạy xong. Rất hữu ích cho ô tìm kiếm autocomplete.`,
    starterCode: `function createDebounce(fn, delay = 100) {
  // TODO: Viết custom debounce function hoãn việc gọi hàm fn sau delay ms
  let timer = null;

  return function (...args) {
    // Viết logic tại đây...
  };
}`,
    testCases: [
      { input: 'let calls = 0; const d = createDebounce(() => calls++, 50); d(); d(); return calls;', expected: 0 }
    ],
    points: 20,
    viewCount: 310,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Debounce', 'Performance']
  },
  {
    id: 'rm-perf-virtual-list',
    categoryId: 'cat-performance-sec',
    title: 'Xây Dựng Thuật Toán Virtual Windowing (Virtual List)',
    slug: 'virtual-list-windowing-algorithm',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `getVirtualRange(scrollTop, containerHeight, itemHeight, totalItems)` trả về mảng index `[startIndex, endIndex]` duy nhất các phần tử cần render trong Viewport.',
    explanation: `**Giải thích Virtual Windowing:**\nThay vì render toàn bộ 100,000 phần tử HTML gây đơ trình duyệt, Virtual List chỉ tính toán và render duy nhất khoảng 20 phần tử nằm trong khoảng nhìn thấy của màn hình.`,
    starterCode: `function getVirtualRange(scrollTop, containerHeight, itemHeight, totalItems) {
  // TODO: Trả về mảng [startIndex, endIndex] duy nhất các phần tử cần render trong Viewport
  
}`,
    testCases: [
      { input: 'const range = getVirtualRange(200, 400, 40, 1000); return range[0];', expected: 5 },
      { input: 'const range = getVirtualRange(200, 400, 40, 1000); return range[1];', expected: 15 }
    ],
    points: 30,
    viewCount: 540,
    createdAt: '2026-07-24',
    tags: ['Performance', 'Virtual List', 'Senior']
  },
  {
    id: 'rm-sec-01',
    categoryId: 'cat-performance-sec',
    title: 'Phòng Chống Tấn Công XSS & Khởi Tạo Content Security Policy',
    slug: 'web-security-xss-csp-prevention',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    content: 'Khi ứng dụng React nhận một chuỗi HTML do người dùng nhập vào từ Rich Text Editor, phương thức/kỹ thuật nào ĐÚNG VÀ BẢO MẬT NHẤT để hiển thị mà không bị lỗ hổng XSS (Cross-Site Scripting)?',
    explanation: '**Giải thích Bảo Mật XSS:**\n- dangerouslySetInnerHTML trong React nếu không lọc dữ liệu bằng thư viện Sanitizer (như DOMPurify) sẽ vô tình thực thi các script độc hại mà hacker cài cắm.',
    options: [
      { id: 'sec-opt-1', text: 'Sử dụng thư viện DOMPurify để làm sạch (sanitize) chuỗi HTML trước khi truyền vào dangerouslySetInnerHTML.', is_correct: true },
      { id: 'sec-opt-2', text: 'Sử dụng trực tiếp eval() để ép kiểu dữ liệu chuỗi về JSX object.', is_correct: false },
      { id: 'sec-opt-3', text: 'Chỉ cần bọc chuỗi HTML trong thẻ <div> là trình duyệt sẽ tự động chặn toàn bộ script độc hại.', is_correct: false },
      { id: 'sec-opt-4', text: 'Lưu toàn bộ chuỗi HTML vào LocalStorage để mã hóa tự động.', is_correct: false }
    ],
    points: 25,
    viewCount: 620,
    createdAt: '2026-07-24',
    tags: ['Security', 'XSS', 'DOMPurify', 'Senior']
  },
  {
    id: 'rm-arch-01',
    categoryId: 'cat-performance-sec',
    title: 'Frontend System Design: Kiến Trúc Scale 1M+ Realtime Users',
    slug: 'frontend-system-design-realtime-scale',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài Frontend System Design (Level Senior / Lead Architect)\n\n1. Thiết kế kiến trúc Client-side Caching và State Normalization cho một Dashboard tài chính hiển thị 1,000 biến động giá cổ phiếu theo thời gian thực (Realtime WebSockets).\n2. Phân tích giải pháp chống quá tải DOM khi nhận hàng trăm tin nhắn WebSocket mỗi giây (Message Debouncing / State Batching / Virtual Canvas rendering).\n3. Đề xuất mô hình Offline Persistence với IndexedDB khi ứng dụng mất kết nối mạng.',
    explanation: '### Lời Giải Chuẩn Principal Architect:\n- **State Normalization**: Lưu trữ entities theo ID (dictionary format) thay vì mảng lồng nhau để cập nhật O(1).\n- **High Frequency Batching**: Nhóm các message WebSocket trong mảng đệm và dùng requestAnimationFrame để batch update state đúng với tần số làm tươi màn hình (60Hz / 120Hz).\n- **IndexedDB Sync**: Dùng Service Worker bắt sự kiện background sync để lưu tin nhắn khi offline.',
    points: 35,
    viewCount: 880,
    createdAt: '2026-07-24',
    tags: ['System Design', 'Architect', 'WebSockets', 'State Normalization']
  },
  {
    id: 'rm-arch-event-emitter',
    categoryId: 'cat-js-core',
    title: 'Xây Dựng Typed Custom Event Emitter Engine',
    slug: 'custom-event-emitter-pub-sub-engine',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết class EventEmitter có 3 phương thức: on(event, listener), emit(event, ...args), và off(event, listener).',
    explanation: '**Giải thích Pub/Sub Pattern:**\nEvent Emitter là trái tim của các thư viện lớn (Node.js Events, RxJS, Socket.io) giúp giao tiếp bất đồng bộ decoupled giữa các module mà không phụ thuộc trực tiếp nhau.',
    starterCode: `class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    // TODO: Đăng ký sự kiện vào this.events
  }
  emit(event, ...args) {
    // TODO: Thực thi các hàm listener của sự kiện
  }
  off(event, listener) {
    // TODO: Hủy đăng ký sự kiện
  }
}`,
    testCases: [
      { input: 'const e = new EventEmitter(); let res = 0; e.on("add", (val) => res += val); e.emit("add", 10); return res;', expected: 10 }
    ],
    points: 35,
    viewCount: 710,
    createdAt: '2026-07-24',
    tags: ['Design Patterns', 'Event Emitter', 'Architect']
  },

  // ==========================================
  // EXPANDED FE CURRICULUM QUESTIONS (24 NODES)
  // ==========================================
  {
    id: 'rm-js-var-let',
    categoryId: 'cat-js-core',
    title: 'Phân Biệt var, let, const & Cơ Chế Hoisting trong JS',
    slug: 'javascript-var-let-const-hoisting-scope',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    content: 'Khi khai báo một biến bằng `var` bên trong một vòng lặp `for (var i = 0; i < 3; i++)`, biến `i` có phạm vi (scope) như thế nào?',
    explanation: '### Giải thích Scope & Hoisting:\n- `var` có phạm vi Function-scope (hoặc Global-scope nếu khai báo ngoài hàm). `var` KHÔNG tuân theo Block-scope `{}` như `let` và `const`.\n- Do đó `i` rò rỉ ra ngoài vòng lặp `for`. Khi dùng `let i`, mỗi vòng lặp tạo ra 1 binding mới độc lập trong Block-scope.',
    options: [
      { id: 'v1', text: 'Biến i có phạm vi Function Scope (hoặc Global) và có thể truy cập được sau khi vòng lặp kết thúc.', is_correct: true },
      { id: 'v2', text: 'Biến i có phạm vi Block Scope và bị hủy ngay khi kết thúc vòng lặp.', is_correct: false },
      { id: 'v3', text: 'Biến i bị ép kiểu thành const và không thể thay đổi giá trị.', is_correct: false },
      { id: 'v4', text: 'JavaScript ném ra lỗi ReferenceError.', is_correct: false }
    ],
    points: 10,
    viewCount: 310,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Hoisting', 'Scope', 'Junior']
  },
  {
    id: 'rm-dom-form',
    categoryId: 'cat-js-core',
    title: 'Lấy Dữ Liệu Form HTML & Xử Lý Validation Chuẩn JS',
    slug: 'dom-form-data-extraction-validation',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `validateEmail(email)` trả về `true` nếu chuỗi email chứa ký tự `@` và `.`, ngược lại trả về `false`.',
    explanation: '### Giải thích Validation Form:\nHàm kiểm tra điều kiện đơn giản với `includes("@") && includes(".")`.',
    starterCode: `function validateEmail(email) {
  // TODO: Trả về true nếu chuỗi email hợp lệ chứa '@' và '.'
  if (typeof email !== 'string') return false;

}`,
    testCases: [
      { input: 'return validateEmail("user@example.com");', expected: true },
      { input: 'return validateEmail("invalid_email");', expected: false }
    ],
    points: 10,
    viewCount: 220,
    createdAt: '2026-07-24',
    tags: ['DOM', 'Form Validation', 'Junior']
  },
  {
    id: 'rm-react-rules',
    categoryId: 'cat-react-hooks',
    title: 'React Rules of Hooks & Component Lifecycle',
    slug: 'react-rules-of-hooks-lifecycle',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Tới thời điểm hiện tại, quy tắc quan trọng nhất khi sử dụng React Hooks (như `useState`, `useEffect`) là gì?',
    explanation: '### Quy Tắc Vàng Của React Hooks:\nChỉ được gọi Hooks ở cấp cao nhất (Top-Level) của React Function Component. KHÔNG ĐƯỢC gọi Hook bên trong vòng lặp `for`, câu lệnh điều kiện `if/else`, hoặc hàm lồng nhau.',
    options: [
      { id: 'rh1', text: 'Chỉ gọi Hooks ở cấp cao nhất (Top-Level) của Function Component, không gọi trong câu lệnh điều kiện if/else hay vòng lặp.', is_correct: true },
      { id: 'rh2', text: 'Có thể gọi Hooks bất kỳ đâu miễn là truyền đầy đủ mảng dependencies.', is_correct: false },
      { id: 'rh3', text: 'Bắt buộc phải gọi useState trong Class Component.', is_correct: false },
      { id: 'rh4', text: 'Chỉ gọi useEffect sau khi đã gọi return JSX.', is_correct: false }
    ],
    points: 15,
    viewCount: 420,
    createdAt: '2026-07-24',
    tags: ['ReactJS', 'Hooks', 'Rules of Hooks']
  },
  {
    id: 'rm-perf-vitals-theory',
    categoryId: 'cat-performance-sec',
    title: 'Tối Ưu Chỉ Số Core Web Vitals (LCP, INP, CLS)',
    slug: 'core-web-vitals-lcp-inp-cls-optimization',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài Tối Ưu Hiệu Năng Core Web Vitals:\n\n1. Phân tích 3 chỉ số cốt lõi của Google Web Vitals: **LCP (Largest Contentful Paint)**, **INP (Interaction to Next Paint)**, và **CLS (Cumulative Layout Shift)**.\n2. Trình bày các kỹ thuật Senior giúp cải thiện INP (giảm bớt thời gian giải phóng Long Tasks trên Main Thread bằng `requestIdleCallback` hoặc Web Workers).',
    explanation: '### Lời Giải Chi Tiết Web Vitals:\n- **LCP (<2.5s)**: Đo thời gian tải xong phần tử nội dung chính của màn hình. Tối ưu bằng CDN, Image Optimization (`webp`), Preload critical CSS/fonts.\n- **INP (<200ms)**: Thay thế cho FID. Đo độ trễ phản hồi khi người dùng tương tác. Tối ưu bằng cách chia nhỏ Long Tasks (`>50ms`) thành nhiều micro-tasks hoặc đưa tính toán sang Web Workers.\n- **CLS (<0.1)**: Đo độ giật dịch chuyển bố cục. Khai báo sẵn `width` & `height` hoặc `aspect-ratio` cho hình ảnh/iframe.',
    points: 25,
    viewCount: 650,
    createdAt: '2026-07-24',
    tags: ['Performance', 'Core Web Vitals', 'LCP', 'INP', 'CLS']
  },
  {
    id: 'rm-arch-mfe',
    categoryId: 'cat-performance-sec',
    title: 'Kiến Trúc Micro-Frontends & Module Federation',
    slug: 'micro-frontends-module-federation-architecture',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Trong giải pháp Micro-Frontends sử dụng Webpack Module Federation, khái niệm **Host** và **Remote** được hiểu như thế nào?',
    explanation: '### Phân Biệt Host vs Remote:\n- **Host App**: Ứng dụng shell chính chịu trách nhiệm khởi tạo trang và tải động các container remote.\n- **Remote App**: Ứng dụng độc lập xuất bản (expose) các component hoặc route để Host App import và sử dụng tại runtime.',
    options: [
      { id: 'mfe1', text: 'Host App chứa khung giao diện chính và tải động các Micro-app Remote tại thời điểm Runtime.', is_correct: true },
      { id: 'mfe2', text: 'Host App là cơ sở dữ liệu backend còn Remote App là giao diện client.', is_correct: false },
      { id: 'mfe3', text: 'Remote App bắt buộc phải biên dịch trước toàn bộ code thành tệp tĩnh duy nhất.', is_correct: false },
      { id: 'mfe4', text: 'Cả Host và Remote không thể chia sẻ chung phiên bản React.', is_correct: false }
    ],
    points: 35,
    viewCount: 510,
    createdAt: '2026-07-24',
    tags: ['Architect', 'Micro-Frontends', 'Module Federation']
  },
  {
    id: 'rm-arch-memory',
    categoryId: 'cat-performance-sec',
    title: 'Tối Ưu Hóa Memory Leaks & Memory Profiling FE',
    slug: 'frontend-memory-leaks-profiling',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài Debugging & Memory Profiling:\n\n1. Chỉ ra 4 nguyên nhân hàng đầu gây **Memory Leaks** trên trình duyệt (Uncleaned Event Listeners, Detached DOM Trees, Timers `setInterval` không clear, Closure rò rỉ tham chiếu).\n2. Trình bày các bước dùng **Chrome DevTools Memory Heap Snapshot** để so sánh Delta Heap size và phát hiện đối tượng rò rỉ.',
    explanation: '### Lời Giải Chuẩn Senior Profiler:\n- Dọn dẹp listener trong `useEffect` cleanup function (`return () => window.removeEventListener(...)`).\n- Hủy `setInterval` / `setTimeout` khi component unmount.\n- Gán `null` cho các đối tượng Detached DOM Element không còn nằm trong render tree.',
    points: 30,
    viewCount: 740,
    createdAt: '2026-07-24',
    tags: ['Memory Leaks', 'DevTools', 'Profiling', 'Senior']
  },
  {
    id: 'rm-arch-task-queue',
    categoryId: 'cat-js-core',
    title: 'Viết Custom Task Queue Concurrency Control Engine',
    slug: 'custom-task-queue-concurrency-control',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết class `TaskQueue(concurrency)` giới hạn tối đa `concurrency` công việc bất đồng bộ (Promises) được thực thi song song cùng một lúc.',
    explanation: '### Giải thích Concurrency Control:\nNếu có 100 API request nhưng chỉ cho phép chạy tối đa 3 request cùng lúc để không gây sập Server. Hàm sẽ đẩy task mới vào queue và kích hoạt khi có slot trống.',
    starterCode: `class TaskQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  push(task) {
    // TODO: Đẩy task vào queue và kiểm soát số lượng task chạy song song không vượt quá concurrency
    
  }
}`,
    testCases: [
      { input: 'const q = new TaskQueue(2); return q.push(() => Promise.resolve(100));', expected: 100 }
    ],
    points: 35,
    viewCount: 680,
    createdAt: '2026-07-24',
    tags: ['Concurrency', 'Task Queue', 'Promises', 'Architect']
  },
  {
    id: 'rm-arch-design-system',
    categoryId: 'cat-html-css',
    title: 'Thiết Kế Design System & Enterprise Component Architecture',
    slug: 'design-system-enterprise-component-architecture',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài Design System Architecture:\n\n1. Trình bày quy trình thiết kế **Design Tokens** (Color Palette, Typography, Spacing Scale, Elevation) cho một Design System đa nền tảng.\n2. Phân tích mô hình **Atomic Design** (Atoms -> Molecules -> Organisms -> Templates -> Pages) và chiến lược xuất bản gói NPM Component Library độc lập.',
    explanation: '### Lời Giải Chuẩn Lead UI Architect:\n- **Design Tokens**: Sử dụng CSS Variables (`--color-primary`, `--spacing-md`) giúp hỗ trợ Dark Mode và Theming linh hoạt.\n- **Atomic Design**: Chia nhỏ UI thành các nguyên tử tái sử dụng (Button, Input), ghép thành phân tử (SearchForm) và sinh ra sinh vật (Navbar).',
    points: 30,
    viewCount: 590,
    createdAt: '2026-07-24',
    tags: ['Design System', 'Atomic Design', 'Architect']
  }
];


