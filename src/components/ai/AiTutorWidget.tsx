import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Code2,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  Key,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { Question } from '../../types';

interface AiTutorWidgetProps {
  activeQuestion?: Question | null;
  userCode?: string;
  onOpenApiKeyModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function AiTutorWidget({
  activeQuestion,
  userCode,
  onOpenApiKeyModal,
}: AiTutorWidgetProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '👋 Xin chào! Mình là **Sanjion AI Tutor** - Trợ Lý Học Tập & Phỏng Vấn Frontend từ Junior đến Senior.\n\nBạn có thể hỏi mình bất cứ thắc mắc gì về JS, React, CSS, Web Performance hoặc bấm các nút phía dưới để xin **Gợi ý Hint**, **Giảng bài dễ hiểu** nhé!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // ✨ GLOBAL CUSTOM EVENT LISTENER TO DISPATCH INSTANT PROMPTS (FROM TOOLTIPS & ROADMAP) ✨
  useEffect(() => {
    const handleCustomAskAi = (e: CustomEvent) => {
      const promptText = e.detail?.prompt;
      if (promptText) {
        setIsOpen(true);
        setTimeout(() => {
          handleSendMessage(promptText);
        }, 150);
      }
    };

    window.addEventListener('sanjion-ask-ai' as any, handleCustomAskAi as any);
    return () => window.removeEventListener('sanjion-ask-ai' as any, handleCustomAskAi as any);
  }, []);

  const handleSendMessage = async (customPrompt?: string) => {
    const query = customPrompt || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputQuery('');
    setIsLoading(true);

    try {
      const apiKey = aiService.getStoredApiKey();
      const aiReplyText = await aiService.askAiTutor(query, activeQuestion, apiKey);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI Tutor error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Không thể kết nối Trợ lý AI:** ${aiService.formatAiError(err)}\n\nHãy kiểm tra cấu hình Gemini API Key trong menu cài đặt nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionType: 'hint' | 'explain' | 'review') => {
    if (isLoading) return;

    const apiKey = aiService.getStoredApiKey();
    setIsLoading(true);

    let promptText = '';
    let replyPromise: Promise<string>;

    if (actionType === 'hint') {
      if (!activeQuestion) {
        promptText = 'Cho mình xin gợi ý tổng quan để bắt đầu học Frontend vững chắc từ Junior đến Senior?';
        replyPromise = aiService.askAiTutor(promptText, null, apiKey);
      } else {
        promptText = `💡 Xin gợi ý hint cho câu hỏi: "${activeQuestion.title}"`;
        replyPromise = aiService.getSmartHint(activeQuestion, apiKey);
      }
    } else if (actionType === 'explain') {
      if (!activeQuestion) {
        promptText = 'Giảng lại khái niệm Event Loop & Closure cho người mới học Junior?';
        replyPromise = aiService.explainTheorySimple('Event Loop & Closure', 'Cách JS xử lý bất đồng bộ', apiKey);
      } else {
        promptText = `🎓 Giảng lại đề bài "${activeQuestion.title}" theo cách dễ hiểu nhất cho Junior.`;
        replyPromise = aiService.explainTheorySimple(activeQuestion.title, activeQuestion.content, apiKey);
      }
    } else {
      // Review
      if (!userCode || !userCode.trim()) {
        promptText = 'Đánh giá giúp mình các tiêu chí Clean Code quan trọng nhất khi viết JavaScript/React?';
        replyPromise = aiService.askAiTutor(promptText, activeQuestion, apiKey);
      } else {
        promptText = `🔍 Review mã nguồn hiện tại của mình cho câu hỏi "${activeQuestion?.title || 'Coding Exercise'}"`;
        replyPromise = aiService.askAiTutor(
          `Hãy đánh giá bài code này theo góc nhìn Senior Developer:\n\n\`\`\`javascript\n${userCode}\n\`\`\`\n\nChỉ ra điểm tốt, lỗ hổng hiệu năng và cách refactor sạch đẹp nhất.`,
          activeQuestion,
          apiKey
        );
      }
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const resultText = await replyPromise;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: resultText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Lỗi kết nối AI:** ${aiService.formatAiError(err)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button - Lifted above bottom navigation bar on mobile/iPad */}
      <div className="fixed xl:bottom-6 bottom-20 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center gap-2 p-3 xl:px-4 xl:py-3 rounded-full font-bold text-sm text-white shadow-2xl transition-all duration-300 hover:scale-105 ${
            isOpen
              ? 'bg-slate-900 hover:bg-slate-800 ring-4 ring-slate-900/30'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:shadow-pink-500/40 ring-4 ring-purple-500/30'
          }`}
          title="Trợ Lý AI Tutor 24/7"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 animate-bounce text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          {/* Text visible ONLY on Desktop XL screens */}
          <span className="hidden xl:inline font-extrabold text-xs">Trợ Lý AI Tutor</span>
          {isOpen ? <X className="w-5 h-5 xl:ml-1" /> : <Sparkles className="w-4 h-4 text-amber-300 hidden xl:inline" />}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed xl:bottom-24 bottom-32 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[580px] max-h-[75vh] bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Sanjion AI Tutor <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-pink-100">
                  Mô hình: <span className="font-semibold text-white">{aiService.getActiveModelName()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenApiKeyModal && (
                <button
                  onClick={onOpenApiKeyModal}
                  title="Cấu hình API Key"
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-pink-100 hover:text-white"
                >
                  <Key className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 bg-purple-50/60 border-b border-purple-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleQuickAction('hint')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-amber-800 text-xs font-bold shadow-sm hover:bg-amber-50 disabled:opacity-50 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Xin Gợi Ý Hint
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-800 text-xs font-bold shadow-sm hover:bg-indigo-50 disabled:opacity-50 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> AI Giảng Bài Dễ Hiểu
            </button>
            <button
              onClick={() => handleQuickAction('review')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-800 text-xs font-bold shadow-sm hover:bg-purple-50 disabled:opacity-50 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-500" /> Senior Code Review
            </button>
          </div>

          {/* Active Context Banner if question is selected */}
          {activeQuestion && (
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
              <span className="truncate">
                📍 Đang làm: <b className="text-slate-800">{activeQuestion.title}</b>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">
                {activeQuestion.difficulty}
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-rose-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[84%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none prose prose-sm max-w-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-pink-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs italic">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
                  <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>Sanjion AI Tutor đang suy nghĩ bài giải...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Đặt câu hỏi thắc mắc cho Trợ Lý AI..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-slate-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
