"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { filterQuestions } from "@/lib/questions";
import {
  getBookmarks,
  getIncorrectQuestionIds,
  recordQuestionPractice,
  toggleBookmark,
} from "@/lib/storage";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Question, AWS_DOMAINS } from "@/types/question";
import {
  BookOpen,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

interface QuestionAnswerState {
  selectedOptions: string[];
  isSubmitted: boolean;
}

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDomain = searchParams?.get("domain");

  // Filters state
  const [selectedDomain, setSelectedDomain] = useState<1 | 2 | 3 | 4 | "all">(
    initialDomain ? (parseInt(initialDomain) as 1 | 2 | 3 | 4) : "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<"all" | "unanswered" | "incorrect" | "bookmarked">("all");
  const [selectedType, setSelectedType] = useState<"all" | "single" | "multiple">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isShuffled, setIsShuffled] = useState(false);
  const [hideAnswersWhilePracticing, setHideAnswersWhilePracticing] = useState(false);

  // Persistent map of question responses during this session
  // questionId -> { selectedOptions: string[], isSubmitted: boolean }
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, QuestionAnswerState>>({});

  // Question index in active filtered list
  const [currentIndex, setCurrentIndex] = useState(0);

  // Bookmarks & incorrect tracking
  const [bookmarksSet, setBookmarksSet] = useState<Set<string>>(new Set());
  const [incorrectSet, setIncorrectSet] = useState<Set<string>>(new Set());

  // Load sets on mount once
  useEffect(() => {
    setBookmarksSet(getBookmarks());
    setIncorrectSet(getIncorrectQuestionIds());
  }, []);

  // Compute filtered questions list stably without resetting on answer submit
  const filteredList = useMemo(() => {
    let result = filterQuestions({
      domain: selectedDomain,
      type: selectedType,
      searchQuery,
      bookmarkedOnly: selectedStatus === "bookmarked",
      incorrectOnly: selectedStatus === "incorrect",
      bookmarkedIds: bookmarksSet,
      incorrectIds: incorrectSet,
    });

    if (isShuffled) {
      result = [...result].sort(() => 0.5 - Math.random());
    }

    return result;
  }, [selectedDomain, selectedStatus, selectedType, searchQuery, isShuffled]);

  // If filter changes and index is out of bounds, adjust
  useEffect(() => {
    if (currentIndex >= filteredList.length) {
      setCurrentIndex(0);
    }
  }, [filteredList.length, currentIndex]);

  const currentQ = filteredList[currentIndex];

  // Retrieve current question's state from the persistent sessionAnswers map
  const currentState: QuestionAnswerState = useMemo(() => {
    if (!currentQ) return { selectedOptions: [], isSubmitted: false };
    return sessionAnswers[currentQ.id] || { selectedOptions: [], isSubmitted: false };
  }, [currentQ, sessionAnswers]);

  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    if (currentState.isSubmitted && !hideAnswersWhilePracticing) {
      // already submitted and feedback showing: do not change
      return;
    }

    const currentSelected = currentState.selectedOptions || [];
    let updated: string[] = [];

    if (currentQ.type === "multiple") {
      if (currentSelected.includes(optionId)) {
        updated = currentSelected.filter((id) => id !== optionId);
      } else {
        const maxOptions = currentQ.correctOptionIds.length;
        if (currentSelected.length < maxOptions) {
          updated = [...currentSelected, optionId];
        } else {
          updated = [...currentSelected.slice(1), optionId];
        }
      }
    } else {
      updated = [optionId];
    }

    setSessionAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOptions: updated,
        isSubmitted: false,
      },
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentQ || currentState.selectedOptions.length === 0) return;

    // Permanently mark submitted in sessionAnswers so it stays visible
    setSessionAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOptions: currentState.selectedOptions,
        isSubmitted: true,
      },
    }));

    const isCorrect =
      currentState.selectedOptions.length === currentQ.correctOptionIds.length &&
      currentState.selectedOptions.every((id) => currentQ.correctOptionIds.includes(id));

    recordQuestionPractice(currentQ.id, currentState.selectedOptions, isCorrect);
  };

  const handleResetCurrentQuestion = () => {
    if (!currentQ) return;
    setSessionAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOptions: [],
        isSubmitted: false,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleToggleBookmarkCurrent = () => {
    if (!currentQ) return;
    toggleBookmark(currentQ.id);
    setBookmarksSet(getBookmarks());
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Self-Paced Practice
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500">Full Question Bank</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900">
              AWS Cloud Practitioner Practice
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Work through questions one-by-one. Answers remain visible until you advance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideAnswersWhilePracticing(!hideAnswersWhilePracticing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-semibold transition ${
                hideAnswersWhilePracticing
                  ? "border-slate-800 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {hideAnswersWhilePracticing ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                  <span>Hidden Answers Mode</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>Immediate Feedback</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
          {/* Top Row: Search and Status Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics (EC2, S3, IAM, TCO...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-800 focus:outline-none"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs overflow-x-auto">
              {(["all", "unanswered", "incorrect", "bookmarked"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex-1 py-1 rounded-lg capitalize font-semibold transition text-xs whitespace-nowrap px-2 ${
                    selectedStatus === status
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Question Type and Shuffle */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-800 focus:outline-none"
              >
                <option value="all">All Question Types</option>
                <option value="single">Single Choice</option>
                <option value="multiple">Multiple Response</option>
              </select>

              <button
                type="button"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                  isShuffled
                    ? "border-slate-800 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
            </div>
          </div>

          {/* Domain Badges Filter */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Domain:</span>
            <button
              onClick={() => setSelectedDomain("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition text-xs ${
                selectedDomain === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Domains
            </button>
            {[1, 2, 3, 4].map((dId) => {
              const dom = AWS_DOMAINS[dId as 1 | 2 | 3 | 4];
              const isSelected = selectedDomain === dId;
              return (
                <button
                  key={dId}
                  onClick={() => setSelectedDomain(dId as any)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition text-xs flex items-center gap-1 ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>D{dId}: {dom.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice Question Workspace */}
        <div className="mt-6">
          {filteredList.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 mb-3">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No questions match filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Reset your search query or select &quot;All Domains&quot; to view questions.
              </p>
              <button
                onClick={() => {
                  setSelectedDomain("all");
                  setSelectedStatus("all");
                  setSelectedType("all");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Question Progress Header Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">
                    Question {currentIndex + 1} of {filteredList.length}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>Filtered Pool: {filteredList.length}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-xs text-slate-700">
                    {currentIndex + 1} / {filteredList.length}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredList.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Question Card with Stable Submitted State */}
              {currentQ && (
                <QuestionCard
                  question={currentQ}
                  questionNumber={currentIndex + 1}
                  totalQuestions={filteredList.length}
                  selectedOptions={currentState.selectedOptions}
                  onSelectOption={handleSelectOption}
                  isBookmarked={bookmarksSet.has(currentQ.id)}
                  onToggleBookmark={handleToggleBookmarkCurrent}
                  mode="practice"
                  isAnswerSubmitted={currentState.isSubmitted}
                  onCheckAnswer={handleCheckAnswer}
                  hideFeedbackInPractice={hideAnswersWhilePracticing}
                />
              )}

              {/* Bottom Navigation & Reset Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition shadow-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {/* Reset button if answered */}
                {currentState.isSubmitted && (
                  <button
                    type="button"
                    onClick={handleResetCurrentQuestion}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium transition"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Try again</span>
                  </button>
                )}

                {currentIndex < filteredList.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                  >
                    Finish Session
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent mb-4" />
            <p className="text-xs text-slate-500">Loading Practice Sessions...</p>
          </div>
        </AppLayout>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
