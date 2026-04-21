import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '../store';
import { useTossInterstitialAd } from '../hooks/useTossInterstitialAd';

const flowers = ['🌸', '🌺', '🌷', '🌹'];

export default function IntroScreen() {
  const { startApp, playCount } = useAppStore();
  const { preload, showAd } = useTossInterstitialAd();

  useEffect(() => {
    preload();
  }, [preload]);

  const handleStart = () => {
    if (playCount > 0) {
      showAd(() => startApp());
    } else {
      startApp();
    }
  };

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFF5F7 0%, #FFF9F0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 28px',
        boxSizing: 'border-box',
      }}
    >
      {/* 꽃 장식 */}
      <div
        style={{
          fontSize: 44,
          marginBottom: 4,
          letterSpacing: 8,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
        }}
      >
        {flowers.map((f, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            style={{ display: 'inline-block', flexShrink: 0 }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      {/* 앱 이름 */}
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: '#2D3748',
          margin: '8px 0 4px',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        부모님 치매예방
        <br />
        <span style={{ color: '#FF6B9D', fontSize: 24 }}>뇌 건강 체크</span>
      </motion.h1>

      <p
        style={{
          fontSize: 17,
          color: '#718096',
          textAlign: 'center',
          lineHeight: 1.7,
          margin: '0 0 24px',
        }}
      >
        매일 아침 1분,{' '}
        <strong style={{ color: '#E53E3E' }}>3가지 퀴즈</strong>로
        <br />
        건강한 두뇌 습관을 만들어요!
      </p>

      {/* 단계 안내 */}
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '16px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          marginBottom: 24,
        }}
      >
        {[
          { icon: '🔢', label: '1단계', desc: '숫자를 기억하세요', color: '#3182CE' },
          { icon: '🎨', label: '2단계', desc: '색깔을 맞혀보세요', color: '#E53E3E' },
          { icon: '💰', label: '3단계', desc: '거스름돈을 계산해요', color: '#38A169' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < 2 ? '1px solid #F7F8FA' : 'none',
            }}
          >
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            <div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: item.color,
                  background: item.color + '18',
                  borderRadius: 8,
                  padding: '2px 8px',
                }}
              >
                {item.label}
              </span>
              <p style={{ margin: '2px 0 0', fontSize: 17, color: '#2D3748', fontWeight: 500 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 시작 버튼 */}
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleStart}
          style={{
            width: '100%',
            height: 60,
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: 18,
            fontSize: 22,
            fontWeight: 800,
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(255, 107, 157, 0.4)',
            letterSpacing: 1,
            marginBottom: (/Toss/i.test(navigator.userAgent) && playCount > 0) ? 8 : 0,
          }}
        >
          {(/Toss/i.test(navigator.userAgent) && playCount > 0) ? '훈련 시작 🧠' : '시작하기 🧠'}
        </motion.button>
        {(/Toss/i.test(navigator.userAgent) && playCount > 0) && (
          <p style={{ fontSize: 13, color: '#A0AEC0', margin: 0 }}>
            * 광고를 약 5초간 시청한 뒤 시작합니다
          </p>
        )}
      </div>


    </motion.div>
  );
}
