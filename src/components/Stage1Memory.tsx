import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { useTossInterstitialAd } from '../hooks/useTossInterstitialAd';
import StageHeader from './StageHeader';

type Phase = 'show' | 'input' | 'feedback';

export default function Stage1Memory() {
  const { quizData, setScore, goToStage } = useAppStore();
  const { preload } = useTossInterstitialAd();
  const { number } = quizData.stage1;

  const [phase, setPhase] = useState<Phase>('show');
  const [countdown, setCountdown] = useState(3);
  const [inputVal, setInputVal] = useState('');
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 광고 사전 로드
  useEffect(() => {
    preload();
  }, [preload]);

  // 카운트다운 후 입력 단계
  useEffect(() => {
    if (phase !== 'show') return;
    if (countdown <= 0) {
      setPhase('input');
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const handleSubmit = () => {
    if (!inputVal.trim()) return;
    const isCorrect = inputVal.trim() === number;
    setCorrect(isCorrect);
    setScore('stage1', isCorrect);
    setPhase('feedback');
    setTimeout(() => goToStage('stage2'), 1800);
  };

  return (
    <motion.div
      key="stage1"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
      style={{
        minHeight: '100vh',
        background: '#EFF6FF',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 40px',
        boxSizing: 'border-box',
      }}
    >
      <StageHeader current={1} color="#3182CE" />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 28px',
          gap: 32,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 40 }}>🔢</span>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A365D', margin: '8px 0 4px' }}>
            숫자 기억하기
          </h2>
          <p style={{ fontSize: 18, color: '#2B6CB0', margin: 0 }}>
            {phase === 'show'
              ? `${countdown}초 동안 숫자를 외우세요!`
              : phase === 'input'
              ? '외운 숫자를 입력하세요'
              : ''}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'show' && (
            <motion.div
              key="show"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: '32px 48px',
                boxShadow: '0 8px 32px rgba(49, 130, 206, 0.2)',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: '0 0 8px', fontSize: 16, color: '#718096' }}>이 숫자를 기억하세요</p>
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  margin: 0,
                  fontSize: 56,
                  fontWeight: 900,
                  color: '#3182CE',
                  letterSpacing: 8,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {number}
              </motion.p>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: countdown >= n ? '#3182CE' : '#BEE3F8',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', maxWidth: 360 }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 24,
                  padding: '28px 24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <p style={{ margin: '0 0 16px', fontSize: 18, color: '#4A5568', textAlign: 'center' }}>
                  방금 본 숫자는?
                </p>
                <input
                  ref={inputRef}
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="숫자를 입력하세요"
                  style={{
                    width: '100%',
                    height: 64,
                    fontSize: 32,
                    fontWeight: 700,
                    textAlign: 'center',
                    border: '2px solid #BEE3F8',
                    borderRadius: 16,
                    outline: 'none',
                    background: '#F0F8FF',
                    color: '#1A365D',
                    boxSizing: 'border-box',
                    letterSpacing: 4,
                  }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!inputVal.trim()}
                style={{
                  width: '100%',
                  height: 64,
                  marginTop: 16,
                  background: inputVal.trim() ? '#3182CE' : '#A0AEC0',
                  border: 'none',
                  borderRadius: 18,
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: inputVal.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
              >
                확인하기
              </motion.button>
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
                {correct ? '대단하세요!' : `정답은 ${number} 이었어요`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
