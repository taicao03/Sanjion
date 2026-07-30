import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import {
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  Lightbulb,
  FileCode,
  Bookmark,
  Star,
  RefreshCw,
  Key,
  Check,
  AlertCircle,
  Wand2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Code2,
  BookOpen,
  MessageSquare,
  Flame,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Question, UserProgress } from "../../types";
import { aiService, AIEvaluationResult } from "../../services/aiService";
import { storageService } from "../../services/storageService";
import { ApiKeyModal } from "../shared/ApiKeyModal";
import { SuccessNextQuestionModal } from "./SuccessNextQuestionModal";
import { MarkdownRenderer } from "../shared/MarkdownRenderer";
import { registerMonacoSnippets } from "../../services/snippetProvider";
import confetti from "canvas-confetti";

interface CodeEditorWorkspaceProps {
  question: Question;
  progress?: UserProgress;
  isBookmarked: boolean;
  onBack: () => void;
  onSolveQuestion: (
    questionId: string,
    score: number,
    userAnswer?: string,
    aiResult?: AIEvaluationResult,
  ) => void;
  onToggleBookmark: (e: React.MouseEvent, questionId: string) => void;
  allQuestions?: Question[];
  onSelectQuestion?: (q: Question) => void;
  onGenerateNextWithAI?: () => void;
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
}

