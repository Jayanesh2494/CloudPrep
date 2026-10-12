"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
}

export const ConfirmSubmitDialog: React.FC<ConfirmSubmitDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  unansweredCount,
  flaggedCount,
}) => {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Submit Mock Exam?</h3>
            <p className="text-xs text-slate-500">Review your completion status</p>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="my-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="text-xl font-bold text-emerald-800">{answeredCount}</div>
            <div className="text-xs text-emerald-700 mt-0.5">Answered</div>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <div className="text-xl font-bold text-rose-800">{unansweredCount}</div>
            <div className="text-xs text-rose-700 mt-0.5">Unanswered</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="text-xl font-bold text-amber-800">{flaggedCount}</div>
            <div className="text-xs text-amber-700 mt-0.5">Flagged</div>
          </div>
        </div>

        {hasUnanswered && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              You have <strong>{unansweredCount}</strong> unanswered questions. Unanswered questions receive 0 points.
            </span>
          </div>
        )}

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Once submitted, your answers will be locked and graded against official AWS CLF-C02 passing criteria (70% benchmark). Full explanations and references will be revealed in your score report.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Return to Exam
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
          >
            Submit & View Results
          </button>
        </div>
      </div>
    </div>
  );
};
