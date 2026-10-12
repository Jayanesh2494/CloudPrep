"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { clearAllUserData, getUserStats } from "@/lib/storage";
import {
  Settings,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Bookmark,
  FileCheck2,
  Target,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const stats = getUserStats();

  const handleResetData = () => {
    clearAllUserData();
    setResetSuccess(true);
    setShowConfirmReset(false);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-4 w-4 text-amber-700" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Settings & Storage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Study Data & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            CloudPrep runs directly in your browser. All practice progress, mock scores, and bookmarks are saved on your device.
          </p>
        </div>

        {resetSuccess && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>All local practice records, exam attempts, and bookmarks have been reset.</span>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {/* Activity summary card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Saved Study Records
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="text-xl font-bold text-slate-900">{stats.attemptedQuestions}</div>
                <div className="text-[10px] text-slate-500">Attempted</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="text-xl font-bold text-emerald-700">{stats.accuracyPercentage}%</div>
                <div className="text-[10px] text-slate-500">Accuracy</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="text-xl font-bold text-slate-900">{stats.examsCompleted}</div>
                <div className="text-[10px] text-slate-500">Exams Finished</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="text-xl font-bold text-amber-700">{stats.bookmarkedCount}</div>
                <div className="text-[10px] text-slate-500">Bookmarks</div>
              </div>
            </div>
          </div>

          {/* Privacy & Storage Guarantee */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Instant Access & Local Storage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No account creation or login is required. You can start practicing questions or taking full-length mock exams immediately. Your study history and bookmarked questions persist across sessions in your browser&apos;s local storage.
            </p>
          </div>

          {/* Danger Zone: Reset Data */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>Reset Data Records</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Permanently clear your question progress, mock exam histories, and saved bookmarks from your browser.
            </p>

            <div className="mt-4">
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 px-4 py-2 text-xs font-semibold transition"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                  <span>Reset All Progress & Scores</span>
                </button>
              ) : (
                <div className="rounded-xl border border-rose-300 bg-white p-4 space-y-3 max-w-md shadow-xs">
                  <div className="text-xs font-bold text-rose-800">
                    Confirm: Erase all exam history and bookmarks?
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleResetData}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold transition"
                    >
                      Yes, Clear Data
                    </button>
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
