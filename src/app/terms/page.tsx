import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Terms of Use & Educational Disclaimer</h1>
              <span className="text-xs text-slate-400">AWS Certified Cloud Practitioner (CLF-C02)</span>
            </div>
          </div>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">1. Independent Study Tool</h2>
            <p>
              CloudPrep is an independent educational prep platform developed to assist students and cloud professionals in preparing for the AWS Certified Cloud Practitioner examination.
            </p>
          </section>

          <section className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900">
            <h3 className="font-bold text-amber-950 mb-1">
              Trademark & Affiliation Disclaimer
            </h3>
            <p>
              Amazon Web Services, AWS, and AWS Certified Cloud Practitioner are trademarks or registered trademarks of Amazon.com, Inc. or its affiliates. CloudPrep is not endorsed by, sponsored by, or affiliated with Amazon Web Services, Inc.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">2. No Guarantee of Actual Exam Questions</h2>
            <p>
              Practice questions provided in this application are intended solely for preparation and educational self-assessment. CloudPrep does not claim or guarantee that these practice questions are actual live exam questions administered by AWS or Pearson VUE.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-900">3. Acceptable Use</h2>
            <p>
              You agree to use CloudPrep for personal study purposes. Automated scraping or unauthorized commercial redistribution is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
