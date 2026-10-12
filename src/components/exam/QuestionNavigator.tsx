"use client";

import React, { useState } from "react";
import { Flag } from "lucide-react";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  userAnswers: Record<string, string[]>;
  questionIds: string[];
  flaggedQuestionIds: string[];
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  totalQuestions,
  currentIndex,
  onSelectIndex,
  userAnswers,
  questionIds,
  flaggedQuestionIds,
}) => {
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered" | "flagged">("all");

  const flaggedSet = new Set(flaggedQuestionIds);

  const getQuestionState = (index: number) => {
    const qId = questionIds[index];
    const isAnswered = Boolean(userAnswers[qId] && userAnswers[qId].length > 0);
    const isFlagged = flaggedSet.has(qId);
    const isCurrent = index === currentIndex;
    return { isAnswered, isFlagged, isCurrent };
  };

  const answeredCount = questionIds.filter(
    (id) => userAnswers[id] && userAnswers[id].length > 0
  ).length;
  const flaggedCount = flaggedQuestionIds.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      {/* Header and stats */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-900">Question Palette</h3>
        <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress Counter Summary */}
      <div className="grid grid-cols-3 gap-2 py-3 text-center text-xs">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-1.5">
          <div className="font-bold text-emerald-800">{answeredCount}</div>
          <div className="text-[10px] text-emerald-700">Answered</div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-1.5">
          <div className="font-bold text-slate-700">{unansweredCount}</div>
          <div className="text-[10px] text-slate-500">Left</div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-1.5">
          <div className="font-bold text-amber-800">{flaggedCount}</div>
          <div className="text-[10px] text-amber-700">Flagged</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 py-1.5 text-xs border-y border-slate-100 mb-3 overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-2 py-1 rounded-md transition font-semibold text-xs ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("answered")}
          className={`px-2 py-1 rounded-md transition font-medium text-xs ${
            filter === "answered"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Ans ({answeredCount})
        </button>
        <button
          onClick={() => setFilter("unanswered")}
          className={`px-2 py-1 rounded-md transition font-medium text-xs ${
            filter === "unanswered"
              ? "bg-slate-200 text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Left ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter("flagged")}
          className={`px-2 py-1 rounded-md transition font-medium text-xs flex items-center gap-1 ${
            filter === "flagged"
              ? "bg-amber-100 text-amber-900 border border-amber-300"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Flag className="h-3 w-3" />
          ({flaggedCount})
        </button>
      </div>

      {/* Palette Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-1.5 overflow-y-auto max-h-[380px] p-1 pr-1.5">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const { isAnswered, isFlagged, isCurrent } = getQuestionState(index);

          if (filter === "answered" && !isAnswered) return null;
          if (filter === "unanswered" && isAnswered) return null;
          if (filter === "flagged" && !isFlagged) return null;

          let btnClass = "border-slate-200 bg-white text-slate-600 hover:bg-slate-50";
          if (isCurrent) {
            btnClass = "border-slate-900 bg-slate-900 text-white font-bold ring-2 ring-slate-400 scale-105 z-10 shadow-xs";
          } else if (isFlagged && isAnswered) {
            btnClass = "border-amber-300 bg-amber-50 text-amber-900 font-bold";
          } else if (isFlagged) {
            btnClass = "border-amber-300 bg-white text-amber-700 font-medium";
          } else if (isAnswered) {
            btnClass = "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium";
          }

          return (
            <button
              key={index}
              onClick={() => onSelectIndex(index)}
              className={`relative flex items-center justify-center h-8 sm:h-9 rounded-lg border text-xs font-mono transition-all palette-btn ${btnClass}`}
            >
              {index + 1}
              {isFlagged && (
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300 border border-slate-400" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-900" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};
