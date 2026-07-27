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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-mono">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-lg bg-[#161B22] border border-white/[0.06] p-6 md:p-8 text-[#EDEFF2]">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B0D11] border border-white/[0.06] text-xs font-bold text-[#C9962C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9962C]" /> Lộ Trình Luyện Tập Senior Roadmap (A -&gt; Z)
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-[#EDEFF2] tracking-tight">
              Hành Trình Chinh Phục Senior Level
            </h1>
            <p className="text-[#8B94A3] text-xs md:text-sm leading-relaxed">
              Theo dõi và hoàn thành từng bài học từ Junior đến Principal Engineer với sự trợ giúp của AI Tutor.
            </p>
          </div>

          {/* User Level & Completion Card */}
          <div className="bg-[#0B0D11] border border-white/[0.06] rounded p-4 w-full md:w-80 flex flex-col gap-2.5 text-[#EDEFF2]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B94A3] uppercase font-bold">Tiến Độ Roadmap</span>
              <span className="font-bold text-[#2FAE79]">
                {solvedCount} / {totalNodes} ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-[#232A35] rounded-sm h-2 overflow-hidden">
              <div
                className="bg-[#2FAE79] h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#8B94A3] pt-1 border-t border-white/[0.04]">
              <span className="flex items-center gap-1 text-[#C9962C]">
                <Flame className="w-3.5 h-3.5 text-[#C9962C]" /> Streak: <b>{profile.streakCount}d</b>
              </span>
              <span className="flex items-center gap-1 text-[#C9962C]">
                <Star className="w-3.5 h-3.5 text-[#C9962C]" /> XP: <b>+{profile.totalPoints}</b>
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
              className={`relative overflow-hidden rounded-lg p-4 text-left transition-colors duration-150 border ${
                isActive
                  ? "bg-[#161B22] border-[#C9962C] text-[#EDEFF2]"
                  : "bg-[#161B22] border-white/[0.06] text-[#8B94A3] hover:border-white/20 hover:text-[#EDEFF2]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-[#0B0D11] border border-white/[0.06]">
                    {getStageIcon(stage.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#8B94A3] uppercase">
                      Cấp Độ {stage.levelNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[#EDEFF2]">
                      {stage.level}
                    </h3>
                  </div>
                </div>
                {stagePct === 100 && (
                  <CheckCircle2 className="w-4 h-4 text-[#2FAE79]" />
                )}
              </div>

              <p className="text-xs text-[#8B94A3] line-clamp-2 mb-3">
                {stage.subtitle}
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#8B94A3]">
                  <span>Hoàn thành</span>
                  <span className="font-bold text-[#EDEFF2]">
                    {stageSolvedCount}/{stage.nodes.length}
                  </span>
                </div>
                <div className="w-full bg-[#0B0D11] rounded-sm h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#2FAE79] transition-all duration-300"
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
          <div className="bg-[#161B22] rounded-lg border border-white/[0.06] p-6 space-y-6">
            {/* Stage Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#0B0D11] text-[#C9962C] border border-[#C9962C]/30">
                    Level {currentStage.levelNumber} - {currentStage.level}
                  </span>
                  <span className="text-xs text-[#8B94A3]">
                    {currentStage.nodes.length} bài tập
                  </span>
                </div>
                <h2 className="text-xl font-display font-medium text-[#EDEFF2]">
                  {currentStage.title}
                </h2>
                <p className="text-xs text-[#8B94A3]">
                  {currentStage.subtitle}
                </p>
              </div>

              {/* Target Skills Tags */}
              <div className="flex flex-wrap gap-1.5 max-w-md">
                {currentStage.targetSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#0B0D11] text-[#8B94A3] px-2 py-0.5 rounded border border-white/[0.04]"
                  >
                    🎯 {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Nodes Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#EDEFF2] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C9962C]" /> Danh Sách Bài Tập Theo Tiến Độ
              </h3>

              <div className="grid grid-cols-1 gap-3">
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
                      className={`group relative overflow-hidden rounded border p-4 transition-colors duration-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        isSolved
                          ? "bg-[#0B0D11] border-[#2FAE79]/40"
                          : "bg-[#0B0D11] border-white/[0.06] hover:border-white/20"
                      }`}
                    >
                      {/* Left Side: Number & Info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isSolved
                              ? "bg-[#2FAE79]/20 text-[#2FAE79] border border-[#2FAE79]/40"
                              : "bg-[#161B22] text-[#C9962C] border border-white/[0.06]"
                          }`}
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-[#2FAE79]" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center flex-wrap gap-2 text-[11px]">
                            {getNodeTypeBadge(node.type)}
                            <span className="px-2 py-0.5 rounded bg-[#161B22] text-[#8B94A3] border border-white/[0.04]">
                              {node.difficulty}
                            </span>
                            <span className="text-[#8B94A3]">
                              ⏱️ {node.estimatedMinutes}m
                            </span>
                          </div>

                          <h4 className="text-sm font-sans font-bold text-[#EDEFF2] group-hover:text-[#C9962C] transition-colors">
                            {node.title}
                          </h4>

                          <p className="text-xs text-[#8B94A3] leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Side: Action Button */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                        {targetQuestion ? (
                          <button
                            onClick={() => onSelectQuestion(targetQuestion)}
                            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded font-bold text-xs transition-colors cursor-pointer ${
                              isSolved
                                ? "bg-[#161B22] text-[#8B94A3] border border-white/[0.06] hover:text-[#EDEFF2]"
                                : "bg-[#2FAE79] hover:bg-[#2FAE79]/90 text-[#0B0D11]"
                            }`}
                          >
                            {isSolved ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2FAE79]" /> Xem Lại
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" /> Bắt Đầu
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#161B22] text-[#8B94A3] text-xs border border-white/[0.04] cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" /> Sắp Ra Mắt
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-[#0B0D11] border border-white/[0.06] rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#5B54D9]/20 text-[#5B54D9] rounded border border-[#5B54D9]/30">
                  <Sparkles className="w-5 h-5 text-[#5B54D9]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#EDEFF2]">
                    Bị vướng ở cấp độ {currentStage.level}?
                  </h4>
                  <p className="text-xs text-[#8B94A3]">
                    Trò chuyện cùng AI Sanjioner để giải đáp thắc mắc và gợi ý hướng đi.
                  </p>
                </div>
              </div>
              {onOpenAiAssistant && (
                <button
                  onClick={onOpenAiAssistant}
                  className="px-3 py-1.5 rounded bg-[#5B54D9]/20 hover:bg-[#5B54D9]/30 border border-[#5B54D9]/40 text-[#EDEFF2] font-bold text-xs whitespace-nowrap transition-colors cursor-pointer"
                >
                  💬 Hỏi AI Sanjioner
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
