"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Question } from "@/types/question";
import { ExamAttempt } from "@/types/exam";
import { getMockExamById, generateRandomWeightedExam, STANDARD_EXAM_DURATION_MINUTES } from "@/lib/mockExams";
import { getQuestionsByIds, allQuestions } from "@/lib/questions";
import {
  getSavedActiveExam,
  saveActiveExam,
  clearActiveExam,
  saveCompletedExam,
  gradeExamAttempt,
  toggleBookmark,
  isBookmarked,
} from "@/lib/storage";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { QuestionNavigator } from "@/components/exam/QuestionNavigator";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { ConfirmSubmitDialog } from "@/components/exam/ConfirmSubmitDialog";
import {
  Cloud,
  ChevronLeft,
  ChevronRight,
  Send,
  Flag,
  BookOpen,
} from "lucide-react";

function ExamRunnerContent({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDynamicMode = searchParams?.get("mode") === "dynamic";
  const testModeParam = searchParams?.get("testMode") || "exam"; // "exam" or "practice"

  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize or restore active exam attempt
  useEffect(() => {
    const existing = getSavedActiveExam();

    if (existing && existing.attemptId === attemptId && !existing.isCompleted) {
      setExamAttempt(existing);
      const loadedQs = getQuestionsByIds(existing.questionIds);
      setQuestions(loadedQs);
      setLoading(false);
      return;
    }

    let examTitle = "AWS Mock Exam";
    let qList: Question[] = [];

    if (isDynamicMode || attemptId.startsWith("exam-dynamic-")) {
      examTitle = "CLF-C02 Dynamic 65Q Simulation";
      qList = generateRandomWeightedExam();
    } else {
      const def = getMockExamById(attemptId);
      if (def && def.questionIds) {
        examTitle = def.title;
        qList = getQuestionsByIds(def.questionIds);
      } else {
        examTitle = "AWS 65-Question Mock Exam";
        qList = allQuestions.slice(0, 65);
      }
    }

    const durationSec = STANDARD_EXAM_DURATION_MINUTES * 60;
    const now = Date.now();
    const expires = now + durationSec * 1000;

    const newAttempt: ExamAttempt = {
      attemptId,
      examId: attemptId,
      examTitle,
      questionIds: qList.map((q) => q.id),
      userAnswers: {},
      flaggedQuestionIds: [],
      startedAt: now,
      expiresAt: expires,
      durationMinutes: STANDARD_EXAM_DURATION_MINUTES,
      isCompleted: false,
    };

    setExamAttempt(newAttempt);
    setQuestions(qList);
    saveActiveExam(newAttempt);
    setLoading(false);
  }, [attemptId, isDynamicMode]);

  const handleSelectOption = (optionId: string) => {
    if (!examAttempt || questions.length === 0) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentSelected = examAttempt.userAnswers[currentQ.id] || [];
    let updatedSelected: string[] = [];

    if (currentQ.type === "multiple") {
      if (currentSelected.includes(optionId)) {
        updatedSelected = currentSelected.filter((id) => id !== optionId);
      } else {
        const maxOptions = currentQ.correctOptionIds.length;
        if (currentSelected.length < maxOptions) {
          updatedSelected = [...currentSelected, optionId];
        } else {
          updatedSelected = [...currentSelected.slice(1), optionId];
        }
      }
    } else {
      updatedSelected = [optionId];
    }

    const updatedAttempt: ExamAttempt = {
      ...examAttempt,
      userAnswers: {
        ...examAttempt.userAnswers,
        [currentQ.id]: updatedSelected,
      },
    };

    setExamAttempt(updatedAttempt);
    saveActiveExam(updatedAttempt);
  };

  const handleToggleFlag = () => {
    if (!examAttempt || questions.length === 0) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const isFlagged = examAttempt.flaggedQuestionIds.includes(currentQ.id);
    const updatedFlagged = isFlagged
      ? examAttempt.flaggedQuestionIds.filter((id) => id !== currentQ.id)
      : [...examAttempt.flaggedQuestionIds, currentQ.id];

    const updatedAttempt: ExamAttempt = {
      ...examAttempt,
      flaggedQuestionIds: updatedFlagged,
    };

    setExamAttempt(updatedAttempt);
    saveActiveExam(updatedAttempt);
  };

  const handleFinalSubmit = () => {
    if (!examAttempt) return;

    const timeSpentSeconds = Math.max(
      1,
      Math.floor((Date.now() - examAttempt.startedAt) / 1000)
    );

    const grade = gradeExamAttempt(
      examAttempt.questionIds,
      examAttempt.userAnswers,
      timeSpentSeconds
    );

    const completedAttempt: ExamAttempt = {
      ...examAttempt,
      submittedAt: Date.now(),
      isCompleted: true,
      timeSpentSeconds,
      ...grade,
    };

    saveCompletedExam(completedAttempt);
    clearActiveExam();

    setIsSubmitModalOpen(false);
    router.push(`/results/${attemptId}`);
  };

  if (loading || !examAttempt || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
          <p className="text-xs text-slate-500">Loading 65-question mock test...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = examAttempt.questionIds.filter(
    (id) => examAttempt.userAnswers[id] && examAttempt.userAnswers[id].length > 0
  ).length;
  const flaggedCount = examAttempt.flaggedQuestionIds.length;
  const unansweredCount = questions.length - answeredCount;
  const isCurrentFlagged = examAttempt.flaggedQuestionIds.includes(currentQ.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-black shadow-xs">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 truncate max-w-[200px] sm:max-w-md">
                  {examAttempt.examTitle}
                </span>
                <span className="hidden sm:inline text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {testModeParam === "practice" ? "Practice Mode (Untimed)" : "Official Exam Mode"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Question {currentIndex + 1} of {questions.length} • No answers shown before submission
              </span>
            </div>
          </div>

          {/* Center Timer (only active countdown in exam mode, untimed in practice) */}
          {testModeParam === "exam" ? (
            <ExamTimer
              expiresAt={examAttempt.expiresAt}
              onTimeExpired={handleFinalSubmit}
            />
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>Self-Paced</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Runner Area */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6 items-start">
          {/* Question Display Card (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <QuestionCard
              question={currentQ}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              selectedOptions={examAttempt.userAnswers[currentQ.id] || []}
              onSelectOption={handleSelectOption}
              isBookmarked={isBookmarked(currentQ.id)}
              onToggleBookmark={() => toggleBookmark(currentQ.id)}
              isFlagged={isCurrentFlagged}
              onToggleFlag={handleToggleFlag}
              mode="exam"
            />

            {/* Bottom Navigation Controls */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Question
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{questions.length}</span>
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                >
                  Next Question
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                >
                  Review & Submit
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Palette (1 col) */}
          <div className="lg:col-span-1 sticky top-20">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
              userAnswers={examAttempt.userAnswers}
              questionIds={examAttempt.questionIds}
              flaggedQuestionIds={examAttempt.flaggedQuestionIds}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmSubmitDialog
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={handleFinalSubmit}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
      />
    </div>
  );
}

export default function ActiveExamRunnerPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
            <p className="text-xs text-slate-500">Loading Exam Simulation...</p>
          </div>
        </div>
      }
    >
      <ExamRunnerContent attemptId={resolvedParams.attemptId} />
    </Suspense>
  );
}
