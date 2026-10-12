import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Privacy Policy</h1>
              <span className="text-xs text-slate-400">Effective Date: October 2026</span>
            </div>
          </div>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">1. No Account or Login Required</h2>
            <p>
              CloudPrep is completely open and requires no user account, registration, or sign-in. You can practice questions and take full-length mock exams immediately without providing any personal information.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">2. Local Device Storage</h2>
            <p>
              Your question attempts, chosen answers, scores, timestamps, and bookmarks are stored exclusively on your device within your browser&apos;s local storage. None of your test scores or personal data are transmitted to external servers.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">3. Data Control & Deletion</h2>
            <p>
              You maintain total control over your study data. You may clear all question progress, exam records, and saved bookmarks at any time from the Settings page or by clearing your browser cache.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
