'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Settings, BarChart3, Wifi, WifiOff } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
// import { useNotification } from '@/hooks/useNotification'; // Removed web notifications
import { usePWA } from '@/hooks/usePWA';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useAudio } from '@/hooks/useAudio';
import CoffeeCup from '@/components/CoffeeCup/CoffeeCup';
import TimerDisplay from '@/components/Timer/TimerDisplay';
import TimerControls from '@/components/Timer/Controls';
import TimeInput from '@/components/Timer/TimeInput';
// import NotificationManager from '@/components/Notification/NotificationManager'; // Removed web notifications
import InstallPrompt from '@/components/UI/InstallPrompt';
import StatisticsPanel from '@/components/Statistics/StatisticsPanel';
import AudioControls from '@/components/UI/AudioControls';
import ThemeToggle from '@/components/UI/ThemeToggle';
import Modal from '@/components/UI/Modal';
import Button from '@/components/UI/Button';

export default function HomePage() {
  const {
    duration,
    isRunning,
    isPaused,
    isCompleted,
    progress,
    formattedTime,
    coffeeLevel,
    setDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    canStart,
    canPause,
    canReset,
  } = useTimer();
  
  // const { canNotify } = useNotification(); // Removed web notifications
  const { canInstall, isInstalled } = usePWA();
  const { isOnline, syncStatus, pendingCount } = useOfflineSync();
  const { sounds } = useAudio();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [cycles, setCycles] = useState<any[]>([]);
  
  // Listen for timer completion
  React.useEffect(() => {
    if (isCompleted) {
      handleTimerComplete(duration);
    }
  }, [isCompleted, duration]);
  
  // Handle timer completion
  const handleTimerComplete = (duration: number) => {
    // Play completion sound
    sounds.completion().catch(() => {}); // Ignore audio errors
    
    // Add to cycles for statistics
    const newCycle = {
      id: crypto.randomUUID(),
      duration,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      completed: true,
    };
    setCycles(prev => [...prev, newCycle]);
    
    console.log('Timer completed!', duration);
  };
  
  // Handle timer start - removed notifications
  const handleTimerStart = (duration: number) => {
    // Timer start logic (no notifications)
  };
  
  // Handle start button click
  const handleStart = () => {
    if (canStart) {
      startTimer();
      sounds.start().catch(() => {}); // Ignore audio errors
    }
  };
  
  // Handle pause button click
  const handlePause = () => {
    if (canPause) {
      pauseTimer();
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    if (canReset) {
      resetTimer();
    }
  };
  
  // Handle settings button click
  const handleSettings = () => {
    setShowSettings(true);
  };
  
  // Handle stats button click
  const handleStats = () => {
    setShowStats(true);
  };
  
  return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-100">
      
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coffee className="w-8 h-8 text-coffee-600" />
              <h1 className="text-2xl font-bold text-foreground">Coffee Timer</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Online Status */}
              <div className="flex items-center space-x-1 text-sm">
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  {pendingCount > 0 && (
                    <span className="text-xs bg-yellow-500 text-white px-1 rounded">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStats}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                İstatistikler
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
              >
                <Settings className="w-4 h-4 mr-1" />
                Ayarlar
              </Button>
              
              <ThemeToggle variant="compact" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Install Prompt */}
      {canInstall() && !isInstalled && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Coffee Cup */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <CoffeeCup
              level={coffeeLevel}
              isAnimating={isRunning}
              size="lg"
              className="drop-shadow-2xl"
            />
          </motion.div>
          
          {/* Right Side - Timer Controls */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            {/* Timer Display */}
            <TimerDisplay
              time={formattedTime}
              progress={progress}
              isRunning={isRunning}
              isCompleted={isCompleted}
            />
            
            {/* Timer Controls */}
            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              canStart={canStart}
              canPause={canPause}
              canReset={canReset}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onSettings={handleSettings}
            />
            
            {/* Time Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <TimeInput
                duration={duration}
                onDurationChange={setDuration}
                disabled={isRunning}
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Ayarlar"
        size="md"
      >
            <div className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Tema</h3>
            <ThemeToggle variant="button" showLabel={false} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Ses</h3>
            <AudioControls showLabel={false} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">PWA</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Uygulama durumu
              </span>
              <div className="flex items-center space-x-2">
                {isInstalled ? (
                  <span className="text-sm text-success">✓ Yüklü</span>
                ) : canInstall() ? (
                  <span className="text-sm text-warning">Yüklenebilir</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Desteklenmiyor</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Stats Modal */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="İstatistikler"
        size="lg"
      >
        <StatisticsPanel cycles={cycles} />
      </Modal>
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border bg-surface/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            ☕ Coffee Timer - Kahve molalarınızı düzenleyin, verimliliğinizi artırın
          </p>
        </div>
      </footer>
    </div>
  );
}