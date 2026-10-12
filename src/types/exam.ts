export interface MockExamDefinition {
  id: string; // e.g. "mock-1", "mock-2", ... "mock-custom"
  title: string;
  description: string;
  questionCount: number; // 65
  durationMinutes: number; // 90
  questionIds?: string[];
  isCustom?: boolean;
}

export interface ExamAttempt {
  attemptId: string;
  examId: string;
  examTitle: string;
  questionIds: string[];
  userAnswers: Record<string, string[]>; // questionId -> selectedOptionIds (e.g. ["A"], ["B", "C"])
  flaggedQuestionIds: string[];
  startedAt: number; // epoch ms
  expiresAt: number; // epoch ms
  durationMinutes: number;
  testMode?: "exam" | "practice";
  submittedAt?: number;
  isCompleted: boolean;
  score?: number; // percentage (0 - 100)
  scaledScore?: number; // scaled score 100 - 1000 (pass is 700)
  passed?: boolean; // score >= 70%
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  timeSpentSeconds?: number;
  domainScores?: Record<1 | 2 | 3 | 4, {
    correct: number;
    total: number;
    percentage: number;
  }>;
}

export interface QuestionProgress {
  attempts: number;
  correctAttempts: number;
  lastSelectedOptionIds?: string[];
  isBookmarked: boolean;
  isIncorrect: boolean;
  lastAttemptAt?: number;
}

export interface UserStats {
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  accuracyPercentage: number;
  bookmarkedCount: number;
  incorrectCount: number;
  examsCompleted: number;
  bestExamScore: number;
  averageExamScore: number;
  domainProficiency: Record<1 | 2 | 3 | 4, {
    attempted: number;
    correct: number;
    total: number;
    percentage: number;
  }>;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
  createdAt: string;
  lastLoginAt: string;
}
