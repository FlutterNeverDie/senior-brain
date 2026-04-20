import { GoogleAdMob } from '@apps-in-toss/web-framework';
import { useRef, useCallback } from 'react';
import { AD_CONFIG } from '../constants/adConfig';

export const useTossInterstitialAd = () => {
  const isLoaded = useRef(false);
  const isLoading = useRef(false);

  const isTossApp = () => /Toss/i.test(navigator.userAgent);

  const isSupported = () => {
    try {
      return (
        GoogleAdMob.loadAppsInTossAdMob.isSupported() &&
        GoogleAdMob.showAppsInTossAdMob.isSupported()
      );
    } catch {
      return false;
    }
  };

  const preload = useCallback(() => {
    if (!isTossApp() || !isSupported()) return;
    if (isLoaded.current || isLoading.current) return;

    isLoading.current = true;
    try {
      GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: AD_CONFIG.INTERSTITIAL },
        onEvent: (event: any) => {
          if (event.type === 'loaded') {
            isLoaded.current = true;
            isLoading.current = false;
          } else if (event.type === 'failedToLoad') {
            isLoading.current = false;
          }
        },
        onError: () => {
          isLoading.current = false;
        },
      });
    } catch {
      isLoading.current = false;
    }
  }, []);

  const showAd = useCallback(
    (onClose: () => void) => {
      if (!isTossApp()) {
        onClose();
        return;
      }
      if (!isSupported() || !isLoaded.current) {
        onClose();
        return;
      }

      isLoaded.current = false;
      let isDone = false;
      let unsubscribe: (() => void) | undefined;

      const handleNext = () => {
        if (isDone) return;
        isDone = true;
        if (unsubscribe) unsubscribe();
        onClose();
        preload();
      };

      try {
        unsubscribe = GoogleAdMob.showAppsInTossAdMob({
          options: { adGroupId: AD_CONFIG.INTERSTITIAL },
          onEvent: (event: any) => {
            if (['adClosed', 'adFailedToShow', 'dismissed'].includes(event.type)) {
              handleNext();
            }
          },
          onError: () => handleNext(),
        });
      } catch {
        handleNext();
      }
    },
    [preload]
  );

  return { preload, showAd };
};
