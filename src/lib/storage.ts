import { ExamAttempt, QuestionProgress, UserStats, UserProfile } from "@/types/exam";
import { Question } from "@/types/question";
import { allQuestions, getQuestionById } from "./questions";

const STORAGE_KEYS = {
  ACTIVE_EXAM: "cloudprep_active_exam",
  EXAM_HISTORY: "cloudprep_exam_history",
  BOOKMARKS: "cloudprep_bookmarks",
  INCORRECT_QUESTIONS: "cloudprep_incorrect_questions",
  QUESTION_PROGRESS: "cloudprep_question_progress",
  USER_PROFILE: "cloudprep_user_profile",
};

// Check if answer is correct
export function checkAnswerCorrectness(
  userOptionIds: string[],
  correctOptionIds: string[]
): boolean {
  if (!userOptionIds || userOptionIds.length === 0) return false;
  if (userOptionIds.length !== correctOptionIds.length) return false;
  const userSet = new Set(userOptionIds.map((s) => s.toUpperCase()));
  const correctSet = new Set(correctOptionIds.map((s) => s.toUpperCase()));
  for (const item of userSet) {
    if (!correctSet.has(item)) return false;
  }
  return true;
}

// Calculate scaled score in AWS style: 100 to 1000, pass is 700 (70%)
export function calculateScaledScore(percentage: number): number {
  return Math.round(100 + (percentage / 100) * 900);
}

// Score an exam attempt
export function gradeExamAttempt(
  questionIds: string[],
  userAnswers: Record<string, string[]>,
  timeSpentSeconds: number
): {
  score: number;
  scaledScore: number;
  passed: boolean;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  domainScores: Record<1 | 2 | 3 | 4, { correct: number; total: number; percentage: number }>;
} {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const domainStats: Record<1 | 2 | 3 | 4, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
  };

  for (const qId of questionIds) {
    const q = getQuestionById(qId);
    if (!q) continue;

    const domain = q.domain;
    domainStats[domain].total += 1;

    const answers = userAnswers[qId] || [];
    if (answers.length === 0) {
      unansweredCount++;
    } else {
      const isCorrect = checkAnswerCorrectness(answers, q.correctOptionIds);
      if (isCorrect) {
        correctCount++;
        domainStats[domain].correct += 1;
      } else {
        incorrectCount++;
      }
    }
  }

  const total = questionIds.length;
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const scaledScore = calculateScaledScore(score);
  const passed = score >= 70;

  const domainScores: Record<1 | 2 | 3 | 4, { correct: number; total: number; percentage: number }> = {
    1: {
      correct: domainStats[1].correct,
      total: domainStats[1].total,
      percentage: domainStats[1].total > 0 ? Math.round((domainStats[1].correct / domainStats[1].total) * 100) : 0,
    },
    2: {
      correct: domainStats[2].correct,
      total: domainStats[2].total,
      percentage: domainStats[2].total > 0 ? Math.round((domainStats[2].correct / domainStats[2].total) * 100) : 0,
    },
    3: {
      correct: domainStats[3].correct,
      total: domainStats[3].total,
      percentage: domainStats[3].total > 0 ? Math.round((domainStats[3].correct / domainStats[3].total) * 100) : 0,
    },
    4: {
      correct: domainStats[4].correct,
      total: domainStats[4].total,
      percentage: domainStats[4].total > 0 ? Math.round((domainStats[4].correct / domainStats[4].total) * 100) : 0,
    },
  };

  return {
    score,
    scaledScore,
    passed,
    correctCount,
    incorrectCount,
    unansweredCount,
    domainScores,
  };
}

/* LocalStorage Handlers */
export function getSavedActiveExam(): ExamAttempt | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAM);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveActiveExam(attempt: ExamAttempt): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAM, JSON.stringify(attempt));
  } catch (e) {
    console.error("Failed to save active exam to localStorage", e);
  }
}

export function clearActiveExam(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM);
}

export function getExamHistory(): ExamAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCompletedExam(attempt: ExamAttempt): void {
  if (typeof window === "undefined") return;
  try {
    const history = getExamHistory();
    // Prepend latest attempt
    const updated = [attempt, ...history.filter((h) => h.attemptId !== attempt.attemptId)];
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(updated));

    // Update incorrect questions set
    const incorrectSet = getIncorrectQuestionIds();
    for (const qId of attempt.questionIds) {
      const q = getQuestionById(qId);
      if (!q) continue;
      const userAns = attempt.userAnswers[qId] || [];
      if (userAns.length > 0 && !checkAnswerCorrectness(userAns, q.correctOptionIds)) {
        incorrectSet.add(qId);
      }
    }
    saveIncorrectQuestionIds(incorrectSet);
  } catch (e) {
    console.error("Failed to save completed exam", e);
  }
}

export function getExamAttemptById(attemptId: string): ExamAttempt | undefined {
  const active = getSavedActiveExam();
  if (active && active.attemptId === attemptId) return active;
  const history = getExamHistory();
  return history.find((h) => h.attemptId === attemptId);
}

