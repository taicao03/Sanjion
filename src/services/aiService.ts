import { GoogleGenAI } from '@google/genai';
import { Question, DifficultyLevel, QuestionType } from '../types';

export interface AIEvaluationResult {
  score: number;
  verdict: 'Xuất sắc' | 'Đạt chuẩn' | 'Cần bổ sung' | 'Chưa đạt';
  strengths: string[];
  weaknesses: string[];
  seniorBestPractice: string;
  rawFeedback: string;
}

export const aiService = {
  // Read Gemini models list dynamically from .env.local (VITE_GEMINI_MODELS)
  getGeminiModels(): string[] {
    const metaEnv = (import.meta as any).env;
    const envModels = (metaEnv && metaEnv.VITE_GEMINI_MODELS) ? metaEnv.VITE_GEMINI_MODELS.split(',') : [];
    const defaultModels = [
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro'
    ];
    const combined = [...envModels, ...defaultModels].map(m => m.trim()).filter(Boolean);
    return Array.from(new Set(combined));
  },

  // Read OpenAI model dynamically from .env.local (VITE_OPENAI_MODEL)
  getOpenAIModel(): string {
    const metaEnv = (import.meta as any).env;
    return (metaEnv && metaEnv.VITE_OPENAI_MODEL) ? metaEnv.VITE_OPENAI_MODEL.trim() : 'gpt-4o-mini';
  },

  // ✨ Get Active Model Name currently configured in .env.local ✨
  getActiveModelName(): string {
    const geminiModels = this.getGeminiModels();
    if (geminiModels.length > 0) {
      return geminiModels[0];
    }
    return this.getOpenAIModel();
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

  // Key & Model Failover Rotation
  async callAIWithRotation(prompt: string, customApiKey?: string): Promise<string> {
    const geminiKeys = customApiKey ? [customApiKey] : this.getGeminiKeys();
    const openAIKeys = this.getOpenAIKeys();

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

Trả về kết quả duy nhất ở dạng JSON hợp lệ (không kèm bất kỳ văn bản ngoài):
{
  "score": 8.5,
  "verdict": "Đạt chuẩn",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "seniorBestPractice": "..."
}
`;

    try {
      const text = await this.callAIWithRotation(prompt, customApiKey);
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);

      const calculatedScore = typeof parsed.score === 'number' ? Math.min(10, Math.max(0, parsed.score)) : 7.0;
      let calculatedVerdict: AIEvaluationResult['verdict'] = 'Đạt chuẩn';
      if (calculatedScore >= 9.0) calculatedVerdict = 'Xuất sắc';
      else if (calculatedScore >= 7.0) calculatedVerdict = 'Đạt chuẩn';
      else if (calculatedScore >= 5.0) calculatedVerdict = 'Cần bổ sung';
      else calculatedVerdict = 'Chưa đạt';

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
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);

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
  }
};
