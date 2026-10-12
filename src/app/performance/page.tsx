"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { getUserStats, getExamHistory, getIncorrectQuestionIds, getBookmarks } from "@/lib/storage";
import { AWS_DOMAINS } from "@/types/question";
import { ExamAttempt, UserStats } from "@/types/exam";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  BookOpen,
  FileCheck2,
  Flame,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  CreditCard,
  Cloud,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Bookmark,
} from "lucide-react";

export default function PerformanceDashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getUserStats();
    const h = getExamHistory();
    const inc = getIncorrectQuestionIds();
    const bm = getBookmarks();

    setStats(s);
    setHistory(h);
    setIncorrectCount(inc.size);
    setBookmarkCount(bm.size);
    setLoading(false);
  }, []);

  // Compute Pace & Time Analytics
  const paceAnalytics = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        avgSecondsPerQuestion: 0,
        totalTimeSeconds: 0,
        paceStatus: "no-data" as "optimal" | "ontrack" | "slow" | "no-data",
        estimatedExamMinutes: 90,
      };
    }

    let totalSeconds = 0;
    let totalQuestionsAnswered = 0;

    for (const attempt of history) {
      if (attempt.timeSpentSeconds) {
        totalSeconds += attempt.timeSpentSeconds;
        totalQuestionsAnswered += attempt.questionIds.length;
      }
    }

    const avgSeconds =
      totalQuestionsAnswered > 0
        ? Math.round(totalSeconds / totalQuestionsAnswered)
        : 0;

    let paceStatus: "optimal" | "ontrack" | "slow" | "no-data" = "ontrack";
    if (avgSeconds === 0) {
      paceStatus = "no-data";
    } else if (avgSeconds <= 72) {
      paceStatus = "optimal";
    } else if (avgSeconds <= 83) {
      paceStatus = "ontrack";
    } else {
      paceStatus = "slow";
    }

    const estimatedExamMinutes = avgSeconds > 0 ? Math.round((avgSeconds * 65) / 60) : 90;

    return {
      avgSecondsPerQuestion: avgSeconds,
      totalTimeSeconds: totalSeconds,
      paceStatus,
      estimatedExamMinutes,
    };
  }, [history]);

  // Overall Exam Readiness Score (0 - 100%)
  const readiness = useMemo(() => {
    if (!stats) return { score: 0, scaledScore: 100, level: "Starting Out", color: "text-slate-500", barColor: "bg-slate-300" };

    const examFactor = stats.bestExamScore > 0 ? stats.bestExamScore : 0;
    const avgExamFactor = stats.averageExamScore > 0 ? stats.averageExamScore : 0;
    const practiceAccuracy = stats.accuracyPercentage > 0 ? stats.accuracyPercentage : 0;
    const questionCoverage = Math.min(100, Math.round((stats.attemptedQuestions / 200) * 100));

    let readinessScore = 0;
    if (history.length > 0) {
      readinessScore = Math.round(
        avgExamFactor * 0.4 +
        examFactor * 0.3 +
        practiceAccuracy * 0.2 +
        questionCoverage * 0.1
      );
    } else if (stats.attemptedQuestions > 0) {
      readinessScore = Math.round(practiceAccuracy * 0.6 + questionCoverage * 0.4);
    }

    readinessScore = Math.max(0, Math.min(100, readinessScore));
    const predictedScaled = Math.round(100 + (readinessScore / 100) * 900);

    let level = "Getting Started";
    let color = "text-slate-700";
    let barColor = "bg-slate-400";

    if (readinessScore >= 85) {
      level = "Mastery Zone (High Confidence)";
      color = "text-emerald-700";
      barColor = "bg-emerald-600";
    } else if (readinessScore >= 70) {
      level = "Exam Ready (Target Met)";
      color = "text-emerald-700";
      barColor = "bg-emerald-600";
    } else if (readinessScore >= 50) {
      level = "Approaching Readiness";
      color = "text-amber-700";
      barColor = "bg-amber-500";
    } else if (readinessScore > 0) {
      level = "Foundation Building";
      color = "text-slate-800";
      barColor = "bg-amber-600";
    }

    return {
      score: readinessScore,
      scaledScore: predictedScaled,
      level,
      color,
      barColor,
    };
  }, [stats, history]);

  // Weakest Domain Identification
  const weakestDomainId = useMemo(() => {
    if (!stats || !stats.domainProficiency) return 2;
    let lowestPct = 101;
    let lowestId = 2; // default to security if tied

    for (const dId of [1, 2, 3, 4] as const) {
      const d = stats.domainProficiency[dId];
      if (d.attempted > 0) {
        if (d.percentage < lowestPct) {
          lowestPct = d.percentage;
          lowestId = dId;
        }
      }
    }
    return lowestId;
  }, [stats]);

  const domainIcons: Record<number, any> = {
    1: Cloud,
    2: ShieldCheck,
    3: Layers,
    4: CreditCard,
  };

  const domainColors: Record<number, { bg: string; text: string; bar: string }> = {
    1: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-600" },
    2: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-600" },
    3: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-600" },
    4: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-600" },
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs text-slate-500">
          Loading performance analytics...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Diagnostic Center
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">AWS CLF-C02 Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Exam Performance & Readiness
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
              Track mastery against the official 700/1000 passing mark, analyze domain strength, and refine exam pacing.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/exam"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
            >
              <FileCheck2 className="h-4 w-4 text-amber-400" />
              <span>Launch Mock Exam</span>
            </Link>
            <Link
              href={`/practice?domain=${weakestDomainId}`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Zap className="h-4 w-4 text-amber-600" />
              <span>Drill Domain {weakestDomainId}</span>
            </Link>
          </div>
        </div>

        {/* Top Readiness Hero Section */}
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Main Exam Readiness Gauge Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <Award className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Overall Exam Readiness Status
                  </h2>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Target: 700 / 1000 (70%)
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 items-center pt-2 pb-4">
                {/* Readiness Percentage & Scaled Score Display */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
                    {readiness.score}%
                  </div>
                  <div className={`text-xs font-bold mt-1 ${readiness.color}`}>
                    {readiness.level}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Predicted Scaled Score: <strong className="text-slate-900 font-mono text-sm">{readiness.scaledScore} / 1000</strong>
                  </div>
                </div>

                {/* Readiness Meter Breakdown */}
                <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Passing Cutoff (700)</span>
                    <span className="font-semibold text-slate-900">70% Required</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden relative">
                    {/* 70% threshold marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                      style={{ left: "70%" }}
                      title="Passing Mark (70%)"
                    />
                    <div
                      className={`h-full ${readiness.barColor} transition-all duration-500`}
                      style={{ width: `${readiness.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>100 (Min)</span>
                    <span className="text-amber-700 font-medium">Passing Line (700)</span>
                    <span>1000 (Max)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Insight Footer */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                {readiness.score >= 70 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                )}
                <span>
                  {readiness.score >= 70
                    ? "Great work! Your mock scores and practice accuracy indicate you are currently in the passing range."
                    : history.length === 0
                    ? "Complete your first 65-question timed mock exam to establish an accurate baseline score."
                    : "Reinforce high-weight security and services domains to push your score comfortably past the 700 benchmark."}
                </span>
              </div>
              <Link
                href="/exam"
                className="shrink-0 font-bold text-slate-900 hover:text-amber-600 inline-flex items-center gap-1"
              >
                <span>Take Mock Exam</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Prep Milestones
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {stats?.examsCompleted || 0} Exams
                    </div>
                    <div className="text-[11px] text-slate-500">65Q Tests Completed</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {stats?.bestExamScore ? `Best: ${stats.bestExamScore}%` : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {stats?.accuracyPercentage || 0}% Accuracy
                    </div>
                    <div className="text-[11px] text-slate-500">Practice Question Pool</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {stats?.correctQuestions || 0} Correct
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-700">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {incorrectCount} Missed Questions
                    </div>
                    <div className="text-[11px] text-slate-500">Available for Review</div>
                  </div>
                </div>
                <Link
                  href="/review/incorrect"
                  className="text-xs font-semibold text-rose-700 hover:underline"
                >
                  Review
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Updated in real-time after each test attempt.
              </span>
            </div>
          </div>
        </div>

        {/* 4 Domains Mastery Matrix */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                CLF-C02 Blueprint Domain Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Official weighting and your individual performance across each syllabus section.
              </p>
            </div>
            <Link
              href="/practice"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>Practice by Domain</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              const isPassing = dStats.percentage >= 70;

              return (
                <div
                  key={dId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div>
                    {/* Domain Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl ${colors.bg} ${colors.text}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {domain.weighting} Weight
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      Domain {dId}: {domain.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-4">
                      {domain.description}
                    </p>

                    {/* Score Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-mono text-[11px]">
                          {dStats.correct} / {dStats.attempted} answered
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            dStats.attempted === 0
                              ? "text-slate-400"
                              : isPassing
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {dStats.attempted > 0 ? `${dStats.percentage}%` : "No data"}
                        </span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                        <div
                          className={`h-full rounded-full ${colors.bar} transition-all duration-300`}
                          style={{ width: `${Math.min(100, dStats.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Domain Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        dStats.attempted === 0
                          ? "bg-slate-100 text-slate-500"
                          : isPassing
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {dStats.attempted === 0
                        ? "Not Started"
                        : isPassing
                        ? "Proficient (>=70%)"
                        : "Review Recommended"}
                    </span>

                    <Link
                      href={`/practice?domain=${dId}`}
                      className="text-xs font-bold text-slate-900 hover:text-amber-600 flex items-center gap-1"
                    >
                      <span>Drill</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Speed & Pace Analytics Section */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Exam Timing & Speed Efficiency
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official exam time: 90 minutes for 65 questions (benchmark: 83 seconds per question).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                  paceAnalytics.paceStatus === "optimal"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : paceAnalytics.paceStatus === "ontrack"
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : paceAnalytics.paceStatus === "slow"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {paceAnalytics.paceStatus === "optimal" && "Optimal Speed (<75s/q)"}
                {paceAnalytics.paceStatus === "ontrack" && "On Track (75-83s/q)"}
                {paceAnalytics.paceStatus === "slow" && "Pace Warning (>83s/q)"}
                {paceAnalytics.paceStatus === "no-data" && "Benchmark: 83s / Question"}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Your Average Pace</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                {paceAnalytics.avgSecondsPerQuestion > 0
                  ? `${paceAnalytics.avgSecondsPerQuestion}s`
                  : "—"}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Per Question Answered</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Projected 65Q Time</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-mono">
                {paceAnalytics.estimatedExamMinutes}m
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Allowed Time: 90 Minutes</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs text-slate-500 font-medium">Review Buffer Available</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 font-mono">
                {Math.max(0, 90 - paceAnalytics.estimatedExamMinutes)}m
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Reserved for Flagged Review</div>
            </div>
          </div>
        </div>

        {/* Mock Exam History Progression */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Mock Exam Score Progression ({history.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed timeline of your completed full-length test attempts.
              </p>
            </div>
            <Link
              href="/history"
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              View Full History
            </Link>
          </div>

          {history.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No mock exams completed yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Take full 65-question practice mock exams to unlock score progression trends and detailed domain diagnostic reports.
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
              {history.slice(0, 5).map((attempt, idx) => {
                const passed = attempt.passed ?? false;
                const dateStr = attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Completed";
                const mins = attempt.timeSpentSeconds
                  ? Math.floor(attempt.timeSpentSeconds / 60)
                  : 0;

                return (
                  <div
                    key={attempt.attemptId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg border ${
                          passed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {passed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">
                            {attempt.examTitle}
                          </h4>
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {attempt.testMode || "exam"} mode
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {dateStr} • {mins}m elapsed
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-extrabold font-mono text-slate-900">
                          {attempt.score}%
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {attempt.scaledScore} / 1000
                        </div>
                      </div>

                      <Link
                        href={`/results/${attempt.attemptId}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 transition shadow-2xs"
                      >
                        Diagnostic Report
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
