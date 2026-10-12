import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudPrep | AWS Certified Cloud Practitioner (CLF-C02) Practice Platform",
  description:
    "Master the AWS Certified Cloud Practitioner exam with 550+ verified questions, official 65-question timed mock exams, in-depth explanations, and domain analytics.",
  keywords: [
    "AWS Certified Cloud Practitioner",
    "CLF-C02",
    "AWS Exam Prep",
    "AWS Mock Exam 65 Questions",
    "Cloud Practitioner Practice Tests",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-amber-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
