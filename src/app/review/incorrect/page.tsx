"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getIncorrectQuestionIds, saveIncorrectQuestionIds, toggleBookmark, isBookmarked } from "@/lib/storage";
import { getQuestionsByIds } from "@/lib/questions";
import { Question } from "@/types/question";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { RotateCcw, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

export default function ReviewIncorrectPage() {
  const [incorrectQs, setIncorrectQs] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const ids = Array.from(getIncorrectQuestionIds());
    const qs = getQuestionsByIds(ids);
    setIncorrectQs(qs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkMastered = (qId: string) => {
    const set = getIncorrectQuestionIds();
    set.delete(qId);
    saveIncorrectQuestionIds(set);
    loadData();
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Missed Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Incorrect Questions Review ({incorrectQs.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review questions answered incorrectly in past mock exams or practice sessions.
            </p>
          </div>

          <Link
            href="/practice?status=incorrect"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Retake Missed Questions</span>
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {incorrectQs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Zero incorrect questions logged</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You have no missed questions recorded. Take a 65-question mock test to benchmark your preparation.
              </p>
              <Link
                href="/exam"
                className="inline-flex items-center gap-1.5 mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <span>Take a 65Q Mock Exam</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            incorrectQs.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <QuestionCard
                  question={q}
                  questionNumber={idx + 1}
                  totalQuestions={incorrectQs.length}
                  selectedOptions={q.correctOptionIds}
                  onSelectOption={() => {}}
                  isBookmarked={isBookmarked(q.id)}
                  onToggleBookmark={() => toggleBookmark(q.id)}
                  mode="review"
                />
                <div className="flex justify-end pr-1">
                  <button
                    onClick={() => handleMarkMastered(q.id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold transition"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>I understand this now (Remove from Missed)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
