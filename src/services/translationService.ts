import { aiService } from './aiService';
import { findTermDefinition } from './termDictionary';

export const translationService = {
  async translateToVietnamese(text: string): Promise<string> {
    const cleanedText = text.replace(/[*`#_]/g, '').trim();
    if (!cleanedText) return '';

    // 1. Try static term dictionary lookup first for fast instant response
    const dictDef = findTermDefinition(cleanedText);
    if (dictDef) {
      return `📌 **${dictDef.title}**: ${dictDef.simpleExplanation}`;
    }

    // 2. If Gemini API Key is available, call Gemini AI for accurate contextual translation
    const apiKey = aiService.getStoredApiKey();
    if (apiKey) {
      try {
        const prompt = `
Bạn là chuyên gia dịch thuật công nghệ Frontend.
Hãy dịch từ hoặc đoạn văn tiếng Anh dưới đây sang Tiếng Việt chuẩn thuật ngữ chuyên ngành công nghệ (ngắn gọn 1-3 câu, dễ hiểu):

CÂU/TỪ GỐC: "${cleanedText}"

Trả về nội dung dịch chuẩn (có định dạng Markdown đẹp mắt, chứa nghĩa chuẩn + giải thích ngắn gọn):
`;
        const translated = await aiService.callAIWithRotation(prompt, apiKey);
        if (translated && translated.trim().length > 0) {
          return translated.trim();
        }
      } catch (err) {
        console.warn('AI Translation error, falling back to local dictionary:', err);
      }
    }

    // 3. Fallback translation if no API key or AI call failed
    return `🇻🇳 **${cleanedText}**: Thuật ngữ / Khái niệm lập trình Web Frontend. (Cài đặt Gemini API Key để AI dịch chuyên sâu đầy đủ).`;
  }
};
