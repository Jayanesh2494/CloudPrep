import React from "react";
import Link from "next/link";
import { Cloud } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm">CloudPrep AWS Practitioner</span>
              <p className="text-[11px] text-slate-500">Targeting AWS Certified Cloud Practitioner (CLF-C02)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-slate-600">
            <Link href="/dashboard" className="hover:text-amber-600 transition">Dashboard</Link>
            <Link href="/exam" className="hover:text-amber-600 transition">Mock Exams</Link>
            <Link href="/practice" className="hover:text-amber-600 transition">Practice Mode</Link>
            <Link href="/performance" className="hover:text-amber-600 transition">Performance</Link>
            <Link href="/profile" className="hover:text-amber-600 transition">Settings</Link>
            <Link href="/privacy" className="hover:text-amber-600 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-600 transition">Terms & Disclaimer</Link>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            © 2026 CloudPrep. All rights reserved.
          </p>
          <p className="max-w-2xl text-slate-400">
            Educational Disclaimer: CloudPrep is an independent educational tool. It is not affiliated with, endorsed by, or sponsored by Amazon Web Services, Inc. (AWS). AWS and AWS Certified Cloud Practitioner are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </div>
      </div>
    </footer>
  );
};
