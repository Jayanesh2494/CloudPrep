import { allQuestions } from "./questions";
import { MockExamDefinition } from "@/types/exam";
import { Question } from "@/types/question";

export const STANDARD_EXAM_QUESTION_COUNT = 65;
export const STANDARD_EXAM_DURATION_MINUTES = 90;
export const PASS_SCORE_PERCENTAGE = 70; // 700 / 1000

// Generate the 8 standard fixed 65-question mock exams + Exam 9
export const mockExamList: MockExamDefinition[] = [
  {
    id: "mock-1",
    title: "AWS Mock Exam 1",
    description: "Foundational cloud concepts, core compute architectures, and initial security essentials.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(0, 65).map((q) => q.id),
  },
  {
    id: "mock-2",
    title: "AWS Mock Exam 2",
    description: "AWS global infrastructure, object storage, and IAM authentication best practices.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(65, 130).map((q) => q.id),
  },
  {
    id: "mock-3",
    title: "AWS Mock Exam 3",
    description: "Relational and NoSQL databases, VPC networking, and cloud economic value.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(130, 195).map((q) => q.id),
  },
  {
    id: "mock-4",
    title: "AWS Mock Exam 4",
    description: "Shared responsibility model, security services, encryption, and compliance frameworks.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(195, 260).map((q) => q.id),
  },
  {
    id: "mock-5",
    title: "AWS Mock Exam 5",
    description: "AWS pricing models, Organizations consolidated billing, and AWS Support tiers.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(260, 325).map((q) => q.id),
  },
  {
    id: "mock-6",
    title: "AWS Mock Exam 6",
    description: "Serverless computing, CloudFormation automation, and Well-Architected Framework pillars.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(325, 390).map((q) => q.id),
  },
  {
    id: "mock-7",
    title: "AWS Mock Exam 7",
    description: "Hybrid cloud connectivity, content delivery, and account governance policies.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(390, 455).map((q) => q.id),
  },
  {
    id: "mock-8",
    title: "AWS Mock Exam 8",
    description: "Disaster recovery scenarios, elasticity, monitoring, and AWS Trusted Advisor checks.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: allQuestions.slice(455, 520).map((q) => q.id),
  },
  {
    id: "mock-9",
    title: "AWS Mock Exam 9 (Comprehensive Capstone)",
    description: "Full-spectrum simulation testing comprehensive readiness across all 4 CLF-C02 domains.",
    questionCount: 65,
    durationMinutes: 90,
    questionIds: [
      ...allQuestions.slice(520, 558).map((q) => q.id),
      ...allQuestions.slice(0, 27).map((q) => q.id),
    ],
  },
];

export function getMockExamById(examId: string): MockExamDefinition | undefined {
  return mockExamList.find((m) => m.id === examId);
}

/**
 * Generates a realistic 65-question exam drawn with official CLF-C02 domain weighting:
 * Domain 1: Cloud Concepts (24% ~ 16 questions)
 * Domain 2: Security and Compliance (30% ~ 20 questions)
 * Domain 3: Cloud Technology and Services (34% ~ 22 questions)
 * Domain 4: Billing, Pricing, and Support (12% ~ 7 questions)
 * Total: 65 questions
 */
export function generateRandomWeightedExam(): Question[] {
  function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const d1 = shuffle(allQuestions.filter((q) => q.domain === 1)).slice(0, 16);
  const d2 = shuffle(allQuestions.filter((q) => q.domain === 2)).slice(0, 20);
  const d3 = shuffle(allQuestions.filter((q) => q.domain === 3)).slice(0, 22);
  const d4 = shuffle(allQuestions.filter((q) => q.domain === 4)).slice(0, 7);

  const combined = shuffle([...d1, ...d2, ...d3, ...d4]);
  // If slightly short due to category availability, top up from remainder
  if (combined.length < 65) {
    const existingIds = new Set(combined.map((q) => q.id));
    const remainder = shuffle(allQuestions.filter((q) => !existingIds.has(q.id)));
    while (combined.length < 65 && remainder.length > 0) {
      combined.push(remainder.pop()!);
    }
  }

  return combined.slice(0, 65);
}
