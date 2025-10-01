import { useEffect, useCallback, useState } from 'react';
import useTimerStore from '@/store/timerStore';

export const useTimer = () => {
  const {
    duration,
    remaining,
    isRunning,
    isPaused,
    isCompleted,
    startTime,
    endTime,
    progress: progressFn,
    formattedTime: formattedTimeFn,
    coffeeLevel: coffeeLevelFn,
    setDuration,
    updateRemaining,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeTimer,
    tick,
  } = useTimerStore();
  
  // Call functions to get computed values
  const progress = progressFn();
  const formattedTime = formattedTimeFn();
  const coffeeLevel = coffeeLevelFn();
  
  // Simple timer with useEffect - back to basics
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      console.log('Starting simple timer'); // Debug log
      
      interval = setInterval(() => {
        // Always get fresh state from store to avoid stale closure
        const currentState = useTimerStore.getState();
        const currentRemaining = currentState.remaining;
        const currentIsRunning = currentState.isRunning;
        
        console.log('Timer tick - remaining:', currentRemaining, 'isRunning:', currentIsRunning); // Debug log
        
        // Only continue if still running and has time left
        if (!currentIsRunning || currentRemaining <= 0) {
          console.log('Timer stopped or completed, clearing interval'); // Debug log
          if (interval) clearInterval(interval);
          return;
        }
        
        const newRemaining = currentRemaining - 1;
        
        console.log('Updating from', currentRemaining, 'to', newRemaining); // Debug log
        
        // Update remaining time through store action - get fresh action from store
        useTimerStore.getState().updateRemaining(newRemaining);
        
        if (newRemaining <= 0) {
          console.log('Timer completed!'); // Debug log
          useTimerStore.getState().completeTimer();
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        console.log('Clearing timer interval'); // Debug log
        clearInterval(interval);
      }
    };
  }, [isRunning]); // Only depend on isRunning, not remaining
  
  // Debug: Log store values
  useEffect(() => {
    console.log('Store values changed:', { 
      remaining, 
      formattedTime, 
      progress, 
      coffeeLevel, 
      isRunning 
    });
  }, [remaining, formattedTime, progress, coffeeLevel, isRunning]);
  
  // Handle timer completion
  useEffect(() => {
    if (isCompleted && remaining === 0) {
      // Timer completed, trigger notifications
      console.log('Timer completed!');
      // You can add completion logic here
    }
  }, [isCompleted, remaining]);
  
  // Memoized actions
  const handleStart = useCallback(() => {
    console.log('Handle start called:', { isPaused, isRunning, remaining }); // Debug log
    if (isPaused) {
      console.log('Resuming timer'); // Debug log
      resumeTimer();
    } else {
      console.log('Starting timer'); // Debug log
      startTimer();
    }
  }, [isPaused, resumeTimer, startTimer, isRunning, remaining]);
  
  const handlePause = useCallback(() => {
    pauseTimer();
  }, [pauseTimer]);
  
  const handleReset = useCallback(() => {
    resetTimer();
  }, [resetTimer]);
  
  const handleSetDuration = useCallback((newDuration: number) => {
    setDuration(newDuration);
  }, [setDuration]);
  
    return {
      // State
      duration,
      remaining,
      isRunning,
      isPaused,
      isCompleted,
      startTime,
      endTime,
      progress,
      formattedTime,
      coffeeLevel,
      
      // Actions
      setDuration: handleSetDuration,
      startTimer: handleStart,
      pauseTimer: handlePause,
      resetTimer: handleReset,
      completeTimer,
      
      // Computed
      isActive: isRunning || isPaused,
      canStart: !isRunning && remaining > 0,
      canPause: isRunning && remaining > 0,
      canReset: !isRunning || isCompleted,
    };
};

