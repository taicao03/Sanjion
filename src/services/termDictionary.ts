export interface TermDefinition {
  key: string;
  aliases: string[];
  title: string;
  category: string;
  simpleExplanation: string; // Dễ hiểu nhất cho Junior
  analogyOrExample: string;  // Ví dụ đời thực hoặc code ngắn
  level: 'Junior' | 'Mid-level' | 'Senior' | 'Architect';
}

export const TERM_DICTIONARY: Record<string, TermDefinition> = {
  css: {
    key: 'css',
    aliases: ['css', 'css3'],
    title: 'CSS3 (Cascading Style Sheets)',
    category: 'Frontend Foundations',
    simpleExplanation: 'Ngôn ngữ tạo kiểu dáng, màu sắc, bố cục và hiệu ứng động cho trang web.',
    analogyOrExample: '🎨 Ví dụ: HTML là bộ khung xương ngôi nhà, còn CSS là sơn tường, nội thất và trang trí.',
    level: 'Junior',
  },
  html: {
    key: 'html',
    aliases: ['html', 'html5'],
    title: 'HTML5 (HyperText Markup Language)',
    category: 'Frontend Foundations',
    simpleExplanation: 'Ngôn ngữ đánh dấu cấu trúc chuẩn tạo nên khung xương của mọi trang web.',
    analogyOrExample: '🏗️ Ví dụ các thẻ chuẩn: `<header>`, `<main>`, `<article>`, `<button>`, `<footer>`.',
    level: 'Junior',
  },
  javascript: {
    key: 'javascript',
    aliases: ['javascript', 'js', 'es6'],
    title: 'JavaScript (JS / ES6+)',
    category: 'Frontend Foundations',
    simpleExplanation: 'Ngôn ngữ lập trình bất đồng bộ đơn luồng giúp trang web có khả năng tương tác linh hoạt.',
    analogyOrExample: '⚡ Ví dụ: Bấm nút gửi form, hiển thị thông báo, gửi request API realtime.',
    level: 'Junior',
  },
  react: {
    key: 'react',
    aliases: ['react', 'reactjs'],
    title: 'ReactJS (Thư viện UI dựa trên Component)',
    category: 'React Ecosystem',
    simpleExplanation: 'Thư viện JavaScript mã nguồn mở của Meta giúp xây dựng giao diện người dùng theo mô hình Component tái sử dụng và Virtual DOM.',
    analogyOrExample: '⚛️ Đặc trưng: State-driven UI – Giao diện tự động cập nhật mỗi khi State thay đổi.',
    level: 'Junior',
  },
  typescript: {
    key: 'typescript',
    aliases: ['typescript', 'ts'],
    title: 'TypeScript (Type-Safe JS)',
    category: 'Frontend Foundations',
    simpleExplanation: 'Superset của JavaScript bổ sung hệ thống kiểu tĩnh (Static Typing), giúp phát hiện lỗi sai ngay trong quá trình gõ code.',
    analogyOrExample: '🛡️ Ví dụ: `const name: string = "Alice";` ngăn chặn truyền nhầm số vào biến chuỗi.',
    level: 'Mid-level',
  },
  dom: {
    key: 'dom',
    aliases: ['dom', 'document object model'],
    title: 'DOM (Document Object Model)',
    category: 'Browser Engine',
    simpleExplanation: 'Cấu trúc cây đối tượng biểu diễn toàn bộ tài liệu HTML để JavaScript có thể truy cập, sửa đổi style hay nội dung.',
    analogyOrExample: '🌳 Ví dụ: `document.getElementById("btn").addEventListener("click", ...)`',
    level: 'Junior',
  },
  flexbox: {
    key: 'flexbox',
    aliases: ['flexbox', 'flex'],
    title: 'CSS Flexbox (Flexible Box Layout)',
    category: 'CSS Layout',
    simpleExplanation: 'Mô hình bố cục 1 chiều (theo dòng hoặc cột) giúp sắp xếp và căn chỉnh khoảng cách phần tử cực kỳ linh hoạt.',
    analogyOrExample: '📐 Căn giữa hoàn toàn: `display: flex; justify-content: center; align-items: center;`',
    level: 'Junior',
  },
  grid: {
    key: 'grid',
    aliases: ['css grid', 'grid layout'],
    title: 'CSS Grid Layout',
    category: 'CSS Layout',
    simpleExplanation: 'Mô hình bố cục 2 chiều (gồm cả hàng lẫn cột) mạnh mẽ nhất để dựng khung layout phức tạp.',
    analogyOrExample: '🏁 Cú pháp: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;`',
    level: 'Junior',
  },
  microtask: {
    key: 'microtask',
    aliases: ['microtask', 'microtasks', 'microtask queue'],
    title: 'Microtask Queue (Hàng đợi vi tác vụ)',
    category: 'JS Engine & Event Loop',
    simpleExplanation: 'Hàng đợi có ĐỘ ƯU TIÊN CAO NHẤT trong JavaScript. Khi Call Stack trống, JS Engine sẽ chạy SẠCH TẤT CẢ Microtask trước rồi mới tới Macrotask.',
    analogyOrExample: '⚡ VIP Queue: Promise.then, queueMicrotask luôn chạy trước setTimeout.',
    level: 'Mid-level',
  },
  macrotask: {
    key: 'macrotask',
    aliases: ['macrotask', 'macrotasks', 'task queue'],
    title: 'Macrotask Queue (Hàng đợi tác vụ thông thường)',
    category: 'JS Engine & Event Loop',
    simpleExplanation: 'Hàng đợi các sự kiện lớn như setTimeout, setInterval, I/O. Chỉ được thực thi 1 task ở mỗi cycle sau khi Microtask rỗng.',
    analogyOrExample: '⏱️ Ví dụ: setTimeout(..., 0) phải chờ toàn bộ Promise.then trong Microtask Queue hoàn thành.',
    level: 'Mid-level',
  },
  closure: {
    key: 'closure',
    aliases: ['closure', 'closures'],
    title: 'Closure (Bao đóng phạm vi)',
    category: 'JavaScript Core',
    simpleExplanation: 'Khả năng một hàm con "ghi nhớ" và truy cập các biến ở hàm cha (Lexical Scope) ngay cả khi hàm cha đã chạy xong.',
    analogyOrExample: '🎒 Chiếc balo kỷ niệm: Dù hàm cha đã kết thúc, hàm con vẫn mang theo chiếc balo chứa biến bên mình.',
    level: 'Junior',
  },
  eventloop: {
    key: 'eventloop',
    aliases: ['event loop', 'eventloop'],
    title: 'Event Loop (Vòng lặp sự kiện)',
    category: 'JS Runtime',
    simpleExplanation: 'Trái tim giúp JS (đơn luồng Single-thread) xử lý bất đồng bộ mà không bị treo. Liên tục kiểm tra Call Stack và rút task từ Queue.',
    analogyOrExample: '🔄 Điều phối giao thông: Liên tục đưa các callback ready vào Call Stack thực thi.',
    level: 'Mid-level',
  },
  hoisting: {
    key: 'hoisting',
    aliases: ['hoisting'],
    title: 'Hoisting (Kéo khai báo lên đầu)',
    category: 'JavaScript Core',
    simpleExplanation: 'Cơ chế JS Engine tự động kéo phần khai báo của hàm (`function`) và biến (`var`) lên đầu phạm vi (scope) trước khi chạy.',
    analogyOrExample: '⚠️ `var` được gán undefined, còn `let` & `const` bị khóa trong Temporal Dead Zone (TDZ).',
    level: 'Junior',
  },
  debounce: {
    key: 'debounce',
    aliases: ['debounce', 'debouncing'],
    title: 'Debounce (Hoãn thực thi)',
    category: 'Web Performance',
    simpleExplanation: 'Kỹ thuật hoãn việc gọi một hàm cho tới khi người dùng NGỪNG thao tác sau một khoảng thời gian chờ chỉ định.',
    analogyOrExample: '🔍 Ô tìm kiếm Autocomplete: Chỉ gọi API khi người dùng dừng gõ phím 300ms.',
    level: 'Mid-level',
  },
  throttle: {
    key: 'throttle',
    aliases: ['throttle', 'throttling'],
    title: 'Throttle (Giới hạn tần suất)',
    category: 'Web Performance',
    simpleExplanation: 'Kỹ thuật giới hạn hàm chỉ được gọi TỐI ĐA 1 lần trong mỗi khoảng thời gian cố định.',
    analogyOrExample: '📜 Khi cuộn trang (Scroll event) hoặc resize cửa sổ trình duyệt.',
    level: 'Mid-level',
  },
  virtuallist: {
    key: 'virtuallist',
    aliases: ['virtual list', 'virtual windowing', 'virtualization'],
    title: 'Virtual List / Windowing (Danh sách ảo)',
    category: 'Web Performance',
    simpleExplanation: 'Kỹ thuật chỉ tạo và render khoảng 20-30 phần tử HTML nằm trong vùng nhìn thấy (Viewport) cho 100,000+ phần tử.',
    analogyOrExample: '📱 Bảng tin TikTok/Facebook lướt vô tận mà bộ nhớ RAM vẫn siêu nhẹ.',
    level: 'Senior',
  },
  xss: {
    key: 'xss',
    aliases: ['xss', 'cross-site scripting'],
    title: 'XSS - Cross-Site Scripting',
    category: 'Web Security',
    simpleExplanation: 'Lỗ hổng khi hacker chèn mã JS độc hại vào trang web để đánh cắp Cookie / Session Token của người dùng.',
    analogyOrExample: '🛡️ Phòng chống: Dùng DOMPurify làm sạch HTML trước khi render.',
    level: 'Senior',
  },
  csrf: {
    key: 'csrf',
    aliases: ['csrf', 'cross-site request forgery'],
    title: 'CSRF - Cross-Site Request Forgery',
    category: 'Web Security',
    simpleExplanation: 'Lỗ hổng khi trang web độc hại lừa trình duyệt người dùng tự động gửi yêu cầu giả mạo bằng Cookie có sẵn.',
    analogyOrExample: '🛡️ Phòng chống: Dùng CSRF Token & Cookie `SameSite=Strict`.',
    level: 'Senior',
  },
  csp: {
    key: 'csp',
    aliases: ['csp', 'content security policy'],
    title: 'Content Security Policy (CSP)',
    category: 'Web Security',
    simpleExplanation: 'HTTP Header quy định rõ những nguồn domain tin cậy nào trình duyệt mới được phép tải script, css, img.',
    analogyOrExample: '🛡️ Ví dụ: `Content-Security-Policy: default-src \'self\'`',
    level: 'Senior',
  },
  usememo: {
    key: 'usememo',
    aliases: ['usememo'],
    title: 'useMemo Hook',
    category: 'React Optimization',
    simpleExplanation: 'Hook của React giúp ghi nhớ (cache) KẾT QUẢ của phép tính phức tạp để không phải tính lại khi re-render.',
    analogyOrExample: '💡 `const val = useMemo(() => slowCompute(a), [a]);`',
    level: 'Mid-level',
  },
  usecallback: {
    key: 'usecallback',
    aliases: ['usecallback'],
    title: 'useCallback Hook',
    category: 'React Optimization',
    simpleExplanation: 'Hook giúp ghi nhớ BẢN THÂN ĐỊNH NGHĨA HÀM để tránh tạo instance mới ở mỗi lần re-render.',
    analogyOrExample: '💡 `const onClick = useCallback(() => doWork(), []);`',
    level: 'Mid-level',
  },
  corewebvitals: {
    key: 'corewebvitals',
    aliases: ['core web vitals', 'web vitals', 'lcp', 'cls', 'inp'],
    title: 'Core Web Vitals',
    category: 'Web Performance',
    simpleExplanation: '3 chỉ số chuẩn Google: LCP (Tải nội dung <2.5s), INP (Phản hồi tương tác <200ms), CLS (Độ giật bố cục <0.1).',
    analogyOrExample: '🚀 Quyết định thứ hạng xếp loại SEO trang web trên Google Search.',
    level: 'Senior',
  },
  specificity: {
    key: 'specificity',
    aliases: ['specificity', 'css specificity'],
    title: 'CSS Specificity (Độ ưu tiên CSS)',
    category: 'CSS Architecture',
    simpleExplanation: 'Quy tắc tính điểm trọng số của trình duyệt để quyết định style nào thắng và áp dụng cho HTML.',
    analogyOrExample: '📊 Trọng số: Inline (1000) > ID #nav (100) > Class .btn (10) > Element div (1).',
    level: 'Junior',
  },
  bfc: {
    key: 'bfc',
    aliases: ['bfc', 'block formatting context'],
    title: 'Block Formatting Context (BFC)',
    category: 'CSS Layout',
    simpleExplanation: 'Vùng bố cục độc lập giúp bao bọc phần tử float và chống hiện tượng gộp lề margin collapse.',
    analogyOrExample: '🎨 Tạo BFC chuẩn nhất: `display: flow-root;`',
    level: 'Junior',
  },
  modulefederation: {
    key: 'modulefederation',
    aliases: ['module federation', 'micro-frontends', 'micro frontends'],
    title: 'Module Federation & Micro-Frontends',
    category: 'Frontend Architecture',
    simpleExplanation: 'Kiến trúc cho phép nhiều ứng dụng FE độc lập tải và chia sẻ trực tiếp Component/Route với nhau tại Runtime.',
    analogyOrExample: '🏢 Host App tải động các Micro-App Remote khi người dùng chuyển trang.',
    level: 'Architect',
  },
  statenormalization: {
    key: 'statenormalization',
    aliases: ['state normalization', 'normalization'],
    title: 'State Normalization (Chuẩn hóa State)',
    category: 'State Management',
    simpleExplanation: 'Tổ chức state theo cấu trúc từ điển { byId, allIds } giúp truy cập và cập nhật dữ liệu với độ phức tạp O(1).',
    analogyOrExample: '⚡ Giúp Dashboard Realtime nhận hàng ngàn message mà không bị đơ giật.',
    level: 'Architect',
  }
};

export function findTermDefinition(word: string): TermDefinition | undefined {
  const clean = word.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '');
  if (!clean) return undefined;

  for (const key in TERM_DICTIONARY) {
    const term = TERM_DICTIONARY[key];
    if (term.key === clean || term.aliases.some(alias => alias === clean)) {
      return term;
    }
  }
  return undefined;
}

// Compile exact Regex of all dictionary terms for clean text parsing
const allAliases = Array.from(
  new Set(
    Object.values(TERM_DICTIONARY).flatMap(t => [t.key, ...t.aliases])
  )
).sort((a, b) => b.length - a.length);

export const KNOWN_TERMS_REGEX = new RegExp(
  `\\b(${allAliases.map(a => a.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`,
  'gi'
);
