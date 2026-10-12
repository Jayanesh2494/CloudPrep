"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getBookmarks, toggleBookmark } from "@/lib/storage";
import { getQuestionsByIds } from "@/lib/questions";
import { Question } from "@/types/question";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Bookmark, BookOpen, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarkedQs, setBookmarkedQs] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const ids = Array.from(getBookmarks());
    const qs = getQuestionsByIds(ids);
    setBookmarkedQs(qs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemove = (qId: string) => {
    toggleBookmark(qId);
    loadData();
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="h-4 w-4 text-amber-600 fill-amber-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Saved Questions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Bookmarks ({bookmarkedQs.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Saved questions for focused review during practice or exams.
            </p>
          </div>

          <Link
            href="/practice?status=bookmarked"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Practice These Bookmarks</span>
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {bookmarkedQs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                <Bookmark className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No bookmarked questions yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                While practicing questions or reviewing mock exams, tap Bookmark on any question to save it here.
              </p>
              <Link
                href="/practice"
                className="inline-flex items-center gap-1.5 mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <span>Browse Questions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            bookmarkedQs.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={idx + 1}
                totalQuestions={bookmarkedQs.length}
                selectedOptions={q.correctOptionIds}
                onSelectOption={() => {}}
                isBookmarked={true}
                onToggleBookmark={() => handleRemove(q.id)}
                mode="review"
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
