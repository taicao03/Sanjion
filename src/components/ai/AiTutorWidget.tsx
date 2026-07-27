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
import { MarkdownRenderer } from '../shared/MarkdownRenderer';

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

      {/* Chat Window Panel — Editor Noir Dark Aesthetic */}
      {isOpen && (
        <div className="fixed xl:bottom-24 bottom-32 right-4 sm:right-6 z-50 w-[92vw] sm:w-[460px] h-[600px] max-h-[80vh] bg-[#161B22] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp font-mono text-[#EDEFF2]">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B0D11] via-[#161B22] to-[#0B0D11] text-white flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/40">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white font-sans">
                  Sanjion AI Tutor <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Engine: <span className="font-semibold text-amber-300">{aiService.getActiveModelName()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenApiKeyModal && (
                <button
                  onClick={onOpenApiKeyModal}
                  title="Cấu hình API Key"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="p-2.5 bg-[#0B0D11] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => handleQuickAction('hint')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm hover:bg-[#232A35] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Xin Gợi Ý Hint
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-purple-500/40 text-purple-300 text-xs font-bold shadow-sm hover:bg-[#232A35] disabled:opacity-50 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> AI Giảng Bài Dễ Hiểu
            </button>
            <button
              onClick={() => handleQuickAction('review')}
              disabled={isLoading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161B22] border border-pink-500/40 text-pink-300 text-xs font-bold shadow-sm hover:bg-[#232A35] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-pink-400" /> Senior Code Review
            </button>
          </div>

          {/* Active Context Banner if question is selected */}
          {activeQuestion && (
            <div className="px-4 py-2 bg-[#0B0D11] border-b border-white/10 text-xs text-slate-300 flex items-center justify-between font-mono">
              <span className="truncate">
                📍 Đang làm: <b className="text-amber-300 font-sans">{activeQuestion.title}</b>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {activeQuestion.difficulty}
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0B0D11]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[86%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white rounded-br-none font-medium'
                      : 'bg-[#161B22] border border-white/10 text-[#EDEFF2] rounded-bl-none font-sans'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <MarkdownRenderer content={msg.text} />
                  ) : (
                    <div className="whitespace-pre-wrap font-sans text-white">{msg.text}</div>
                  )}
                  <div
                    className={`text-[10px] mt-2 text-right font-mono ${
                      msg.sender === 'user' ? 'text-pink-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-slate-400 text-xs italic font-mono">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                  AI
                </div>
                <div className="bg-[#161B22] border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm text-amber-300">
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Sanjion AI Tutor đang phân tích & soạn bài giảng...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer — High Contrast Input Box */}
          <div className="p-3 bg-[#161B22] border-t border-white/10 font-mono">
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
                placeholder="Nhập câu hỏi thắc mắc cho Trợ Lý AI..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D11] text-[#EDEFF2] text-xs md:text-sm font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white shadow-md disabled:opacity-50 transition-all cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
