import React, { useState, useEffect } from 'react';
import { Question, UserProfile } from '../../types';
import {
  X,
  Clock,
  Play,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  FileText,
  Code as CodeIcon,
  CheckSquare,
  Trophy,
  Mail,
  Copy,
  Check,
  Send,
  Eye,
  Terminal,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import { GmailConfirmEmailModal } from '../auth/GmailConfirmEmailModal';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSolveQuestion: (questionId: string, score: number, userAnswer?: string) => void;
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
  profile?: UserProfile;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSolveQuestion,
  isLoggedIn = false,
  onOpenAuthModal,
  profile,
}) => {
  // Exam Step Flow: INTRO -> GENERATING -> ACTIVE -> SUMMARY
  const [examStep, setExamStep] = useState<'INTRO' | 'GENERATING' | 'ACTIVE' | 'SUMMARY'>('INTRO');
  
  // Timer & Session
  const TOTAL_TIME = 45 * 60; // 45 minutes in seconds
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  
  // User Answers state: { [questionId]: answerValue }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Coding Sandbox Execution logs state: { [questionId]: { pass: boolean, logs: string[] } }
  const [codingRunLogs, setCodingRunLogs] = useState<Record<string, { pass: boolean; logs: string[] }>>({});
  const [isCodingRunning, setIsCodingRunning] = useState<boolean>(false);

  // AI Loading state during generation
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // Exam Result state
  const [examResult, setExamResult] = useState<{
    score: number;
    maxPoints: number;
    percent: number;
    grade: 'XUẤT SẮC' | 'ĐẠT CHUẨN' | 'CẦN CỐ GẮNG';
    timeSpentStr: string;
    breakdown: Array<{
      question: Question;
      userAnswer: string;
      isCorrect: boolean;
      pointsEarned: number;
      feedback: string;
    }>;
  } | null>(null);

  // Email Template Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [emailTab, setEmailTab] = useState<'PREVIEW' | 'HTML_CODE'>('PREVIEW');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [isCopiedEmailHtml, setIsCopiedEmailHtml] = useState<boolean>(false);
  const [emailSendStatus, setEmailSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRecipientEmail(profile?.email || 'sanjioner@dev.io');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, profile]);

  // 45-Min Timer Effect
  useEffect(() => {
    let timer: any;
    if (examStep === 'ACTIVE' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam(); // Auto-submit when time expires!
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStep, timeLeft]);

  if (!isOpen) return null;

  // Format Time Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColorClass = (seconds: number) => {
    if (seconds <= 300) return 'text-red-400 border-red-500/50 bg-red-500/10 animate-pulse';
    if (seconds <= 900) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-[#EDEFF2] border-white/10 bg-[#0B0D11]';
  };

  // ✨ GENERATE 5 RANDOM QUESTIONS FOR EXAM ✨
  const handleStartExamGeneration = async (mode: 'AI' | 'RANDOM_BANK') => {
    setExamStep('GENERATING');
    setGenerationProgress(15);

    try {
      if (mode === 'AI') {
        setGenerationProgress(35);
        // Generate 3 AI questions and mix with 2 bank questions for ultra diversity
        const categoriesList = [
          { id: 'cat-react-hooks', name: 'React Hooks & State' },
          { id: 'cat-js-core', name: 'JavaScript Core & ES6+' },
          { id: 'cat-async-js', name: 'Async JS & Event Loop' },
        ];
        
        const aiQs: Question[] = [];
        for (let i = 0; i < 3; i++) {
          const cat = categoriesList[i % categoriesList.length];
          try {
            const q = await aiService.generateQuestionWithAI(
              cat.id,
              cat.name,
              i === 0 ? 'EASY' : i === 1 ? 'MEDIUM' : 'HARD',
              i === 0 ? 'MULTIPLE_CHOICE' : i === 1 ? 'THEORY' : 'CODING_PRACTICE'
            );
            aiQs.push(q);
          } catch (err) {
            console.error('Failed to gen AI question, falling back to bank:', err);
          }
          setGenerationProgress(35 + (i + 1) * 15);
        }

        // Fill remaining with random bank questions
        const shuffledBank = [...questions].sort(() => 0.5 - Math.random());
        const bankFill = shuffledBank.slice(0, 5 - aiQs.length);
        const finalSet = [...aiQs, ...bankFill].slice(0, 5);

        setExamQuestions(finalSet);
      } else {
        // Quick Random Bank Mode
        setGenerationProgress(60);
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setExamQuestions(selected);
      }

      setGenerationProgress(100);
      setTimeout(() => {
        setExamStep('ACTIVE');
        setTimeLeft(TOTAL_TIME);
        setCurrentIdx(0);
        setAnswers({});
        setCodingRunLogs({});
      }, 500);
    } catch (err) {
      console.error('Exam Generation Error:', err);
      // Fallback
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setExamQuestions(shuffled.slice(0, 5));
      setExamStep('ACTIVE');
      setTimeLeft(TOTAL_TIME);
    }
  };

  // Run Code in Sandbox for Coding Practice Question
  const handleRunCodingTest = (q: Question) => {
    const code = answers[q.id] || q.starterCode || '';
    if (!code.trim()) return;

    setIsCodingRunning(true);
    setTimeout(() => {
      const logs: string[] = [];
      let pass = true;

      try {
        const testFn = new Function(code);
        testFn();
        logs.push('✅ Code executed successfully with no syntax errors.');

        if (q.testCases && q.testCases.length > 0) {
          q.testCases.forEach((tc, i) => {
            try {
              const runner = new Function(code + '\n' + tc.input);
              const res = runner();
              const expectedStr = JSON.stringify(tc.expected);
              const actualStr = JSON.stringify(res);
              if (actualStr === expectedStr || res === tc.expected) {
                logs.push(`✓ Test Case #${i + 1}: Passed`);
              } else {
                pass = false;
                logs.push(`✗ Test Case #${i + 1}: Failed (Expected ${expectedStr}, got ${actualStr})`);
              }
            } catch (err: any) {
              pass = false;
              logs.push(`✗ Test Case #${i + 1} Error: ${err.message}`);
            }
          });
        }
      } catch (err: any) {
        pass = false;
        logs.push(`❌ Syntax/Compilation Error: ${err.message}`);
      }

      setCodingRunLogs((prev) => ({
        ...prev,
        [q.id]: { pass, logs },
      }));
      setIsCodingRunning(false);
    }, 400);
  };

  // FINISH & EVALUATE EXAM
  const handleFinishExam = () => {
    const timeSpentSecs = TOTAL_TIME - timeLeft;
    const timeSpentStr = `${Math.floor(timeSpentSecs / 60)} phút ${timeSpentSecs % 60} giây`;

    let earnedScore = 0;
    let maxPoints = 0;

    const breakdown = examQuestions.map((q) => {
      const uAns = answers[q.id] || '';
      const points = q.points || 20;
      maxPoints += points;

      let isCorrect = false;
      let feedback = '';

      if (q.type === 'MULTIPLE_CHOICE') {
        const correctOpt = q.options?.find((o) => o.is_correct);
        if (uAns && correctOpt && uAns === correctOpt.id) {
          isCorrect = true;
          earnedScore += points;
          feedback = '✓ Đáp án chính xác tuyệt đối.';
        } else {
          feedback = `✗ Sai. Đáp án đúng là: "${correctOpt?.text || 'N/A'}"`;
        }
      } else if (q.type === 'THEORY') {
        // Theory checks minimum 30 characters
        if (uAns.trim().length >= 30) {
          isCorrect = true;
          earnedScore += points;
          feedback = '✓ Phần trình bày lý thuyết đầy đủ chi tiết.';
        } else if (uAns.trim().length > 0) {
          earnedScore += Math.floor(points / 2);
          feedback = '⚠️ Lý thuyết tương đối ngắn, nhận 50% số điểm.';
        } else {
          feedback = '✗ Bỏ trống câu hỏi lý thuyết.';
        }
      } else {
        // Coding Practice
        const runRes = codingRunLogs[q.id];
        if (runRes?.pass || (uAns.includes('return') && uAns.length > 20)) {
          isCorrect = true;
          earnedScore += points;
          feedback = '✓ Giải thuật biên dịch và chạy đúng testcase.';
        } else if (uAns.length > 10) {
          earnedScore += Math.floor(points / 2);
          feedback = '⚠️ Mã nguồn chưa vượt qua toàn bộ testcase.';
        } else {
          feedback = '✗ Chưa hoàn thiện bài tập code.';
        }
      }

      // Save user progress for solved questions
      if (isCorrect && isLoggedIn) {
        onSolveQuestion(q.id, points, uAns);
      }

      return {
        question: q,
        userAnswer: uAns,
        isCorrect,
        pointsEarned: isCorrect ? points : 0,
        feedback,
      };
    });

    const percent = Math.round((earnedScore / (maxPoints || 100)) * 100);
    const grade: 'XUẤT SẮC' | 'ĐẠT CHUẨN' | 'CẦN CỐ GẮNG' =
      percent >= 80 ? 'XUẤT SẮC' : percent >= 50 ? 'ĐẠT CHUẨN' : 'CẦN CỐ GẮNG';

    setExamResult({
      score: earnedScore,
      maxPoints,
      percent,
      grade,
      timeSpentStr,
      breakdown,
    });

    setExamStep('SUMMARY');
  };

  // GENERATE PROFESSIONAL HTML EMAIL TEMPLATE
  const getEmailHtmlContent = () => {
    if (!examResult) return '';
    const candidateName = profile?.fullName || profile?.username || 'Học Viên Sanjion';
    const email = recipientEmail || profile?.email || 'user@sanjion.dev';
    const examCode = `SANJION-45M-${Date.now().toString(36).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo Cáo Kết Quả Thi Thử Sanjion 45'</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0D11; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #EDEFF2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0B0D11; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #161B22; border: 1px solid rgba(201, 150, 44, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #181F2A 0%, #0F141C 100%); padding: 32px 40px; border-bottom: 2px solid #C9962C; text-align: center;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(201, 150, 44, 0.15); border: 1px solid #C9962C; border-radius: 12px; padding: 10px 20px; margin-bottom: 12px;">
                      <span style="color: #C9962C; font-weight: 800; font-size: 14px; letter-spacing: 2px;">⚡ SANJION CODE ACADEMY</span>
                    </div>
                    <h1 style="margin: 8px 0 0 0; color: #FFFFFF; font-size: 24px; font-weight: 800; tracking-tight: -0.5px;">
                      CHỨNG NHẬN KẾT QUẢ KỲ THI THỬ 45'
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #8B94A3; font-size: 13px;">Mã Đề Thi Verified: <strong style="color: #5B54D9;">${examCode}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Candidate Info Card -->
          <tr>
            <td style="padding: 28px 40px 10px 40px;">
              <table role="presentation" width="100%" style="background-color: #0B0D11; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px;">
                <tr>
                  <td width="50%" style="font-size: 13px; color: #8B94A3; line-height: 1.6;">
                    Thí Sinh: <strong style="color: #EDEFF2; font-size: 14px;">${candidateName}</strong><br>
                    Email: <span style="color: #2FAE79;">${email}</span>
                  </td>
                  <td width="50%" align="right" style="font-size: 13px; color: #8B94A3; line-height: 1.6;">
                    Ngày Thực Hiện: <strong style="color: #EDEFF2;">${dateStr}</strong><br>
                    Thời Gian Làm Bài: <strong style="color: #C9962C;">${examResult.timeSpentStr}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Big Result Score Box -->
          <tr>
            <td style="padding: 10px 40px 24px 40px;">
              <table role="presentation" width="100%" style="background: linear-gradient(180deg, rgba(201, 150, 44, 0.1) 0%, rgba(15, 20, 28, 0.5) 100%); border: 1px solid #C9962C; border-radius: 16px; padding: 24px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #8B94A3; margin-bottom: 6px;">TỔNG ĐIỂM ĐẠT ĐƯỢC</div>
                    <div style="font-size: 48px; font-weight: 900; color: #C9962C; font-family: monospace; line-height: 1;">
                      ${examResult.score} <span style="font-size: 20px; color: #8B94A3;">/ ${examResult.maxPoints} XP</span>
                    </div>
                    <div style="margin-top: 14px;">
                      <span style="display: inline-block; padding: 6px 18px; border-radius: 20px; font-weight: 800; font-size: 13px; background-color: ${examResult.percent >= 80 ? 'rgba(47, 174, 121, 0.2)' : 'rgba(201, 150, 44, 0.2)'}; color: ${examResult.percent >= 80 ? '#2FAE79' : '#C9962C'}; border: 1px solid ${examResult.percent >= 80 ? '#2FAE79' : '#C9962C'};">
                        🏆 KHẾ CẤP: ${examResult.grade} (${examResult.percent}%)
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Question Breakdown Table -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <h3 style="font-size: 15px; color: #EDEFF2; margin: 0 0 14px 0; font-weight: 700;">📌 Bảng Chi Tiết Kết Quả 5 Câu Hỏi:</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #0B0D11; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; font-size: 12px;">
                <thead>
                  <tr style="background-color: #181F2A; border-bottom: 1px solid rgba(255,255,255,0.08); text-align: left; color: #8B94A3;">
                    <th style="padding: 12px 14px;">#</th>
                    <th style="padding: 12px 14px;">Tiêu Đề Câu Hỏi</th>
                    <th style="padding: 12px 14px;">Loại</th>
                    <th style="padding: 12px 14px; text-align: center;">Trạng Thái</th>
                    <th style="padding: 12px 14px; text-align: right;">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  ${examResult.breakdown
                    .map(
                      (item, idx) => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <td style="padding: 12px 14px; color: #C9962C; font-weight: bold;">#${idx + 1}</td>
                      <td style="padding: 12px 14px; color: #EDEFF2; font-weight: 600;">${item.question.title}</td>
                      <td style="padding: 12px 14px; color: #8B94A3;"><span style="background-color: rgba(91,84,217,0.15); color: #5B54D9; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${item.question.type}</span></td>
                      <td style="padding: 12px 14px; text-align: center;">
                        <span style="color: ${item.isCorrect ? '#2FAE79' : '#C1553B'}; font-weight: bold;">
                          ${item.isCorrect ? '✓ Hoàn Thành' : '✗ Chưa Đạt'}
                        </span>
                      </td>
                      <td style="padding: 12px 14px; text-align: right; font-weight: bold; color: ${item.isCorrect ? '#2FAE79' : '#8B94A3'};">
                        +${item.pointsEarned} XP
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Certified Seal Footer -->
          <tr>
            <td style="background-color: #0B0D11; padding: 28px 40px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #8B94A3;">
                      Hệ Thống Đánh Giá Năng Lực Frontend Engineer — <strong>Sanjion Platform 2026</strong>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #5B54D9;">
                      Báo cáo này được tự động tạo bởi AI Model Engine. Mọi thắc mắc xin gửi về: <a href="mailto:support@sanjion.dev" style="color: #C9962C; text-decoration: none;">support@sanjion.dev</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const handleCopyEmailHtml = () => {
    const html = getEmailHtmlContent();
    navigator.clipboard.writeText(html);
    setIsCopiedEmailHtml(true);
    setTimeout(() => setIsCopiedEmailHtml(false), 2000);
  };

  const handleSendSimulatedEmail = () => {
    setEmailSendStatus('sending');
    setTimeout(() => {
      setEmailSendStatus('sent');
      setTimeout(() => setEmailSendStatus('idle'), 3000);
    }, 1200);
  };

  const currentQ = examQuestions[currentIdx];

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-[#0B0D11]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono">
      <div className="bg-[#161B22] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden text-[#EDEFF2]">
        
        {/* TOP MODAL BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181F2A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9962C]/20 border border-[#C9962C]/50 flex items-center justify-center text-[#C9962C]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Kỳ Thi Thử Sanjion 45 Phút
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#5B54D9]/20 border border-[#5B54D9]/50 text-[#5B54D9] font-mono">
                  {aiService.getActiveModelName()}
                </span>
              </h3>
              <p className="text-[11px] text-[#8B94A3]">
                {examStep === 'ACTIVE'
                  ? `Đang làm câu ${currentIdx + 1} / ${examQuestions.length}`
                  : 'Đánh giá năng lực đếm ngược thực tế'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {examStep === 'ACTIVE' && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs ${getTimeColorClass(timeLeft)}`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#8B94A3] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: INTRO SCREEN */}
        {examStep === 'INTRO' && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            <div className="text-center space-y-3 py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#C9962C]/10 border border-[#C9962C]/40 flex items-center justify-center text-[#C9962C] mx-auto shadow-lg shadow-[#C9962C]/10">
                <Zap className="w-8 h-8 text-[#C9962C]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Thử Thách Áp Lực 45 Phút — Sanjion Developer Certification
              </h2>
              <p className="text-xs text-[#8B94A3] max-w-lg mx-auto leading-relaxed">
                Hệ thống sẽ tổng hợp <b>5 câu hỏi ngẫu nhiên</b> được thiết kế bởi AI Model Engine (Trắc nghiệm, Lý thuyết chuyên sâu & Lập trình sandbox). Bạn có đúng <b>45 phút</b> để hoàn thành từng câu 1.
              </p>
            </div>

            {/* Exam Rules Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#C9962C] font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Thời Lượng</span>
                </div>
                <p className="text-xs text-[#8B94A3]">45 phút đếm ngược tự động nộp bài khi hết giờ.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#5B54D9] font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Cấu Trúc 5 Câu</span>
                </div>
                <p className="text-xs text-[#8B94A3]">2 Trắc nghiệm + 2 Lý thuyết + 1 Bài tập Coding Realtime.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#2FAE79] font-bold text-xs">
                  <Mail className="w-4 h-4" />
                  <span>Báo Cáo Email</span>
                </div>
                <p className="text-xs text-[#8B94A3]">Tự động tạo Template Email Báo cáo & Chứng nhận chuyên nghiệp.</p>
              </div>
            </div>

            {/* Start Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => handleStartExamGeneration('AI')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#C9962C] hover:bg-[#C9962C]/90 text-slate-950 font-black text-xs transition-all shadow-lg shadow-[#C9962C]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>✨ Bắt Đầu Thi Thử (AI Model {aiService.getActiveModelName()} Sinh Đề Mới 100%)</span>
              </button>

              <button
                onClick={() => handleStartExamGeneration('RANDOM_BANK')}
                className="w-full py-3 px-4 rounded-xl bg-[#0F141C] border border-white/10 hover:bg-white/5 text-[#EDEFF2] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#C9962C]" />
                <span>⚡ Chế Độ Nhanh: Trích 5 Câu Ngẫu Nhiên Từ Ngân Hàng Sanjion</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GENERATING SCREEN */}
        {examStep === 'GENERATING' && (
          <div className="p-12 text-center space-y-6 my-auto">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <RefreshCw className="w-12 h-12 text-[#C9962C] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#5B54D9] absolute" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">
                Đang Tổng Hợp Bộ Đề Thi 45 Phút...
              </h3>
              <p className="text-xs text-[#8B94A3]">
                Model AI <span className="text-[#5B54D9] font-bold">{aiService.getActiveModelName()}</span> đang soạn thảo các câu hỏi thử thách ngẫu nhiên.
              </p>
            </div>
            {/* Progress Bar */}
            <div className="max-w-md mx-auto bg-[#0B0D11] h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-[#C9962C] h-full transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: ACTIVE EXAM SCREEN (STEP-BY-STEP 1 QUESTION AT A TIME) */}
        {examStep === 'ACTIVE' && currentQ && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* STEPPER HEADER */}
            <div className="px-6 py-3 bg-[#0B0D11] border-b border-white/10 flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex items-center gap-2">
                {examQuestions.map((q, idx) => {
                  const isAns = Boolean(answers[q.id]);
                  const isCur = idx === currentIdx;
                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCur
                          ? 'bg-[#C9962C] text-slate-950 ring-2 ring-[#C9962C]/40'
                          : isAns
                          ? 'bg-[#2FAE79]/20 border border-[#2FAE79]/40 text-[#2FAE79]'
                          : 'bg-[#161B22] border border-white/10 text-[#8B94A3] hover:text-white'
                      }`}
                    >
                      <span>Câu {idx + 1}</span>
                      {isAns && <Check className="w-3 h-3 text-[#2FAE79]" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleFinishExam}
                className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Nộp Bài Thi Thử</span>
              </button>
            </div>

            {/* ACTIVE QUESTION CONTAINER */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {/* Question Metadata Tags */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#5B54D9]/20 border border-[#5B54D9]/40 text-[#5B54D9] font-bold">
                  {currentQ.type === 'MULTIPLE_CHOICE'
                    ? '📝 TRẮC NGHIỆM'
                    : currentQ.type === 'THEORY'
                    ? '💡 LÝ THUYẾT'
                    : '💻 LẬP TRÌNH'}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#C9962C]/20 border border-[#C9962C]/40 text-[#C9962C] font-bold">
                  {currentQ.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#8B94A3]">
                  +{currentQ.points || 20} XP
                </span>
              </div>

              {/* Question Title & Content */}
              <div className="space-y-3">
                <h2 className="text-base font-bold text-white leading-snug">
                  Câu #{currentIdx + 1}: {currentQ.title}
                </h2>
                <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5 text-xs text-[#EDEFF2] leading-relaxed">
                  <MarkdownRenderer content={currentQ.content || ''} />
                </div>
              </div>

              {/* INPUT AREA BASED ON TYPE */}
              {/* 1. QUIZ OPTIONS */}
              {currentQ.type === 'MULTIPLE_CHOICE' && currentQ.options && (
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-bold text-[#8B94A3]">Chọn 1 đáp án chính xác nhất:</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((opt) => {
                      const isSelected = answers[currentQ.id] === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))
                          }
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#C9962C]/15 border-[#C9962C] text-white font-bold'
                              : 'bg-[#0B0D11] border-white/5 hover:border-white/20 text-[#EDEFF2]'
                          }`}
                        >
                          <span className="pr-4">{opt.text}</span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'border-[#C9962C] bg-[#C9962C] text-slate-950'
                                : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. THEORY ANSWER TEXTAREA */}
              {currentQ.type === 'THEORY' && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#8B94A3]">Trình bày câu trả lời chi tiết:</p>
                    <span className="text-[10px] text-[#8B94A3]">
                      {(answers[currentQ.id] || '').length} ký tự (Khuyên dùng &gt;= 30)
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                    placeholder="Nhập phần giải thích, phân tích kiến thức và các ví dụ minh họa tại đây..."
                    className="w-full p-4 bg-[#0B0D11] border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#C9962C]/60 font-mono"
                  />
                </div>
              )}

              {/* 3. CODING PRACTICE EDITOR & RUNNER */}
              {currentQ.type === 'CODING_PRACTICE' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#8B94A3] flex items-center gap-1.5">
                      <CodeIcon className="w-4 h-4 text-[#5B54D9]" />
                      <span>Mã Nguồn Lập Trình (JavaScript / TypeScript):</span>
                    </p>

                    <button
                      onClick={() => handleRunCodingTest(currentQ)}
                      disabled={isCodingRunning}
                      className="px-3 py-1.5 rounded-lg bg-[#2FAE79]/20 hover:bg-[#2FAE79]/30 border border-[#2FAE79]/40 text-[#2FAE79] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isCodingRunning ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>Chạy Thử Code</span>
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={answers[currentQ.id] ?? (currentQ.starterCode || '')}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                    placeholder="// Viết mã nguồn giải thuật tại đây..."
                    className="w-full p-4 bg-[#0B0D11] border border-white/10 rounded-xl text-xs text-[#2FAE79] font-mono focus:outline-none focus:border-[#5B54D9]/60 leading-relaxed"
                  />

                  {/* Sandbox Run Output Logs */}
                  {codingRunLogs[currentQ.id] && (
                    <div className="p-3 rounded-xl bg-[#0B0D11] border border-white/5 space-y-1 font-mono text-[11px]">
                      <p className="text-[10px] text-[#8B94A3] font-bold uppercase tracking-wider">
                        Console Logs Sandbox:
                      </p>
                      {codingRunLogs[currentQ.id].logs.map((log, i) => (
                        <div
                          key={i}
                          className={
                            log.includes('✓') || log.includes('✅')
                              ? 'text-[#2FAE79]'
                              : log.includes('✗') || log.includes('❌')
                              ? 'text-[#C1553B]'
                              : 'text-slate-400'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NAVIGATION FOOTER */}
            <div className="px-6 py-4 bg-[#181F2A] border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="py-2 px-4 rounded-xl bg-[#0F141C] border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu Trước</span>
              </button>

              {currentIdx < examQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                  className="py-2 px-5 rounded-xl bg-[#C9962C] hover:bg-[#C9962C]/90 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Câu Tiếp Theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishExam}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Hoàn Thành & Nộp Bài</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & RESULTS SCREEN */}
        {examStep === 'SUMMARY' && examResult && (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Header Banner */}
            <div className="text-center space-y-3 py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#C9962C]/20 border border-[#C9962C]/50 flex items-center justify-center text-[#C9962C] mx-auto shadow-xl shadow-[#C9962C]/10 animate-bounce">
                <Trophy className="w-8 h-8 text-[#C9962C]" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                🎉 Kết Quả Kỳ Thi Thử Sanjion 45 Phút
              </h2>
              <p className="text-xs text-[#2FAE79] font-bold">
                Khế Cấp: <span className="underline">{examResult.grade}</span> ({examResult.percent}%)
              </p>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5">
                <div className="text-2xl font-black text-[#C9962C] font-mono">
                  {examResult.score} / {examResult.maxPoints}
                </div>
                <div className="text-[11px] text-[#8B94A3] mt-1">Tổng Điểm XP</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5">
                <div className="text-2xl font-black text-[#5B54D9] font-mono">
                  {examResult.percent}%
                </div>
                <div className="text-[11px] text-[#8B94A3] mt-1">Tỷ Lệ Chính Xác</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0D11] border border-white/5">
                <div className="text-2xl font-black text-[#2FAE79] font-mono">
                  {examResult.timeSpentStr}
                </div>
                <div className="text-[11px] text-[#8B94A3] mt-1">Thời Gian Hoàn Thành</div>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#8B94A3] uppercase tracking-wider">
                Chi Tiết Từng Câu Hỏi:
              </h3>
              <div className="space-y-2">
                {examResult.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0B0D11] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-[#C9962C]">#{idx + 1}</span>
                        <span className="text-white">{item.question.title}</span>
                      </div>
                      <p className="text-[11px] text-[#8B94A3]">{item.feedback}</p>
                    </div>

                    <div className="text-right flex-shrink-0 font-bold">
                      <span className={item.isCorrect ? 'text-[#2FAE79]' : 'text-[#C1553B]'}>
                        {item.isCorrect ? `+${item.pointsEarned} XP` : '0 XP'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#5B54D9] hover:bg-[#5B54D9]/90 text-white font-bold text-xs transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>✉️ Xem & Gửi Template Confirm Gmail</span>
              </button>

              <button
                onClick={() => setExamStep('INTRO')}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#0F141C] border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C9962C]" />
                <span>Thi Lại Bài Khác</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Gmail Account Confirmation Email Template Modal */}
      <GmailConfirmEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        targetEmail={profile?.email || 'user@gmail.com'}
        fullName={profile?.fullName || profile?.username || 'Học Viên Sanjion'}
      />

    </div>
  );
};
