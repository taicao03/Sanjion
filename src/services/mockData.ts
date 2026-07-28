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
  },

  // ===========================================================
  // NEW JUNIOR QUESTIONS (Bài 7-20)
  // ===========================================================
  {
    id: 'rm-html-semantic',
    categoryId: 'cat-html-css',
    title: 'HTML5 Semantic Elements & Accessibility (a11y)',
    slug: 'html5-semantic-elements-accessibility',
    difficulty: 'EASY',
    type: 'THEORY',
    content: '### Đề Bài HTML5 Semantics:\n\n1. Phân tích sự khác biệt về ngữ nghĩa giữa các thẻ `<div>` và các thẻ HTML5 semantic như `<header>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.\n2. Các thuộc tính **ARIA** (Accessible Rich Internet Applications) như `role`, `aria-label`, `aria-hidden` giúp ích gì cho người dùng dùng Screen Reader?',
    explanation: '### Lời Giải Chi Tiết:\n- **Semantic HTML** giúp Search Engine và Screen Reader hiểu cấu trúc trang tốt hơn. `<article>` dùng cho nội dung độc lập, `<section>` dùng cho các nhóm liên quan.\n- **ARIA Attributes**: `role="button"` cho phần tử không phải button, `aria-label="Close dialog"` mô tả mục đích, `aria-hidden="true"` ẩn trang trí với SR.',
    points: 10,
    viewCount: 280,
    createdAt: '2026-07-24',
    tags: ['HTML5', 'Semantic', 'Accessibility', 'Junior']
  },
  {
    id: 'rm-css-grid',
    categoryId: 'cat-html-css',
    title: 'CSS Grid Layout - Xây Dựng Dashboard Layout',
    slug: 'css-grid-dashboard-layout',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `getDashboardGridStyles()` trả về object CSS styles cho một grid layout dashboard 2 cột.',
    explanation: '### CSS Grid Dashboard:\n- `grid-template-columns: 200px 1fr` tạo sidebar cố định và main content linh hoạt.\n- `grid-template-rows: auto 1fr` tạo header cố định và content co giãn theo chiều cao.',
    starterCode: `function getDashboardGridStyles() {
  // TODO: Trả về CSS Grid styles cho dashboard layout 2 cột
  return {
    display: 'grid',
    // Thêm thuộc tính grid tại đây...
  };
}`,
    testCases: [
      { input: 'const s = getDashboardGridStyles(); return s.display;', expected: 'grid' },
      { input: 'const s = getDashboardGridStyles(); return s.gridTemplateColumns !== undefined;', expected: true },
    ],
    points: 15,
    viewCount: 195,
    createdAt: '2026-07-24',
    tags: ['CSS', 'Grid', 'Layout', 'Junior']
  },
  {
    id: 'rm-js-string',
    categoryId: 'cat-js-core',
    title: 'Xử Lý String ES6+ (Template Literals & Methods)',
    slug: 'javascript-string-template-literals-methods',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `formatName(firstName, lastName)` sử dụng Template Literals để trả về chuỗi `"Xin chào, [Họ Tên]!"` với tên được viết hoa chữ đầu.',
    explanation: '### Template Literals:\nDùng backtick và `${}` để nội suy biến. `str.charAt(0).toUpperCase() + str.slice(1)` để viết hoa chữ đầu.',
    starterCode: `function formatName(firstName, lastName) {
  // TODO: Dùng Template Literal để tạo chuỗi chào hỏi chuẩn
}`,
    testCases: [
      { input: 'return formatName("nguyen", "an");', expected: 'Xin chào, Nguyen An!' },
      { input: 'return formatName("tran", "bao");', expected: 'Xin chào, Tran Bao!' },
    ],
    points: 10,
    viewCount: 210,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'String', 'Template Literals', 'Junior']
  },
  {
    id: 'rm-js-object',
    categoryId: 'cat-js-core',
    title: 'Object Destructuring & Spread/Rest Operator ES6+',
    slug: 'javascript-destructuring-spread-rest',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    content: 'Đoạn code sau in ra gì?\n\n```javascript\nconst { a, ...rest } = { a: 1, b: 2, c: 3 };\nconsole.log(rest);\n```',
    explanation: '### Giải thích Rest Operator:\nRest `...rest` thu thập tất cả các key còn lại sau khi đã destructure `a`. Kết quả `rest = { b: 2, c: 3 }`.',
    options: [
      { id: 'obj1', text: '{ b: 2, c: 3 }', is_correct: true },
      { id: 'obj2', text: '[2, 3]', is_correct: false },
      { id: 'obj3', text: '{ a: 1 }', is_correct: false },
      { id: 'obj4', text: 'undefined', is_correct: false },
    ],
    points: 10,
    viewCount: 320,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Destructuring', 'ES6', 'Junior']
  },
  {
    id: 'rm-css-variables',
    categoryId: 'cat-html-css',
    title: 'CSS Custom Properties (Variables) & Theming',
    slug: 'css-custom-properties-variables-theming',
    difficulty: 'EASY',
    type: 'THEORY',
    content: '### Đề Bài CSS Variables:\n\n1. CSS Custom Properties (CSS Variables) được khai báo như thế nào và có phạm vi (scope) ra sao?\n2. Tại sao CSS Variables lại được ưa chuộng hơn các biến của tiền xử lý CSS (Sass/Less) khi xây dựng Dark Mode?',
    explanation: '### Lời Giải:\n- Khai báo: `--primary-color: #007bff;` trong `:root {}`. Truy cập: `color: var(--primary-color);`.\n- **Ưu điểm so với Sass variables**: CSS Variables thay đổi được **tại runtime** qua JS (`element.style.setProperty()`). Sass variables chỉ là compile-time constants.',
    points: 10,
    viewCount: 245,
    createdAt: '2026-07-24',
    tags: ['CSS', 'Variables', 'Theming', 'Junior']
  },
  {
    id: 'rm-dom-query',
    categoryId: 'cat-js-core',
    title: 'DOM Querying & Element Manipulation',
    slug: 'dom-querying-element-manipulation',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `toggleClass(element, className)` thêm class nếu chưa có, xóa class nếu đã có.',
    explanation: '### Giải thích classList:\n`element.classList.toggle(className)` là API hiện đại nhất để toggle class. Trả về `true` nếu thêm, `false` nếu xóa.',
    starterCode: `function toggleClass(element, className) {
  // TODO: Toggle class trên element - thêm nếu chưa có, xóa nếu đã có
  if (!element || !className) return;
}`,
    testCases: [
      { input: 'const el = { classList: { toggle: (c) => c } }; return toggleClass(el, "active") || "done";', expected: 'done' },
    ],
    points: 10,
    viewCount: 180,
    createdAt: '2026-07-24',
    tags: ['DOM', 'classList', 'Manipulation', 'Junior']
  },
  {
    id: 'rm-js-function',
    categoryId: 'cat-js-core',
    title: 'Arrow Functions & this Context Binding',
    slug: 'arrow-functions-this-context-binding',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Đoạn code sau in ra gì?\n\n```javascript\nconst obj = {\n  name: "Sanjion",\n  greet: function() {\n    const inner = () => console.log(this.name);\n    inner();\n  }\n};\nobj.greet();\n```',
    explanation: '### Giải thích Arrow Function & this:\nArrow function KHÔNG có `this` riêng, nó kế thừa `this` từ lexical scope bên ngoài (ở đây là `greet` method). Vì `greet` được gọi qua `obj.greet()`, `this` trong `greet` trỏ tới `obj`.',
    options: [
      { id: 'fn1', text: '"Sanjion"', is_correct: true },
      { id: 'fn2', text: 'undefined', is_correct: false },
      { id: 'fn3', text: 'TypeError', is_correct: false },
      { id: 'fn4', text: 'window hoặc global', is_correct: false },
    ],
    points: 15,
    viewCount: 380,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Arrow Function', 'this', 'Context']
  },
  {
    id: 'rm-http-basics',
    categoryId: 'cat-js-core',
    title: 'HTTP Methods & REST API Fundamentals',
    slug: 'http-methods-rest-api-fundamentals',
    difficulty: 'EASY',
    type: 'THEORY',
    content: '### Đề Bài HTTP & REST:\n\n1. Phân biệt 4 HTTP method phổ biến: **GET**, **POST**, **PUT**, **DELETE** về mục đích và idempotency.\n2. HTTP Status Code nào phù hợp để trả về khi tạo mới một resource thành công? Và khi resource không tìm thấy?',
    explanation: '### Lời Giải:\n- **GET**: Đọc dữ liệu, idempotent. **POST**: Tạo mới, không idempotent. **PUT**: Cập nhật toàn bộ, idempotent. **DELETE**: Xóa, idempotent.\n- **201 Created** khi tạo mới thành công. **404 Not Found** khi không tìm thấy resource.',
    points: 10,
    viewCount: 260,
    createdAt: '2026-07-24',
    tags: ['HTTP', 'REST API', 'Status Codes', 'Junior']
  },
  {
    id: 'rm-git-basics',
    categoryId: 'cat-js-core',
    title: 'Git Workflow - Commit, Branch & Merge',
    slug: 'git-workflow-commit-branch-merge',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    content: 'Khi muốn hoàn tác commit cuối cùng nhưng GIỮ LẠI các thay đổi trong Working Directory (không xóa code đã viết), lệnh Git nào phù hợp nhất?',
    explanation: '### Giải thích Git Reset:\n- `git reset --soft HEAD~1`: Hoàn tác commit, giữ thay đổi trong Staging Area.\n- `git reset --mixed HEAD~1` (mặc định): Hoàn tác commit và Staging, giữ thay đổi trong Working Directory.\n- `git reset --hard HEAD~1`: Xóa hết commit và thay đổi, NGUY HIỂM!',
    options: [
      { id: 'git1', text: 'git reset --mixed HEAD~1', is_correct: true },
      { id: 'git2', text: 'git reset --hard HEAD~1', is_correct: false },
      { id: 'git3', text: 'git revert HEAD', is_correct: false },
      { id: 'git4', text: 'git checkout HEAD~1', is_correct: false },
    ],
    points: 10,
    viewCount: 340,
    createdAt: '2026-07-24',
    tags: ['Git', 'Version Control', 'Junior']
  },
  {
    id: 'rm-js-error',
    categoryId: 'cat-js-core',
    title: 'Xử Lý Lỗi try/catch & Custom Error Class',
    slug: 'javascript-error-handling-custom-error',
    difficulty: 'EASY',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `safeDivide(a, b)` chia `a` cho `b`. Nếu `b === 0`, ném một `Error` có message là `"Division by zero"`. Nếu thành công, trả về kết quả.',
    explanation: '### Giải thích Error Handling:\n`throw new Error("message")` ném lỗi. Bên ngoài dùng `try/catch(e)` để bắt và xử lý.',
    starterCode: `function safeDivide(a, b) {
  // TODO: Chia a cho b, throw Error nếu b === 0
}`,
    testCases: [
      { input: 'return safeDivide(10, 2);', expected: 5 },
      { input: 'try { safeDivide(5, 0); return false; } catch(e) { return e.message; }', expected: 'Division by zero' },
    ],
    points: 10,
    viewCount: 190,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Error Handling', 'try/catch', 'Junior']
  },
  {
    id: 'rm-css-responsive',
    categoryId: 'cat-html-css',
    title: 'Responsive Design & Media Queries Mobile-First',
    slug: 'responsive-design-media-queries-mobile-first',
    difficulty: 'MEDIUM',
    type: 'THEORY',
    content: '### Đề Bài Responsive Design:\n\n1. Giải thích triết lý **Mobile-First** CSS và tại sao nó được ưu tiên hơn Desktop-First?\n2. Viết Media Query để áp dụng style riêng cho màn hình tablet (width >= 768px) và desktop (width >= 1024px).',
    explanation: '### Lời Giải:\n- **Mobile-First**: Viết CSS cho màn hình nhỏ trước, dùng `@media (min-width: ...)` để override lên màn hình lớn. Hiệu năng tốt hơn vì mobile không tải styles desktop thừa.\n- Tablet: `@media (min-width: 768px) { ... }`. Desktop: `@media (min-width: 1024px) { ... }`.',
    points: 15,
    viewCount: 310,
    createdAt: '2026-07-24',
    tags: ['CSS', 'Responsive', 'Media Queries', 'Mobile-First']
  },
  {
    id: 'rm-js-map-set',
    categoryId: 'cat-js-core',
    title: 'Map & Set Data Structures trong JavaScript',
    slug: 'javascript-map-set-data-structures',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `uniqueSortedList(arr)` nhận vào mảng số nguyên có thể có phần tử trùng, trả về mảng các số duy nhất đã được sắp xếp tăng dần. Sử dụng Set.',
    explanation: '### Giải thích Set:\n`new Set(arr)` loại bỏ trùng lặp. `Array.from(set).sort((a,b) => a-b)` chuyển về mảng và sắp xếp.',
    starterCode: `function uniqueSortedList(arr) {
  // TODO: Dùng Set để loại trùng lặp, rồi sắp xếp tăng dần
}`,
    testCases: [
      { input: 'return JSON.stringify(uniqueSortedList([3, 1, 2, 1, 3]));', expected: '[1,2,3]' },
      { input: 'return JSON.stringify(uniqueSortedList([5, 5, 5]));', expected: '[5]' },
    ],
    points: 15,
    viewCount: 275,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'Set', 'Data Structures', 'ES6']
  },
  {
    id: 'rm-browser-storage',
    categoryId: 'cat-js-core',
    title: 'LocalStorage vs SessionStorage vs Cookies',
    slug: 'browser-storage-localstorage-sessionstorage-cookies',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    content: 'Đâu là sự khác biệt ĐÚNG nhất giữa `localStorage` và `sessionStorage`?',
    explanation: '### Giải thích Browser Storage:\n- **localStorage**: Dữ liệu tồn tại vĩnh viễn cho đến khi bị xóa thủ công. Chia sẻ giữa các tab cùng origin.\n- **sessionStorage**: Dữ liệu chỉ tồn tại trong phiên tab hiện tại. Khi đóng tab, dữ liệu bị xóa. Không chia sẻ giữa các tab.',
    options: [
      { id: 'bs1', text: 'localStorage dữ liệu bị xóa khi đóng tab; sessionStorage tồn tại vĩnh viễn.', is_correct: false },
      { id: 'bs2', text: 'sessionStorage dữ liệu bị xóa khi đóng tab; localStorage tồn tại đến khi bị xóa thủ công.', is_correct: true },
      { id: 'bs3', text: 'Cả hai đều bị xóa khi người dùng đóng trình duyệt.', is_correct: false },
      { id: 'bs4', text: 'localStorage và sessionStorage đều có giới hạn 4KB giống Cookie.', is_correct: false },
    ],
    points: 10,
    viewCount: 415,
    createdAt: '2026-07-24',
    tags: ['Browser Storage', 'localStorage', 'sessionStorage', 'Junior']
  },
  {
    id: 'rm-js-regex',
    categoryId: 'cat-js-core',
    title: 'Regular Expressions (RegEx) Cơ Bản trong JS',
    slug: 'javascript-regex-basics',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `isValidVietnamesePhone(phone)` trả về `true` nếu chuỗi phone là số điện thoại Việt Nam hợp lệ (bắt đầu bằng 0, có đúng 10 chữ số).',
    explanation: '### Giải thích RegEx:\nPattern `^0\\d{9}$`: `^0` bắt đầu bằng 0, `\\d{9}` tiếp theo có đúng 9 chữ số, `$` kết thúc chuỗi.',
    starterCode: `function isValidVietnamesePhone(phone) {
  // TODO: Kiểm tra số điện thoại VN - bắt đầu bằng 0, tổng 10 chữ số
  const regex = /TODO/;
  return regex.test(phone);
}`,
    testCases: [
      { input: 'return isValidVietnamesePhone("0912345678");', expected: true },
      { input: 'return isValidVietnamesePhone("123456789");', expected: false },
      { input: 'return isValidVietnamesePhone("09123456789");', expected: false },
    ],
    points: 15,
    viewCount: 230,
    createdAt: '2026-07-24',
    tags: ['JavaScript', 'RegEx', 'Validation', 'Junior']
  },

  // ===========================================================
  // NEW MID-LEVEL QUESTIONS (Bài 7-20)
  // ===========================================================
  {
    id: 'rm-ts-generics',
    categoryId: 'cat-typescript',
    title: 'TypeScript Generics & Conditional Types',
    slug: 'typescript-generics-conditional-types',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm generic `first<T>(arr: T[]): T | undefined` trả về phần tử đầu tiên của mảng, hoặc `undefined` nếu mảng rỗng.',
    explanation: '### TypeScript Generics:\n`<T>` là type parameter, cho phép hàm hoạt động với mọi kiểu dữ liệu nhưng vẫn type-safe. Kiểu trả về `T | undefined` mô tả chính xác khả năng.',
    starterCode: `function first<T>(arr: T[]): T | undefined {
  // TODO: Trả về phần tử đầu tiên hoặc undefined
}`,
    testCases: [
      { input: 'return first([1, 2, 3]);', expected: 1 },
      { input: 'return first([]);', expected: undefined },
      { input: 'return first(["a", "b"]);', expected: 'a' },
    ],
    points: 15,
    viewCount: 285,
    createdAt: '2026-07-25',
    tags: ['TypeScript', 'Generics', 'Type Safety']
  },
  {
    id: 'rm-react-useref',
    categoryId: 'cat-react-hooks',
    title: 'useRef & forwardRef - Quản Lý DOM Refs trong React',
    slug: 'react-useref-forwardref-dom-refs',
    difficulty: 'MEDIUM',
    type: 'THEORY',
    content: '### Đề Bài useRef:\n\n1. `useRef` khác `useState` như thế nào? Khi nào nên dùng `useRef` thay vì `useState`?\n2. `forwardRef` giải quyết vấn đề gì khi muốn truyền ref từ component cha xuống DOM element bên trong component con?',
    explanation: '### Lời Giải:\n- **useRef vs useState**: `useRef` lưu giá trị mutable mà KHÔNG gây re-render khi thay đổi. Dùng cho DOM refs, timer IDs, previous values.\n- **forwardRef**: Wrap component con để nó có thể nhận `ref` prop từ cha và forward xuống DOM element bên trong.',
    points: 20,
    viewCount: 320,
    createdAt: '2026-07-25',
    tags: ['React', 'useRef', 'forwardRef', 'Hooks']
  },
  {
    id: 'rm-promise-chain',
    categoryId: 'cat-async-js',
    title: 'Promise Chaining & Async/Await Patterns',
    slug: 'promise-chaining-async-await-patterns',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `fetchUserData(userId)` sử dụng async/await để giả lập fetch user (delay 10ms, trả về `{ id: userId, name: "User" + userId }`).',
    explanation: '### Async/Await Pattern:\n`async function` luôn trả về Promise. `await` tạm dừng thực thi để chờ Promise resolve. Wrap trong `try/catch` để xử lý lỗi.',
    starterCode: `async function fetchUserData(userId) {
  // TODO: Giả lập API call với delay 10ms và trả về user object
  return new Promise((resolve) => {
    setTimeout(() => {
      // Điền logic resolve tại đây...
    }, 10);
  });
}`,
    testCases: [
      { input: 'return fetchUserData(1).then(u => u.id);', expected: 1 },
      { input: 'return fetchUserData(42).then(u => u.name);', expected: 'User42' },
    ],
    points: 15,
    viewCount: 290,
    createdAt: '2026-07-25',
    tags: ['Async/Await', 'Promise', 'Mid-Level']
  },
  {
    id: 'rm-context-api',
    categoryId: 'cat-react-hooks',
    title: 'React Context API & useContext Hook',
    slug: 'react-context-api-usecontext',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Khi nào thì nên dùng **React Context API** thay vì truyền Props trực tiếp?',
    explanation: '### Context API Use Cases:\nContext phù hợp khi dữ liệu cần được chia sẻ "globally" giữa nhiều component ở nhiều cấp độ khác nhau mà không muốn "prop drilling" qua nhiều tầng component trung gian.',
    options: [
      { id: 'ctx1', text: 'Khi dữ liệu cần chia sẻ giữa nhiều component không liên quan mà tránh prop drilling qua nhiều tầng.', is_correct: true },
      { id: 'ctx2', text: 'Khi chỉ truyền dữ liệu giữa component cha và con trực tiếp.', is_correct: false },
      { id: 'ctx3', text: 'Context luôn tốt hơn Redux trong mọi trường hợp.', is_correct: false },
      { id: 'ctx4', text: 'Chỉ dùng Context khi ứng dụng có hơn 100 component.', is_correct: false },
    ],
    points: 15,
    viewCount: 355,
    createdAt: '2026-07-25',
    tags: ['React', 'Context API', 'State Management']
  },
  {
    id: 'rm-js-prototype',
    categoryId: 'cat-js-core',
    title: 'Prototype Chain & Class Inheritance trong JavaScript',
    slug: 'javascript-prototype-chain-class-inheritance',
    difficulty: 'MEDIUM',
    type: 'THEORY',
    content: '### Đề Bài Prototype:\n\n1. Giải thích **Prototype Chain** trong JavaScript hoạt động ra sao khi truy cập một property không tồn tại trên object.\n2. Cú pháp ES6 `class` và `extends` thực chất là **syntactic sugar** cho gì? Cơ chế thực thi bên dưới là gì?',
    explanation: '### Lời Giải:\n- **Prototype Chain**: Khi truy cập `obj.prop`, JS tìm trong `obj`, nếu không có thì lên `obj.__proto__` (prototype của constructor), cứ thế đến `null`.\n- **ES6 Class**: Là syntactic sugar cho Prototypal Inheritance. `class Animal {}` tương đương `function Animal() {}` với `Animal.prototype`.',
    points: 20,
    viewCount: 410,
    createdAt: '2026-07-25',
    tags: ['JavaScript', 'Prototype', 'OOP', 'Class']
  },
  {
    id: 'rm-ts-interface',
    categoryId: 'cat-typescript',
    title: 'TypeScript Interface vs Type Alias - Khi Nào Dùng Gì?',
    slug: 'typescript-interface-vs-type-alias',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Đâu là điểm khác biệt QUAN TRỌNG NHẤT giữa `interface` và `type` trong TypeScript?',
    explanation: '### Interface vs Type:\n- **Interface**: Hỗ trợ Declaration Merging (có thể khai báo cùng tên nhiều lần, TypeScript merge chúng lại). Chỉ dùng cho Object/Class shapes.\n- **Type Alias**: Có thể dùng cho Union types, Intersection types, Primitives. KHÔNG hỗ trợ Declaration Merging.',
    options: [
      { id: 'ts1', text: 'Interface hỗ trợ Declaration Merging còn Type Alias thì không; Type Alias linh hoạt hơn (dùng được cho Union, Primitives).', is_correct: true },
      { id: 'ts2', text: 'Interface nhanh hơn Type Alias về mặt compile time.', is_correct: false },
      { id: 'ts3', text: 'Type Alias không thể dùng với Generic types.', is_correct: false },
      { id: 'ts4', text: 'Chúng hoàn toàn giống nhau và có thể dùng thay thế nhau tự do.', is_correct: false },
    ],
    points: 15,
    viewCount: 380,
    createdAt: '2026-07-25',
    tags: ['TypeScript', 'Interface', 'Type Alias']
  },
  {
    id: 'rm-jest-test',
    categoryId: 'cat-js-core',
    title: 'Viết Unit Tests với Jest & Mock Functions',
    slug: 'unit-testing-jest-mock-functions',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `sum(a, b)` trả về tổng 2 số, và viết test assertion đơn giản kiểm tra `sum(2, 3) === 5`.',
    explanation: '### Jest Testing:\n`expect(value).toBe(expected)` kiểm tra strict equality. `jest.fn()` tạo mock function. Test nên là FAST, ISOLATED, REPEATABLE.',
    starterCode: `function sum(a, b) {
  // TODO: Trả về tổng 2 số
}

// Test assertion
function runTest() {
  const result = sum(2, 3);
  if (result !== 5) throw new Error(\`Expected 5 but got \${result}\`);
  return 'PASS';
}`,
    testCases: [
      { input: 'return sum(2, 3);', expected: 5 },
      { input: 'return sum(-1, 1);', expected: 0 },
      { input: 'return sum(0, 0);', expected: 0 },
    ],
    points: 15,
    viewCount: 265,
    createdAt: '2026-07-25',
    tags: ['Testing', 'Jest', 'Unit Test']
  },
  {
    id: 'rm-react-reducer',
    categoryId: 'cat-react-hooks',
    title: 'useReducer Pattern & Flux Architecture',
    slug: 'react-usereducer-flux-architecture',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài useReducer:\n\n1. `useReducer` thích hợp hơn `useState` trong những trường hợp nào?\n2. Phân tích kiến trúc **Flux** (Action -> Dispatcher -> Store -> View) và tại sao nó giúp state predictable hơn?',
    explanation: '### Lời Giải:\n- **useReducer**: Phù hợp khi state logic phức tạp, nhiều sub-values, hoặc state tiếp theo phụ thuộc vào state trước đó.\n- **Flux Pattern**: Dữ liệu chỉ chảy một chiều (unidirectional data flow). Actions mô tả "what happened", Reducer thuần túy tính toán state mới.',
    points: 25,
    viewCount: 420,
    createdAt: '2026-07-25',
    tags: ['React', 'useReducer', 'Flux', 'State Management']
  },
  {
    id: 'rm-module-bundler',
    categoryId: 'cat-performance-sec',
    title: 'Vite vs Webpack - Build Tools & Tree Shaking',
    slug: 'vite-vs-webpack-build-tools-tree-shaking',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Lý do chính tại sao **Vite** khởi động Development Server nhanh hơn đáng kể so với Webpack truyền thống là gì?',
    explanation: '### Vite vs Webpack Dev Server:\n- **Webpack**: Bundle toàn bộ app thành file bundle lớn trước khi serve. Càng nhiều module, càng chậm.\n- **Vite**: Dùng native ES Modules của trình duyệt trong dev mode. Chỉ transform file nào được request, không bundle trước. Đặc biệt nhanh với HMR.',
    options: [
      { id: 'vite1', text: 'Vite dùng native ES Modules, chỉ transform file nào được request thay vì bundle toàn bộ app trước.', is_correct: true },
      { id: 'vite2', text: 'Vite được viết bằng Go nên nhanh hơn Webpack viết bằng JavaScript.', is_correct: false },
      { id: 'vite3', text: 'Vite bỏ qua bước kiểm tra TypeScript nên nhanh hơn.', is_correct: false },
      { id: 'vite4', text: 'Vite chỉ hỗ trợ React nên được tối ưu tốt hơn.', is_correct: false },
    ],
    points: 15,
    viewCount: 445,
    createdAt: '2026-07-25',
    tags: ['Vite', 'Webpack', 'Build Tools', 'Tree Shaking']
  },
  {
    id: 'rm-curry-compose',
    categoryId: 'cat-js-core',
    title: 'Currying & Function Composition trong FP',
    slug: 'currying-function-composition-fp',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `curry(fn)` biến đổi hàm `fn` nhận nhiều arguments thành chuỗi hàm nhận từng argument một.',
    explanation: '### Currying Pattern:\nCurried function `add(a)(b)` thay vì `add(a, b)`. Sử dụng đệ quy hoặc closure để tích lũy arguments.',
    starterCode: `function curry(fn) {
  // TODO: Biến đổi fn thành curried function
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      // Điền logic tích lũy args tại đây...
    };
  };
}`,
    testCases: [
      { input: 'const add = curry((a, b) => a + b); return add(1)(2);', expected: 3 },
      { input: 'const multiply = curry((a, b, c) => a * b * c); return multiply(2)(3)(4);', expected: 24 },
    ],
    points: 25,
    viewCount: 330,
    createdAt: '2026-07-25',
    tags: ['JavaScript', 'Functional Programming', 'Currying', 'Advanced']
  },
  {
    id: 'rm-react-memo',
    categoryId: 'cat-react-hooks',
    title: 'React.memo & Optimization Rendering Tree',
    slug: 'react-memo-optimization-rendering',
    difficulty: 'MEDIUM',
    type: 'THEORY',
    content: '### Đề Bài React.memo:\n\n1. `React.memo()` là gì và nó ngăn re-render như thế nào?\n2. Khi nào thì `React.memo()` phản tác dụng (premature optimization)?',
    explanation: '### Lời Giải:\n- `React.memo(Component)` wrap component, shallow compare props. Nếu props không đổi, bỏ qua re-render.\n- **Phản tác dụng**: Khi component luôn nhận props mới (objects/arrays tạo mới mỗi render), chi phí so sánh props cao hơn chi phí re-render thực tế.',
    points: 20,
    viewCount: 365,
    createdAt: '2026-07-25',
    tags: ['React', 'memo', 'Performance', 'Optimization']
  },
  {
    id: 'rm-ts-discriminated',
    categoryId: 'cat-typescript',
    title: 'TypeScript Discriminated Unions & Type Guards',
    slug: 'typescript-discriminated-unions-type-guards',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    content: 'Đâu là cách sử dụng **Discriminated Union** ĐÚNG trong TypeScript?\n\n```typescript\ntype Shape =\n  | { kind: "circle"; radius: number }\n  | { kind: "square"; side: number };\n```',
    explanation: '### Discriminated Unions:\nProp `kind` là "discriminant" - TS dùng để thu hẹp kiểu (narrowing) trong switch/if statements. Sau `if (shape.kind === "circle")`, TS biết chắc `shape.radius` tồn tại.',
    options: [
      { id: 'du1', text: 'Dùng switch(shape.kind) để xử lý mỗi case với type narrowing tự động - TS hiểu shape.radius trong case "circle".', is_correct: true },
      { id: 'du2', text: 'Phải dùng as để ép kiểu trong từng case.', is_correct: false },
      { id: 'du3', text: 'Discriminated Union chỉ hoạt động với interface, không với type alias.', is_correct: false },
      { id: 'du4', text: 'Cần khai báo thêm type guard function bắt buộc.', is_correct: false },
    ],
    points: 20,
    viewCount: 295,
    createdAt: '2026-07-25',
    tags: ['TypeScript', 'Discriminated Union', 'Type Guards']
  },
  {
    id: 'rm-lazy-import',
    categoryId: 'cat-react-hooks',
    title: 'Code Splitting & Lazy Import với React.lazy',
    slug: 'code-splitting-react-lazy-suspense',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết đoạn code React sử dụng `React.lazy` và `Suspense` để lazy load component `HeavyComponent` từ đường dẫn `./HeavyComponent`.',
    explanation: '### Code Splitting với React.lazy:\n`const Heavy = React.lazy(() => import("./HeavyComponent"))` tạo component lazy. Wrap trong `<Suspense fallback={<Loading/>}>` để hiển thị fallback khi chưa load xong.',
    starterCode: `// TODO: Tạo lazy component và wrap với Suspense
function getConfig() {
  // Mô phỏng cấu hình lazy import
  return {
    strategy: 'lazy',
    boundary: 'Suspense',
    fallback: '<LoadingSpinner />'
  };
}`,
    testCases: [
      { input: 'const c = getConfig(); return c.strategy;', expected: 'lazy' },
      { input: 'const c = getConfig(); return c.boundary;', expected: 'Suspense' },
    ],
    points: 15,
    viewCount: 250,
    createdAt: '2026-07-25',
    tags: ['React', 'Code Splitting', 'Lazy Loading', 'Performance']
  },
  {
    id: 'rm-array-sort',
    categoryId: 'cat-js-core',
    title: 'Binary Search & Custom Sort Algorithm trong JS',
    slug: 'binary-search-custom-sort-javascript',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `binarySearch(sortedArr, target)` tìm kiếm nhị phân trong mảng đã sắp xếp, trả về index hoặc -1 nếu không tìm thấy.',
    explanation: '### Binary Search O(log n):\nMỗi lần kiểm tra điểm giữa, loại bỏ một nửa mảng. Điều kiện: mảng phải được sắp xếp trước.',
    starterCode: `function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // TODO: So sánh sortedArr[mid] với target và cập nhật left/right
  }
  return -1;
}`,
    testCases: [
      { input: 'return binarySearch([1, 3, 5, 7, 9], 5);', expected: 2 },
      { input: 'return binarySearch([1, 3, 5, 7, 9], 6);', expected: -1 },
      { input: 'return binarySearch([2, 4, 6, 8], 2);', expected: 0 },
    ],
    points: 20,
    viewCount: 310,
    createdAt: '2026-07-25',
    tags: ['Algorithm', 'Binary Search', 'Data Structures']
  },

  // ===========================================================
  // NEW SENIOR QUESTIONS (Bài 7-20)
  // ===========================================================
  {
    id: 'rm-web-worker',
    categoryId: 'cat-performance-sec',
    title: 'Web Workers & Offscreen Computation',
    slug: 'web-workers-offscreen-computation',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài Web Workers:\n\n1. **Web Worker** là gì và tại sao nó giúp tránh block Main Thread?\n2. Những loại tác vụ nào phù hợp để chuyển sang Web Worker? Những giới hạn nào Web Worker có?',
    explanation: '### Lời Giải:\n- Web Worker chạy JS trong thread riêng biệt, không ảnh hưởng UI thread. Giao tiếp qua `postMessage` và `onmessage`.\n- **Phù hợp**: Image processing, cryptography, large data parsing, AI inference.\n- **Giới hạn**: Không truy cập được DOM, `window`, `document`. Phải truyền data qua serialized messages.',
    points: 25,
    viewCount: 380,
    createdAt: '2026-07-25',
    tags: ['Web Workers', 'Performance', 'Multithreading', 'Senior']
  },
  {
    id: 'rm-intersection',
    categoryId: 'cat-performance-sec',
    title: 'Lazy Loading với IntersectionObserver API',
    slug: 'lazy-loading-intersection-observer',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `setupLazyImages()` trả về config cho IntersectionObserver để lazy load images khi chúng vào viewport (threshold 10%).',
    explanation: '### IntersectionObserver:\n`new IntersectionObserver(callback, { threshold: 0.1 })` quan sát elements. Khi element 10% trong viewport, callback được gọi với `entry.isIntersecting === true`.',
    starterCode: `function setupLazyImages() {
  // TODO: Trả về config object cho IntersectionObserver
  return {
    threshold: 0, // Sửa threshold
    rootMargin: '0px',
    lazyAttr: 'data-src',
  };
}`,
    testCases: [
      { input: 'const c = setupLazyImages(); return c.threshold;', expected: 0.1 },
      { input: 'const c = setupLazyImages(); return c.lazyAttr;', expected: 'data-src' },
    ],
    points: 20,
    viewCount: 285,
    createdAt: '2026-07-25',
    tags: ['Performance', 'IntersectionObserver', 'Lazy Loading', 'Senior']
  },
  {
    id: 'rm-csrf-sec',
    categoryId: 'cat-performance-sec',
    title: 'CSRF Attack & SameSite Cookie Defense',
    slug: 'csrf-attack-samesite-cookie-defense',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    content: 'Cơ chế phòng thủ HIỆU QUẢ NHẤT để bảo vệ form submit khỏi tấn công **Cross-Site Request Forgery (CSRF)** là gì?',
    explanation: '### CSRF Defense:\n- **CSRF Token**: Server tạo token ngẫu nhiên nhúng vào form, xác thực mỗi request. Attacker không thể đọc token từ site khác.\n- **SameSite Cookie**: `SameSite=Strict` hoặc `Lax` ngăn browser gửi cookie khi request đến từ domain khác.',
    options: [
      { id: 'csrf1', text: 'Sử dụng CSRF Token (Synchronizer Token Pattern) và thiết lập SameSite=Strict cho session cookie.', is_correct: true },
      { id: 'csrf2', text: 'Chỉ cần dùng HTTPS là đủ bảo vệ khỏi CSRF.', is_correct: false },
      { id: 'csrf3', text: 'Validate Content-Type header của request là đủ.', is_correct: false },
      { id: 'csrf4', text: 'CORS headers tự động bảo vệ khỏi CSRF attacks.', is_correct: false },
    ],
    points: 25,
    viewCount: 420,
    createdAt: '2026-07-25',
    tags: ['Security', 'CSRF', 'Cookie', 'Senior']
  },
  {
    id: 'rm-redux-toolkit',
    categoryId: 'cat-react-hooks',
    title: 'Redux Toolkit & RTK Query Pattern',
    slug: 'redux-toolkit-rtk-query-pattern',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài Redux Toolkit:\n\n1. Redux Toolkit giải quyết những "pain points" nào của Redux thuần?\n2. **RTK Query** là gì? So sánh với React Query về data fetching và caching.',
    explanation: '### Lời Giải:\n- **Redux Toolkit**: Giảm boilerplate với `createSlice`, `createAsyncThunk`. Immer.js cho phép "mutate" state trực tiếp.\n- **RTK Query vs React Query**: Cả hai đều cache, dedupe requests. RTK Query tích hợp sâu với Redux store. React Query standalone và framework-agnostic.',
    points: 25,
    viewCount: 395,
    createdAt: '2026-07-25',
    tags: ['Redux', 'RTK Query', 'State Management', 'Senior']
  },
  {
    id: 'rm-pwa-sw',
    categoryId: 'cat-performance-sec',
    title: 'Service Worker & PWA Offline Caching Strategy',
    slug: 'service-worker-pwa-offline-caching',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `getCachingStrategy(resourceType)` trả về chiến lược cache phù hợp: "cache-first" cho static assets, "network-first" cho API calls.',
    explanation: '### Caching Strategies:\n- **Cache First**: Dùng cho images, CSS, JS (static assets ít thay đổi).\n- **Network First**: Dùng cho API calls để luôn có data mới nhất, fallback về cache khi offline.',
    starterCode: `function getCachingStrategy(resourceType) {
  // TODO: Trả về caching strategy phù hợp
  // resourceType: 'static' | 'api' | 'image'
}`,
    testCases: [
      { input: 'return getCachingStrategy("static");', expected: 'cache-first' },
      { input: 'return getCachingStrategy("api");', expected: 'network-first' },
      { input: 'return getCachingStrategy("image");', expected: 'cache-first' },
    ],
    points: 25,
    viewCount: 315,
    createdAt: '2026-07-25',
    tags: ['PWA', 'Service Worker', 'Caching', 'Senior']
  },
  {
    id: 'rm-error-boundary',
    categoryId: 'cat-react-hooks',
    title: 'React Error Boundaries & Fallback UI',
    slug: 'react-error-boundaries-fallback-ui',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    content: 'Đặc điểm nào là ĐÚNG về React Error Boundaries?',
    explanation: '### Error Boundaries:\n- Phải là **Class Component** với `componentDidCatch` và `getDerivedStateFromError`.\n- Bắt lỗi trong render, lifecycle, constructors của **con cháu**. KHÔNG bắt: event handlers, async code, server-side rendering.',
    options: [
      { id: 'eb1', text: 'Error Boundary phải là Class Component và chỉ bắt lỗi trong render phase của component con, không bắt lỗi trong event handlers.', is_correct: true },
      { id: 'eb2', text: 'Function Component với try/catch có thể làm Error Boundary.', is_correct: false },
      { id: 'eb3', text: 'Error Boundary bắt được tất cả lỗi kể cả trong async setTimeout.', is_correct: false },
      { id: 'eb4', text: 'Một Error Boundary có thể bắt lỗi của chính nó.', is_correct: false },
    ],
    points: 20,
    viewCount: 340,
    createdAt: '2026-07-25',
    tags: ['React', 'Error Boundary', 'Error Handling']
  },
  {
    id: 'rm-memoize',
    categoryId: 'cat-js-core',
    title: 'Viết Hàm memoize() Cache Kết Quả Hàm',
    slug: 'memoize-function-caching',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `memoize(fn)` nhận vào một hàm và trả về phiên bản đã được cache. Nếu hàm được gọi với cùng arguments, trả về kết quả cached thay vì tính toán lại.',
    explanation: '### Memoization:\nDùng Map để lưu `key -> value`. Key là JSON.stringify của arguments. Cache hit khi gọi lại với cùng args.',
    starterCode: `function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    // TODO: Tính toán, lưu vào cache và trả về
  };
}`,
    testCases: [
      { input: 'let calls = 0; const expensive = memoize((n) => { calls++; return n * 2; }); expensive(5); expensive(5); return calls;', expected: 1 },
      { input: 'const add = memoize((a, b) => a + b); return add(3, 4);', expected: 7 },
    ],
    points: 25,
    viewCount: 360,
    createdAt: '2026-07-25',
    tags: ['JavaScript', 'Memoization', 'Optimization', 'Senior']
  },
  {
    id: 'rm-bundle-analysis',
    categoryId: 'cat-performance-sec',
    title: 'Bundle Analysis & Performance Budget',
    slug: 'bundle-analysis-performance-budget',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài Bundle Optimization:\n\n1. Làm thế nào để phân tích bundle size với **webpack-bundle-analyzer** hoặc **rollup-plugin-visualizer**?\n2. **Performance Budget** là gì? Làm thế nào để thiết lập và enforce trong CI/CD pipeline?',
    explanation: '### Lời Giải:\n- Chạy `npx webpack-bundle-analyzer stats.json` hoặc `vite-bundle-visualizer` để xem treemap bundle size.\n- **Performance Budget**: Giới hạn kích thước bundle tối đa (VD: main chunk < 200KB gzipped). Enforce qua Lighthouse CI trong pipeline.',
    points: 25,
    viewCount: 295,
    createdAt: '2026-07-25',
    tags: ['Bundle Analysis', 'Performance Budget', 'Optimization', 'Senior']
  },
  {
    id: 'rm-observer-pattern',
    categoryId: 'cat-js-core',
    title: 'Observer Design Pattern với WeakRef',
    slug: 'observer-design-pattern-weakref',
    difficulty: 'HARD',
    type: 'CODING_PRACTICE',
    content: 'Viết class `Observable` đơn giản với methods `subscribe(callback)` và `notify(data)` để thực thi tất cả subscriber callbacks.',
    explanation: '### Observer Pattern:\nMaintain danh sách callbacks trong array/Set. `notify()` loop qua và gọi từng callback. Dùng WeakRef trong production để tránh memory leak.',
    starterCode: `class Observable {
  constructor() {
    this.subscribers = [];
  }
  
  subscribe(callback) {
    // TODO: Thêm callback vào danh sách subscribers
  }
  
  notify(data) {
    // TODO: Gọi tất cả subscribers với data
  }
}`,
    testCases: [
      { input: 'const obs = new Observable(); let result = 0; obs.subscribe((d) => result = d); obs.notify(42); return result;', expected: 42 },
      { input: 'const obs = new Observable(); let count = 0; obs.subscribe(() => count++); obs.subscribe(() => count++); obs.notify(); return count;', expected: 2 },
    ],
    points: 25,
    viewCount: 280,
    createdAt: '2026-07-25',
    tags: ['Design Patterns', 'Observer', 'Senior']
  },
  {
    id: 'rm-ssr-strategies',
    categoryId: 'cat-performance-sec',
    title: 'SSR vs SSG vs CSR - Rendering Strategies So Sánh',
    slug: 'ssr-ssg-csr-rendering-strategies',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    content: 'Trang nào phù hợp nhất với **SSG (Static Site Generation)**?',
    explanation: '### Rendering Strategies:\n- **SSG**: Trang không thay đổi thường xuyên (blog, docs, marketing). Build once, serve as static files. Tốc độ load cực nhanh.\n- **SSR**: Trang cần data cá nhân hóa mỗi request (dashboard, profile).\n- **CSR**: App phức tạp, tương tác cao (SPA).',
    options: [
      { id: 'ssr1', text: 'Trang blog bài viết ít thay đổi, cần SEO tốt và tốc độ load nhanh nhất.', is_correct: true },
      { id: 'ssr2', text: 'Trang dashboard real-time hiển thị dữ liệu cá nhân của từng user.', is_correct: false },
      { id: 'ssr3', text: 'Ứng dụng chat cần cập nhật tin nhắn liên tục.', is_correct: false },
      { id: 'ssr4', text: 'Trang admin có nhiều biểu đồ tương tác phức tạp.', is_correct: false },
    ],
    points: 20,
    viewCount: 420,
    createdAt: '2026-07-25',
    tags: ['SSR', 'SSG', 'CSR', 'Next.js', 'Senior']
  },
  {
    id: 'rm-zustand-compare',
    categoryId: 'cat-react-hooks',
    title: 'Zustand vs Jotai vs Valtio - Modern State Management',
    slug: 'zustand-jotai-valtio-state-management-comparison',
    difficulty: 'HARD',
    type: 'THEORY',
    content: '### Đề Bài State Management Libraries:\n\n1. So sánh triết lý thiết kế của **Zustand**, **Jotai** và **Valtio**.\n2. Khi nào nên chọn Zustand thay vì Redux Toolkit cho dự án mới?',
    explanation: '### Lời Giải:\n- **Zustand**: Store-based, minimal API, không cần Provider wrap. Tốt cho app quy mô vừa.\n- **Jotai**: Atom-based (như Recoil), bottom-up. Tốt khi cần granular subscriptions.\n- **Valtio**: Proxy-based, mutations thực sự nhưng immutable updates. Intuitive nhất.\n- **Zustand vs Redux**: Zustand ít boilerplate hơn, không cần actions/reducers cho simple state.',
    points: 25,
    viewCount: 355,
    createdAt: '2026-07-25',
    tags: ['Zustand', 'State Management', 'Jotai', 'Senior']
  },
  {
    id: 'rm-image-opt',
    categoryId: 'cat-performance-sec',
    title: 'Image Optimization & Next-Gen Formats',
    slug: 'image-optimization-next-gen-formats',
    difficulty: 'MEDIUM',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `getImageConfig(imagePath)` trả về config cho responsive image với srcset và lazy loading.',
    explanation: '### Image Optimization:\n`loading="lazy"` dùng native browser lazy loading. `srcset` cung cấp multiple sizes cho responsive. WebP nhỏ hơn JPEG ~25-35%.',
    starterCode: `function getImageConfig(imagePath) {
  // TODO: Trả về config cho responsive optimized image
  return {
    src: imagePath,
    loading: '', // 'lazy'
    decoding: 'async',
    format: '', // 'webp'
  };
}`,
    testCases: [
      { input: 'const c = getImageConfig("/img.jpg"); return c.loading;', expected: 'lazy' },
      { input: 'const c = getImageConfig("/img.jpg"); return c.format;', expected: 'webp' },
    ],
    points: 15,
    viewCount: 240,
    createdAt: '2026-07-25',
    tags: ['Performance', 'Image', 'WebP', 'Senior']
  },
  {
    id: 'rm-a11y-wcag',
    categoryId: 'cat-html-css',
    title: 'Accessibility (a11y) WCAG 2.1 Standards Audit',
    slug: 'accessibility-wcag-2-1-standards',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    content: 'Theo **WCAG 2.1 Level AA**, tỷ lệ tương phản màu sắc tối thiểu giữa text và background là bao nhiêu?',
    explanation: '### WCAG 2.1 Color Contrast:\n- **Normal text** (< 18pt): Tối thiểu **4.5:1** contrast ratio cho AA.\n- **Large text** (≥ 18pt hoặc 14pt bold): Tối thiểu **3:1**.\n- **AAA level** (enhanced): 7:1 cho normal text.',
    options: [
      { id: 'a11y1', text: '4.5:1 cho text thông thường (< 18pt) và 3:1 cho text lớn.', is_correct: true },
      { id: 'a11y2', text: '2:1 cho tất cả các loại text.', is_correct: false },
      { id: 'a11y3', text: '7:1 cho tất cả các loại text (AAA standard).', is_correct: false },
      { id: 'a11y4', text: 'Không có yêu cầu tỷ lệ cụ thể, miễn là người dùng có thể đọc được.', is_correct: false },
    ],
    points: 20,
    viewCount: 290,
    createdAt: '2026-07-25',
    tags: ['Accessibility', 'WCAG', 'a11y', 'Senior']
  },
  {
    id: 'rm-generator',
    categoryId: 'cat-js-core',
    title: 'Generator Functions & Custom Iterator Protocol',
    slug: 'generator-functions-custom-iterator',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết Generator function `range(start, end, step = 1)` tạo ra dãy số từ start đến end (exclusive) với bước nhảy step.',
    explanation: '### Generator Functions:\n`function*` và `yield` tạo iterable lazy sequence. Gọi `range(0, 10, 2)` tạo generator cho `0, 2, 4, 6, 8` mà không cần tạo array trong bộ nhớ.',
    starterCode: `function* range(start, end, step = 1) {
  // TODO: Yield từng số từ start đến end (exclusive) với bước nhảy step
  let current = start;
  while (current < end) {
    // Điền logic yield tại đây...
    current += step;
  }
}`,
    testCases: [
      { input: 'return [...range(0, 5)].join(",");', expected: '0,1,2,3,4' },
      { input: 'return [...range(0, 10, 2)].join(",");', expected: '0,2,4,6,8' },
      { input: 'return [...range(1, 4)].length;', expected: 3 },
    ],
    points: 30,
    viewCount: 315,
    createdAt: '2026-07-25',
    tags: ['JavaScript', 'Generator', 'Iterator', 'Expert']
  },

  // ===========================================================
  // NEW ARCHITECT QUESTIONS (Bài 7-20)
  // ===========================================================
  {
    id: 'rm-monorepo',
    categoryId: 'cat-js-core',
    title: 'Monorepo Strategy - Nx vs Turborepo vs pnpm Workspaces',
    slug: 'monorepo-nx-turborepo-pnpm-workspaces',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Ưu điểm chính của **Turborepo** so với chạy build script thông thường trong Monorepo là gì?',
    explanation: '### Turborepo:\n- **Remote Caching**: Cache kết quả build trên cloud, team members và CI chia sẻ cache. Không build lại nếu input không thay đổi.\n- **Pipeline Parallelism**: Chạy tasks song song theo dependency graph.',
    options: [
      { id: 'mono1', text: 'Turborepo cache kết quả build (locally và remotely) và chạy tasks song song theo dependency graph.', is_correct: true },
      { id: 'mono2', text: 'Turborepo tự động deploy lên production khi build xong.', is_correct: false },
      { id: 'mono3', text: 'Turborepo yêu cầu tất cả packages phải dùng cùng framework.', is_correct: false },
      { id: 'mono4', text: 'Turborepo thay thế hoàn toàn npm/pnpm trong Monorepo.', is_correct: false },
    ],
    points: 30,
    viewCount: 280,
    createdAt: '2026-07-25',
    tags: ['Monorepo', 'Turborepo', 'Nx', 'Architect']
  },
  {
    id: 'rm-graphql-fed',
    categoryId: 'cat-js-core',
    title: 'GraphQL Federation & Schema Stitching',
    slug: 'graphql-federation-schema-stitching',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài GraphQL Federation:\n\n1. Giải thích mô hình **Apollo Federation**: Supergraph và Subgraph là gì?\n2. Sự khác biệt giữa **Schema Stitching** (cũ) và **Federation** (mới) về kỹ thuật và scalability?',
    explanation: '### Lời Giải:\n- **Supergraph**: Schema tổng hợp từ nhiều Subgraph services. Router nhận request, route đến đúng subgraph.\n- **Federation vs Stitching**: Federation: mỗi service tự define schema + resolver, compose tự động. Stitching: merge thủ công ở gateway, coupling cao hơn.',
    points: 35,
    viewCount: 260,
    createdAt: '2026-07-25',
    tags: ['GraphQL', 'Federation', 'Apollo', 'Architect']
  },
  {
    id: 'rm-js-proxy',
    categoryId: 'cat-js-core',
    title: 'JavaScript Proxy & Reflect API - Meta-programming',
    slug: 'javascript-proxy-reflect-meta-programming',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `createReadOnlyProxy(obj)` sử dụng Proxy để ngăn việc gán giá trị mới (`set` trap ném TypeError).',
    explanation: '### JavaScript Proxy:\n`new Proxy(target, handler)` intercept operations. `set` trap chặn gán. `Reflect.set()` thực hiện set mặc định. `Reflect.get()` thực hiện get mặc định.',
    starterCode: `function createReadOnlyProxy(obj) {
  // TODO: Tạo Proxy ngăn việc set property
  return new Proxy(obj, {
    set(target, prop, value) {
      // Ném TypeError khi cố gán value
    },
    get(target, prop) {
      return Reflect.get(target, prop);
    }
  });
}`,
    testCases: [
      { input: 'const p = createReadOnlyProxy({x: 1}); return p.x;', expected: 1 },
      { input: 'const p = createReadOnlyProxy({x: 1}); try { p.x = 2; return false; } catch(e) { return e instanceof TypeError; }', expected: true },
    ],
    points: 35,
    viewCount: 295,
    createdAt: '2026-07-25',
    tags: ['JavaScript', 'Proxy', 'Reflect', 'Meta-programming', 'Architect']
  },
  {
    id: 'rm-cicd-fe',
    categoryId: 'cat-performance-sec',
    title: 'CI/CD Pipeline cho Frontend - GitHub Actions',
    slug: 'cicd-pipeline-frontend-github-actions',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Trong GitHub Actions workflow cho Frontend, thứ tự stage nào là ĐÚNG NHẤT theo best practices?',
    explanation: '### CI/CD Best Practice Order:\n1. **Install** dependencies (cache node_modules)\n2. **Lint** (fail fast nếu code style sai)\n3. **Test** (unit + integration tests)\n4. **Build** (production bundle)\n5. **Deploy** (staging, rồi production)',
    options: [
      { id: 'cicd1', text: 'Install → Lint → Test → Build → Deploy', is_correct: true },
      { id: 'cicd2', text: 'Build → Test → Lint → Deploy → Install', is_correct: false },
      { id: 'cicd3', text: 'Deploy → Test → Build → Lint', is_correct: false },
      { id: 'cicd4', text: 'Test → Deploy → Build → Lint', is_correct: false },
    ],
    points: 25,
    viewCount: 345,
    createdAt: '2026-07-25',
    tags: ['CI/CD', 'GitHub Actions', 'DevOps', 'Architect']
  },
  {
    id: 'rm-owasp-fe',
    categoryId: 'cat-performance-sec',
    title: 'OWASP Top 10 Frontend Security Checklist',
    slug: 'owasp-top-10-frontend-security',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài OWASP Frontend Security:\n\n1. Liệt kê 5 lỗ hổng bảo mật Frontend từ OWASP Top 10 và cách phòng tránh.\n2. **Content Security Policy (CSP)** header hoạt động như thế nào để chống XSS?',
    explanation: '### Lời Giải OWASP:\n1. **Injection (XSS)**: Sanitize HTML với DOMPurify.\n2. **Broken Authentication**: Dùng httpOnly cookies, rotate tokens.\n3. **Sensitive Data Exposure**: HTTPS everywhere, không lưu sensitive data trong localStorage.\n4. **IDOR**: Validate authorization server-side, không chỉ dựa vào frontend.\n5. **Security Misconfiguration**: CSP headers, HSTS, X-Frame-Options.\n\n**CSP**: `Content-Security-Policy: default-src self` chỉ cho phép tải resources từ cùng origin, block inline scripts ngăn XSS.',
    points: 35,
    viewCount: 310,
    createdAt: '2026-07-25',
    tags: ['Security', 'OWASP', 'CSP', 'XSS', 'Architect']
  },
  {
    id: 'rm-state-machine',
    categoryId: 'cat-js-core',
    title: 'Finite State Machine Implementation (XState Pattern)',
    slug: 'finite-state-machine-xstate-pattern',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `createFormMachine()` trả về object state machine với states: idle, loading, success, error và transitions.',
    explanation: '### State Machine:\nXác định states hữu hạn và transitions hợp lệ. Ngăn chặn các state transitions không hợp lệ (e.g., không thể từ success sang loading trực tiếp mà không qua idle).',
    starterCode: `function createFormMachine() {
  let state = 'idle';
  
  const transitions = {
    idle: { SUBMIT: 'loading' },
    loading: { SUCCESS: 'success', ERROR: 'error' },
    success: { RESET: 'idle' },
    error: { RETRY: 'loading', RESET: 'idle' },
  };
  
  return {
    getState: () => state,
    send(event) {
      // TODO: Thực hiện transition nếu hợp lệ, bỏ qua nếu không hợp lệ
    }
  };
}`,
    testCases: [
      { input: 'const m = createFormMachine(); m.send("SUBMIT"); return m.getState();', expected: 'loading' },
      { input: 'const m = createFormMachine(); m.send("SUBMIT"); m.send("SUCCESS"); return m.getState();', expected: 'success' },
      { input: 'const m = createFormMachine(); m.send("SUCCESS"); return m.getState();', expected: 'idle' },
    ],
    points: 35,
    viewCount: 275,
    createdAt: '2026-07-25',
    tags: ['State Machine', 'XState', 'Design Patterns', 'Architect']
  },
  {
    id: 'rm-ws-batching',
    categoryId: 'cat-performance-sec',
    title: 'WebSocket Message Batching & Backpressure Control',
    slug: 'websocket-message-batching-backpressure',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Khi nhận 1000 WebSocket messages/giây và mỗi message trigger React re-render, kỹ thuật nào HIỆU QUẢ NHẤT để tối ưu?',
    explanation: '### WebSocket Batching:\n- **requestAnimationFrame Batching**: Buffer messages trong mảng, flush và update state 1 lần mỗi 60fps frame.\n- Giảm re-renders từ 1000/giây xuống còn 60/giây mà không mất data.',
    options: [
      { id: 'ws1', text: 'Buffer messages trong array, dùng requestAnimationFrame để batch update state 1 lần mỗi animation frame (~60fps).', is_correct: true },
      { id: 'ws2', text: 'Đóng kết nối WebSocket khi nhận quá 100 messages/giây.', is_correct: false },
      { id: 'ws3', text: 'Dùng Web Worker xử lý mỗi message riêng biệt và gửi kết quả về main thread.', is_correct: false },
      { id: 'ws4', text: 'Chỉ hiển thị mỗi message thứ 10 để giảm tải.', is_correct: false },
    ],
    points: 30,
    viewCount: 295,
    createdAt: '2026-07-25',
    tags: ['WebSocket', 'Performance', 'Batching', 'Architect']
  },
  {
    id: 'rm-apollo-cache',
    categoryId: 'cat-js-core',
    title: 'Apollo Client Cache Normalization & Optimistic UI',
    slug: 'apollo-client-cache-normalization-optimistic-ui',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài Apollo Cache:\n\n1. Giải thích cơ chế **Normalized Cache** của Apollo Client: InMemoryCache lưu trữ data như thế nào?\n2. **Optimistic Response** là gì và nó cải thiện UX như thế nào?',
    explanation: '### Lời Giải:\n- **Normalized Cache**: Apollo lưu mỗi entity theo `__typename:id` (VD: `User:123`). Nếu cùng entity xuất hiện ở nhiều queries, chỉ lưu 1 lần. Update tự động sync.\n- **Optimistic Response**: Cập nhật UI ngay lập tức với giả định mutation thành công, rollback nếu server trả lỗi.',
    points: 35,
    viewCount: 265,
    createdAt: '2026-07-25',
    tags: ['GraphQL', 'Apollo', 'Cache', 'Optimistic UI', 'Architect']
  },
  {
    id: 'rm-ast-babel',
    categoryId: 'cat-js-core',
    title: 'AST Traversal & Custom Babel Plugin Basics',
    slug: 'ast-traversal-custom-babel-plugin',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `getASTInfo(code)` phân tích code string và trả về thông tin cơ bản: số lượng function declarations.',
    explanation: '### AST Basics:\nBabel parser tạo ra AST tree. Traverse qua nodes để phân tích và transform code. Dùng acorn hoặc @babel/parser.',
    starterCode: `function getASTInfo(code) {
  // Giả lập AST analysis (đếm từ khóa function)
  const functionCount = (code.match(/\\bfunction\\b/g) || []).length;
  const arrowCount = (code.match(/=>/g) || []).length;
  
  return {
    functionDeclarations: functionCount,
    arrowFunctions: arrowCount,
    // TODO: Thêm hasClasses
    hasClasses: code.includes('class '),
  };
}`,
    testCases: [
      { input: 'return getASTInfo("function a() {} function b() {}").functionDeclarations;', expected: 2 },
      { input: 'return getASTInfo("const fn = () => {}").arrowFunctions;', expected: 1 },
      { input: 'return getASTInfo("class MyClass {}").hasClasses;', expected: true },
    ],
    points: 35,
    viewCount: 245,
    createdAt: '2026-07-25',
    tags: ['AST', 'Babel', 'Compiler', 'Architect']
  },
  {
    id: 'rm-feature-flag',
    categoryId: 'cat-js-core',
    title: 'Feature Flag Architecture & A/B Testing Frontend',
    slug: 'feature-flag-architecture-ab-testing',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Kiến trúc Feature Flag nào cho phép **tắt/bật tính năng ngay lập tức mà KHÔNG cần redeploy**?',
    explanation: '### Feature Flags:\n- **Runtime Feature Flags**: Fetch flag config từ server (LaunchDarkly, Unleash), update trong app không cần redeploy.\n- **Build-time Flags**: Được quyết định tại compile time (VD: env variables). Cần rebuild để thay đổi.',
    options: [
      { id: 'ff1', text: 'Runtime Feature Flags fetch từ remote config service, app re-evaluate flags mà không cần redeploy.', is_correct: true },
      { id: 'ff2', text: 'Environment variable flags trong .env file, rebuild để thay đổi.', is_correct: false },
      { id: 'ff3', text: 'If/else hardcoded trong source code theo version number.', is_correct: false },
      { id: 'ff4', text: 'Feature flags chỉ hoạt động với server-side rendering.', is_correct: false },
    ],
    points: 30,
    viewCount: 310,
    createdAt: '2026-07-25',
    tags: ['Feature Flags', 'A/B Testing', 'Architecture', 'Architect']
  },
  {
    id: 'rm-wasm',
    categoryId: 'cat-performance-sec',
    title: 'WebAssembly (WASM) & Compute-Intensive Tasks',
    slug: 'webassembly-wasm-compute-intensive',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài WebAssembly:\n\n1. WebAssembly giải quyết vấn đề gì mà JavaScript không làm được?\n2. Kể tên 3 use case thực tế phù hợp với WASM trong web apps.',
    explanation: '### Lời Giải WASM:\n- **WASM** thực thi gần với tốc độ native code, không qua JS engine. Phù hợp cho compute-heavy tasks.\n- **Use cases**: \n  1. Video/Image processing (FFmpeg.wasm)\n  2. Cryptography (Argon2 password hashing)\n  3. Game engines (Unity WebGL)\n  4. CAD/3D modeling (AutoCAD on web)\n  5. Scientific computing (Python/NumPy via Pyodide)',
    points: 30,
    viewCount: 275,
    createdAt: '2026-07-25',
    tags: ['WebAssembly', 'WASM', 'Performance', 'Architect']
  },
  {
    id: 'rm-crypto-api',
    categoryId: 'cat-performance-sec',
    title: 'Web Crypto API & Client-Side Hashing',
    slug: 'web-crypto-api-client-side-hashing',
    difficulty: 'EXPERT',
    type: 'CODING_PRACTICE',
    content: 'Viết hàm `hashString(str)` sử dụng Web Crypto API để tạo SHA-256 hash của chuỗi đầu vào và trả về hex string.',
    explanation: '### Web Crypto API:\n`crypto.subtle.digest("SHA-256", buffer)` trả về ArrayBuffer. Convert sang hex string bằng `Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("")`.',
    starterCode: `async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // TODO: Convert ArrayBuffer sang hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}`,
    testCases: [
      { input: 'return hashString("hello").then(h => h.length);', expected: 64 },
      { input: 'return hashString("").then(h => typeof h);', expected: 'string' },
    ],
    points: 35,
    viewCount: 260,
    createdAt: '2026-07-25',
    tags: ['Security', 'Crypto API', 'SHA-256', 'Architect']
  },
  {
    id: 'rm-dx-eng',
    categoryId: 'cat-js-core',
    title: 'Developer Experience (DX) Engineering Best Practices',
    slug: 'developer-experience-dx-engineering',
    difficulty: 'EXPERT',
    type: 'MULTIPLE_CHOICE',
    content: 'Bộ công cụ DX nào KHÔNG phù hợp để enforce code quality tự động trong team?',
    explanation: '### DX Engineering Tools:\n- **ESLint + Prettier**: Lint và format code tự động.\n- **Husky + lint-staged**: Pre-commit hooks chạy lint/test trước khi commit.\n- **Storybook**: Component documentation và visual testing.\n- **Postman**: API testing tool cho backend, không liên quan trực tiếp tới frontend code quality enforcement.',
    options: [
      { id: 'dx1', text: 'Postman cho API documentation - không enforce frontend code quality tự động.', is_correct: true },
      { id: 'dx2', text: 'Husky + lint-staged chạy lint/format trước khi commit.', is_correct: false },
      { id: 'dx3', text: 'ESLint + Prettier enforce code style nhất quán.', is_correct: false },
      { id: 'dx4', text: 'Storybook tạo visual regression tests cho components.', is_correct: false },
    ],
    points: 25,
    viewCount: 280,
    createdAt: '2026-07-25',
    tags: ['DX', 'Developer Experience', 'Tooling', 'Architect']
  },
  {
    id: 'rm-arch-review',
    categoryId: 'cat-js-core',
    title: 'Conducting Technical Architecture Reviews',
    slug: 'technical-architecture-reviews-process',
    difficulty: 'EXPERT',
    type: 'THEORY',
    content: '### Đề Bài Architecture Review:\n\n1. Quy trình **RFC (Request for Comments)** trong engineering team hoạt động như thế nào?\n2. **ADR (Architecture Decision Record)** là gì và tại sao nó quan trọng cho long-term maintainability?',
    explanation: '### Lời Giải:\n- **RFC Process**: Engineer viết proposal mô tả problem, proposed solution, alternatives, trade-offs. Team review và comment. Lead quyết định approve/reject.\n- **ADR**: Document ghi lại quyết định kiến trúc quan trọng, context tại thời điểm đó, và hệ quả. Giúp team mới hiểu "tại sao" thay vì chỉ "cái gì".',
    points: 30,
    viewCount: 255,
    createdAt: '2026-07-25',
    tags: ['Architecture', 'RFC', 'ADR', 'Engineering Process', 'Architect']
  }
];





