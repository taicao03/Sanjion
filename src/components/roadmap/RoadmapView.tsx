import React, { useState } from "react";
import {
  Sprout,
  Zap,
  Award,
  Crown,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  Code2,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Lock,
  Target,
  Flame,
  Star,
} from "lucide-react";
import {
  ROADMAP_STAGES,
  RoadmapStage,
  LearningNode,
} from "../../services/roadmapData";
import { Question, UserProgress, UserProfile } from "../../types";

interface RoadmapViewProps {
  questions: Question[];
  progressMap: Record<string, UserProgress>;
  profile: UserProfile;
  onSelectQuestion: (question: Question) => void;
  onOpenAiAssistant?: () => void;
}

export function RoadmapView({
  questions,
  progressMap,
  profile,
  onSelectQuestion,
  onOpenAiAssistant,
}: RoadmapViewProps) {
  const [activeStageId, setActiveStageId] = useState<string>("stage-junior");

  // Find questions mapped to roadmap nodes
  const getQuestionForNode = (node: LearningNode): Question | undefined => {
    return questions.find(
      (q) => q.id === node.questionId || q.slug === node.questionId,
    );
  };

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case "Sprout":
        return <Sprout className="w-6 h-6 text-emerald-500" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-blue-500" />;
      case "Award":
        return <Award className="w-6 h-6 text-purple-500" />;
      case "Crown":
        return <Crown className="w-6 h-6 text-amber-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-pink-500" />;
    }
  };

  const getNodeTypeBadge = (type: LearningNode["type"]) => {
    switch (type) {
      case "THEORY":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <BookOpen className="w-3.5 h-3.5" /> Lý Thuyết A-Z
          </span>
        );
      case "MULTIPLE_CHOICE":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5" /> Trắc Nghiệm Phản Xạ
          </span>
        );
      case "CODING_PRACTICE":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Code2 className="w-3.5 h-3.5" /> Thực Hành Code Monaco
          </span>
        );
    }
  };

  // Calculate overall stats
  const totalNodes = ROADMAP_STAGES.reduce((sum, s) => sum + s.nodes.length, 0);
  const solvedCount = ROADMAP_STAGES.reduce((sum, s) => {
    const solvedInStage = s.nodes.filter((node) => {
      const q = getQuestionForNode(node);
      if (!q) return false;
      return (
        progressMap[q.id]?.status === "SOLVED" ||
        (q.slug && progressMap[q.slug]?.status === "SOLVED")
      );
    }).length;
    return sum + solvedInStage;
  }, 0);

  const completionPercentage = Math.round((solvedCount / totalNodes) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white p-8 md:p-10 shadow-xl shadow-pink-500/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Lộ
              Trình Luyện Tập Chuẩn Roadmap.sh (A -&gt; Z)
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Hành Trình Chinh Phục
            </h1>
            <p className="text-pink-100 text-sm md:text-base leading-relaxed">
              Bắt đầu từ sự trợ giúp của AI Tutor.
            </p>
          </div>

          {/* User Level & Completion Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:w-80 flex flex-col gap-3 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs text-pink-200 uppercase font-semibold">
                Tiến Độ Hoàn Thành
              </span>
              <span className="text-sm font-bold text-amber-300">
                {solvedCount} / {totalNodes} Bài ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 p-0.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-pink-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-pink-100 pt-1">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />{" "}
                Streak: <b>{profile.streakCount} ngày</b>
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />{" "}
                Points: <b>{profile.totalPoints} pts</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROADMAP_STAGES.map((stage) => {
          const isActive = stage.id === activeStageId;
          const stageSolvedCount = stage.nodes.filter((node) => {
            const q = getQuestionForNode(node);
            if (!q) return false;
            return (
              progressMap[q.id]?.status === "SOLVED" ||
              (q.slug && progressMap[q.slug]?.status === "SOLVED")
            );
          }).length;
          const stagePct = Math.round(
            (stageSolvedCount / stage.nodes.length) * 100,
          );

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 border ${
                isActive
                  ? "bg-white shadow-xl shadow-pink-500/10 border-pink-400 ring-2 ring-pink-500/20 scale-[1.02]"
                  : "bg-white/80 backdrop-blur-md hover:bg-white border-pink-100/60 shadow-sm hover:shadow"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-inner`}
                  >
                    {getStageIcon(stage.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
                      Cấp Độ {stage.levelNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {stage.level}
                    </h3>
                  </div>
                </div>
                {stagePct === 100 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                )}
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {stage.subtitle}
              </p>

              {/* Progress bar inside stage tab */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>Tiến độ</span>
                  <span className="font-semibold text-slate-700">
                    {stageSolvedCount}/{stage.nodes.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stage.gradient} transition-all duration-300`}
                    style={{ width: `${stagePct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details & Learning Nodes */}
      {(() => {
        const currentStage =
          ROADMAP_STAGES.find((s) => s.id === activeStageId) ||
          ROADMAP_STAGES[0];

        return (
          <div className="bg-white rounded-3xl shadow-xl shadow-pink-500/5 border border-pink-100 p-6 md:p-8 space-y-8">
            {/* Stage Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${currentStage.badgeColor}`}
                  >
                    Level {currentStage.levelNumber} - {currentStage.level}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {currentStage.nodes.length} Bài học & Thực hành
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentStage.title}
                </h2>
                <p className="text-sm text-slate-600">
                  {currentStage.subtitle}
                </p>
              </div>

              {/* Target Skills Tags */}
              <div className="flex flex-wrap gap-2 max-w-md">
                {currentStage.targetSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                  >
                    🎯 {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Nodes Timeline / Cards */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-pink-500" /> Danh Sách Bài Tập &
                Lý Thuyết Từng Bước
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {currentStage.nodes.map((node, index) => {
                  const targetQuestion = getQuestionForNode(node);
                  const isSolved = targetQuestion
                    ? progressMap[targetQuestion.id]?.status === "SOLVED" ||
                      (targetQuestion.slug &&
                        progressMap[targetQuestion.slug]?.status === "SOLVED")
                    : false;

                  return (
                    <div
                      key={node.id}
                      className={`group relative overflow-hidden rounded-2xl border p-5 md:p-6 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                        isSolved
                          ? "bg-emerald-50/40 border-emerald-200/80 shadow-sm"
                          : "bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {/* Left Side: Number & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 shadow-sm ${
                            isSolved
                              ? "bg-emerald-500 text-white"
                              : "bg-gradient-to-br from-pink-500 to-purple-600 text-white"
                          }`}
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center flex-wrap gap-2">
                            {getNodeTypeBadge(node.type)}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                node.difficulty === "EASY"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : node.difficulty === "MEDIUM"
                                    ? "bg-blue-100 text-blue-700"
                                    : node.difficulty === "HARD"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {node.difficulty}
                            </span>
                            <span className="text-xs text-slate-400">
                              ⏱️ {node.estimatedMinutes} phút
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                            {node.title}
                          </h4>

                          <p className="text-sm text-slate-600 leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Launch / Action Button */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        {targetQuestion ? (
                          <button
                            onClick={() => onSelectQuestion(targetQuestion)}
                            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                              isSolved
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-pink-500/25 hover:scale-[1.02]"
                            }`}
                          >
                            {isSolved ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />{" "}
                                Xem Lại Bài Làm
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4" /> Bắt Đầu Học &
                                Làm Bài
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4" /> Sắp Ra Mắt
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant Banner inside Stage */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-600/30">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Bị vướng ở cấp độ {currentStage.level}? Trợ lý AI Tutor sẵn
                    sàng hỗ trợ!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Bấm vào Trợ lý AI để xin gợi ý hint, yêu cầu giảng lại lý
                    thuyết theo ngôn ngữ đơn giản hoặc giải đáp câu hỏi phỏng
                    vấn.
                  </p>
                </div>
              </div>
              {onOpenAiAssistant && (
                <button
                  onClick={onOpenAiAssistant}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 whitespace-nowrap transition-all"
                >
                  💬 Trò Chuyện Cùng AI Tutor
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
