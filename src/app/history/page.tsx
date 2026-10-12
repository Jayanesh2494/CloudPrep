"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getExamHistory } from "@/lib/storage";
import { ExamAttempt } from "@/types/exam";
import { History, FileCheck2, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function ExamHistoryPage() {
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHistory(getExamHistory());
    setLoading(false);
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Attempt Records
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Exam Attempt History ({history.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Historical performance records across all 65-question mock exams.
            </p>
          </div>

          <Link
            href="/exam"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
          >
            <FileCheck2 className="h-4 w-4 text-amber-400" />
            <span>Take New Mock Exam</span>
          </Link>
        </div>

        <div className="mt-6">
          {history.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                <History className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No exam history recorded</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Once you finish your first 65-question mock exam, your score breakdown will appear here.
              </p>
              <Link
                href="/exam"
                className="inline-flex items-center gap-1.5 mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <span>Start Mock Exam 1</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const passed = item.passed ?? false;
                const dateStr = item.submittedAt
                  ? new Date(item.submittedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Completed";
                const mins = item.timeSpentSeconds ? Math.floor(item.timeSpentSeconds / 60) : 0;
                const secs = item.timeSpentSeconds ? item.timeSpentSeconds % 60 : 0;

                return (
                  <div
                    key={item.attemptId}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          passed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        }`}
                      >
                        {passed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {item.examTitle}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                              passed
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-rose-200 bg-rose-50 text-rose-800"
                            }`}
                          >
                            {passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1">
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {mins}m {secs}s
                          </span>
                          <span>•</span>
                          <span>
                            {item.correctCount ?? 0} / {item.questionIds.length} correct
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-xl font-extrabold font-mono text-slate-900">
                          {item.score}%
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Scaled: {item.scaledScore ?? 100} / 1000
                        </div>
                      </div>

                      <Link
                        href={`/results/${item.attemptId}`}
                        className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-1.5 text-xs font-semibold transition shadow-xs"
                      >
                        <span>Review</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
