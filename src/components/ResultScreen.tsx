import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { TossBannerAd } from './TossBannerAd';

const isTossApp = () => /Toss/i.test(navigator.userAgent);

function getBrainAge(score: number): { age: number; emoji: string; praise: string; color: string } {
  if (score === 3) return { age: 20, emoji: '🌸🌸🌸', praise: '천재이신가요?! 완벽해요!', color: '#FF6B9D' };
  if (score === 2) return { age: 35, emoji: '🌺🌺', praise: '훌륭하세요! 두뇌가 젊어요!', color: '#F97316' };
  if (score === 1) return { age: 50, emoji: '🌼', praise: '잘 하셨어요! 내일 더 잘할 수 있어요!', color: '#F6C90E' };
  return { age: 65, emoji: '🌻', praise: '내일 또 도전해요! 응원합니다!', color: '#805AD5' };
}

const STAGE_LABELS = ['숫자 기억', '색깔 판단', '잔돈 계산'];

export default function ResultScreen() {
  const { goToIntro } = useAppStore();
  // mount 시점에 점수 스냅샷 → 인트로 이동 시 플리커 방지
  const [scoreList] = useState(() => {
    const s = useAppStore.getState().scores;
    return [s.stage1, s.stage2, s.stage3];
  });
  const total = scoreList.filter(Boolean).length;
  const { age, emoji, praise, color } = getBrainAge(total);

  const handleShare = () => {
    const text = `오늘 뇌 나이 ${age}세! 3문제 중 ${total}개 맞췄어요! ${emoji}\n부모님 치매예방 뇌 건강 체크 👉 앱인토스`;
    if (isTossApp()) {
      // 앱인토스 share API
      import('@apps-in-toss/web-framework').then(({ share }) => {
        (share as any)?.({ message: text }).catch(() => null);
      }).catch(() => null);
    } else if (navigator.share) {
      navigator.share({ title: '부모님 치매예방 뇌 건강 체크', text }).catch(() => null);
    } else {
      alert('공유 기능은 토스 앱에서 이용해 주세요!');
    }
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFF5F7 0%, #FFF9F0 60%, #F0FFF4 100%)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 120,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 28px 0',
          gap: 24,
        }}
      >
        {/* 꽃 & 타이틀 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 64, margin: 0, lineHeight: 1 }}>{emoji}</p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color,
              margin: '12px 0 4px',
            }}
          >
            오늘 뇌 나이
          </h2>
          <p
            style={{
              fontSize: 72,
              fontWeight: 900,
              color,
              margin: 0,
              lineHeight: 1,
              textShadow: `0 4px 16px ${color}44`,
            }}
          >
            {age}세
          </p>
          <p style={{ fontSize: 20, color: '#4A5568', margin: '8px 0 0' }}>{praise}</p>
        </motion.div>

        {/* 점수 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            width: '100%',
            maxWidth: 360,
            background: '#FFFFFF',
            borderRadius: 24,
            padding: '24px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: '#2D3748' }}>오늘의 결과</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color,
                background: color + '18',
                borderRadius: 10,
                padding: '4px 14px',
              }}
            >
              {total}/3
            </span>
          </div>

          {scoreList.map((ok, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < 2 ? '1px solid #F7F8FA' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>
                  {['🔢', '🎨', '💰'][i]}
                </span>
                <span style={{ fontSize: 18, color: '#4A5568', fontWeight: 500 }}>
                  {STAGE_LABELS[i]}
                </span>
              </div>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: ok ? '#38A169' : '#E53E3E',
                }}
              >
                {ok ? '⭕' : '❌'}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 효도 버튼 (공유하기) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            style={{
              width: '100%',
              height: 68,
              background: 'linear-gradient(135deg, #FAE045 0%, #FFC107 100%)',
              border: 'none',
              borderRadius: 18,
              fontSize: 22,
              fontWeight: 800,
              color: '#7B4600',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(250, 224, 69, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            💌 아들/딸에게 점수 자랑하기
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goToIntro}
            style={{
              width: '100%',
              height: 56,
              background: '#F7FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: 16,
              fontSize: 19,
              fontWeight: 600,
              color: '#718096',
              cursor: 'pointer',
            }}
          >
            처음으로 돌아가기
          </motion.button>
        </motion.div>

        {/* 내일 안내 */}
        <p
          style={{
            fontSize: 16,
            color: '#A0AEC0',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          🌙 내일 아침 7시에 새로운 문제가 도착합니다
        </p>
      </div>

      {/* 하단 배너 광고 */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
        <TossBannerAd />
      </div>
    </motion.div>
  );
}
