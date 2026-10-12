import React from "react";
import Link from "next/link";
import {
  Cloud,
  FileCheck2,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Database,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function HomePage() {
  const domainCards = [
    {
      num: 1,
      name: "Cloud Concepts",
      weight: "24%",
      icon: Cloud,
      border: "border-slate-200",
      tag: "bg-blue-50 text-blue-700 border-blue-200",
      desc: "Cloud architecture, high availability, elasticity, agility, economies of scale, and Well-Architected Framework.",
    },
    {
      num: 2,
      name: "Security & Compliance",
      weight: "30%",
      icon: ShieldCheck,
      border: "border-slate-200",
      tag: "bg-emerald-50 text-emerald-700 border-emerald-200",
      desc: "AWS Shared Responsibility Model, IAM policies, MFA, KMS, AWS WAF, Shield, and compliance documentation.",
    },
    {
      num: 3,
      name: "Cloud Technology & Services",
      weight: "34%",
      icon: Database,
      border: "border-slate-200",
      tag: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "EC2 compute, S3 object storage, RDS & DynamoDB databases, VPC networking, CloudFront, Route 53, and Lambda.",
    },
    {
      num: 4,
      name: "Billing, Pricing & Support",
      weight: "12%",
      icon: DollarSign,
      border: "border-slate-200",
      tag: "bg-purple-50 text-purple-700 border-purple-200",
      desc: "On-demand, Reserved & Spot pricing, AWS Organizations consolidated billing, Cost Explorer, Budgets, and Support plans.",
    },
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 bg-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Certification Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700 mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>AWS Certified Cloud Practitioner (CLF-C02)</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span className="text-slate-500 font-normal">Full Exam Bank</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-4xl mx-auto leading-[1.15]">
            Pass the AWS Cloud Practitioner Exam with{" "}
            <span className="text-amber-600">
              Realistic 65-Question
            </span>{" "}
            Mock Exams
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Prepare with full-length 65-question mock exams matching the official AWS format. Choose between strict timed Exam Mode or self-paced Practice Mode.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/exam"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <FileCheck2 className="h-4 w-4 text-amber-400" />
              <span>Start 65Q Mock Exam</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/practice"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <BookOpen className="h-4 w-4 text-amber-600" />
              <span>Open Practice Mode</span>
            </Link>
          </div>

          {/* Minimal Stats Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">500+</div>
              <div className="text-xs text-slate-500 mt-0.5">Exam Questions</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">9</div>
              <div className="text-xs text-slate-500 mt-0.5">Full Mock Exams</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">90 Min</div>
              <div className="text-xs text-slate-500 mt-0.5">Official Timer Limit</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</div>
              <div className="text-xs text-slate-500 mt-0.5">Detailed Explanations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="py-14 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Exam Mode & Practice Mode
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Pick your preferred study strategy for the AWS CLF-C02 exam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Exam Mode Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Exam Simulation Mode</h3>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Exact 65-Question Format
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Realistic timed testing environment. 65 questions, 90-minute countdown timer, question palette with review flagging, and <strong>no answer reveals before submission</strong>.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Strict 90-minute countdown with automatic submission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Zero answer hints or correctness feedback during the test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Comprehensive score report and domain breakdown after submission</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/exam"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs"
              >
                <span>Select 65Q Mock Exam</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Practice Mode Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Practice & Study Mode</h3>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Self-Paced Learning
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Answer questions at your own pace. Filter by domain, search topics, or focus on missed questions. Reveal instant explanations and official AWS references.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Choose instant answer feedback or blind practice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Direct links to official AWS documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Filter by unanswered, missed, or bookmarked items</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-5 py-2.5 text-xs font-bold transition shadow-xs"
              >
                <span>Open Practice Sessions</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CLF-C02 Domain Blueprint */}
      <section className="py-14 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Exam Domains Blueprint
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              Official CLF-C02 domain weightings and competencies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domainCards.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.num}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${d.tag}`}>
                        {d.weight}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      Domain {d.num}: {d.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <Link
                      href={`/practice?domain=${d.num}`}
                      className="text-xs font-semibold text-slate-800 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Practice Domain {d.num}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
