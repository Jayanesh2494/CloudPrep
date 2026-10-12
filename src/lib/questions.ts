import questionsData from "@/data/questions.json";
import { Question } from "@/types/question";

export const allQuestions: Question[] = questionsData as Question[];

const questionMap: Map<string, Question> = new Map(
  allQuestions.map((q) => [q.id, q])
);

export function getAllQuestions(): Question[] {
  return allQuestions;
}

export function getQuestionById(id: string): Question | undefined {
  return questionMap.get(id);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  return ids
    .map((id) => questionMap.get(id))
    .filter((q): q is Question => q !== undefined);
}

export function getQuestionsByDomain(domain: 1 | 2 | 3 | 4): Question[] {
  return allQuestions.filter((q) => q.domain === domain);
}

export interface QuestionFilters {
  domain?: 1 | 2 | 3 | 4 | "all";
  type?: "single" | "multiple" | "all";
  searchQuery?: string;
  bookmarkedOnly?: boolean;
  incorrectOnly?: boolean;
  unansweredOnly?: boolean;
  bookmarkedIds?: Set<string>;
  incorrectIds?: Set<string>;
  answeredIds?: Set<string>;
}

export function filterQuestions(
  filters: QuestionFilters,
  pool: Question[] = allQuestions
): Question[] {
  return pool.filter((q) => {
    if (filters.domain && filters.domain !== "all" && q.domain !== filters.domain) {
      return false;
    }
    if (filters.type && filters.type !== "all" && q.type !== filters.type) {
      return false;
    }
    if (filters.bookmarkedOnly && filters.bookmarkedIds) {
      if (!filters.bookmarkedIds.has(q.id)) return false;
    }
    if (filters.incorrectOnly && filters.incorrectIds) {
      if (!filters.incorrectIds.has(q.id)) return false;
    }
    if (filters.unansweredOnly && filters.answeredIds) {
      if (filters.answeredIds.has(q.id)) return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const query = filters.searchQuery.toLowerCase();
      const matchText =
        q.questionText.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        q.options.some((opt) => opt.text.toLowerCase().includes(query)) ||
        q.tags.some((tag) => tag.toLowerCase().includes(query));
      if (!matchText) return false;
    }
    return true;
  });
}
