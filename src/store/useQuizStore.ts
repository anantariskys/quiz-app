import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Question {
  question: string;
  incorrect_answers: string[];
  correctAnswer: string;
  allAnswers: string[];
}


interface QuizState {
  questions: Question[];
  answers: Record<number, string>; // Store answers with question index as key
  currentQuestionIndex: number;
  timer: number;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (index: number, answer: string) => void;
  next: () => void;
  prev: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  decrementTimer: () => void;
  reset: () => void;
  results: {
    correct: number;
    incorrect: number;
    answered: number;
  };
  setResults: (results: { correct: number; incorrect: number; answered: number }) => void;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set) => ({
      questions: [],
      currentQuestionIndex: 0,
      timer: 60,
      answers: {},
      results: { correct: 0, incorrect: 0, answered: 0 },
      setResults(results) {
        set({ results });
      },

      setAnswer(index, answer) {
        set((state) => ({
          answers: {
            ...state.answers,
            [index]: answer,
          },
        }));
      },

      decrementTimer() {
        set((state) => ({
          timer: state.timer - 1,
        }));
      },
      reset() {
        set({
          questions: [],
          currentQuestionIndex: 0,
          timer: 60,
          answers: {},
        });
      },

      setQuestions: (questions: Question[]) =>
        set(() => ({
          questions,
          currentQuestionIndex: questions.length > 0 ? 0 : -1,
        })),
      next() {
        set((state) => ({
          currentQuestionIndex:
            state.currentQuestionIndex < state.questions.length - 1
              ? state.currentQuestionIndex + 1
              : state.currentQuestionIndex,
        }));
      },
      prev() {
        set((state) => ({
          currentQuestionIndex:
            state.currentQuestionIndex > 0
              ? state.currentQuestionIndex - 1
              : state.currentQuestionIndex,
        }));
      },
      setCurrentQuestionIndex(index) {
        set({ currentQuestionIndex: index });
      },
    }),
    { name: "quiz-store" }
  )
);