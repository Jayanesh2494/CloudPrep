"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { getExamAttemptById, toggleBookmark, isBookmarked } from "@/lib/storage";
import { getQuestionsByIds } from "@/lib/questions";
import { ExamAttempt } from "@/types/exam";
import { Question, AWS_DOMAINS } from "@/types/question";
import { QuestionCard } from "@/components/questions/QuestionCard";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Cloud,
  ShieldCheck,
  Server,
  CreditCard,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ExamResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const resolvedParams = use(params);
  const attemptId = resolvedParams.attemptId;
  const router = useRouter();

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct" | "flagged">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getExamAttemptById(attemptId);
    if (data) {
      setAttempt(data);
      const qs = getQuestionsByIds(data.questionIds);
      setQuestions(qs);

      if (data.passed) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
    setLoading(false);
  }, [attemptId]);

  if (loading || !attempt) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent mb-4" />
          <p className="text-xs text-slate-500">Loading exam results report...</p>
        </div>
      </AppLayout>
    );
  }

  const passed = attempt.passed ?? false;
  const score = attempt.score ?? 0;
  const scaledScore = attempt.scaledScore ?? 100;
  const timeTakenMin = attempt.timeSpentSeconds ? Math.floor(attempt.timeSpentSeconds / 60) : 0;
  const timeTakenSec = attempt.timeSpentSeconds ? attempt.timeSpentSeconds % 60 : 0;

  const filteredQuestions = questions.filter((q) => {
    const userAns = attempt.userAnswers[q.id] || [];
    const isCorrect =
      userAns.length === q.correctOptionIds.length &&
      userAns.every((id) => q.correctOptionIds.includes(id));
    const isFlagged = attempt.flaggedQuestionIds.includes(q.id);

    if (reviewFilter === "incorrect") return !isCorrect;
    if (reviewFilter === "correct") return isCorrect;
    if (reviewFilter === "flagged") return isFlagged;
    return true;
  });

  const domainIcons: Record<number, any> = {
    1: Cloud,
    2: ShieldCheck,
    3: Server,
    4: CreditCard,
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/exam" className="hover:text-amber-700">Mock Exams</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{attempt.examTitle}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Score Report</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/exam/${attempt.examId}`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Retake Test</span>
            </Link>
            <Link
              href="/exam"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
            >
              <span>Take Another Exam</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Score Card */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Left Result Stamp */}
            <div className="text-center md:text-left space-y-2">
              <div
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                  passed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{passed ? "PASSING RESULT" : "NEEDS IMPROVEMENT"}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {attempt.examTitle}
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {passed
                  ? "Well done! You met the passing criteria (70% / 700 scaled) for the AWS Cloud Practitioner certification."
                  : "Keep practicing! Review your missed questions below and study key domain topics."}
              </p>
            </div>

            {/* Center Circular Score Badge */}
            <div className="flex flex-col items-center justify-center p-5 rounded-xl border border-slate-100 bg-slate-50/70 text-center">
              <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {score}%
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-1">
                Scaled Score: <span className="font-bold text-amber-700">{scaledScore} / 1000</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {attempt.correctCount} of {questions.length} Correct
              </div>
            </div>

            {/* Right Quick Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
                <div className="text-base font-bold text-emerald-800">{attempt.correctCount}</div>
                <div className="text-[10px] text-emerald-700">Correct</div>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-2.5">
                <div className="text-base font-bold text-rose-800">{attempt.incorrectCount}</div>
                <div className="text-[10px] text-rose-700">Incorrect</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <div className="text-base font-bold text-slate-700">{attempt.unansweredCount}</div>
                <div className="text-[10px] text-slate-500">Unanswered</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <div className="text-base font-bold text-slate-800 font-mono">
                  {timeTakenMin}m {timeTakenSec}s
                </div>
                <div className="text-[10px] text-slate-500">Time Taken</div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain-Level Performance Breakdown */}
        {attempt.domainScores && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Domain Performance Breakdown
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((dId) => {
                const domain = AWS_DOMAINS[dId as 1 | 2 | 3 | 4];
                const dScore = attempt.domainScores?.[dId as 1 | 2 | 3 | 4] || {
                  correct: 0,
                  total: 0,
                  percentage: 0,
                };
                const Icon = domainIcons[dId];
                const isGood = dScore.percentage >= 70;

                return (
                  <div
                    key={dId}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span
                          className={`text-xs font-mono font-bold ${
                            isGood ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {dScore.percentage}%
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-800">
                        D{dId}: {domain.name}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        {dScore.correct} / {dScore.total} correct
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isGood ? "bg-emerald-600" : "bg-amber-600"
                        }`}
                        style={{ width: `${dScore.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question-By-Question Detailed Review */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Detailed Question Review & Explanations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your selections alongside correct answers and official AWS documentation.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  reviewFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setReviewFilter("incorrect")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  reviewFilter === "incorrect"
                    ? "bg-rose-100 text-rose-900 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Missed ({attempt.incorrectCount})
              </button>
              <button
                onClick={() => setReviewFilter("correct")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  reviewFilter === "correct"
                    ? "bg-emerald-100 text-emerald-900 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Correct ({attempt.correctCount})
              </button>
              <button
                onClick={() => setReviewFilter("flagged")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  reviewFilter === "flagged"
                    ? "bg-amber-100 text-amber-900 font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Flagged ({attempt.flaggedQuestionIds.length})
              </button>
            </div>
          </div>

          {/* List of Questions in Review */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const userSelected = attempt.userAnswers[q.id] || [];
              const isFlagged = attempt.flaggedQuestionIds.includes(q.id);

              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  questionNumber={questions.indexOf(q) + 1}
                  totalQuestions={questions.length}
                  selectedOptions={userSelected}
                  onSelectOption={() => {}}
                  isBookmarked={isBookmarked(q.id)}
                  onToggleBookmark={() => toggleBookmark(q.id)}
                  isFlagged={isFlagged}
                  mode="review"
                />
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
