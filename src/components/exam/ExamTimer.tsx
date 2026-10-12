"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  expiresAt: number; // epoch ms
  onTimeExpired: () => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  expiresAt,
  onTimeExpired,
  isPaused = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isPaused, onTimeExpired]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formattedTime =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isLowTime = secondsRemaining <= 600; // <= 10 mins
  const isUrgent = secondsRemaining <= 180; // <= 3 mins

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all shadow-xs ${
        isUrgent
          ? "border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
          : isLowTime
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="h-4 w-4 text-rose-600" />
      ) : (
        <Clock className={`h-4 w-4 ${isLowTime ? "text-amber-600" : "text-slate-400"}`} />
      )}
      <span>{formattedTime}</span>
    </div>
  );
};
