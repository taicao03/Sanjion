import { GoogleGenAI } from '@google/genai';
import { Question, DifficultyLevel, QuestionType } from '../types';

export interface AIEvaluationResult {
  score: number;
  verdict: 'Xuất sắc' | 'Đạt chuẩn' | 'Cần bổ sung' | 'Chưa đạt';
  strengths: string[];
  weaknesses: string[];
  seniorBestPractice: string;
  recommendedTopics?: string[];
  grillMeQuestions?: Array<{
    question: string;
    concept: string;
    hint: string;
  }>;
  rawFeedback: string;
}

export const aiService = {
  // Read Gemini models list dynamically from .env.local (VITE_GEMINI_MODELS)
  getGeminiModels(): string[] {
    const metaEnv = (import.meta as any).env;
    const envModels = (metaEnv && metaEnv.VITE_GEMINI_MODELS) ? metaEnv.VITE_GEMINI_MODELS.split(',') : [];
    const defaultModels = [
      'gemini-3.6-flash',
      'gemini-2.0-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
    ];
    const combined = [...envModels, ...defaultModels].map(m => m.trim()).filter(Boolean);
    return Array.from(new Set(combined));
  },

  // Read OpenAI model dynamically from .env.local (VITE_OPENAI_MODEL)
  getOpenAIModel(): string {
    const metaEnv = (import.meta as any).env;
    return (metaEnv && metaEnv.VITE_OPENAI_MODEL) ? metaEnv.VITE_OPENAI_MODEL.trim() : 'gpt-4o-mini';
  },

  // ✨ Get Active Model Name currently configured or selected ✨
  getActiveModelName(): string {
    const selected = localStorage.getItem('fe_selected_ai_model');
    if (selected && selected !== 'gemini-2.5-flash' && selected !== 'gemini-2.5-flash-lite') return selected;
    const geminiModels = this.getGeminiModels();
    if (geminiModels.length > 0) {
      return geminiModels[0];
    }
    return this.getOpenAIModel();
  },

  getSelectedModel(): string {
    return this.getActiveModelName();
  },

  setSelectedModel(modelName: string): void {
    if (modelName) {
      localStorage.setItem('fe_selected_ai_model', modelName.trim());
    }
  },

  getCustomModelsList(): string[] {
    try {
      const saved = localStorage.getItem('fe_custom_ai_models');
      const baseModels = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gpt-4o-mini'];
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.from(new Set([...parsed, ...baseModels]));
      }
      return baseModels;
    } catch (e) {
      return ['gemini-3.6-flash', 'gemini-2.0-flash', 'gpt-4o-mini'];
    }
  },

  addCustomAiModel(modelName: string): string[] {
    const list = this.getCustomModelsList();
    const cleaned = modelName.trim();
    if (cleaned && !list.includes(cleaned)) {
      list.unshift(cleaned);
      localStorage.setItem('fe_custom_ai_models', JSON.stringify(list));
    }
    return list;
  },

  // Parse and clean all Gemini keys from .env.local and localStorage
  getGeminiKeys(): string[] {
    const metaEnv = (import.meta as any).env;
    const envKeys = (metaEnv && metaEnv.VITE_GEMINI_API_KEY) ? metaEnv.VITE_GEMINI_API_KEY.split(',') : [];
    const localKey = localStorage.getItem('fe_gemini_api_key');
    const localKeys = localKey ? localKey.split(',') : [];

    const combined = [...localKeys, ...envKeys].map(k => k.trim()).filter(Boolean);
    return Array.from(new Set(combined.filter(k => !k.startsWith('sk-'))));
  },

  // Parse ChatGPT OpenAI keys (sk-...)
  getOpenAIKeys(): string[] {
    const metaEnv = (import.meta as any).env;
    const envKeys = (metaEnv && metaEnv.VITE_OPENAI_API_KEY) ? metaEnv.VITE_OPENAI_API_KEY.split(',') : [];
    const localKey = localStorage.getItem('fe_openai_api_key');
    const localKeys = localKey ? localKey.split(',') : [];

    const combined = [...localKeys, ...envKeys].map(k => k.trim()).filter(Boolean);
    return Array.from(new Set(combined.filter(k => k.startsWith('sk-'))));
  },

  getStoredApiKey(): string {
    const gemini = this.getGeminiKeys().join(', ');
    const openai = this.getOpenAIKeys().join(', ');
    return gemini || openai || '';
  },

  setStoredApiKey(geminiKey: string, openaiKey?: string) {
    if (geminiKey) localStorage.setItem('fe_gemini_api_key', geminiKey.trim());
    if (openaiKey) localStorage.setItem('fe_openai_api_key', openaiKey.trim());
  },

  formatAiError(err: any): string {
    const errStr = typeof err === 'string' ? err : err?.message || JSON.stringify(err);

    if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
      return '⚠️ Mô hình AI hiện tại chạm giới hạn Quota. Hệ thống đang tự động kết nối mô hình thay thế cấu hình trong .env.local!';
    }

    return `⚠️ Không thể kết nối tới Trợ Lý AI: ${errStr}`;
  },

  // ✨ ROBUST BULLETPROOF JSON PARSER & AUTOMATIC SANITIZER FOR LLM RESPONSES ✨
  safeParseAiJson(rawText: string): any {
    if (!rawText || !rawText.trim()) {
      throw new Error('Phản hồi từ AI rỗng.');
    }

    // 1. Strip markdown code fences ```json ... ``` or ``` ... ```
    let text = rawText.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // 2. Extract first `{` to last `}` if extra conversational text surrounds the JSON
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1);
    }

    // 3. Try standard JSON.parse first
    try {
      return JSON.parse(text);
    } catch (e1) {
      console.warn('⚠️ [safeParseAiJson]: Standard JSON.parse failed. Attempting control character sanitization...', e1);
    }

    // 4. Sanitize literal control characters (newlines, tabs, quotes) inside JSON string literals
    try {
      const sanitized = text.replace(/"((?:[^"\\]|\\.)*)"/gs, (_, strContent) => {
        const cleaned = strContent
          .replace(/\r\n/g, '\\n')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\n')
          .replace(/\t/g, '\\t')
          .replace(/[\x00-\x1F\x7F]/g, '');
        return `"${cleaned}"`;
      });
      return JSON.parse(sanitized);
    } catch (e2) {
      console.warn('⚠️ [safeParseAiJson]: Sanitized string parse failed. Attempting global control character repair...', e2);
    }

    // 5. Aggressive repair: replace unescaped control chars globally
    try {
      const aggressive = text
        .replace(/\r\n/g, '\\n')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/[\x00-\x1F\x7F]/g, '');
      return JSON.parse(aggressive);
    } catch (e3) {
      console.error('❌ [safeParseAiJson]: All parsing attempts failed.', e3);
      throw new Error(`Không thể parse JSON từ phản hồi AI: ${(e3 as Error).message}`);
    }
  },

  // ✨ RANDOM SHUFFLE OPTIONS ALGORITHM TO DISTRIBUTE CORRECT ANSWER RANDOM OVER A, B, C, D ✨
  shuffleOptions(options?: Array<{ id: string; text: string; is_correct: boolean }>) {
    if (!options || !Array.isArray(options) || options.length === 0) return undefined;
    const copied = [...options];
    for (let i = copied.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    // Re-assign IDs 'opt-a', 'opt-b', 'opt-c', 'opt-d' so they map cleanly to A, B, C, D
    return copied.map((opt, index) => ({
      ...opt,
      id: `opt-${String.fromCharCode(97 + index)}`
    }));
  },

  // ✨ DIRECT HTTP FETCH TO GEMINI REST API WITH HIGH CREATIVITY TEMPERATURE (0.95) ✨
  async callGeminiRestApi(prompt: string, apiKey: string): Promise<string> {
    const models = this.getGeminiModels();
    let lastErr: any = null;

    for (const modelName of models) {
      try {
        console.log(`🌐 [Gemini REST API]: Thử kết nối model ${modelName} từ .env.local...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.95,
              topP: 0.95,
              topK: 40
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log(`✅ [Gemini REST API]: Phản hồi thành công model ${modelName}!`);
            return text;
          }
        } else {
          const errBody = await response.text();
          console.warn(`⚠️ [Gemini REST API ${modelName}] HTTP ${response.status}:`, errBody);
          lastErr = new Error(`HTTP ${response.status}: ${errBody}`);
        }
      } catch (err: any) {
        console.warn(`⚠️ [Gemini REST API ${modelName}] Lỗi kết nối:`, err.message || err);
        lastErr = err;
      }
    }

    throw lastErr || new Error('Không thể kết nối Gemini REST API với tất cả các models trong .env.local');
  },

  // Direct fetch to OpenAI API
  async callOpenAI(prompt: string, apiKey: string): Promise<string> {
    const model = this.getOpenAIModel();
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  },

  // Helper to split and clean any single or comma-separated API key string
  cleanKeyArray(rawKeys?: string | string[]): string[] {
    if (!rawKeys) return [];
    const list = Array.isArray(rawKeys) ? rawKeys : rawKeys.split(',');
    return Array.from(new Set(list.map(k => k.trim()).filter(Boolean)));
  },

  // Key & Model Failover Rotation
  async callAIWithRotation(prompt: string, customApiKey?: string): Promise<string> {
    const parsedCustom = customApiKey ? this.cleanKeyArray(customApiKey) : [];

    const geminiKeys = parsedCustom.length > 0
      ? parsedCustom.filter(k => !k.startsWith('sk-'))
      : this.getGeminiKeys();

    const openAIKeys = parsedCustom.length > 0
      ? parsedCustom.filter(k => k.startsWith('sk-'))
      : this.getOpenAIKeys();

    if (geminiKeys.length === 0 && openAIKeys.length === 0) {
      throw new Error('MISSING_API_KEY: Chưa cấu hình Gemini API Key hoặc OpenAI Key.');
    }

    let lastError: any = null;

    // 1. Try Gemini REST API
    for (let i = 0; i < geminiKeys.length; i++) {
      const apiKey = geminiKeys[i];
      try {
        console.log(`🌐 [Gemini REST API]: Đang kết nối Key #${i + 1}/${geminiKeys.length}...`);
        const restText = await this.callGeminiRestApi(prompt, apiKey);
        if (restText) {
          return restText;
        }
      } catch (err: any) {
        console.warn(`⚠️ [Gemini REST API]: Key #${i + 1} lỗi:`, err.message || err);
        lastError = err;
      }

      // Try SDK fallback with active models
      const modelsToTry = this.getGeminiModels();
      for (const mName of modelsToTry) {
        try {
          console.log(`🤖 [Gemini SDK ${mName}]: Đang thử model ${mName}...`);
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: mName,
            contents: prompt,
            config: {
              temperature: 0.95,
            }
          });

          if (response && response.text) {
            console.log(`✅ [Gemini SDK ${mName}]: Phản hồi thành công!`);
            return response.text;
          }
        } catch (err: any) {
          lastError = err;
        }
      }
    }

    // 2. Failover to ChatGPT OpenAI API reading VITE_OPENAI_MODEL from .env.local
    for (let j = 0; j < openAIKeys.length; j++) {
      const openKey = openAIKeys[j];
      try {
        console.log(`🤖 [ChatGPT OpenAI]: Đang thử kết nối OpenAI Key #${j + 1}...`);
        const text = await this.callOpenAI(prompt, openKey);
        if (text) {
          console.log(`✅ [ChatGPT OpenAI]: Phản hồi thành công!`);
          return text;
        }
      } catch (err: any) {
        console.warn(`⚠️ [ChatGPT OpenAI]: Key #${j + 1} gặp lỗi:`, err.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error(`NO_WORKING_AI_KEY: Đã thử toàn bộ các mô hình Gemini (${this.getGeminiModels().join(', ')}) & ChatGPT (${this.getOpenAIModel()}) nhưng không thể kết nối.`);
  },

  // ✨ DYNAMIC & RIGOROUS AI EVALUATION ✨
  async evaluateTheoryAnswer(
    questionTitle: string,
    questionContent: string,
    userAnswer: string,
    customApiKey?: string
  ): Promise<AIEvaluationResult> {
    const prompt = `
Bạn là Giám Đốc Công Nghệ (CTO) & Principal Engineer chuyên phỏng vấn Frontend tại Google/Meta.
Hãy chấm điểm và nhận xét ĐẬM TÍNH CHUYÊN MÔN, ĐỘC LẬP VÀ CHÍNH XÁC 100% cho bài làm của ứng viên dưới đây.

ĐỀ BÀI CÂU HỎI:
- Tiêu đề: ${questionTitle}
- Chi tiết đề bài: ${questionContent}

BÀI LÀM CỦA ỨNG VIÊN:
"${userAnswer}"

YÊU CẦU ĐÁNH GIÁ NGHIÊM NGẠC:
1. Đánh giá tính chính xác về mặt kỹ thuật, cú pháp, hiệu năng, tư duy kiến trúc và các trường hợp biên (edge cases).
2. Tự tính toán điểm số chính xác (từ 0.0 đến 10.0) tương ứng với chất lượng bài làm thực tế.
3. Phân loại "verdict" dựa trên điểm:
   - score >= 9.0: "Xuất sắc"
   - 7.0 <= score < 9.0: "Đạt chuẩn"
   - 5.0 <= score < 7.0: "Cần bổ sung"
   - score < 5.0: "Chưa đạt"
4. Phân tích ít nhất 2 điểm mạnh ĐẶC THÙ trong bài làm này.
5. Chỉ ra cụ thể các lỗi sai, lỗ hổng tư duy hoặc kiến thức bị thiếu trong bài làm này.
6. Soạn một bài giải mẫu chuẩn Senior Principal Engineer (có code / markdown minh họa).
7. Chỉ ra 2-3 từ khóa/chủ đề cần ôn luyện lại trong "recommendedTopics" (ví dụ: ["Guard Clause", "Array Methods", "Defensive Programming"]).
8. Tạo 2-3 câu hỏi phỏng vấn chuyên sâu trong "grillMeQuestions" (/grill-me) xoáy sâu ĐÚNG VÀO CÁC LỖI SAI hoặc lỗ hổng tư duy mà ứng viên vừa mắc phải trong bài nộp này.

Trả về kết quả duy nhất ở dạng JSON hợp lệ (không kèm bất kỳ văn bản ngoài):
{
  "score": 8.5,
  "verdict": "Đạt chuẩn",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "seniorBestPractice": "...",
  "recommendedTopics": ["Guard Clause", "Array Methods", "Defensive Programming"],
  "grillMeQuestions": [
    {
      "question": "Tại sao mệnh đề 'if (Array.isArray(numbers)) return [];' lại bị đảo ngược logic khi kiểm tra kiểu dữ liệu mảng?",
      "concept": "Guard Clause & Logic Control",
      "hint": "Guard Clause cần kiểm tra điều kiện SAI (!Array.isArray(numbers)) để return sớm, thay vì return khi mảng HỢP LỆ."
    },
    {
      "question": "Trong JavaScript, sự khác biệt giữa cú pháp gọi hàm 'numbers.filter(...)' và 'filter(...)' standalone là gì?",
      "concept": "Method Invocation vs Standalone Function Call",
      "hint": "'filter' là một method nằm trên Array.prototype, không phải hàm tự do toàn cục trừ khi tự định nghĩa."
    }
  ]
}
`;

    try {
      const text = await this.callAIWithRotation(prompt, customApiKey);
      const parsed = this.safeParseAiJson(text);

      const calculatedScore = typeof parsed.score === 'number' ? Math.min(10, Math.max(0, parsed.score)) : 7.0;
      let calculatedVerdict: AIEvaluationResult['verdict'] = 'Đạt chuẩn';
      if (calculatedScore >= 9.0) calculatedVerdict = 'Xuất sắc';
      else if (calculatedScore >= 7.0) calculatedVerdict = 'Đạt chuẩn';
      else if (calculatedScore >= 5.0) calculatedVerdict = 'Cần bổ sung';
      else calculatedVerdict = 'Chưa đạt';

      // Fallback topics & grill-me questions if AI JSON missed them
      const fallbackTopics = ['Guard Clause', 'Array Methods', 'Defensive Programming', 'Type Checking'];
      const fallbackGrillQuestions = [
        {
          question: `Phân tích nguyên lý Guard Clause và tại sao điều kiện \`if (!Array.isArray(arr))\` lại giúp bảo vệ hàm khỏi Runtime Error?`,
          concept: 'Guard Clause & Type Safety',
          hint: 'Guard Clause trả về giá trị mặc định sớm khi dữ liệu không hợp lệ, giữ cho luồng chính không bị lồng ghép (nesting) phức tạp.'
        },
        {
          question: `Khi thao tác với mảng lớn trong JavaScript, việc chaining nhiều phương thức \`filter().map()\` ảnh hưởng thế nào đến hiệu năng so với 1 vòng lặp \`reduce()\`?`,
          concept: 'Array Iteration Performance',
          hint: '\`filter().map()\` sẽ tạo ra mảng trung gian và duyệt mảng 2 lần (O(2N)), trong khi \`reduce()\` chỉ duyệt 1 lần (O(N)).'
        }
      ];

      return {
        score: calculatedScore,
        verdict: parsed.verdict || calculatedVerdict,
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 
          ? parsed.strengths 
          : ['Bài làm thể hiện được ý tưởng ban đầu.'],
        weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0 
          ? parsed.weaknesses 
          : ['Cần giải thích rõ ràng hơn về nguyên lý hoạt động.'],
        seniorBestPractice: parsed.seniorBestPractice || 'Xem đáp án trong tab Lời Giải Mẫu.',
        recommendedTopics: Array.isArray(parsed.recommendedTopics) && parsed.recommendedTopics.length > 0
          ? parsed.recommendedTopics
          : fallbackTopics,
        grillMeQuestions: Array.isArray(parsed.grillMeQuestions) && parsed.grillMeQuestions.length > 0
          ? parsed.grillMeQuestions
          : fallbackGrillQuestions,
        rawFeedback: text,
      };
    } catch (err: any) {
      const formattedErrorMsg = this.formatAiError(err);
      throw new Error(formattedErrorMsg);
    }
  },

  // ✨ GENERATE 100% VALID, CATEGORY-MATCHED & HIGHLY SPECIFIC QUESTIONS ✨
  async generateQuestionWithAI(
    categoryId: string,
    categoryName: string,
    difficulty: DifficultyLevel,
    type: QuestionType,
    topicHint?: string,
    customApiKey?: string
  ): Promise<Question> {
    const randomSeed = Math.random().toString(36).substring(7);
    const timeStamp = Date.now();

    // Category-Aware Real World Scenarios to prevent Mismatches (e.g. WebSocket on HTML/CSS)
    const categoryScenarios: Record<string, string[]> = {
      'cat-html-css': [
        'Tối ưu hóa BFC (Block Formatting Context) & Margin Collapse cho Shopee Layout',
        'Thiết kế Responsive Masonry Grid bằng Pure CSS & Aspect Ratio',
        'Tối ưu hóa Core Web Vitals (CLS & LCP) cho trang landing page Lazada',
        'Xây dựng Dark Mode Theme bằng CSS Custom Properties & prefers-color-scheme'
      ],
      'cat-js-core': [
        'Triển khai hàm Deep Clone Object xử lý Circular Reference',
        'Tạo Module Pattern ghi nhớ Lexical Scope & Closure bảo mật thông tin',
        'Viết Polyfill Array.prototype.flat / reduce cho trình duyệt cũ'
      ],
      'cat-async-js': [
        'Triển khai Polyfill Promise.allSettled & cơ chế Auto-Retry HTTP Call',
        'Phân tích Event Loop Microtask vs Macrotask trong hệ thống Binance'
      ],
      'cat-react-hooks': [
        'Viết Custom Hook useLocalStorage đồng bộ dữ liệu giữa nhiều tab',
        'Tối ưu Virtualized Scroll 100,000 dòng dữ liệu cho Meta Newsfeed',
        'Ngăn ngừa Re-render lặp bằng useCallback & React.memo'
      ],
      'cat-typescript': [
        'Xây dựng Utility Type DeepReadonly & Type Guards kiểm tra dữ liệu',
        'Triển khai Generic Repository Pattern trong dự án Enterprise TypeScript'
      ],
      'cat-performance-sec': [
        'Phòng chống tấn công XSS & cấu hình Content Security Policy (CSP)',
        'Tối ưu Bundle Size bằng Dynamic Import & Route-based Code Splitting'
      ]
    };

    const scenariosForCategory = categoryScenarios[categoryId] || [
      `Phân tích & triển khai giải pháp thực tế cho chủ đề ${categoryName}`
    ];
    const chosenScenario = scenariosForCategory[Math.floor(Math.random() * scenariosForCategory.length)];

    const difficultyGuide = {
      'EASY': 'CẤP ĐỘ DỄ (EASY / JUNIOR): Kiểm tra kiến thức nền tảng cơ bản, khai báo biến, cú pháp đơn giản.',
      'MEDIUM': 'CẤP ĐỘ TRUNG BÌNH (MEDIUM / MID-LEVEL): Đòi hỏi tư duy Closure, Polyfill mảng, Custom Hook, Event Loop.',
      'HARD': 'CẤP ĐỘ KHÓ (HARD / SENIOR): Thử thách cao với Debounce/Throttle phức tạp, Custom Promise, AbortController, Fiber Tree.',
      'EXPERT': 'CẤP ĐỘ SIÊU KHÓ (EXPERT / PRINCIPAL ARCHITECT): Đề bài cực kỳ thử thách về System Design, Custom Virtual Scroll, Micro-Frontends, State Scheduler, Memory Leak & Performance Tuning.'
    }[difficulty];

    // Strict constraints per QuestionType
    const typeInstructions = {
      'MULTIPLE_CHOICE': `
YÊU CẦU BẮT BUỘC CHO BÀI TRẮC NGHIỆM (MULTIPLE_CHOICE):
1. BẮT BUỘC trả về mảng "options" chứa ĐÚNG 4 lựa chọn (trong đó CÓ ĐÚNG 1 LỰA CHỌN có "is_correct": true).
2. Vị trí của đáp án đúng "is_correct": true PHẢI ĐƯỢC ĐẶT NGẪU NHIÊN.
3. CÁC ĐÁP ÁN ĐỀU PHẢI CHỨA NỘI DUNG KỸ THUẬT RÕ RÀNG (KHÔNG DÙNG CÂU CHUNG CHUNG NGUYÊN MẪU).
4. TUYỆT ĐỐI KHÔNG TRẢ VỀ "starterCode" HAY "testCases"!
`,
      'THEORY': `
YÊU CẦU BẮT BUỘC CHO BÀI LÝ THUYẾT (THEORY):
1. BẮT BUỘC ĐẶT CÂU HỎI PHÂN TÍCH CỤ THỂ, RÕ RÀNG VỀ KHÁI NIỆM / NGUYÊN LÝ KỸ THUẬT THUỘC CHỦ ĐỀ "${categoryName}".
2. NỘI DUNG ĐỀ BÀI (content) PHẢI GỒM Ý NGHĨA KỸ THUẬT, CÁC CÂU HỎI NHỎ CẦN TRẢ LỜI VÀ YÊU CẦU NÊU VÍ DỤ MINH HỌA.
3. TUYỆT ĐỐI KHÔNG TRẢ VỀ CÂU CHUNG CHUNG KÍỂU "Phân tích tình huống cho chủ đề X".
4. TUYỆT ĐỐI KHÔNG TRẢ VỀ "options", "starterCode" HAY "testCases"!
`,
      'CODING_PRACTICE': `
YÊU CẦU BẮT BUỘC CHO BÀI THỰC HÀNH CODING (CODING_PRACTICE):
1. BẮT BUỘC trả về "starterCode" chứa khung hàm và mảng "testCases" chứa các câu lệnh kiểm thử tự động.
2. TUYỆT ĐỐI KHÔNG TRẢ VỀ mảng "options"!
3. CỰC KỲ QUAN TRỌNG VỀ "starterCode": "starterCode" BẮT BUỘC ĐỂ TRỐNG HOÀN TOÀN ("") KHÔNG ĐƯỢC CHỨA BẤT KỲ MÃ NGUỒN HAY LỜI GIẢI NÀO (lời giải đầy đủ chỉ nằm trong "explanation")!
`
    }[type];

    const prompt = `
Bạn là Giám Đốc Công Nghệ (CTO) & Principal Engineer hàng đầu tại Big Tech (Google, Meta, Shopee).
Hãy tạo một bài tập Sanjion Frontend HOÀN TOÀN MỚI 100% ĐỘC ĐÁO CHUẨN XÁC KỸ THUẬT (Random Seed: ${randomSeed}-${timeStamp}):

YÊU CẦU LOẠI BÀI TẬP BẮT BUỘC: ${type}
${typeInstructions}

YÊU CẦU BẮT BUỘC KHỚP NỘI DUNG CHỦ ĐỀ:
1. Chủ đề: ${categoryName} (BẮT BUỘC MỌI CÂU HỎI PHẢI THUỘC CHỦ ĐỀ NÀY)
2. Kịch bản minh họa: "${chosenScenario}".
3. Cấp độ độ khó: ${difficulty} (${difficultyGuide})
4. Từ khóa gợi ý bổ sung: ${topicHint || 'Kịch bản thực tế nâng cao'}

YÊU CẦU ĐỊNH DẠNG MÃ NGUỒN TRONG ĐỀ BÀI (BẮT BUỘC):
- BỌC TOÀN BỘ CÁC ĐOẠN MÃ JAVASCRIPT / REACT TRONG TRƯỜNG "content" BẰNG KHỐI MARKDOWN CODE BLOCK: \`\`\`javascript ... \`\`\`
- TUYỆT ĐỐI KHÔNG ĐỂ CODE JSX RƠI RÃI RA NGOÀI KHỐI MARKDOWN.

Trả về duy nhất JSON hợp lệ có dạng:
{
  "title": "<Tiêu đề bài tập ngắn gọn độc đáo>",
  "content": "<Nội dung câu hỏi chi tiết, chuyên sâu chuẩn Senior dạng Markdown>",
  "explanation": "<Lời giải chi tiết và Best Practice Senior>",
  "options": [
    { "id": "a", "text": "<Nội dung đáp án A chuẩn kỹ thuật>", "is_correct": false },
    { "id": "b", "text": "<Nội dung đáp án B chuẩn kỹ thuật>", "is_correct": true },
    { "id": "c", "text": "<Nội dung đáp án C chuẩn kỹ thuật>", "is_correct": false },
    { "id": "d", "text": "<Nội dung đáp án D chuẩn kỹ thuật>", "is_correct": false }
  ],
  "starterCode": "function solution() { }",
  "testCases": [ { "input": "solution()", "expected": true } ],
  "points": ${difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 15 : difficulty === 'HARD' ? 25 : 35},
  "tags": ["Sanjion", "${categoryName}", "${difficulty}"]
}
`;

    try {
      const text = await this.callAIWithRotation(prompt, customApiKey);
      const parsed = this.safeParseAiJson(text);

      const uniqueId = `ai-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const isQuiz = type === 'MULTIPLE_CHOICE';
      const isTheory = type === 'THEORY';

      const rawOptions = isQuiz ? (Array.isArray(parsed.options) && parsed.options.length >= 2 ? parsed.options : [
        { id: 'opt-a', text: 'Khởi tạo useCallback bọc callback function và truyền mảng dependency phù hợp.', is_correct: true },
        { id: 'opt-b', text: 'Chuyển callback function ra ngoài phạm vi Component làm biến toàn cục.', is_correct: false },
        { id: 'opt-c', text: 'Bọc toàn bộ Component cha trong React.memo.', is_correct: false },
        { id: 'opt-d', text: 'Sử dụng useLayoutEffect thay cho useEffect.', is_correct: false },
      ]) : undefined;

      return {
        id: uniqueId,
        categoryId,
        title: parsed.title || `[${difficulty}] Bài tập ${isQuiz ? 'Trắc Nghiệm' : isTheory ? 'Lý Thuyết' : 'Coding'} ${categoryName} (#${uniqueId.slice(-4)})`,
        slug: `ai-question-${uniqueId}`,
        difficulty: difficulty,
        type: type, // 100% PRESERVES SELECTED TYPE
        content: parsed.content || 'Nội dung bài tập được sáng tạo tự động bởi AI.',
        explanation: parsed.explanation || 'Lời giải chi tiết chuẩn Senior Sanjioner.',
        options: this.shuffleOptions(rawOptions), // ✨ RANDOMLY SHUFFLES A, B, C, D ✨
        starterCode: !isQuiz && !isTheory ? (parsed.starterCode || 'function solution() {\n  // Triển khai mã nguồn tại đây\n}') : undefined,
        testCases: !isQuiz && !isTheory ? (parsed.testCases || [{ input: 'return true;', expected: true }]) : undefined,
        points: parsed.points || (difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 15 : difficulty === 'HARD' ? 25 : 35),
        viewCount: 1,
        createdAt: new Date().toISOString().split('T')[0],
        tags: ['AI', 'Sanjion', difficulty, type],
      };
    } catch (err: any) {
      console.warn('AI Question Generator Dynamic Fallback Triggered:', err);

      const isQuiz = type === 'MULTIPLE_CHOICE';
      const isTheory = type === 'THEORY';
      const uniqueFallbackId = `ai-matrix-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // ✨ CATEGORY-SPECIFIC RICH TECHNICAL THEORY FALLBACK BANK (100% VALID & SPECIFIC) ✨
      const theoryFallbacksByCategory: Record<string, Array<{ title: string; content: string; explanation: string }>> = {
        'cat-html-css': [
          {
            title: `[${difficulty}] HTML & CSS: Phân tích nguyên lý Block Formatting Context (BFC)`,
            content: `### Đề bài Lý thuyết CSS: Block Formatting Context (BFC)\n\n1. Trình bày nguyên lý hoạt động của **Block Formatting Context (BFC)** trong CSS.\n2. Phân tích ít nhất 3 trường hợp thực tế cần tạo BFC (chống Margin Collapse, bao bọc phần tử floated, ngăn text trôi bao quanh float).\n3. Đưa ra các thuộc tính CSS có thể khởi tạo một BFC mới (ví dụ: \`display: flow-root\`, \`overflow: hidden\`).`,
            explanation: `### Lời giải chi tiết BFC:\nBFC là một vùng bố cục độc lập trong trang web nơi các khối phần tử được xếp chồng theo chiều dọc. Tạo BFC bằng \`display: flow-root\` là giải pháp hiện đại và sạch nhất để clear float và chống margin collapse.`
          },
          {
            title: `[${difficulty}] HTML & CSS: Tối ưu hóa chỉ số Cumulative Layout Shift (CLS)`,
            content: `### Đề bài Lý thuyết Performance CSS: Cumulative Layout Shift (CLS)\n\n1. Giải thích nguyên nhân khiến chỉ số **CLS (Cumulative Layout Shift)** bị kém trên các trang web chứa nhiều hình ảnh và quảng cáo banner.\n2. Kỹ thuật sử dụng thuộc tính \`aspect-ratio\` hoặc thiết lập kích thước \`width\` & \`height\` trong HTML/CSS giúp trình duyệt dành sẵn khoảng trống (Layout Reservation) như thế nào?`,
            explanation: `### Lời giải chi tiết CLS:\nKhai báo \`width\` và \`height\` hoặc \`aspect-ratio\` trên thẻ \`<img>\` giúp trình duyệt tính toán trước tỉ lệ khung hình (Aspect Ratio) và dành sẵn diện tích khi chưa tải xong ảnh, ngăn hiện tượng giật đẩy bố cục.`
          }
        ],
        'cat-react-hooks': [
          {
            title: `[${difficulty}] ReactJS: So sánh useEffect vs useLayoutEffect`,
            content: `### Đề bài Lý thuyết React Lifecycle: useEffect vs useLayoutEffect\n\n1. Phân tích sự khác biệt về thời điểm thực thi của \`useEffect\` và \`useLayoutEffect\` trong chu kỳ render của React.\n2. Trong trường hợp nào việc dùng \`useEffect\` để cập nhật DOM hoặc đo đạc vị trí phần tử sẽ gây ra hiện tượng giật nháy giao diện (Flickering)?\n3. Tại sao \`useLayoutEffect\` lại giải quyết triệt để được vấn đề trên?`,
            explanation: `### Lời giải chi tiết:\n\`useLayoutEffect\` thực thi đồng bộ ngay sau khi DOM mutation nhưng trước khi trình duyệt thực hiện thao tác Paint. Vì vậy các thay đổi DOM trong \`useLayoutEffect\` được vẽ cùng lúc với lần render ban đầu, tránh giật nháy.`
          }
        ],
        'cat-js-core': [
          {
            title: `[${difficulty}] JavaScript Core: Khái niệm Closure & Lexical Scope`,
            content: `### Đề bài Lý thuyết JS Core: Closure & Memory Management\n\n1. Định nghĩa khái niệm **Closure** trong JavaScript.\n2. Giải thích cơ chế ghi nhớ Lexical Scope khi một hàm con được trả về từ một hàm cha.\n3. Trình bày trường hợp Closure có thể gây ra hiện tượng rò rỉ bộ nhớ (Memory Leak) nếu giữ lại tham chiếu đến các đối tượng DOM lớn không cần thiết.`,
            explanation: `### Lời giải chi tiết:\nClosure xảy ra khi một hàm giữ lại tham chiếu đến môi trường từ vựng (lexical environment) nơi nó được sinh ra. Để tránh Memory Leak, cần gán \`null\` cho biến closure khi không còn sử dụng.`
          }
        ]
      };

      const categoryTheoryPool = theoryFallbacksByCategory[categoryId] || [
        {
          title: `[${difficulty}] ${categoryName}: Phân tích Kiến trúc & Tối ưu hiệu năng`,
          content: `### Đề bài Lý thuyết Frontend: Tối ưu hiệu năng & Nguyên lý thiết kế cho ${categoryName}\n\n1. Trình bày các vấn đề về hiệu năng và bộ nhớ thường gặp khi phát triển ứng dụng Frontend thuộc chủ đề **${categoryName}**.\n2. Phân tích các giải pháp Best Practice Senior giúp tối ưu thời gian tải trang và trải nghiệm người dùng.`,
          explanation: `### Lời giải chi tiết:\nÁp dụng các kỹ thuật Code Splitting, Lazy Loading, Memoization và dọn dẹp các Event Listener khi unmount.`
        }
      ];

      const selectedTheory = categoryTheoryPool[Math.floor(Math.random() * categoryTheoryPool.length)];

      // Technical Quiz pool
      const realQuizPool = [
        {
          title: `[${difficulty}] ${categoryName}: Quản lý Re-render và Memoization trong React`,
          content: `Trong ReactJS, khi truyền một callback function làm prop cho một Component con được bọc bởi \`React.memo\`, kỹ thuật nào giúp ngăn ngừa Component con bị re-render không cần thiết mỗi khi Component cha re-render?`,
          explanation: `### Sử dụng useCallback trong React:\n\`useCallback\` giúp ghi nhớ (cache) định nghĩa hàm và giữ nguyên tham chiếu (reference) của callback giữa các lần re-render. Khi kết hợp với \`React.memo\`, Component con sẽ không bị re-render thừa.`,
          options: [
            { id: 'q1-1', text: 'Bọc callback function bằng hook useCallback và truyền mảng dependency phù hợp.', is_correct: true },
            { id: 'q1-2', text: 'Khai báo callback function bên trong useEffect hook.', is_correct: false },
            { id: 'q1-3', text: 'Chuyển callback function thành một biến toàn cục ngoài Component.', is_correct: false },
            { id: 'q1-4', text: 'Sử dụng useMemo bọc lại toàn bộ JSX của Component cha.', is_correct: false },
          ]
        },
        {
          title: `[${difficulty}] ${categoryName}: Phân biệt Event Loop Microtask vs Macrotask`,
          content: `Đoạn mã JavaScript bất đồng bộ dưới đây chứa cả \`setTimeout(..., 0)\` và \`Promise.resolve().then(...)\`. Thứ tự ưu tiên thực thi trong Event Loop Engine là gì?`,
          explanation: `### Microtask vs Macrotask trong JS:\n- **Microtask Queue** (Promise, queueMicrotask) có độ ưu tiên cao hơn và sẽ rút cạn toàn bộ hàng đợi trước khi chuyển sang Macrotask.\n- **Macrotask Queue** (setTimeout, setInterval) chỉ được thực thi ở mỗi cycle tiếp theo của Event Loop.`,
          options: [
            { id: 'q2-1', text: 'Callback trong Promise.then (Microtask) luôn thực thi trước setTimeout (Macrotask).', is_correct: true },
            { id: 'q2-2', text: 'setTimeout(..., 0) luôn chạy trước vì có tham số thời gian 0ms.', is_correct: false },
            { id: 'q2-3', text: 'Thứ tự thực thi hoàn toàn ngẫu nhiên phụ thuộc vào số nhân CPU.', is_correct: false },
            { id: 'q2-4', text: 'Cả hai được đẩy sang Web Worker để chạy song song 2 luồng.', is_correct: false },
          ]
        }
      ];

      const selectedQuiz = realQuizPool[Math.floor(Math.random() * realQuizPool.length)];

      return {
        id: uniqueFallbackId,
        categoryId,
        title: isQuiz ? selectedQuiz.title : selectedTheory.title,
        slug: `ai-question-${uniqueFallbackId}`,
        difficulty,
        type: type, // 100% PRESERVES SELECTED TYPE
        content: isQuiz ? selectedQuiz.content : selectedTheory.content,
        explanation: isQuiz ? selectedQuiz.explanation : selectedTheory.explanation,
        options: isQuiz ? this.shuffleOptions(selectedQuiz.options) : undefined,
        starterCode: !isQuiz && !isTheory ? `function solution() {\n  // Triển khai giải pháp cho ${categoryName}\n  return true;\n}` : undefined,
        testCases: !isQuiz && !isTheory ? [{ input: 'return solution();', expected: true }] : undefined,
        points: difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 15 : difficulty === 'HARD' ? 25 : 35,
        viewCount: 1,
        createdAt: new Date().toISOString().split('T')[0],
        tags: ['Sanjion', categoryName, difficulty, type],
      };
    }
  },

  // ✨ DYNAMIC TOPIC-SPECIFIC FALLBACK GENERATOR (IF AI MODEL ROTATION FAILS) ✨
  getTopicSpecificFallback(userQuery: string, questionTitle?: string): string {
    const text = (userQuery + ' ' + (questionTitle || '')).toLowerCase();

    if (text.includes('specificity') || text.includes('độ ưu tiên') || text.includes('css')) {
      return `### 📖 Giải Thích Chi Tiết: CSS Specificity (Độ Ưu Tiên CSS)

**CSS Specificity** là quy tắc tính điểm trọng số của trình duyệt để quyết định xem style từ selector nào sẽ thắng và được áp dụng cho phần tử HTML.

#### 1. Thứ Tự Trọng Số Điểm Specificity:
1. **Inline styles** (\`style="..."\`): **(1, 0, 0, 0)** = 1000 điểm.
2. **IDs** (\`#nav\`, \`#header\`): **(0, 1, 0, 0)** = 100 điểm.
3. **Classes, Attributes, Pseudo-classes** (\`.btn\`, \`[type="text"]\`, \`:hover\`): **(0, 0, 1, 0)** = 10 điểm.
4. **Elements & Pseudo-elements** (\`div\`, \`h1\`, \`::before\`): **(0, 0, 0, 1)** = 1 điểm.

#### 2. Ví Dụ Phân Tích Thực Tế:
Ví dụ selector: \`#nav ul li.active a\`
- 1 ID (\`#nav\`) -> 100
- 1 Class (\`.active\`) -> 10
- 3 Elements (\`ul\`, \`li\`, \`a\`) -> 3
=> Total Specificity = **(0, 1, 1, 3)** (Tổng điểm: 113).

#### 💡 Mẹo Senior:
- Tránh lạm dụng \`!important\` vì nó làm hỏng kiến trúc CSS và khó debug.
- Sử dụng mô hình **BEM (Block Element Modifier)** hoặc **CSS Modules** để quản lý Specificity phẳng và sạch sẽ!`;
    }

    if (text.includes('microtask') || text.includes('macrotask') || text.includes('event loop')) {
      return `### 📖 Giải Thích Chi Tiết: Event Loop & Microtasks vs Macrotasks

#### 1. Nguyên Lý Event Loop Engine:
JavaScript là ngôn ngữ đơn luồng (Single-thread). Event Loop liên tục kiểm tra nếu **Call Stack** trống thì rút công việc từ **Task Queue** sang chạy.

#### 2. Thứ Tự Ưu Tiên Hàng Đợi:
1. **Synchronous Code**: Mã đồng bộ chạy ngay lập tức trên Call Stack.
2. **Microtask Queue** (\`Promise.then\`, \`queueMicrotask\`, \`async/await\`): Chạy **SẠCH TẤT CẢ** microtask ngay khi Call Stack rỗng.
3. **Macrotask Queue** (\`setTimeout\`, \`setInterval\`, \`I/O\`): Chỉ chạy **1 Macrotask** ở mỗi cycle của Event Loop.

#### ⚡ Code minh họa:
\`\`\`javascript
console.log('1'); // Đồng bộ -> log 1
setTimeout(() => console.log('2'), 0); // Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
console.log('4'); // Đồng bộ -> log 4

// Đầu ra chuẩn: 1, 4, 3, 2
\`\`\``;
    }

    if (text.includes('closure')) {
      return `### 📖 Giải Thích Chi Tiết: Closure Trong JavaScript

**Closure** là khả năng một hàm con "ghi nhớ" và truy cập các biến thuộc về phạm vi hàm cha (Lexical Scope) ngay cả khi hàm cha đã hoàn thành thực thi và trả về.

#### ⚡ Code minh họa:
\`\`\`javascript
function createCounter(initial = 0) {
  let count = initial; // Biến nằm riêng trong Closure Scope
  return {
    increment: () => ++count,
    getValue: () => count
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue()); // 11
\`\`\`

#### 💡 Mẹo Senior:
Closure rất mạnh mẽ để tạo biến riêng tư (Private Variables), nhưng cần lưu ý dọn dẹp các tham chiếu DOM trong closure khi unmount để tránh **Memory Leaks**.`;
    }

    if (text.includes('usememo') || text.includes('usecallback')) {
      return `### 📖 Giải Thích Chi Tiết: useMemo vs useCallback Trong React

| Tiêu Chí | \`useMemo\` | \`useCallback\` |
| :--- | :--- | :--- |
| **Mục Đích** | Ghi nhớ (cache) **kết quả tính toán** | Ghi nhớ (cache) **định nghĩa hàm** |
| **Trả Về** | Giá trị \`fn()\` | Bản thân hàm \`fn\` |
| **Ứng Dụng** | Lọc mảng 10,000 phần tử đắt đỏ | Kết hợp \`React.memo\` tránh re-render con |

#### ⚡ Code minh họa:
\`\`\`javascript
// Ghi nhớ giá trị tính toán:
const sortedList = useMemo(() => items.sort(), [items]);

// Ghi nhớ tham chiếu hàm callback:
const handleClick = useCallback(() => doSomething(id), [id]);
\`\`\``;
    }

    const topicTitle = questionTitle || userQuery.replace(/["']/g, '');
    return `### 🤖 Trợ Lý Sanjion AI Tutor - Giải Thích: ${topicTitle}

Cảm ơn bạn đã hỏi về **${topicTitle}**!

#### 📌 Phân Tích Cốt Lõi:
1. **Bản Chất Kỹ Thuật**: Khái niệm này đóng vai trò quan trọng trong việc thiết kế kiến trúc và tối ưu hiệu năng ứng dụng Frontend.
2. **Quy Trình Hoạt Động**: Cần đảm bảo luồng dữ liệu một chiều (Unidirectional Data Flow), tránh rò rỉ bộ nhớ (Memory Leaks) và hạn chế các thao tác DOM thừa.
3. **Best Practice Senior**:
   - Viết code có cấu trúc rõ ràng, dễ bảo trì và mở rộng.
   - Thêm unit test kiểm thử các trường hợp biên (Edge Cases).

💡 *Bạn có thể bấm nút "Xin Gợi Ý Hint" hoặc nhập câu hỏi cụ thể hơn để AI phân tích từng dòng code nhé!*`;
  },

  // ✨ INTERACTIVE AI TUTOR ASSISTANT METHODS ✨
  async askAiTutor(
    userQuery: string,
    contextQuestion?: Question | null,
    customApiKey?: string
  ): Promise<string> {
    const contextInfo = contextQuestion
      ? `\nĐANG XEM CÂU HỎI HỌC TẬP:\n- Tiêu đề: ${contextQuestion.title}\n- Cấp độ: ${contextQuestion.difficulty}\n- Nội dung: ${contextQuestion.content.slice(0, 300)}...`
      : '';

    const prompt = `
Bạn là "Sanjion AI Tutor" - Trợ Lý Học Tập & Phỏng Vấn Frontend cao cấp.
Nhiệm vụ của bạn là giải đáp CHÍNH XÁC, TRỰC TIẾP VÀO TRỌNG TÂM CỦA CÂU HỎI HỌC VIÊN.

${contextInfo}

CÂU HỎI / YÊU CẦU CỦA HỌC VIÊN:
"${userQuery}"

YÊU CẦU TRẢ LỜI NGHIÊM NGẠC:
1. TRẢ LỜI TRỰC TIẾP, ĐÚNG TRỌNG TÂM từ khóa được hỏi (Ví dụ: Hỏi về CSS Specificity thì giải thích ĐÚNG CSS Specificity, hỏi về Event Loop thì giải thích ĐÚNG Event Loop).
2. TUYỆT ĐỐI KHÔNG trả lời lan man hoặc nói về các chủ đề không liên quan.
3. Dùng định dạng GitHub Markdown đẹp mắt (headings, code blocks với highlight ngôn ngữ, bullets).
4. Đưa ra **Cơ chế hoạt động** + **Ví dụ thực tế/Code minh họa** + **Mẹo Senior**.
`;

    try {
      return await this.callAIWithRotation(prompt, customApiKey);
    } catch (err: any) {
      console.warn('askAiTutor failover trigger:', err);
      return this.getTopicSpecificFallback(userQuery, contextQuestion?.title);
    }
  },

  async getSmartHint(
    question: Question,
    customApiKey?: string
  ): Promise<string> {
    const prompt = `
Bạn là Sanjion AI Tutor. Học viên đang bị vướng khi làm bài tập dưới đây và cần GỢI Ý HINT THÔNG MINH.

CÂU HỎI/BÀI TẬP:
- Tiêu đề: ${question.title}
- Cấp độ: ${question.difficulty}
- Đề bài: ${question.content}

YÊU CẦU:
Hãy đưa ra 3 cấp độ gợi ý (KHÔNG ĐƯỢC CHO THẲNG ĐÁP ÁN HOẶC CODE HOÀN CHỈNH):
- **Gợi ý 1 (Định hướng tư duy)**: Nhắc lại từ khóa chính hoặc khái niệm cốt lõi cần dùng.
- **Gợi ý 2 (Phương pháp kỹ thuật)**: Gợi ý hàm, hook hoặc cấu trúc dữ liệu thích hợp.
- **Gợi ý 3 (Cấu trúc từng bước)**: Các bước logic sơ bộ để hoàn thành bài.

Định dạng Markdown đẹp mắt.
`;

    try {
      return await this.callAIWithRotation(prompt, customApiKey);
    } catch (err: any) {
      return this.getTopicSpecificFallback(`Gợi ý hint cho ${question.title}`, question.title);
    }
  },

  async explainTheorySimple(
    topic: string,
    content: string,
    customApiKey?: string
  ): Promise<string> {
    const prompt = `
Bạn là Giảng Viên Frontend AI giàu kinh nghiệm. Hãy giảng lại khái niệm kỹ thuật dưới đây theo phong cách DỄ HIỂU NHẤT CHO LEVEL JUNIOR (Fresher/Mới bắt đầu).

CHỦ ĐỀ: ${topic}
NỘI DUNG: ${content}

YÊU CẦU BÀI GIẢNG:
1. **Ví dụ Ẩn Dụ Đời Thường**: Dùng một hình ảnh quen thuộc trong cuộc sống (ví dụ: nhà hàng, shipper, hộp quà, v.v.).
2. **Giải Thích Khái Niệm**: Ngắn gọn, không dùng từ quá hàn lâm.
3. **Code Minh Họa Cực Kỳ Đơn Giản**: 5-10 dòng code comment từng dòng.
4. **Lỗi Sai Người Mới Thường Gặp (Common Pitfall)**.

Trả về Markdown chuẩn, sinh động.
`;

    try {
      return await this.callAIWithRotation(prompt, customApiKey);
    } catch (err: any) {
      return this.getTopicSpecificFallback(topic, topic);
    }
  }
};


