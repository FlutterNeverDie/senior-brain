import { create } from 'zustand';
import { generateQuizData, QuizData } from './quizLogic';

export type AppStage = 'intro' | 'stage1' | 'stage2' | 'stage3' | 'result';

interface AppState {
  appStage: AppStage;
  scores: { stage1: boolean | null; stage2: boolean | null; stage3: boolean | null };
  quizData: QuizData;
  playCount: number; // 0 = 최초, 1부터 = 두 번째 이후
  startApp: () => void;       // 시작하기 버튼 → 새 퀴즈 + 점수 초기화
  goToIntro: () => void;      // 결과화면 → 인트로 (점수 유지, 플리커 방지)
  goToStage: (stage: AppStage) => void;
  setScore: (stage: 'stage1' | 'stage2' | 'stage3', correct: boolean) => void;
  totalScore: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  appStage: 'intro',
  scores: { stage1: null, stage2: null, stage3: null },
  quizData: generateQuizData(),
  playCount: 0,

  startApp: () =>
    set((s) => ({
      appStage: 'stage1',
      scores: { stage1: null, stage2: null, stage3: null },
      quizData: generateQuizData(),        // 매번 새 문제
      playCount: s.playCount + 1,
    })),

  goToIntro: () => set({ appStage: 'intro' }), // 점수는 건드리지 않음

  goToStage: (stage) => set({ appStage: stage }),

  setScore: (stage, correct) =>
    set((s) => ({ scores: { ...s.scores, [stage]: correct } })),

  totalScore: () => {
    const { scores } = get();
    return [scores.stage1, scores.stage2, scores.stage3].filter(Boolean).length;
  },
}));
