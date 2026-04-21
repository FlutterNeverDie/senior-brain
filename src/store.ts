import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateQuizData, QuizData } from './quizLogic';

export type AppStage = 'intro' | 'stage1' | 'stage2' | 'stage3' | 'result';

interface AppState {
  appStage: AppStage;
  scores: { stage1: boolean | null; stage2: boolean | null; stage3: boolean | null };
  quizData: QuizData;
  playCount: number;      // 오늘 플레이한 횟수
  lastPlayDate: string;    // 마지막으로 플레이한 날짜 (YYYY-MM-DD)
  startApp: () => void;
  goToIntro: () => void;
  goToStage: (stage: AppStage) => void;
  setScore: (stage: 'stage1' | 'stage2' | 'stage3', correct: boolean) => void;
  totalScore: () => number;
  resetPlayCountIfNewDay: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      appStage: 'intro',
      scores: { stage1: null, stage2: null, stage3: null },
      quizData: generateQuizData(),
      playCount: 0,
      lastPlayDate: '',

      startApp: () => {
        const today = getTodayString();
        set((s) => ({
          appStage: 'stage1',
          scores: { stage1: null, stage2: null, stage3: null },
          quizData: generateQuizData(),
          playCount: s.playCount + 1,
          lastPlayDate: today,
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

      resetPlayCountIfNewDay: () => {
        const today = getTodayString();
        const { lastPlayDate } = get();
        if (lastPlayDate !== today) {
          set({ playCount: 0, lastPlayDate: today });
        }
      },
    }),
    {
      name: 'senior-brain-storage',
      storage: createJSONStorage(() => localStorage),
      // appStage나 quizData는 영속화할 필요 없으므로 partialise 사용 (선택 사항)
      partialize: (state) => ({
        playCount: state.playCount,
        lastPlayDate: state.lastPlayDate,
      }),
    }
  )
);

