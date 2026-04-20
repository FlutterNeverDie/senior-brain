import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store';
import StageHeader from './StageHeader';

type Phase = 'quiz' | 'feedback';

const COLOR_BG: Record<string, string> = {
  빨강: '#FFF5F5',
  파랑: '#EBF8FF',
  노랑: '#FFFFF0',
  초록: '#F0FFF4',
  보라: '#FAF5FF',
};

const COLOR_HEX: Record<string, string> = {
  빨강: '#E53E3E',
  파랑: '#3182CE',
  노랑: '#D69E2E',
  초록: '#38A169',
  보라: '#805AD5',
};

export default function Stage2Color() {
  const { quizData, setScore, goToStage } = useAppStore();
  const { word, wordColorHex, answer, options } = quizData.stage2;
  const [phase, setPhase] = useState<Phase>('quiz');
  const [selected, setSelected] = useState('');
  const [correct, setCorrect] = useState(false);

  const handleSelect = (opt: string) => {
    if (phase !== 'quiz') return;
    const isCorrect = opt === answer;
    setSelected(opt);
    setCorrect(isCorrect);
    setScore('stage2', isCorrect);
    setPhase('feedback');
    setTimeout(() => goToStage('stage3'), 1800);
  };

  return (
    <motion.div
      key="stage2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{
        minHeight: '100vh',
        background: '#FFF7ED',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 40px',
        boxSizing: 'border-box',
      }}
    >
      <StageHeader current={2} color="#DD6B20" />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 28px',
          gap: 28,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 40 }}>🎨</span>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#7B341E', margin: '8px 0 4px' }}>
            색깔 판단하기
          </h2>
          <p style={{ fontSize: 18, color: '#C05621', margin: 0 }}>
            이 글자의 <strong>색깔</strong>을 고르세요
          </p>
        </div>

        {/* 스트룹 단어 */}
        <AnimatePresence mode="wait">
          {phase === 'quiz' && (
            <motion.div
              key="word"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '36px 56px',
                boxShadow: '0 8px 32px rgba(221, 107, 32, 0.15)',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: 15, color: '#A0AEC0' }}>
                이 글자의 색은?
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 68,
                  fontWeight: 900,
                  color: wordColorHex,
                  textShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {word}
              </p>
            </motion.div>
          )}

          {phase === 'feedback' && (
            <motion.div
              key="fb"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontSize: 72, margin: 0 }}>{correct ? '🎉' : '🤔'}</p>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: correct ? '#38A169' : '#E53E3E',
                  margin: '8px 0 4px',
                }}
              >
                {correct ? '정답이에요!' : '아쉽네요!'}
              </p>
              <p style={{ fontSize: 18, color: '#718096', margin: 0 }}>
                {correct
                  ? '색깔을 잘 구분하셨어요!'
                  : `정답은 "${answer}" 이었어요`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택지 버튼 */}
        {phase === 'quiz' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              width: '100%',
              maxWidth: 360,
            }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(opt)}
                style={{
                  height: 72,
                  background: COLOR_BG[opt] ?? '#F7FAFC',
                  border: `3px solid ${COLOR_HEX[opt] ?? '#CBD5E0'}`,
                  borderRadius: 18,
                  fontSize: 24,
                  fontWeight: 800,
                  color: COLOR_HEX[opt] ?? '#2D3748',
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        )}

        {/* 피드백 시 정답 표시 */}
        {phase === 'feedback' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '16px 28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 17, color: '#4A5568' }}>
              선택:{' '}
              <strong style={{ color: COLOR_HEX[selected] ?? '#2D3748' }}>{selected}</strong>
              {!correct && (
                <>
                  {'  →  '}
                  <strong style={{ color: COLOR_HEX[answer] ?? '#2D3748' }}>{answer}</strong>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