export function getBookmarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function toggleBookmark(questionId: string): boolean {
  if (typeof window === "undefined") return false;
  const bookmarks = getBookmarks();
  let isNowBookmarked = false;
  if (bookmarks.has(questionId)) {
    bookmarks.delete(questionId);
    isNowBookmarked = false;
  } else {
    bookmarks.add(questionId);
    isNowBookmarked = true;
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(bookmarks)));
  return isNowBookmarked;
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().has(questionId);
}

export function getIncorrectQuestionIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INCORRECT_QUESTIONS);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveIncorrectQuestionIds(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.INCORRECT_QUESTIONS, JSON.stringify(Array.from(ids)));
}

export function recordQuestionPractice(
  questionId: string,
  selectedOptionIds: string[],
  isCorrect: boolean
): void {
  if (typeof window === "undefined") return;
  try {
    const rawProgress = localStorage.getItem(STORAGE_KEYS.QUESTION_PROGRESS);
    const progressMap: Record<string, QuestionProgress> = rawProgress ? JSON.parse(rawProgress) : {};

    const existing = progressMap[questionId] || {
      attempts: 0,
      correctAttempts: 0,
      isBookmarked: isBookmarked(questionId),
      isIncorrect: false,
    };

    existing.attempts += 1;
    if (isCorrect) {
      existing.correctAttempts += 1;
      existing.isIncorrect = false;
    } else {
      existing.isIncorrect = true;
      const incorrectSet = getIncorrectQuestionIds();
      incorrectSet.add(questionId);
      saveIncorrectQuestionIds(incorrectSet);
    }
    existing.lastSelectedOptionIds = selectedOptionIds;
    existing.lastAttemptAt = Date.now();

    progressMap[questionId] = existing;
    localStorage.setItem(STORAGE_KEYS.QUESTION_PROGRESS, JSON.stringify(progressMap));
  } catch (e) {
    console.error("Failed to record question practice", e);
  }
}

export function getUserStats(): UserStats {
  const history = getExamHistory();
  const bookmarks = getBookmarks();
  const incorrect = getIncorrectQuestionIds();

  let attempted = 0;
  let correct = 0;
  let totalScoreSum = 0;
  let bestScore = 0;

  const domainStats: Record<1 | 2 | 3 | 4, { attempted: number; correct: number; total: number }> = {
    1: { attempted: 0, correct: 0, total: 0 },
    2: { attempted: 0, correct: 0, total: 0 },
    3: { attempted: 0, correct: 0, total: 0 },
    4: { attempted: 0, correct: 0, total: 0 },
  };

  for (const q of allQuestions) {
    domainStats[q.domain].total += 1;
  }

  // Count practice progress
  if (typeof window !== "undefined") {
    try {
      const rawProgress = localStorage.getItem(STORAGE_KEYS.QUESTION_PROGRESS);
      if (rawProgress) {
        const progressMap: Record<string, QuestionProgress> = JSON.parse(rawProgress);
        for (const [qId, prog] of Object.entries(progressMap)) {
          if (prog.attempts > 0) {
            attempted++;
            const q = getQuestionById(qId);
            if (q) {
              domainStats[q.domain].attempted += 1;
              if (prog.correctAttempts > 0) {
                correct++;
                domainStats[q.domain].correct += 1;
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  for (const exam of history) {
    if (exam.score !== undefined) {
      totalScoreSum += exam.score;
      if (exam.score > bestScore) {
        bestScore = exam.score;
      }
    }
  }

  const accuracyPercentage = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const averageExamScore = history.length > 0 ? Math.round(totalScoreSum / history.length) : 0;

  return {
    totalQuestions: allQuestions.length,
    attemptedQuestions: attempted,
    correctQuestions: correct,
    accuracyPercentage,
    bookmarkedCount: bookmarks.size,
    incorrectCount: incorrect.size,
    examsCompleted: history.length,
    bestExamScore: bestScore,
    averageExamScore,
    domainProficiency: {
      1: {
        ...domainStats[1],
        percentage: domainStats[1].attempted > 0 ? Math.round((domainStats[1].correct / domainStats[1].attempted) * 100) : 0,
      },
      2: {
        ...domainStats[2],
        percentage: domainStats[2].attempted > 0 ? Math.round((domainStats[2].correct / domainStats[2].attempted) * 100) : 0,
      },
      3: {
        ...domainStats[3],
        percentage: domainStats[3].attempted > 0 ? Math.round((domainStats[3].correct / domainStats[3].attempted) * 100) : 0,
      },
      4: {
        ...domainStats[4],
        percentage: domainStats[4].attempted > 0 ? Math.round((domainStats[4].correct / domainStats[4].attempted) * 100) : 0,
      },
    },
  };
}

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return {
      uid: "guest-user",
      email: "learner@cloudprep.aws",
      displayName: "AWS Cloud Learner",
      photoURL: null,
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  const defaultProfile: UserProfile = {
    uid: "guest-user",
    email: "learner@cloudprep.aws",
    displayName: "AWS Cloud Learner",
    photoURL: null,
    isGuest: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function clearAllUserData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM);
  localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
  localStorage.removeItem(STORAGE_KEYS.INCORRECT_QUESTIONS);
  localStorage.removeItem(STORAGE_KEYS.QUESTION_PROGRESS);
}