export const CodeEditorWorkspace: React.FC<CodeEditorWorkspaceProps> = ({
  question,
  progress,
  isBookmarked,
  onBack,
  onSolveQuestion,
  onToggleBookmark,
  allQuestions = [],
  onSelectQuestion,
  onGenerateNextWithAI,
  isLoggedIn = false,
  onOpenAuthModal,
}) => {
  const [activeTab, setActiveTab] = useState<"problem" | "explanation" | "ai">(
    "problem",
  );
  const [code, setCode] = useState<string>(progress?.userAnswer || "");
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(
    null,
  );
  const [theoryAnswerInput, setTheoryAnswerInput] = useState<string>(
    progress?.userAnswer || "",
  );

  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<
    { pass: boolean; msg: string }[]
  >([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [expandedGrillIndex, setExpandedGrillIndex] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "success" | "failed"
  >("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Editor View Controls, Language Selection & Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'typescript' | 'react' | 'css' | 'html'>('typescript');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [isFormattedSuccess, setIsFormattedSuccess] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  // AI evaluation states
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIEvaluationResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // Success Modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setCode(progress?.userAnswer || "");
    setSelectedQuizOption(null);
    setTheoryAnswerInput(progress?.userAnswer || "");
    setOutputLogs([]);
    setConsoleLogs([]);
    setTestResults([]);
    setFeedbackStatus(progress?.status === "SOLVED" ? "success" : "idle");
    setValidationError(null);
    setAiError(null);
    setIsSuccessModalOpen(false);

    // Restore saved AI Result if user previously evaluated this question!
    const savedAiResult = progress?.aiResult || storageService.getProgress(question.id, question.slug)?.aiResult;
    if (savedAiResult) {
      setAiResult(savedAiResult);
      setActiveTab("ai");
    } else {
      setAiResult(null);
      setActiveTab("problem");
    }
  }, [question.id]);

  const triggerConfetti = () => {
    // Editor Noir: Bỏ hiệu ứng pháo hoa confetti phô trương,
    // thay bằng sự tiết chế và chính xác của log hệ thống.
  };

  // ✨ CLEAN ES MODULE, JSX & AUTO ALIAS FUNCTION NAMES FOR BROWSER SANDBOX ✨
  const prepareCodeForRunner = (rawCode: string): string => {
    let cleaned = rawCode;
    // Strip ES Module import statements
    cleaned = cleaned.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?/gm, "");
    cleaned = cleaned.replace(/^import\s+['"].*?['"];?/gm, "");
    // Strip ES Module export statements
    cleaned = cleaned.replace(/^export\s+default\s+.*?;?/gm, "");
    cleaned = cleaned.replace(
      /^export\s+(const|let|var|function|class)/gm,
      "$1",
    );

    // Replace JSX Component returns like return ( <div>...</div> ); with return true; for sandbox testing
    cleaned = cleaned.replace(
      /return\s*\(\s*<[\s\S]*?>\s*\);?/g,
      "return true;",
    );

    // Extract declared function names from user code: function Counter() -> Counter
    const functionMatches = [
      ...cleaned.matchAll(/function\s+([a-zA-Z0-9_$]+)\s*\(/g),
    ].map((m) => m[1]);
    const constMatches = [
      ...cleaned.matchAll(
        /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\(.*?\)\s*=>)/g,
      ),
    ].map((m) => m[1]);
    const allDeclaredNames = [...functionMatches, ...constMatches];

    // Mock React hooks & global scope polyfill
    let polyfill = `
      var React = typeof React !== 'undefined' ? React : { createElement: function() { return true; } };
      var useState = typeof useState !== 'undefined' ? useState : function(initial) { return [initial, function() {}]; };
      var useEffect = typeof useEffect !== 'undefined' ? useEffect : function(fn) {};
    `;

    // Alias declared user function (e.g. Counter) to solution so test suites calling solution() execute smoothly
    if (allDeclaredNames.length > 0) {
      const mainFunc = allDeclaredNames[0];
      polyfill += `\nvar solution = typeof solution !== 'undefined' ? solution : (typeof ${mainFunc} !== 'undefined' ? ${mainFunc} : function() { return true; });`;
    } else {
      polyfill += `\nvar solution = typeof solution !== 'undefined' ? solution : function() { return true; };`;
    }

    return polyfill + "\n" + cleaned.trim();
  };

  // ✨ 100% PERFECT INDUSTRY-STANDARD PRETTIER FORMAT ENGINE ✨
  const handleFormatCode = async () => {
    try {
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel, parserEstree],
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
      });

      setCode(formatted);
      setIsFormattedSuccess(true);
      setTimeout(() => setIsFormattedSuccess(false), 1500);
    } catch (err: any) {
      console.warn("Prettier format fallback:", err);
      if (editorRef.current) {
        try {
          await editorRef.current
            .getAction("editor.action.formatDocument")
            ?.run();
          setIsFormattedSuccess(true);
          setTimeout(() => setIsFormattedSuccess(false), 1500);
        } catch (e) {
          // Silent fallback
        }
      }
    }
  };

  // Helper to accurately compare actual returned result with expected test case output
  const checkTestCaseMatch = (actual: any, expected: any): boolean => {
    if (expected === undefined) {
      return actual !== undefined && actual !== null;
    }
    if (actual === expected) {
      return true;
    }
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr === expectedStr) {
      return true;
    }
    if (typeof actual === "string" && typeof expected === "string") {
      return actual.trim() === expected.trim();
    }
    if (typeof actual === "number" && typeof expected === "number") {
      return Math.abs(actual - expected) < 1e-6;
    }
    return false;
  };

  // 1. SMART FLEXIBLE TEST RUNNER (RUN ONLY - DOES NOT SOLVE OR OPEN MODAL)
  const handleRunTests = () => {
    setValidationError(null);

    if (!code || code.trim().length === 0) {
      setValidationError(
        "⚠️ Vui lòng viết mã giải thuật trước khi bấm Chạy Thử Code!",
      );
      return;
    }

    setIsEvaluating(true);
    setTestResults([]);
    setConsoleLogs([]);
    setOutputLogs(["🚀 Đang khởi chạy JavaScript Sandbox Environment..."]);

    const executableCode = prepareCodeForRunner(code);

    setTimeout(() => {
      const logs: string[] = ["Executing Solution Code..."];
      const results: { pass: boolean; msg: string }[] = [];
      const intercepted: string[] = [];

      // Save original console methods
      const originalConsole = {
        log: window.console.log,
        warn: window.console.warn,
        error: window.console.error
      };

      // Override console methods temporarily
      window.console.log = (...args: any[]) => {
        intercepted.push(args.map(arg => {
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
        originalConsole.log.apply(window.console, args);
      };

      window.console.warn = (...args: any[]) => {
        intercepted.push('⚠️ Warning: ' + args.map(arg => String(arg)).join(' '));
        originalConsole.warn.apply(window.console, args);
      };

      window.console.error = (...args: any[]) => {
        intercepted.push('❌ Error: ' + args.map(arg => String(arg)).join(' '));
        originalConsole.error.apply(window.console, args);
      };

      try {
        // Verify code syntax compilation
        const compilationCheck = new Function(executableCode);
        compilationCheck();
        logs.push("✅ Biên dịch mã nguồn hợp lệ không có lỗi cú pháp!");

        if (question.testCases && question.testCases.length > 0) {
          question.testCases.forEach((tc, idx) => {
            try {
              const testFn = new Function(executableCode + "\n" + tc.input);
              const actual = testFn();
              const expectedStr = JSON.stringify(tc.expected);
              const actualStr = JSON.stringify(actual);

              const isMatch = checkTestCaseMatch(actual, tc.expected);

              results.push({
                pass: isMatch,
                msg: isMatch ? `✓ Test Case #${idx + 1}: Passed` : `✗ Test Case #${idx + 1}: Failed (Expected ${expectedStr}, got ${actualStr})`,
              });
            } catch (err: any) {
              results.push({
                pass: false,
                msg: `✗ Test Case #${idx + 1}: Error: ${err.message}`,
              });
            }
          });
        } else {
          results.push({ pass: true, msg: "✓ Code executed successfully." });
        }
      } catch (err: any) {
        logs.push(`✗ Compilation Error: ${err.message}`);
        results.push({ pass: false, msg: `✗ ${err.message}` });
      } finally {
        // RESTORE original console methods immediately!
        window.console.log = originalConsole.log;
        window.console.warn = originalConsole.warn;
        window.console.error = originalConsole.error;
      }

      setConsoleLogs(intercepted);
      setOutputLogs(logs);
      setTestResults(results);
      setIsEvaluating(false);
    }, 350);
  };

  // 2. SUBMIT SOLUTION (RUNS TESTS, SOLVES IF ALL PASS, OPENS SUCCESS MODAL)
  const handleSubmitSolution = () => {
    setValidationError(null);

    if (!isLoggedIn) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!code || code.trim().length === 0) {
      setValidationError(
        "⚠️ Vui lòng viết mã giải thuật trước khi bấm Nộp Bài!",
      );
      return;
    }

    setIsEvaluating(true);
    setTestResults([]);
    setConsoleLogs([]);
    setOutputLogs(["🚀 Đang khởi chạy JavaScript Sandbox Environment..."]);

    const executableCode = prepareCodeForRunner(code);

    setTimeout(() => {
      const logs: string[] = ["Executing Solution Code..."];
      const results: { pass: boolean; msg: string }[] = [];
      const intercepted: string[] = [];

      // Save original console methods
      const originalConsole = {
        log: window.console.log,
        warn: window.console.warn,
        error: window.console.error
      };

      // Override console methods temporarily
      window.console.log = (...args: any[]) => {
        intercepted.push(args.map(arg => {
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
        originalConsole.log.apply(window.console, args);
      };

      window.console.warn = (...args: any[]) => {
        intercepted.push('⚠️ Warning: ' + args.map(arg => String(arg)).join(' '));
        originalConsole.warn.apply(window.console, args);
      };

      window.console.error = (...args: any[]) => {
        intercepted.push('❌ Error: ' + args.map(arg => String(arg)).join(' '));
        originalConsole.error.apply(window.console, args);
      };

      let allPassed = true;

      try {
        // Verify code syntax compilation
        const compilationCheck = new Function(executableCode);
        compilationCheck();
        logs.push("✅ Biên dịch mã nguồn hợp lệ không có lỗi cú pháp!");

        if (question.testCases && question.testCases.length > 0) {
          question.testCases.forEach((tc, idx) => {
            try {
              const testFn = new Function(executableCode + "\n" + tc.input);
              const actual = testFn();
              const expectedStr = JSON.stringify(tc.expected);
              const actualStr = JSON.stringify(actual);

              const isMatch = checkTestCaseMatch(actual, tc.expected);

              if (!isMatch) {
                allPassed = false;
              }

              results.push({
                pass: isMatch,
                msg: isMatch ? `✓ Test Case #${idx + 1}: Passed` : `✗ Test Case #${idx + 1}: Failed (Expected ${expectedStr}, got ${actualStr})`,
              });
            } catch (err: any) {
              allPassed = false;
              results.push({
                pass: false,
                msg: `✗ Test Case #${idx + 1}: Error: ${err.message}`,
              });
            }
          });
        } else {
          results.push({ pass: true, msg: "✓ All tests passed — nice work." });
        }

        if (allPassed) {
          setFeedbackStatus("success");
          onSolveQuestion(question.id, question.points, code);
          setTimeout(() => setIsSuccessModalOpen(true), 350);
        } else {
          setFeedbackStatus("failed");
          logs.push("❌ Một số testcase chưa vượt qua. Vui lòng kiểm tra lại giải thuật trước khi nộp!");
        }
      } catch (err: any) {
        logs.push(`✗ Compilation Error: ${err.message}`);
        results.push({ pass: false, msg: `✗ ${err.message}` });
        setFeedbackStatus("failed");
      } finally {
        // RESTORE original console methods immediately!
        window.console.log = originalConsole.log;
        window.console.warn = originalConsole.warn;
        window.console.error = originalConsole.error;
      }

      setConsoleLogs(intercepted);
      setOutputLogs(logs);
      setTestResults(results);
      setIsEvaluating(false);
    }, 350);
  };

  // STRICT QUIZ SUBMISSION
  const handleSubmitQuiz = () => {
    setValidationError(null);

    if (!isLoggedIn) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!selectedQuizOption || !question.options) {
      setValidationError("⚠️ Vui lòng chọn 1 đáp án trước khi nộp bài!");
      return;
    }

    const chosen = question.options.find((o) => o.id === selectedQuizOption);
    if (chosen?.is_correct) {
      setFeedbackStatus("success");
      triggerConfetti();
      onSolveQuestion(question.id, question.points, selectedQuizOption);
      setTimeout(() => setIsSuccessModalOpen(true), 350);
    } else {
      setFeedbackStatus("failed");
      setValidationError(
        "❌ Rất tiếc, đáp án bạn chọn chưa chính xác! Vui lòng đọc kỹ đề bài và thử lại.",
      );
    }
  };

  // STRICT THEORY SUBMISSION
  const handleSubmitTheory = () => {
    setValidationError(null);

    if (!isLoggedIn) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    if (!theoryAnswerInput || theoryAnswerInput.trim().length < 20) {
      setValidationError(
        "⚠️ Vui lòng nhập tối thiểu 20 ký tự giải thích chi tiết trước khi hoàn thành bài tập!",
      );
      return;
    }

    setFeedbackStatus("success");
    triggerConfetti();
    onSolveQuestion(question.id, question.points, theoryAnswerInput);
    setTimeout(() => setIsSuccessModalOpen(true), 350);
  };

  // AI Evaluation Trigger (PERSISTS AI Tab State!)
  const handleEvaluateWithAI = async () => {
    setValidationError(null);

    if (!isLoggedIn) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    const answerToEvaluate =
      question.type === "CODING_PRACTICE" ? code : theoryAnswerInput;

    if (!answerToEvaluate || answerToEvaluate.trim().length < 10) {
      setAiError(
        "Vui lòng nhập câu trả lời hoặc viết code chi tiết trước khi gửi Gemini AI Sanjioner nhận xét.",
      );
      return;
    }

    const apiKey = aiService.getStoredApiKey();
    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setActiveTab("ai");

    try {
      const res = await aiService.evaluateTheoryAnswer(
        question.title,
        question.content,
        answerToEvaluate,
        apiKey,
      );
      setAiResult(res);

      // Persist AI evaluation result locally immediately so switching questions preserves recommendations & grill-me
      storageService.saveProgress(
        question.id,
        res.score >= 6 ? "SOLVED" : "ATTEMPTED",
        res.score >= 6 ? question.points : 0,
        answerToEvaluate,
        question.slug,
        undefined,
        res,
      );

      if (res.score >= 6) {
        setFeedbackStatus("success");
        triggerConfetti();
        onSolveQuestion(question.id, question.points, answerToEvaluate, res);
      } else {
        setFeedbackStatus("failed");
        onSolveQuestion(question.id, 0, answerToEvaluate, res);
        setValidationError(
          `❌ Bài làm chưa đạt điểm qua (Điểm AI: ${res.score}/10). Vui lòng xem nhận xét chi tiết bên dưới!`,
        );
      }
    } catch (err: any) {
      setAiError(err.message || "Lỗi xảy ra khi gọi Gemini API");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-auto lg:h-[calc(100vh-5rem)] max-w-[1400px] mx-auto px-2 sm:px-4 pb-20 lg:pb-0 font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between py-2.5 sm:py-3 border-b border-white/[0.06] gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#161B22] hover:bg-white/[0.04] border border-white/[0.06] text-[#EDEFF2] text-xs font-mono transition-colors flex-shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9962C]" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <h2 className="text-sm sm:text-base font-sans font-bold text-[#FFFFFF] truncate">
            {question.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#5B54D9]/10 hover:bg-[#5B54D9]/20 border border-[#5B54D9]/30 text-xs text-[#EDEFF2] font-mono cursor-pointer"
            title="Cấu hình Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#5B54D9]" />
            <span className="hidden sm:inline">Gemini API Key</span>
          </button>

          <button
            onClick={(e) => onToggleBookmark(e, question.id)}
            className={`p-2 rounded border transition-colors cursor-pointer ${
              isBookmarked
                ? "bg-[#C9962C]/10 border-[#C9962C]/40 text-[#C9962C]"
                : "bg-[#161B22] border-white/[0.06] text-[#8B94A3] hover:text-[#EDEFF2]"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-[#C9962C]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Main Workspace Split Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3 overflow-hidden min-h-0">
        {/* Left Side: Question details & tabs */}
        <div className="bg-[#181F2A] rounded-lg border border-slate-700/60 p-4 flex flex-col h-full overflow-hidden shadow-lg">
          {/* Tab buttons (VS Code style tabs) */}
          <div className="flex bg-[#0F141C] p-1 rounded border border-slate-700/60 mb-4 flex-shrink-0 text-xs font-mono">
            <button
              onClick={() => setActiveTab("problem")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
                activeTab === "problem"
                  ? "bg-[#181F2A] text-white border-b-2 border-[#C9962C]"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Đề bài bài tập
            </button>
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-colors ${
                activeTab === "explanation"
                  ? "bg-[#181F2A] text-[#2FAE79] border-b-2 border-[#2FAE79]"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Lời Giải Mẫu
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-1.5 text-xs font-mono font-bold rounded transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "ai"
                  ? "bg-[#5B54D9]/30 text-white border-b-2 border-[#5B54D9]"
                  : "text-[#5B54D9] hover:bg-[#5B54D9]/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5B54D9]" />
              AI Sanjioner
            </button>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="mb-3 p-3 rounded bg-[#C1553B]/20 border border-[#C1553B]/50 text-[#C1553B] text-xs font-mono flex items-center gap-2 flex-shrink-0 animate-fadeIn font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {activeTab === "problem" ? (
              <div className="space-y-4">
                {/* Question metadata badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#0F141C] text-[#2FAE79] border border-[#2FAE79]/50 font-bold">
                    {question.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0F141C] text-[#C9962C] border border-[#C9962C]/50 font-bold">
                    +{question.points} XP
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0F141C] text-slate-200 border border-slate-700 font-bold">
                    {question.type}
                  </span>
                </div>

                {/* Markdown Question Content using prose-custom */}
                <div className="prose-custom max-w-none">
                  <MarkdownRenderer content={question.content} />
                </div>

                {/* Multiple choice options */}
                {question.type === "MULTIPLE_CHOICE" && question.options && (
                  <div className="space-y-2 mt-4 font-mono">
                    <label className="block text-white text-xs font-bold">
                      Chọn 1 đáp án đúng nhất:
                    </label>
                    {question.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                          selectedQuizOption === opt.id
                            ? "bg-[#C9962C]/20 border-[#C9962C] text-white font-bold"
                            : "bg-black/40 border-white/10 text-slate-200 hover:border-white/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="quiz-option"
                          checked={selectedQuizOption === opt.id}
                          onChange={() => {
                            setSelectedQuizOption(opt.id);
                            setValidationError(null);
                          }}
                          className="accent-[#C9962C]"
                        />
                        <span className="text-xs">{opt.text}</span>
                      </label>
                    ))}

                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!selectedQuizOption}
                      className="w-full mt-3 py-2 rounded bg-[#2FAE79] hover:bg-[#2FAE79]/90 text-[#0B0D11] font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Nộp câu trả lời Sanjion
                    </button>
                  </div>
                )}

                {/* Theory Answer Input */}
                {question.type === "THEORY" && (
                  <div className="space-y-3 mt-4 font-mono">
                    <label className="block text-[#8B94A3] text-xs">
                      Nhập câu trả lời lý thuyết Sanjion của bạn (tối thiểu 20
                      ký tự):
                    </label>
                    <textarea
                      rows={5}
                      value={theoryAnswerInput}
                      onChange={(e) => {
                        setTheoryAnswerInput(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Trình bày giải thích chi tiết, các ý chính và ví dụ minh họa..."
                      className="w-full p-3 bg-[#0B0D11] border border-white/[0.06] rounded text-xs text-[#EDEFF2] placeholder-[#8B94A3]/50 focus:outline-none focus:border-[#C9962C]/50 font-mono"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleEvaluateWithAI}
                        disabled={isAiLoading}
                        className="flex-1 py-2 rounded border border-[#5B54D9] bg-[#5B54D9]/20 text-[#EDEFF2] hover:bg-[#5B54D9]/30 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isAiLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-[#5B54D9]" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-[#5B54D9]" />
                        )}
                        Gửi Gemini AI Sanjioner Chấm Bài
                      </button>

                      <button
                        onClick={handleSubmitTheory}
                        className="py-2 px-4 rounded bg-[#2FAE79] hover:bg-[#2FAE79]/90 text-[#0B0D11] font-bold text-xs cursor-pointer transition-colors"
                      >
                        Nộp bài & Hoàn thành
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === "explanation" ? (
              <div className="space-y-3 animate-fadeIn font-mono">
                <div className="p-3 rounded bg-[#2FAE79]/10 border border-[#2FAE79]/30 text-[#2FAE79] text-xs flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 flex-shrink-0" />
                  <span>Lời giải chi tiết & Best Practice:</span>
                </div>
                <div className="bg-[#0B0D11] p-4 rounded border border-white/[0.06] text-xs text-[#EDEFF2] leading-relaxed">
                  <MarkdownRenderer content={question.explanation} />
                </div>
              </div>
            ) : (
              /* AI Tab - PR Comment Style */
              <div className="space-y-4 animate-fadeIn font-mono">
                {isAiLoading ? (
                  <div className="py-12 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#5B54D9] animate-spin mx-auto" />
                    <p className="text-xs text-[#8B94A3]">
                      Gemini Sanjioner đang tiến hành Code Review...
                    </p>
                  </div>
                ) : aiError ? (
                  <div className="p-4 rounded bg-[#C1553B]/10 border border-[#C1553B]/30 text-[#C1553B] text-xs">
                    {aiError}
                  </div>
                ) : aiResult ? (
                  <div className="space-y-4 border-l-2 border-[#5B54D9] pl-3">
                    {/* Pull Request Comment Header */}
                    <div className="flex items-center justify-between bg-[#0B0D11] p-3 rounded border border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#5B54D9] flex items-center justify-center text-white text-[10px] font-bold">
                          AI
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#EDEFF2]">
                            Gemini Sanjioner
                          </span>
                          <span className="text-[10px] text-[#8B94A3] ml-2">
                            commented on PR
                          </span>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#C9962C]">
                        {aiResult.score} / 10
                      </div>
                    </div>

                    {/* Verdict */}
                    <div className="text-xs text-[#8B94A3] bg-[#0B0D11] p-3 rounded border border-white/[0.04]">
                      <span className="font-bold text-[#EDEFF2]">
                        Review Summary:{" "}
                      </span>
                      {aiResult.verdict}
                    </div>

                    {/* Next Question CTA */}
                    {aiResult.score >= 6 && (
                      <button
                        onClick={() => setIsSuccessModalOpen(true)}
                        className="w-full py-2 rounded bg-[#2FAE79] text-[#0B0D11] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        ✓ Review Passed — Sang câu tiếp theo
                      </button>
                    )}

                    {/* Strengths */}
                    <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
                      <h5 className="text-xs font-bold text-[#2FAE79] mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Strengths:
                      </h5>
                      <ul className="list-disc list-inside text-xs text-[#EDEFF2] space-y-1">
                        {aiResult.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
                      <h5 className="text-xs font-bold text-[#C1553B] mb-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Suggested Improvements:
                      </h5>
                      <ul className="list-disc list-inside text-xs text-[#EDEFF2] space-y-1">
                        {aiResult.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Senior Solution */}
                    <div className="p-3 bg-[#0B0D11] border border-white/[0.04] rounded">
                      <h5 className="text-xs font-bold text-[#818CF8] mb-2">
                        Senior Best Practice Solution:
                      </h5>
                      <div className="text-xs text-[#EDEFF2] leading-relaxed">
                        <MarkdownRenderer
                          content={aiResult.seniorBestPractice}
                        />
                      </div>
                    </div>

                    {/* WIDGET 1: 📚 BÀI TẬP KHUYÊN HỌC THÊM (RECOMMENDED PRACTICE QUESTIONS) */}
                    {allQuestions && allQuestions.length > 0 && (
                      <div className="p-3 bg-[#0B0D11] border border-slate-700/60 rounded-xl space-y-2.5">
                        <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          📚 Bài Tập Gợi Ý Nên Ôn Thêm:
                        </h5>
                        <div className="space-y-2">
                          {allQuestions
                            .filter((q) => q.id !== question.id)
                            .filter((q) => {
                              if (q.categoryId && q.categoryId === question.categoryId) return true;
                              if (aiResult.recommendedTopics && Array.isArray(aiResult.recommendedTopics)) {
                                return aiResult.recommendedTopics.some((topic) =>
                                  q.title.toLowerCase().includes(topic.toLowerCase()) ||
                                  q.tags?.some((t) => t.toLowerCase().includes(topic.toLowerCase()))
                                );
                              }
                              return q.difficulty === question.difficulty;
                            })
                            .slice(0, 3)
                            .map((recQ) => (
                              <div
                                key={recQ.id}
                                className="p-2.5 rounded-lg bg-[#181F2A] border border-slate-700/50 hover:border-amber-400/50 flex items-center justify-between gap-2 transition-all group cursor-pointer"
                                onClick={() => onSelectQuestion && onSelectQuestion(recQ)}
                              >
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                                    {recQ.title}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                                      {recQ.difficulty}
                                    </span>
                                    <span>+{recQ.points} XP</span>
                                  </div>
                                </div>
                                <button className="flex-shrink-0 px-2 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400 hover:text-slate-950 font-bold text-[11px] transition-colors flex items-center gap-1">
                                  <span>Luyện Bài Này</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* WIDGET 2: 🔥 CÂU HỎI PHỎNG VẤN CHUYÊN SÂU (/grill-me) */}
                    <div className="p-3.5 bg-[#0F141C] border border-[#5B54D9]/40 rounded-xl space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-[#818CF8] flex items-center gap-1.5 uppercase tracking-wider">
                          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                          🔥 Câu Hỏi Phỏng Vấn Drill-Down (/grill-me):
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#5B54D9]/20 text-[#818CF8] border border-[#5B54D9]/40">
                          AI Senior Interview
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Các câu hỏi tự luận phỏng vấn bên dưới được AI thiết kế riêng xoáy sâu vào đúng các lỗi sai bạn vừa gặp để kiểm tra tư duy sâu:
                      </p>

                      <div className="space-y-2">
                        {(aiResult.grillMeQuestions && aiResult.grillMeQuestions.length > 0
                          ? aiResult.grillMeQuestions
                          : [
                              {
                                question: `Tại sao mệnh đề kiểm tra trong bài làm của bạn lại chưa ngăn chặn được trường hợp Runtime Error khi nhận dữ liệu không đúng định dạng?`,
                                concept: 'Guard Clause & Type Safety',
                                hint: 'Nên dùng `if (!Array.isArray(data))` để return sớm thay vì thực thi luồng chính khi dữ liệu không hợp lệ.'
                              },
                              {
                                question: `Khi thao tác với mảng lớn trong JavaScript, việc chaining nhiều phương thức filter().map() ảnh hưởng thế nào đến hiệu năng so với 1 vòng lặp reduce()?`,
                                concept: 'Performance & Iteration Complexity',
                                hint: 'reduce() cho phép kết hợp lọc và biến đổi trong 1 lượt duyệt duy nhất O(N), tránh tạo mảng trung gian.'
                              }
                            ]
                        ).map((qItem, idx) => {
                          const isExpanded = expandedGrillIndex === idx;
                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-[#181F2A] border border-slate-700/60 space-y-2 text-slate-100"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/50 mb-1 inline-block">
                                    {qItem.concept}
                                  </span>
                                  <h6 className="text-xs font-bold leading-snug text-slate-100">
                                    {idx + 1}. {qItem.question}
                                  </h6>
                                </div>
                              </div>

                              {/* Accordion Hint Box */}
                              {isExpanded && (
                                <div className="mt-2 p-2.5 rounded-lg bg-[#0F141C] border border-slate-700/50 text-xs text-slate-200 leading-relaxed animate-fadeIn">
                                  <div className="font-bold text-amber-300 text-[11px] mb-1">
                                    💡 Gợi ý / Đáp án mẫu Senior:
                                  </div>
                                  <MarkdownRenderer content={qItem.hint} />
                                </div>
                              )}

                              {/* Interactive Action Buttons */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                  onClick={() =>
                                    setExpandedGrillIndex(isExpanded ? null : idx)
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                      <span>Ẩn Gợi Ý</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      <span>👁️ Xem Gợi Ý / Đáp Án</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    const promptText = `/grill-me Hãy phỏng vấn tôi về câu hỏi: "${qItem.question}" (Chủ đề: ${qItem.concept}). Vấn đề tôi vừa mắc phải: "${qItem.hint}". Đặt câu hỏi phỏng vấn ngắn đầu tiên để tôi trả lời nhé!`;
                                    window.dispatchEvent(
                                      new CustomEvent("sanjion-ask-ai", {
                                        detail: { prompt: promptText },
                                      })
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#5B54D9] hover:bg-[#5B54D9]/90 text-white font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5B54D9]/20"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                                  <span>💬 Phỏng vấn 1-1 với AI Tutor (/grill-me)</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#8B94A3]">
                    Nhấn{" "}
                    <span className="text-[#5B54D9] font-bold">
                      "Gửi Gemini AI Sanjioner Chấm Bài"
                    </span>{" "}
                    để chạy Code Review.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor & Test Terminal */}
        <div
          className={`bg-[#0B0D11] rounded-lg border border-white/[0.06] overflow-hidden flex flex-col h-full transition-all ${
            isFullscreen
              ? "fixed inset-0 z-50 rounded-none border-none p-3 bg-[#0B0D11]"
              : "relative"
          }`}
        >
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between bg-[#161B22] px-3 py-2 border-b border-white/[0.06] gap-1.5 font-mono">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C1553B]/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9962C]/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2FAE79]/80"></span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Language Selector Dropdown Button */}
              <div className="relative flex-shrink-0 group">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className={`h-7 whitespace-nowrap px-2 rounded bg-[#0B0D11] hover:bg-white/[0.04] text-[#C9962C] text-xs font-mono transition-all border border-white/[0.06] flex items-center gap-1.5 cursor-pointer ${
                    isLangDropdownOpen ? 'border-amber-500/50 bg-[#C9962C]/10' : ''
                  }`}
                  title="Chọn ngôn ngữ lập trình (JS / TS / React / CSS / HTML)"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#C9962C] flex-shrink-0" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block uppercase font-mono font-black text-[11px]">
                    {selectedLanguage === 'javascript'
                      ? 'JS'
                      : selectedLanguage === 'typescript'
                      ? 'TS'
                      : selectedLanguage === 'react'
                      ? 'React TSX'
                      : selectedLanguage === 'css'
                      ? 'CSS'
                      : 'HTML'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 flex-shrink-0 transition-transform ${isLangDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-[#161B22] border border-white/10 shadow-2xl p-1 z-50 animate-fadeIn space-y-0.5 text-xs font-mono">
                    {[
                      { id: 'typescript', label: '🔷 TypeScript (TS)', lang: 'typescript' },
                      { id: 'javascript', label: '⚡ JavaScript (JS)', lang: 'javascript' },
                      { id: 'react', label: '⚛️ React (TSX)', lang: 'typescript' },
                      { id: 'css', label: '🎨 CSS', lang: 'css' },
                      { id: 'html', label: '🌐 HTML', lang: 'html' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(item.id as any);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-bold transition-all cursor-pointer ${
                          selectedLanguage === item.id
                            ? 'bg-purple-600/20 text-amber-300 border border-purple-500/40'
                            : 'text-slate-300 hover:bg-[#232A35] hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {selectedLanguage === item.id && <Check className="w-3 h-3 text-amber-300" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Size Controls */}
              <div className="h-7 flex items-center bg-[#0B0D11] rounded border border-white/[0.06] px-1 text-[11px] text-[#8B94A3] flex-shrink-0 group" title={`Cỡ chữ hiện tại: ${fontSize}px`}>
                <button
                  onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                  className="p-1 text-[#8B94A3] hover:text-[#EDEFF2] transition-colors cursor-pointer"
                  title="Giảm cỡ chữ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block px-1 font-mono text-[10px] font-bold text-[#EDEFF2]">
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize((f) => Math.min(22, f + 1))}
                  className="p-1 text-[#8B94A3] hover:text-[#EDEFF2] transition-colors cursor-pointer"
                  title="Tăng cỡ chữ"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Format Button */}
              <button
                onClick={handleFormatCode}
                className="h-7 whitespace-nowrap px-2 rounded bg-[#0B0D11] hover:bg-white/[0.04] text-[#C9962C] text-xs font-mono transition-all border border-white/[0.06] flex items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                title="Format code (Tự động sắp xếp code đẹp chuẩn Prettier)"
              >
                {isFormattedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-[#2FAE79] flex-shrink-0" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-[#C9962C] flex-shrink-0" />
                )}
                <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block font-sans text-[11px] font-bold">
                  {isFormattedSuccess ? "Đã Format" : "Format"}
                </span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`h-7 whitespace-nowrap px-2 rounded text-xs font-mono transition-all border flex items-center gap-1.5 flex-shrink-0 cursor-pointer group ${
                  isFullscreen
                    ? "bg-[#C1553B] text-[#EDEFF2] border-[#C1553B]"
                    : "bg-[#0B0D11] text-[#8B94A3] hover:text-[#EDEFF2] border-white/[0.06]"
                }`}
                title={isFullscreen ? "Thu nhỏ giao diện" : "Phóng to giao diện"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block font-sans text-[11px] font-bold">
                  {isFullscreen ? "Thu Nhỏ" : "Phóng To"}
                </span>
              </button>

              {question.type === "CODING_PRACTICE" && (
                <>
                  <button
                    onClick={handleEvaluateWithAI}
                    disabled={isAiLoading}
                    title="Chấm AI (Trợ lý AI đánh giá & giải thích chi tiết)"
                    className="h-7 whitespace-nowrap px-2 rounded border border-[#5B54D9]/40 bg-[#5B54D9]/20 hover:bg-[#5B54D9]/30 text-[#EDEFF2] text-xs font-mono transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50 group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#5B54D9] flex-shrink-0" />
                    <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block font-sans text-[11px] font-bold">
                      Chấm AI
                    </span>
                  </button>

                  <button
                    onClick={handleRunTests}
                    disabled={isEvaluating}
                    title="Chạy Thử Code (Chỉ chạy test và in log ra console, không nộp bài)"
                    className="h-7 whitespace-nowrap px-2 rounded border border-[#2FAE79] bg-[#2FAE79]/20 hover:bg-[#2FAE79]/30 text-[#2FAE79] text-xs font-mono font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50 group"
                  >
                    {isEvaluating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-[#2FAE79] fill-current flex-shrink-0" />
                    )}
                    <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block font-sans text-[11px] font-bold">
                      Chạy Thử Code
                    </span>
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    disabled={isEvaluating}
                    title="Nộp Bài (Kiểm tra và hoàn thành thử thách, cộng điểm XP)"
                    className="h-7 whitespace-nowrap px-2 rounded border border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-black transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50 group"
                  >
                    <Check className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
                    <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden inline-block font-sans text-[11px] font-bold">
                      Nộp Bài
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 min-h-[220px] relative">
            <Editor
              height="100%"
              language={selectedLanguage === 'react' ? 'typescript' : selectedLanguage}
              theme="editor-noir"
              value={code}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                // Define Custom Editor Noir Theme
                monaco.editor.defineTheme("editor-noir", {
                  base: "vs-dark",
                  inherit: true,
                  rules: [
                    {
                      token: "comment",
                      foreground: "8B94A3",
                      fontStyle: "italic",
                    },
                    {
                      token: "keyword",
                      foreground: "5B54D9",
                      fontStyle: "bold",
                    },
                    { token: "string", foreground: "2FAE79" },
                    { token: "number", foreground: "C9962C" },
                  ],
                  colors: {
                    "editor.background": "#0B0D11",
                    "editor.foreground": "#EDEFF2",
                    "editor.lineHighlightBackground": "#161B22",
                    "editorCursor.foreground": "#C9962C",
                    "editorIndentGuide.background": "#232A35",
                  },
                });
                monaco.editor.setTheme("editor-noir");
                registerMonacoSnippets(monaco);
              }}
              onChange={(v) => {
                setCode(v || "");
                setValidationError(null);
              }}
              options={{
                fontSize: fontSize,
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 12 },
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                renderLineHighlight: "all",
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                folding: true,
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
                snippetSuggestions: "top",
                suggestOnTriggerCharacters: true,
                tabCompletion: "on",
                acceptSuggestionOnEnter: "on",
                wordBasedSuggestions: "allDocuments",
                parameterHints: { enabled: true },
              }}
            />
          </div>

          {/* Test Runner Output Terminal */}
          <div className="h-44 bg-[#0B0D11] border-t border-white/[0.06] p-3 font-mono text-xs overflow-y-auto">
            <div className="flex items-center justify-between text-[#8B94A3] mb-2 pb-1 border-b border-white/[0.04]">
              <span className="font-bold flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-[#C9962C]" />
                Console & Test Output:
              </span>
              {feedbackStatus === "success" && (
                <span className="text-[#2FAE79] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2FAE79]" />
                  PASSED (+{question.points} XP)
                </span>
              )}
            </div>

            <div className="space-y-3">
              {/* 1. Captured console.log output */}
              {consoleLogs.length > 0 && (
                <div className="space-y-1 bg-[#090D14] p-2.5 rounded border border-white/[0.04]">
                  <div className="text-[10px] text-[#2FAE79] font-extrabold tracking-wider uppercase mb-1">
                    Stdout Logs:
                  </div>
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-300 whitespace-pre-wrap break-all">
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Test Case Results */}
              {testResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-[10px] text-amber-400 font-extrabold tracking-wider uppercase mb-1">
                    Test Cases:
                  </div>
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 ${tr.pass ? "text-[#2FAE79]" : "text-[#C1553B]"}`}
                    >
                      <span>{tr.msg}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 text-[#8B94A3]">
                  {outputLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                  {outputLogs.length === 0 && (
                    <div>$ Press "Chạy Test Code" to execute test runner...</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessNextQuestionModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        earnedPoints={question.points}
        currentQuestion={question}
        allQuestions={allQuestions}
        onNextQuestion={(q: Question) => {
          setIsSuccessModalOpen(false);
          if (onSelectQuestion) onSelectQuestion(q);
        }}
        onGenerateNextWithAI={() => {
          setIsSuccessModalOpen(false);
          if (onGenerateNextWithAI) onGenerateNextWithAI();
        }}
        onBackToBank={() => {
          setIsSuccessModalOpen(false);
          onBack();
        }}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={() => {
          setIsKeyModalOpen(false);
        }}
      />
    </div>
  );
};
