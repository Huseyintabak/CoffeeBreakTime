import { useState, useEffect } from 'react';

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  installPrompt: PWAInstallPrompt | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if app is installed and running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    // Check if app is installed (iOS)
    const isIOSInstalled = (window.navigator as any).standalone;

    setPwaState(prev => ({
      ...prev,
      isInstalled: isStandalone || isIOSInstalled,
      isStandalone,
    }));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as PWAInstallPrompt,
      }));
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstallable: false,
        isInstalled: true,
        installPrompt: null,
      }));
    };

    // Listen for online/offline events
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Install PWA
  const installPWA = async (): Promise<boolean> => {
    if (!pwaState.installPrompt) return false;

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          isInstallable: false,
          installPrompt: null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  // Check if device supports PWA installation
  const canInstall = (): boolean => {
    return pwaState.isInstallable && !pwaState.isInstalled;
  };

  // Get installation instructions for iOS
  const getIOSInstallInstructions = (): string[] => {
    return [
      'Safari menüsünden "Paylaş" butonuna dokunun',
      'Aşağıdaki seçeneklerden "Ana Ekrana Ekle" seçeneğini bulun',
      '"Ekle" butonuna dokunarak uygulamayı ana ekranınıza ekleyin',
    ];
  };

  // Check if running on iOS
  const isIOS = (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  // Check if running on Android
  const isAndroid = (): boolean => {
    return /Android/.test(navigator.userAgent);
  };

  // Get appropriate installation method
  const getInstallMethod = (): 'native' | 'ios' | 'android' | 'unsupported' => {
    if (pwaState.isInstallable) return 'native';
    if (isIOS()) return 'ios';
    if (isAndroid()) return 'android';
    return 'unsupported';
  };

  return {
    ...pwaState,
    installPWA,
    canInstall,
    getIOSInstallInstructions,
    isIOS,
    isAndroid,
    getInstallMethod,
  };
};
