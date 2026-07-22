import React, { useState } from 'react';
import { X, Key, ExternalLink, Sparkles, Check, Bot, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [geminiKey, setGeminiKey] = useState<string>(aiService.getGeminiKeys().join(', '));
  const [openAIKey, setOpenAIKey] = useState<string>(aiService.getOpenAIKeys().join(', '));
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ key: string; status: 'ok' | '429' | 'invalid'; msg: string }[] | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    aiService.setStoredApiKey(geminiKey, openAIKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSaved();
      onClose();
    }, 600);
  };

  const handleTestKeys = async () => {
    setIsTesting(true);
    setTestResults(null);

    const keys = geminiKey.split(',').map(k => k.trim()).filter(Boolean);
    const results: { key: string; status: 'ok' | '429' | 'invalid'; msg: string }[] = [];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      try {
        await aiService.callGeminiRestApi('Ping test connection', k);
        results.push({ key: k, status: 'ok', msg: `Key #${i + 1}: 🟢 Hoạt động tốt (Còn Quota)!` });
      } catch (err: any) {
        const msgStr = err.message || '';
        if (msgStr.includes('429') || msgStr.includes('RESOURCE_EXHAUSTED')) {
          results.push({ key: k, status: '429', msg: `Key #${i + 1}: 🔴 Hết Quota tạm thời (429 Rate Limit - Tự hồi phục sau 60 giây)` });
        } else {
          results.push({ key: k, status: 'invalid', msg: `Key #${i + 1}: ❌ Không hợp lệ / Lỗi kết nối!` });
        }
      }
    }

    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-pink-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center py-2 space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 border border-purple-200 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-slate-800 tracking-tight">Cấu Hình AI Engine Keys</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Kiểm tra trạng thái Quota trực tiếp hoặc cập nhật API Keys mới.
          </p>

          <div className="text-left space-y-3 mt-4">
            {/* Gemini Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">1. Google Gemini API Key (Miễn phí):</label>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-purple-600 hover:underline font-extrabold flex items-center gap-0.5"
                >
                  <span>Lấy Key Gemini</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  type="password"
                  placeholder="Dán Gemini Keys (phân cách bởi dấu phẩy)..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-rose-50/50 border border-pink-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-pink-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-mono"
                />
              </div>
            </div>

            {/* OpenAI / ChatGPT Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  2. ChatGPT OpenAI API Key (sk-...):
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-emerald-600 hover:underline font-extrabold flex items-center gap-0.5"
                >
                  <span>Lấy Key ChatGPT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="password"
                  placeholder="Dán ChatGPT OpenAI Key (sk-...)"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-mono"
                />
              </div>
            </div>

            {/* Test Connection & Quota Status */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestKeys}
                disabled={isTesting || !geminiKey}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                <span>🔍 Kiểm Tra Quota API Keys Trực Tiếp</span>
              </button>

              {testResults && (
                <div className="mt-2 space-y-1 bg-slate-900 text-white p-3 rounded-2xl text-[11px] font-mono leading-relaxed">
                  {testResults.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {res.status === 'ok' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      )}
                      <span>{res.msg}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            {isSaved ? 'Đã Lưu API Keys Thành Công!' : 'Lưu API Keys & Kích Hoạt AI Engine'}
          </button>
        </div>
      </div>
    </div>
  );
};
