"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { mockExamList } from "@/lib/mockExams";
import { getExamHistory, getSavedActiveExam } from "@/lib/storage";
import { ExamAttempt } from "@/types/exam";
import {
  FileCheck2,
  Clock,
  Shuffle,
  Play,
  Info,
  CheckCircle2,
  Shield,
  BookOpen,
} from "lucide-react";

export default function MockExamsHubPage() {
  const router = useRouter();
  const [history, setHistory] = useState<ExamAttempt[]>([]);
  const [activeExam, setActiveExam] = useState<ExamAttempt | null>(null);
  const [selectedGlobalMode, setSelectedGlobalMode] = useState<"exam" | "practice">("exam");

  useEffect(() => {
    setHistory(getExamHistory());
    setActiveExam(getSavedActiveExam());
  }, []);

  const getExamAttemptInfo = (examId: string) => {
    const attempts = history.filter((h) => h.examId === examId);
    if (attempts.length === 0) return null;
    const bestScore = Math.max(...attempts.map((a) => a.score ?? 0));
    return { count: attempts.length, bestScore };
  };

  const handleStartDynamicExam = () => {
    const customAttemptId = `exam-dynamic-${Date.now()}`;
    router.push(`/exam/${customAttemptId}?mode=dynamic&testMode=${selectedGlobalMode}`);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Active Exam Alert if user left in progress */}
        {activeExam && !activeExam.isCompleted && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-600 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-950">
                  Active Mock Test in Progress: {activeExam.examTitle}
                </h3>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Your answers and timer are saved in your session.
                </p>
              </div>
            </div>
            <Link
              href={`/exam/${activeExam.attemptId}`}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-xs shrink-0"
            >
              Resume Test →
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Mock Exam Center
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">CLF-C02 Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              AWS 65-Question Mock Exams
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
              Take full 65-question tests matching the official AWS certification blueprint. Choose strict <strong>Exam Mode</strong> or self-paced <strong>Practice Mode</strong> (no answer reveals until submitted).
            </p>
          </div>

          {/* Dynamic Generator Button */}
          <button
            onClick={handleStartDynamicExam}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
          >
            <Shuffle className="h-4 w-4 text-amber-400" />
            <span>Generate Dynamic 65Q Simulation</span>
          </button>
        </div>

        {/* Test Mode Selector Bar */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Select Test Taking Mode:
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Both modes hide answer correctness until you submit the entire exam.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedGlobalMode("exam")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${
                  selectedGlobalMode === "exam"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>Exam Mode (90 Min Timed)</span>
              </button>

              <button
                onClick={() => setSelectedGlobalMode("practice")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition ${
                  selectedGlobalMode === "practice"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>Practice Mode (Untimed)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 65-Question Mock Exams Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Full-Length Mock Exams (65 Questions)
            </h2>
            <span className="text-xs text-slate-500">
              Active Mode: <strong className="text-slate-900 capitalize">{selectedGlobalMode} Mode</strong> (no answer feedback before submission)
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockExamList.map((exam, index) => {
              const attemptInfo = getExamAttemptInfo(exam.id);

              return (
                <div
                  key={exam.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Exam Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        Exam #{index + 1}
                      </span>
                      {attemptInfo ? (
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                            attemptInfo.bestScore >= 70
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          Best: {attemptInfo.bestScore}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Not Attempted</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {exam.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <FileCheck2 className="h-3.5 w-3.5 text-amber-600" />
                        65 Questions
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        {selectedGlobalMode === "exam" ? "90 Mins" : "Untimed"}
                      </span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {attemptInfo ? `${attemptInfo.count} completed` : "Ready"}
                    </span>

                    <Link
                      href={`/exam/${exam.id}?testMode=${selectedGlobalMode}`}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-xs"
                    >
                      <Play className="h-3 w-3 fill-white" />
                      <span>{attemptInfo ? "Retake" : "Start Test"}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
