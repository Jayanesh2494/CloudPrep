"use client";

import React from "react";
import { Question, AWS_DOMAINS } from "@/types/question";
import { AnswerOption } from "./AnswerOption";
import {
  Bookmark,
  Flag,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  totalQuestions?: number;
  selectedOptions: string[];
  onSelectOption: (optionId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  mode: "practice" | "exam" | "review";
  isAnswerSubmitted?: boolean;
  onCheckAnswer?: () => void;
  hideFeedbackInPractice?: boolean; // When user chooses practice mode without immediate reveals
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptions,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  isFlagged = false,
  onToggleFlag,
  mode,
  isAnswerSubmitted = false,
  onCheckAnswer,
  hideFeedbackInPractice = false,
}) => {
  const isMultiple = question.type === "multiple";
  const domainInfo = AWS_DOMAINS[question.domain];

  // In Exam Mode: NEVER show feedback before submission!
  // In Practice Mode: only show feedback if isAnswerSubmitted AND hideFeedbackInPractice is false.
  const showFeedback =
    mode === "review" || (mode === "practice" && isAnswerSubmitted && !hideFeedbackInPractice);

  const isCorrect =
    showFeedback &&
    selectedOptions.length === question.correctOptionIds.length &&
    selectedOptions.every((id) => question.correctOptionIds.includes(id));

  const handleOptionClick = (optionId: string) => {
    if (showFeedback && mode === "practice") {
      return;
    }
    if (mode === "review") return;

    onSelectOption(optionId);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
      {/* Top Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {questionNumber && (
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
              Question {questionNumber} {totalQuestions ? `of ${totalQuestions}` : ""}
            </span>
          )}

          {/* Domain Badge */}
          <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            Domain {question.domain}: {domainInfo?.name || question.topic}
          </span>

          {/* Question Type Badge */}
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            {isMultiple
              ? `Multiple Response (${question.correctOptionIds.length} correct)`
              : "Single Choice"}
          </span>
        </div>

        {/* Actions: Bookmark & Flag */}
        <div className="flex items-center gap-2">
          {mode === "exam" && onToggleFlag && (
            <button
              type="button"
              onClick={onToggleFlag}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                isFlagged
                  ? "border-amber-300 bg-amber-50 text-amber-800 font-semibold"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Flag className={`h-3.5 w-3.5 ${isFlagged ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isFlagged ? "Flagged for Review" : "Flag for Review"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Question Bookmark"}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              isBookmarked
                ? "border-amber-300 bg-amber-50 text-amber-800 font-semibold"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
            <span className="hidden sm:inline">{isBookmarked ? "Saved" : "Bookmark"}</span>
          </button>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
          {question.questionText}
        </h2>
        {isMultiple && (
          <p className="mt-2 text-xs font-semibold text-amber-700 italic">
            * Please select exactly {question.correctOptionIds.length} correct options.
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isOptionCorrect = question.correctOptionIds.includes(option.id);

          return (
            <AnswerOption
              key={option.id}
              option={option}
              isSelected={isSelected}
              onSelect={handleOptionClick}
              isMultiple={isMultiple}
              disabled={mode === "review"}
              showFeedback={showFeedback}
              isCorrect={isOptionCorrect}
            />
          );
        })}
      </div>

      {/* Practice Mode "Check Answer" Button (Only if feedback is enabled for this practice) */}
      {mode === "practice" && !hideFeedbackInPractice && !isAnswerSubmitted && onCheckAnswer && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={selectedOptions.length === 0}
            onClick={onCheckAnswer}
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white px-5 py-2.5 text-xs font-semibold transition shadow-xs"
          >
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            Check Answer
          </button>
        </div>
      )}

      {/* Explanation & References Reveal */}
      {showFeedback && (
        <div className="mt-6 pt-5 border-t border-slate-100 animate-in fade-in duration-200 space-y-4">
          {/* Result Alert Header */}
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border ${
              isCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">
                {isCorrect ? "Correct Answer" : "Incorrect Answer"}
              </div>
              <div className="text-xs mt-0.5">
                Correct answer:{" "}
                <strong className="underline font-bold">
                  {question.correctOptionIds.join(", ")}
                </strong>
              </div>
            </div>
          </div>

          {/* Explanation Text */}
          {question.explanation && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                Explanation
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Reference Links */}
          {question.references && question.references.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-medium">Official Reference:</span>
              {question.references.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-blue-600 hover:text-blue-700 hover:border-blue-300 transition shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[260px]">
                    {ref.title || "AWS Documentation"}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
