import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '../store';
import { useTossInterstitialAd } from '../hooks/useTossInterstitialAd';
import StageHeader from './StageHeader';

type Phase = 'quiz' | 'feedback';

function formatWon(n: number) {
  return n.toLocaleString('ko-KR') + '원';
}

export default function Stage3Change() {
  const { quizData, setScore, goToStage, playCount } = useAppStore();
  const { showAd } = useTossInterstitialAd();
  const { payAmount, price, itemName, answer, options } = quizData.stage3;

  const [phase, setPhase] = useState<Phase>('quiz');
  const [selected, setSelected] = useState(0);
  const [correct, setCorrect] = useState(false);

  const handleSelect = (opt: number) => {
    if (phase !== 'quiz') return;
    const isCorrect = opt === answer;
    setSelected(opt);
    setCorrect(isCorrect);
    setScore('stage3', isCorrect);
    setPhase('feedback');

    // 피드백 잠깐 보여주고, 두 번째 플레이부터 광고 → 결과 화면
    setTimeout(() => {
      if (playCount >= 2) {
        showAd(() => goToStage('result'));
      } else {
        goToStage('result');
      }
    }, 1600);
  };

  return (
    <motion.div
      key="stage3"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{
        minHeight: '100vh',
        background: '#F0FDF4',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 40px',
        boxSizing: 'border-box',
      }}
    >
      <StageHeader current={3} color="#38A169" />

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
          <span style={{ fontSize: 40 }}>💰</span>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A4731', margin: '8px 0 4px' }}>
            잔돈 계산하기
          </h2>
          <p style={{ fontSize: 18, color: '#276749', margin: 0 }}>
            거스름돈이 얼마인지 골라보세요
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '28px 24px',
                boxShadow: '0 8px 32px rgba(56, 161, 105, 0.15)',
                width: '100%',
                maxWidth: 360,
                boxSizing: 'border-box',
              }}
            >
              {/* 문제 */}
              <div
                style={{
                  background: '#F0FDF4',
                  borderRadius: 16,
                  padding: '20px',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: '0 0 12px', fontSize: 17, color: '#4A5568' }}>
                  <strong style={{ color: '#276749', fontSize: 20 }}>{itemName}</strong>을 샀어요
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#718096' }}>물건값</p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 26,
                        fontWeight: 800,
                        color: '#E53E3E',
                      }}
                    >
                      {formatWon(price)}
                    </p>
                  </div>
                  <span style={{ fontSize: 24, color: '#A0AEC0' }}>→</span>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#718096' }}>낸 돈</p>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 26,
                        fontWeight: 800,
                        color: '#3182CE',
                      }}
                    >
                      {formatWon(payAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700, color: '#2D3748', textAlign: 'center' }}>
                거스름돈은 얼마일까요? 🤔
              </p>

              {/* 선택지 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {options.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(opt)}
                    style={{
                      height: 68,
                      background: '#F7FAFC',
                      border: '2px solid #C6F6D5',
                      borderRadius: 16,
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#276749',
                      cursor: 'pointer',
                    }}
                  >
                    {formatWon(opt)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'feedback' && (
            <motion.div
              key="feedback"
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
                  ? `정확히 ${formatWon(answer)} 맞췄어요!`
                  : `정답은 ${formatWon(answer)} 이었어요`}
              </p>
              <p style={{ fontSize: 16, color: '#A0AEC0', marginTop: 12 }}>
                잠시 후 결과 화면으로 이동해요...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
