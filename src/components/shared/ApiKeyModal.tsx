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
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#0B0D11]/90 flex min-h-full items-center justify-center p-4 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#161B22] border border-white/[0.06] rounded-lg max-w-md w-full p-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#8B94A3] hover:text-[#EDEFF2] rounded hover:bg-white/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center py-2 space-y-3">
          <div className="w-12 h-12 rounded bg-[#0B0D11] border border-white/[0.06] flex items-center justify-center text-[#5B54D9] mx-auto">
            <Sparkles className="w-6 h-6 text-[#5B54D9]" />
          </div>

          <h3 className="text-lg font-display font-medium text-[#EDEFF2]">Cấu Hình AI Engine Keys</h3>
          <p className="text-xs text-[#8B94A3] leading-relaxed">
            Nhập Gemini / OpenAI API Keys cho tính năng Sanjioner AI.
          </p>

          <div className="text-left space-y-3 mt-4">
            {/* Gemini Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#EDEFF2]">1. Google Gemini API Key:</label>
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#5B54D9] hover:underline flex items-center gap-0.5"
                >
                  <span>Lấy Key Gemini</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B94A3]" />
                <input
                  type="password"
                  placeholder="Dán Gemini Key..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-9 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#5B54D9] font-mono"
                />
              </div>
            </div>

            {/* OpenAI / ChatGPT Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#EDEFF2] flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-[#2FAE79]" />
                  2. ChatGPT OpenAI API Key (sk-...):
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#2FAE79] hover:underline flex items-center gap-0.5"
                >
                  <span>Lấy Key ChatGPT</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2FAE79]" />
                <input
                  type="password"
                  placeholder="Dán ChatGPT Key (sk-...)"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/[0.06] rounded pl-9 pr-4 py-2 text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#2FAE79] font-mono"
                />
              </div>
            </div>

            {/* Test Connection & Quota Status */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestKeys}
                disabled={isTesting || !geminiKey}
                className="w-full py-2 rounded bg-[#0B0D11] hover:bg-white/[0.04] border border-white/[0.06] text-[#5B54D9] text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#5B54D9]" />}
                <span>🔍 Kiểm Tra API Key Status</span>
              </button>

              {testResults && (
                <div className="mt-2 space-y-1 bg-[#0B0D11] text-[#EDEFF2] p-3 rounded border border-white/[0.06] text-[11px] font-mono leading-relaxed">
                  {testResults.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {res.status === 'ok' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2FAE79] flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#C1553B] flex-shrink-0" />
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
            className="w-full py-2.5 rounded border border-[#C9962C] text-[#C9962C] bg-[#C9962C]/10 hover:bg-[#C9962C]/20 font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4 text-[#2FAE79]" /> : <Sparkles className="w-4 h-4 text-[#C9962C]" />}
            {isSaved ? 'Đã Lưu Key Thành Công!' : 'Lưu Cấu Hình Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
