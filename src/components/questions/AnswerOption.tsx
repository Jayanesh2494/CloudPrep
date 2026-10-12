"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { QuestionOption } from "@/types/question";

interface AnswerOptionProps {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  isMultiple: boolean;
  disabled?: boolean;
  showFeedback?: boolean; // Only true after submission / in review
  isCorrect?: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  option,
  isSelected,
  onSelect,
  isMultiple,
  disabled = false,
  showFeedback = false,
  isCorrect = false,
}) => {
  let containerStyles = "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/80 shadow-xs";
  let badgeStyles = "border-slate-200 bg-slate-100 text-slate-700 font-semibold";

  if (showFeedback) {
    if (isCorrect) {
      containerStyles = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/30 font-medium";
      badgeStyles = "border-emerald-500 bg-emerald-600 text-white font-bold";
    } else if (isSelected && !isCorrect) {
      containerStyles = "border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400/30";
      badgeStyles = "border-rose-500 bg-rose-600 text-white font-bold";
    } else {
      containerStyles = "border-slate-200 bg-slate-50/60 text-slate-500 opacity-60";
      badgeStyles = "border-slate-200 bg-slate-100 text-slate-400";
    }
  } else if (isSelected) {
    containerStyles = "border-amber-500 bg-amber-50/60 text-slate-900 ring-1 ring-amber-500/40 shadow-xs";
    badgeStyles = "border-amber-500 bg-amber-600 text-white font-bold";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(option.id)}
      className={`group w-full text-left flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer disabled:cursor-default ${containerStyles}`}
    >
      {/* Option ID Badge (A, B, C, D) */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs transition-colors ${badgeStyles}`}
      >
        {showFeedback && isCorrect ? (
          <Check className="h-4 w-4 stroke-[3]" />
        ) : showFeedback && isSelected && !isCorrect ? (
          <X className="h-4 w-4 stroke-[3]" />
        ) : (
          <span>{option.id}</span>
        )}
      </div>

      {/* Option Text */}
      <div className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5 font-normal">
        {option.text}
      </div>

      {/* Checkbox / Radio Visual Indicator */}
      <div className="shrink-0 pt-1">
        <div
          className={`flex h-5 w-5 items-center justify-center ${
            isMultiple ? "rounded-md" : "rounded-full"
          } border transition-colors ${
            isSelected
              ? showFeedback
                ? isCorrect
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-rose-600 bg-rose-600 text-white"
                : "border-amber-600 bg-amber-600 text-white"
              : "border-slate-300 bg-white"
          }`}
        >
          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>
    </button>
  );
};
