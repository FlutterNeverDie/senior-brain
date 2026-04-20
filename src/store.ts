import { create } from 'zustand';
import { generateQuizData, QuizData } from './quizLogic';

export type AppStage = 'intro' | 'stage1' | 'stage2' | 'stage3' | 'result';

interface AppState {
  appStage: AppStage;
  scores: { stage1: boolean | null; stage2: boolean | null; stage3: boolean | null };
  quizData: QuizData;
  startApp: () => void;
  goToStage: (stage: AppStage) => void;
  setScore: (stage: 'stage1' | 'stage2' | 'stage3', correct: boolean) => void;
  reset: () => void;
  totalScore: () => number;
}

const NEXT_STAGE: Record<AppStage, AppStage> = {
  intro: 'stage1',
  stage1: 'stage2',
  stage2: 'stage3',
  stage3: 'result',
  result: 'intro',
};

export const useAppStore = create<AppState>((set, get) => ({
  appStage: 'intro',
  scores: { stage1: null, stage2: null, stage3: null },
  quizData: generateQuizData(),

  startApp: () => set({ appStage: 'stage1' }),

  goToStage: (stage) => set({ appStage: stage }),

  setScore: (stage, correct) =>
    set((s) => ({ scores: { ...s.scores, [stage]: correct } })),

  reset: () =>
    set({
      appStage: 'intro',
      scores: { stage1: null, stage2: null, stage3: null },
    }),

  totalScore: () => {
    const { scores } = get();
    return [scores.stage1, scores.stage2, scores.stage3].filter(Boolean).length;
  },
}));

// 스테이지 진행 헬퍼
export function getNextStage(current: AppStage): AppStage {
  return NEXT_STAGE[current];
}
