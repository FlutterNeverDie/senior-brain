import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateQuizData, QuizData } from './quizLogic';

export type AppStage = 'intro' | 'stage1' | 'stage2' | 'stage3' | 'result';

interface AppState {
  appStage: AppStage;
  scores: { stage1: boolean | null; stage2: boolean | null; stage3: boolean | null };
  quizData: QuizData;
  playCount: number;      // 생애 통틀어 플레이한 횟수
  startApp: () => void;
  goToIntro: () => void;
  goToStage: (stage: AppStage) => void;
  setScore: (stage: 'stage1' | 'stage2' | 'stage3', correct: boolean) => void;
  totalScore: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      appStage: 'intro',
      scores: { stage1: null, stage2: null, stage3: null },
      quizData: generateQuizData(),
      playCount: 0,

      startApp: () => {
        set((s) => ({
          appStage: 'stage1',
          scores: { stage1: null, stage2: null, stage3: null },
          quizData: generateQuizData(),
          playCount: s.playCount + 1,
        }));
      },

      goToIntro: () => set({ appStage: 'intro' }),

      goToStage: (stage) => set({ appStage: stage }),

      setScore: (stage, correct) =>
        set((s) => ({ scores: { ...s.scores, [stage]: correct } })),

      totalScore: () => {
        const { scores } = get();
        return [scores.stage1, scores.stage2, scores.stage3].filter(Boolean).length;
      },
    }),
    {
      name: 'senior-brain-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        playCount: state.playCount,
      }),
    }
  )
);

