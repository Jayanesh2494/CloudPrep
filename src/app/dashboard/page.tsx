"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getUserStats, getExamHistory } from "@/lib/storage";
import { UserStats, ExamAttempt } from "@/types/exam";
import { AWS_DOMAINS } from "@/types/question";
import { mockExamList } from "@/lib/mockExams";
import {
  Cloud,
  FileCheck2,
  BookOpen,
  Bookmark,
  RotateCcw,
  Trophy,
  Target,
  ArrowRight,
  Clock,
  TrendingUp,
  ShieldCheck,
  Server,
  CreditCard,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentExams, setRecentExams] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    setStats(getUserStats());
    setRecentExams(getExamHistory().slice(0, 4));
  }, []);

  const domainIcons: Record<number, any> = {
    1: Cloud,
    2: ShieldCheck,
    3: Server,
    4: CreditCard,
  };

  const domainColors: Record<number, { text: string; bg: string; bar: string }> = {
    1: { text: "text-blue-700", bg: "bg-blue-50", bar: "bg-blue-600" },
    2: { text: "text-emerald-700", bg: "bg-emerald-50", bar: "bg-emerald-600" },
    3: { text: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-600" },
    4: { text: "text-purple-700", bg: "bg-purple-50", bar: "bg-purple-600" },
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Dashboard Overview
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">AWS CLF-C02 Preparation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              AWS Cloud Practitioner Exam Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive exam bank across 9 full-length 65-question mock exams ready for study.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/performance"
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span>Performance</span>
            </Link>
            <Link
              href="/exam"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <FileCheck2 className="h-4 w-4 text-amber-400" />
              <span>Start 65Q Mock Exam</span>
            </Link>
            <Link
              href="/practice"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <BookOpen className="h-4 w-4 text-amber-600" />
              <span>Practice Mode</span>
            </Link>
          </div>
        </div>

        {/* Top Key Statistics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Question Pool */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Question Pool</span>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Target className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.attemptedQuestions || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Questions Attempted</div>
          </div>

          {/* Card 2: Practice Accuracy */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Accuracy Rate</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {stats?.accuracyPercentage || 0}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats?.correctQuestions || 0} Correct Answers
            </div>
          </div>

          {/* Card 3: Mock Exams Completed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Exams Finished</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.examsCompleted || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">65-Question Tests Done</div>
          </div>

          {/* Card 4: Best Mock Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-600">Best Exam Score</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">
              {stats?.bestExamScore ? `${stats.bestExamScore}%` : "—"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Passing standard: 70%</div>
          </div>
        </div>

        {/* Quick Review Shortcuts: Incorrect & Bookmarks */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <Link
            href="/review/incorrect"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition">
                  Review Missed Questions ({stats?.incorrectCount || 0})
                </h4>
                <p className="text-[11px] text-slate-500">Drill into questions answered incorrectly</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/bookmarks"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition shadow-xs group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Bookmark className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition">
                  Saved Bookmarks ({stats?.bookmarkedCount || 0})
                </h4>
                <p className="text-[11px] text-slate-500">Access saved questions for quick reference</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Main Content Layout: Domain Proficiency & Mock Tests */}
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Domain-wise proficiency (2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Domain-Wise Proficiency</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AWS CLF-C02 performance tracking across the 4 exam domains
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                4 Blueprint Domains
              </span>
            </div>

            <div className="space-y-5">
              {[1, 2, 3, 4].map((dId) => {
                const domain = AWS_DOMAINS[dId as 1 | 2 | 3 | 4];
                const dStats = stats?.domainProficiency?.[dId as 1 | 2 | 3 | 4] || {
                  attempted: 0,
                  correct: 0,
                  total: 0,
                  percentage: 0,
                };
                const colors = domainColors[dId];
                const Icon = domainIcons[dId];

                return (
                  <div key={dId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${colors.bg} ${colors.text}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          Domain {dId}: {domain.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">({domain.weighting})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono text-[11px]">
                          {dStats.correct} / {dStats.attempted} answered
                        </span>
                        <span className={`font-mono font-bold ${colors.text}`}>
                          {dStats.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                      <div
                        className={`h-full rounded-full ${colors.bar} transition-all duration-300`}
                        style={{ width: `${Math.min(100, dStats.percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Benchmark: 70%+ across all domains recommended before taking the official exam.
              </span>
              <Link
                href="/practice"
                className="font-semibold text-slate-900 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Practice Questions</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Available Mock Tests & Recent History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">65Q Mock Tests</h3>
              <Link href="/exam" className="text-xs font-semibold text-amber-700 hover:underline">
                View All 9 Exams
              </Link>
            </div>

            <div className="space-y-2.5 flex-1">
              {mockExamList.slice(0, 4).map((exam) => (
                <div
                  key={exam.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{exam.title}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      65Q
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 90 Min
                    </span>
                    <Link
                      href={`/exam/${exam.id}`}
                      className="text-slate-900 font-bold hover:text-amber-700 hover:underline"
                    >
                      Start Test →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Completed Exams History Preview */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Recent Attempt History</span>
                <Link href="/history" className="text-[11px] text-slate-500 hover:underline">
                  View Log
                </Link>
              </div>

              {recentExams.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-3.5 text-center text-xs text-slate-400">
                  No mock exams completed yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {recentExams.slice(0, 2).map((item) => (
                    <Link
                      key={item.attemptId}
                      href={`/results/${item.attemptId}`}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{item.examTitle}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(item.startedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-mono font-bold ${
                            item.passed ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {item.score}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.passed ? "PASS" : "FAIL"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
