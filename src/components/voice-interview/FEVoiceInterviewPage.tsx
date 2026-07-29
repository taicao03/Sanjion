import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  BookOpen,
  ChevronRight,
  Filter,
  Brain,
  MessageSquare,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { FE_2026_QUESTION_BANK, FE2026Question } from '../../services/fe2026QuestionsData';
import { speechService } from '../../services/speechService';
import { aiService } from '../../services/aiService';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import confetti from 'canvas-confetti';

interface ScoreRecord {
  questionId: string;
  score: number;
  verdict: string;
}

export const FEVoiceInterviewPage: React.FC = () => {
  // State
  const [questions, setQuestions] = useState<FE2026Question[]>(FE_2026_QUESTION_BANK);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Answer state
  const [theoryAnswer, setTheoryAnswer] = useState<string>('');
  const [codeAnswer, setCodeAnswer] = useState<string>('');

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    return localStorage.getItem('fe_sanjion_voice_name') || '';
  });

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [sessionScores, setSessionScores] = useState<ScoreRecord[]>([]);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  // AI Generating Custom Question
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);

  // Console execution state
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Ref tracking for latest speech values inside effects
  const selectedVoiceNameRef = useRef<string>(selectedVoiceName);
  const speechRateRef = useRef<number>(speechRate);

  useEffect(() => {
    selectedVoiceNameRef.current = selectedVoiceName;
  }, [selectedVoiceName]);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Load available system voices with multiple fallback timers
  useEffect(() => {
    if (!speechService.isSupported()) return;

    const loadVoices = () => {
      const allVoices = speechService.getAvailableVoices();
      setAvailableVoices(allVoices);
      
      const viVoices = speechService.getVietnameseVoices();
      
      if (allVoices.length > 0) {
        const saved = localStorage.getItem('fe_sanjion_voice_name');
        const hasSaved = allVoices.some(v => v.name === saved);
        if (!saved || !hasSaved) {
          // If we have Vietnamese voices, prefer them
          const preferred = viVoices.find(v => 
            v.name.toLowerCase().includes('natural') || 
            v.name.toLowerCase().includes('google') ||
            v.name.toLowerCase().includes('linh') ||
            v.name.toLowerCase().includes('hoaimy') ||
            v.name.toLowerCase().includes('namminh')
          ) || viVoices[0] || allVoices[0];
          
          setSelectedVoiceName(preferred.name);
          localStorage.setItem('fe_sanjion_voice_name', preferred.name);
        }
      }
    };

    loadVoices();

    const timer1 = setTimeout(loadVoices, 100);
    const timer2 = setTimeout(loadVoices, 500);
    const timer3 = setTimeout(loadVoices, 1500);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchTopic = selectedTopic === 'ALL' || q.topic === selectedTopic;
    const matchDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    return matchTopic && matchDiff;
  });

  // Handle Voice Speech when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    setTheoryAnswer('');
    setCodeAnswer(currentQuestion.codeTemplate || '');
    setEvaluation(null);
    setShowModelAnswer(false);

    if (autoPlayVoice && speechService.isSupported()) {
      handlePlayVoice(currentQuestion.speechText || currentQuestion.questionText);
    } else {
      speechService.stop();
      setIsSpeaking(false);
    }

    return () => {
      speechService.stop();
    };
  }, [currentIndex, currentQuestion]);

  const handlePlayVoice = (textToRead?: string) => {
    if (!speechService.isSupported()) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech API.');
      return;
    }
    const text = textToRead || currentQuestion.speechText || currentQuestion.questionText;
    setIsSpeaking(true);

    speechService.speak({
      text,
      lang: 'vi-VN',
      rate: speechRateRef.current,
      voiceName: selectedVoiceNameRef.current || undefined,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleStopVoice = () => {
    speechService.stop();
    setIsSpeaking(false);
  };

  const handleRunCode = () => {
    setConsoleLogs([]);
    setShowConsole(true);

    if (!codeAnswer || !codeAnswer.trim()) {
      setConsoleLogs(['⚠️ Chưa có mã nguồn để chạy thử. Hãy gõ code vào trình soạn thảo!']);
      return;
    }

    const logs: string[] = [];
    const sandboxConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(arg => {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              return '[Circular/Object]';
            }
          }
          return String(arg);
        }).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('❌ Error: ' + args.map(arg => String(arg)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('⚠️ Warning: ' + args.map(arg => String(arg)).join(' '));
      }
    };

    try {
      let runnableCode = codeAnswer
        .replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?/gm, "")
        .replace(/^import\s+['"].*?['"];?/gm, "")
        .replace(/^export\s+default\s+.*?;?/gm, "")
        .replace(/^export\s+(const|let|var|function|class)/gm, "$1");

      const runner = new Function('console', `
        try {
          ${runnableCode}
        } catch (err) {
          console.error(err.message || err);
        }
      `);

      runner(sandboxConsole);

      if (logs.length === 0) {
        logs.push('✓ Mã nguồn đã chạy thành công (Không có lệnh log kết quả nào).');
      }
      setConsoleLogs(logs);
    } catch (err: any) {
      setConsoleLogs([`❌ Lỗi biên dịch: ${err.message || err}`]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!theoryAnswer.trim() && !codeAnswer.trim()) {
      alert('Vui lòng gõ nội dung trả lời (Lý thuyết hoặc Mã Code) trước khi nộp cho AI chấm điểm.');
      return;
    }

    handleStopVoice();
    setIsEvaluating(true);

    try {
      const result = await aiService.evaluateFE2026Answer(
        currentQuestion.title,
        currentQuestion.topic,
        currentQuestion.questionText,
        currentQuestion.expectedKeywords,
        theoryAnswer,
        codeAnswer
      );

      setEvaluation(result);

      // Record score
      setSessionScores(prev => [
        ...prev.filter(s => s.questionId !== currentQuestion.id),
        {
          questionId: currentQuestion.id,
          score: result.score,
          verdict: result.verdict
        }
      ]);

      // Confetti effect if score >= 8.0
      if (result.score >= 8.0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Lỗi khi AI chấm điểm:', error);
      alert('Có lỗi xảy ra khi AI chấm điểm. Vui lòng thử lại!');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleGenerateAiQuestion = async () => {
    setIsGeneratingQuestion(true);
    handleStopVoice();
    try {
      const prompt = `
Hãy tạo 1 CÂU HỎI PHỎNG VẤN PHẦN CỨNG FRONTEND 2026 MỚI ĐỘC ĐÁO.
Chủ đề chọn trong: React 19, Next.js 15+, Performance INP, System Design, Modern CSS.
Cấp độ: ${selectedDifficulty === 'ALL' ? 'Senior' : selectedDifficulty}.

Trả về ĐÚNG JSON nguyên bản:
{
  "id": "fe2026-ai-gen-${Date.now()}",
  "title": "Tiêu đề ngắn gọn...",
  "topic": "React 19",
  "difficulty": "Senior",
  "questionText": "Nội dung câu hỏi phỏng vấn chi tiết năm 2026...",
  "speechText": "Phiên bản lời nói ngắn gọn truyền cảm cho voice đọc...",
  "codeTemplate": "// Khung code ví dụ...",
  "keyPointsToCover": ["Điểm 1", "Điểm 2"],
  "expectedKeywords": ["React 19", "INP", "Compiler"],
  "techLeadModelAnswer": "Đáp án mẫu chuẩn Tech Lead FE 2026..."
}
`;
      const rawRes = await aiService.callAIWithRotation(prompt);
      const parsed = aiService.safeParseAiJson(rawRes);
      if (parsed && parsed.title && parsed.questionText) {
        const newQ: FE2026Question = {
          id: parsed.id || `ai-gen-${Date.now()}`,
          title: parsed.title,
          topic: parsed.topic || 'React 19',
          difficulty: parsed.difficulty || 'Senior',
          questionText: parsed.questionText,
          speechText: parsed.speechText || parsed.questionText,
          codeTemplate: parsed.codeTemplate || '// Code snippet',
          keyPointsToCover: parsed.keyPointsToCover || ['Tư duy tối ưu hóa', 'Bản chất kiến trúc'],
          expectedKeywords: parsed.expectedKeywords || ['Frontend 2026'],
          techLeadModelAnswer: parsed.techLeadModelAnswer || 'Đáp án mẫu AI sinh tự động.'
        };
        setQuestions(prev => [newQ, ...prev]);
        setCurrentIndex(0);
        alert('🎉 Đã sinh xong câu hỏi FE 2026 mới từ AI!');
      }
    } catch (e) {
      console.error('Lỗi khi tạo câu hỏi AI:', e);
      alert('Không thể tạo câu hỏi mới lúc này. Vui lòng kiểm tra lại API Key!');
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  // Average score calculation
  const avgScore = sessionScores.length > 0
    ? (sessionScores.reduce((acc, curr) => acc + curr.score, 0) / sessionScores.length).toFixed(1)
    : '0.0';

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 7.5) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (score >= 5.0) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#EDEFF2] pb-24 font-sans selection:bg-[#C9962C]/30 selection:text-white">
      {/* 1. Header Banner */}
      <div className="border-b border-slate-800 bg-[#161C24]/80 backdrop-blur-md sticky top-14 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#C9962C]/20 to-amber-600/10 border border-[#C9962C]/40 text-[#C9962C] shadow-lg shadow-[#C9962C]/5">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  FE 2026 Voice Interview Studio
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#C9962C]/20 text-[#C9962C] border border-[#C9962C]/40 rounded-full">
                  Tech Lead Audio AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Người phỏng vấn đọc tiếng Việt • Trả lời bằng gõ/code • AI chấm điểm thang 10 chuẩn 2026
              </p>
            </div>
          </div>

          {/* Session Performance Meter */}
          <div className="flex items-center gap-4 bg-[#0B0D11] px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C9962C]" />
              <span className="text-slate-400">Đã trả lời:</span>
              <span className="font-bold text-white">{sessionScores.length} câu</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Điểm Trung Bình:</span>
              <span className="font-bold text-emerald-400 text-sm">{avgScore} / 10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 2. Control Bar Filters & Audio Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#161C24] p-4 rounded-xl border border-slate-800 shadow-md">
          {/* Topic & Difficulty Filters */}
          <div className="lg:col-span-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Filter className="w-3.5 h-3.5 text-[#C9962C]" />
              <span>Lọc:</span>
            </div>

            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-[#0B0D11] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#C9962C]"
            >
              <option value="ALL">🌐 Tất cả chủ đề FE 2026</option>
              <option value="React 19">⚛️ React 19 & Compiler</option>
              <option value="Next.js 15+">🚀 Next.js 15+ & PPR</option>
              <option value="Performance & INP">⚡ Performance & INP</option>
              <option value="System Design">🏗️ System Design & MF 2.0</option>
              <option value="Modern CSS">🎨 Modern CSS & Container Queries</option>
              <option value="AI & Web Architecture">🤖 AI Client-Side & WebGPU</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-[#0B0D11] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#C9962C]"
            >
              <option value="ALL">🎯 Tất cả Cấp độ</option>
              <option value="Junior">Junior Level</option>
              <option value="Middle">Middle Level</option>
              <option value="Senior">Senior Specialist</option>
              <option value="Tech Lead">Tech Lead / Architect</option>
            </select>

            <button
              onClick={handleGenerateAiQuestion}
              disabled={isGeneratingQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9962C]/10 text-[#C9962C] border border-[#C9962C]/40 text-xs font-semibold hover:bg-[#C9962C]/20 transition-colors disabled:opacity-50"
            >
              {isGeneratingQuestion ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#C9962C]" />
              )}
              <span>Tạo Câu Hỏi AI Mới</span>
            </button>
          </div>

          {/* Voice Speech Control Panel */}
          <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Giọng:</span>
              <select
                value={selectedVoiceName}
                onChange={(e) => {
                  const name = e.target.value;
                  setSelectedVoiceName(name);
                  localStorage.setItem('fe_sanjion_voice_name', name);
                  if (isSpeaking) {
                    setTimeout(() => handlePlayVoice(), 50);
                  }
                }}
                className="bg-[#0B0D11] border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-[#C9962C] max-w-[140px] truncate"
              >
                {availableVoices.length === 0 ? (
                  <option value="">Default (Hệ thống)</option>
                ) : (
                  availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace('Microsoft', 'MS').replace('Google tiếng Việt', 'Google VN').replace('Natural', 'Nat')} ({v.lang})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Tốc độ:</span>
              <div className="flex bg-[#0B0D11] p-0.5 rounded-lg border border-slate-800">
                {[0.8, 0.95, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                      speechRate === rate
                        ? 'bg-[#C9962C] text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={autoPlayVoice}
                onChange={(e) => setAutoPlayVoice(e.target.checked)}
                className="rounded accent-[#C9962C] w-3.5 h-3.5 cursor-pointer"
              />
              <span>Tự đọc</span>
            </label>
          </div>
        </div>

        {/* 3. Tech Lead Voice Examiner Box */}
        <div className="bg-gradient-to-br from-[#161C24] to-[#0F131A] rounded-2xl border border-slate-700/60 p-6 shadow-xl relative overflow-hidden">
          {/* Top Decorative Header */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              {/* Voice Examiner Avatar & Waves */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#C9962C] p-0.5 shadow-lg shadow-[#C9962C]/20">
                  <div className="w-full h-full bg-[#0B0D11] rounded-[14px] flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#C9962C]" />
                  </div>
                </div>

                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-base">Senior Tech Lead FE 2026</h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                    Voice Examiner (Tiếng Việt)
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Câu {currentIndex + 1} / {filteredQuestions.length}</span>
                  <span>•</span>
                  <span className="text-[#C9962C] font-semibold">{currentQuestion.topic}</span>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {currentQuestion.difficulty}
                  </span>
                </p>
              </div>
            </div>

            {/* Audio Action Buttons */}
            <div className="flex items-center gap-2 font-mono">
              {!isSpeaking ? (
                <button
                  onClick={() => handlePlayVoice()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C9962C] text-black font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-[#C9962C]/20 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe Voice Đọc</span>
                </button>
              ) : (
                <button
                  onClick={handleStopVoice}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-xs hover:bg-rose-500/30 transition-all cursor-pointer"
                >
                  <VolumeX className="w-4 h-4 animate-bounce" />
                  <span>Dừng Voice</span>
                </button>
              )}

              <button
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl bg-[#0B0D11] border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
                title="Câu trước"
              >
                &larr;
              </button>
              <button
                onClick={handleNextQuestion}
                className="p-2 rounded-xl bg-[#0B0D11] border border-slate-800 text-slate-300 hover:text-white"
                title="Câu tiếp theo"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Animated Equalizer Visualizer when speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-1 mb-3 px-2 py-1.5 bg-[#0B0D11]/80 rounded-lg border border-emerald-500/30 w-max">
              <span className="text-[11px] font-mono text-emerald-400 font-bold mr-2">Tech Lead đang nói:</span>
              {[40, 80, 50, 90, 60, 100, 70, 40, 80, 60, 90].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.max(8, Math.round(h * Math.random()))}px`,
                    animationDuration: `${0.3 + (i % 5) * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Question Title & Content */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-amber-300 tracking-tight leading-snug">
              {currentQuestion.title}
            </h3>
            <div className="text-sm text-slate-200 leading-relaxed font-sans bg-[#0B0D11]/60 p-4 rounded-xl border border-slate-800/80">
              {currentQuestion.questionText}
            </div>

            {/* Expected Technical Keywords */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Từ khóa kỳ vọng năm 2026:</span>
              {currentQuestion.expectedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-[#5B54D9]/15 text-indigo-300 border border-[#5B54D9]/30"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Candidate Answer Workspace (Dual Mode Input) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theory / Logical Answer Input */}
          <div className="bg-[#161C24] rounded-2xl border border-slate-700/60 p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 font-bold text-sm text-white">
                  <MessageSquare className="w-4 h-4 text-[#C9962C]" />
                  <span>1. Giải Thích Lý Thuyết & Bản Chất (Theory)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {theoryAnswer.length} ký tự
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Trình bày luận điểm, cơ chế hoạt động, ưu nhược điểm hoặc các trường hợp góc (edge cases).
              </p>
              <textarea
                value={theoryAnswer}
                onChange={(e) => setTheoryAnswer(e.target.value)}
                placeholder="Nhập câu trả lời lý thuyết của bạn tại đây... (Ví dụ: Cơ chế AST của React Compiler phân tích các biến thuần túy...)"
                rows={12}
                className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-200 focus:outline-none focus:border-[#C9962C] resize-none leading-relaxed"
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono bg-[#0B0D11] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>💡 Mẹo Tech Lead: Trình bày có cấu trúc (1. Bản chất, 2. So sánh, 3. Ví dụ)</span>
            </div>
          </div>

          {/* Monaco Code Snippet Editor Input */}
          <div className="bg-[#161C24] rounded-2xl border border-slate-700/60 p-5 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 font-bold text-sm text-white">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>2. Viết Mã Nguồn Ví Dụ (Code Snippet)</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2FAE79]/15 text-[#2FAE79] border border-[#2FAE79]/30 hover:bg-[#2FAE79]/25 transition-all text-[10px] font-mono font-bold cursor-pointer"
                  >
                    <span>▶ Run Code</span>
                  </button>
                  <span className="text-[11px] font-mono text-emerald-400">TypeScript / React 19</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Viết đoạn code minh họa hoặc giải pháp kỹ thuật cụ thể (Monaco Editor hỗ trợ Syntax Highlight).
              </p>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0B0D11] h-[280px]">
                <Editor
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  value={codeAnswer}
                  onChange={(val) => setCodeAnswer(val || '')}
                  options={{
                    fontSize: 12,
                    fontFamily: 'Fira Code, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: 'on',
                    tabSize: 2,
                  }}
                />
              </div>

              {showConsole && (
                <div className="mt-3 bg-[#090D14] border border-slate-800 rounded-xl p-3 font-mono text-xs space-y-2 animate-fadeIn max-h-[160px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                    <span className="text-[10px] text-[#2FAE79] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2FAE79] animate-pulse" />
                      TERMINAL CONSOLE LOGS
                    </span>
                    <button 
                      onClick={() => {
                        setConsoleLogs([]);
                        setShowConsole(false);
                      }}
                      className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                    >
                      Ẩn console ✕
                    </button>
                  </div>
                  <div className="space-y-1">
                    {consoleLogs.map((log, idx) => (
                      <div key={idx} className="whitespace-pre-wrap break-all text-slate-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={isEvaluating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C9962C] to-amber-500 text-black font-extrabold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#C9962C]/20 disabled:opacity-50 cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tech Lead AI Đang Phân Tích & Chấm Điểm...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Nộp Câu Trả Lời & Chấm Điểm AI (Thang 10)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5. AI Evaluation Results Panel */}
        {evaluation && (
          <div className="bg-[#161C24] rounded-2xl border border-[#C9962C]/40 p-6 shadow-2xl space-y-6 animate-fadeIn">
            {/* Score Banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0B0D11] p-5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`px-5 py-3 rounded-2xl border font-black font-mono text-3xl sm:text-4xl shadow-xl ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score} <span className="text-sm font-normal text-slate-400">/ 10</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Kết quả đánh giá:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C9962C]/20 text-[#C9962C] border border-[#C9962C]/40">
                      {evaluation.verdict}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-1 italic">
                    "{evaluation.keyAdvice}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{showModelAnswer ? 'Ẩn Đáp Án Mẫu' : 'Xem Đáp Án Chuẩn Tech Lead 2026'}</span>
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9962C] text-black text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  <span>Câu Tiếp Theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#0B0D11] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Độ Chính Xác Kỹ Thuật:</span>
                  <span className="font-bold text-emerald-400">{evaluation.technicalAccuracyScore} / 10</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(evaluation.technicalAccuracyScore / 10) * 100}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0D11] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Khái Niệm FE 2026:</span>
                  <span className="font-bold text-cyan-400">{evaluation.fe2026ConceptScore} / 10</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(evaluation.fe2026ConceptScore / 10) * 100}%` }} />
                </div>
              </div>

              <div className="bg-[#0B0D11] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Độ Rõ Ràng & Chi Tiết:</span>
                  <span className="font-bold text-amber-400">{evaluation.clarityDepthScore} / 10</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(evaluation.clarityDepthScore / 10) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Strengths and Areas to Improve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-[#0B0D11] p-4 rounded-xl border border-emerald-500/30 space-y-2">
                <h4 className="flex items-center gap-2 font-bold text-xs text-emerald-400 font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điểm Mạnh Đáng Ghi Nhận:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {evaluation.strengths.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaps to improve */}
              <div className="bg-[#0B0D11] p-4 rounded-xl border border-rose-500/30 space-y-2">
                <h4 className="flex items-center gap-2 font-bold text-xs text-rose-400 font-mono uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Lỗ Hổng Cần Bổ Sung Thêm:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {evaluation.gapsToImprove.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Lead 2026 Model Answer Collapsible */}
            {showModelAnswer && (
              <div className="bg-[#0B0D11] p-5 rounded-xl border border-amber-500/40 space-y-3 animate-fadeIn">
                <h4 className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Đáp Án Mẫu Chuẩn Senior / Tech Lead FE 2026</span>
                </h4>
                <div className="text-xs text-slate-200 leading-relaxed font-sans">
                  <MarkdownRenderer content={evaluation.techLeadModelAnswer || currentQuestion.techLeadModelAnswer} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
