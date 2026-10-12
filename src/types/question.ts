export type QuestionType = "single" | "multiple";

export interface QuestionOption {
  id: string; // "A", "B", "C", "D", etc.
  text: string;
}

export interface QuestionReference {
  title?: string;
  url: string;
}

export interface Question {
  id: string;
  number: number;
  sourceDocument: string;
  sourcePage?: number;
  questionText: string;
  type: QuestionType;
  options: QuestionOption[];
  correctOptionIds: string[];
  explanation?: string;
  references: QuestionReference[];
  domain: 1 | 2 | 3 | 4;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags: string[];
  status: "draft" | "published" | "needs_review";
  contentVersion: number;
}

export interface DomainInfo {
  id: 1 | 2 | 3 | 4;
  name: string;
  weighting: string;
  description: string;
  icon: string;
}

export const AWS_DOMAINS: Record<1 | 2 | 3 | 4, DomainInfo> = {
  1: {
    id: 1,
    name: "Cloud Concepts",
    weighting: "24%",
    description: "AWS Cloud concepts, value proposition, cloud economics, and cloud architecture design principles.",
    icon: "Cloud"
  },
  2: {
    id: 2,
    name: "Security and Compliance",
    weighting: "30%",
    description: "AWS Shared Responsibility Model, IAM, security services, data protection, and compliance frameworks.",
    icon: "ShieldCheck"
  },
  3: {
    id: 3,
    name: "Cloud Technology and Services",
    weighting: "34%",
    description: "AWS core services (Compute, Storage, Database, Networking), global infrastructure, and management tools.",
    icon: "Server"
  },
  4: {
    id: 4,
    name: "Billing, Pricing, and Support",
    weighting: "12%",
    description: "AWS pricing models, account structures, billing tools, Support plans, and AWS Trusted Advisor.",
    icon: "CreditCard"
  }
};
