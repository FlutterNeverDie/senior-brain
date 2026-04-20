import React, { useEffect, useRef, useState } from 'react';
import { TossAds } from '@apps-in-toss/web-framework';
import { AD_CONFIG } from '../constants/adConfig';

const isTossApp = () => /Toss/i.test(navigator.userAgent);

export const TossBannerAd: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const inToss = isTossApp();

  useEffect(() => {
    if (!inToss) return;
    const ads = TossAds as any;
    try {
      if (ads.initialize?.isSupported?.() || ads.initialize) {
        ads.initialize({
          callbacks: {
            onInitialized: () => setInitialized(true),
            onInitializationFailed: () => setInitialized(true),
          },
        });
      } else {
        setInitialized(true);
      }
    } catch {
      setInitialized(true);
    }
  }, [inToss]);

  useEffect(() => {
    if (!inToss || !initialized || !containerRef.current) return;
    const ads = TossAds as any;
    const attach = ads.attachBanner ?? ads.attach;
    let banner: { destroy: () => void } | undefined;
    try {
      banner = attach?.(AD_CONFIG.BANNER, containerRef.current, {
        variant: 'expanded',
        theme: 'light',
      });
    } catch {
      // 광고 로드 실패 시 무시
    }
    return () => {
      if (banner && typeof banner.destroy === 'function') {
        banner.destroy();
      } else {
        ads.destroyAll?.();
      }
    };
  }, [inToss, initialized]);

  if (!inToss) {
    return (
      <div
        style={{
          height: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F8FA',
          color: '#8B95A1',
          fontSize: 14,
          borderTop: '1px solid #E5E8EB',
        }}
      >
        [광고 영역]
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: 96 }}>
      <div ref={containerRef} style={{ width: '100%' }} />
    </div>
  );
};
