import { Category, Question, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'guest',
  username: 'guest',
  fullName: 'Sanjion Developer',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sanjion',
  streakCount: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  targetLevel: 'Senior',
  totalPoints: 0,
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
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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

  return {
    increment: () => {
      count += 1;
      return count;
    },
    decrement: () => {
      count -= 1;
      return count;
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
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  const copy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key]);
    }
  }
  return copy;
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
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    const results = [];
    let completed = 0;

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((val) => {
          results[index] = val;
          completed += 1;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
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
    state = value;
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
  const { id, name, email } = user;
  return { id, name, email };
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
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
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
];
