import { useState, useCallback, useRef } from 'react';

interface AudioState {
  isSupported: boolean;
  isEnabled: boolean;
  volume: number;
  isPlaying: boolean;
}

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const useAudio = () => {
  const [state, setState] = useState<AudioState>({
    isSupported: typeof Audio !== 'undefined',
    isEnabled: true,
    volume: 0.7,
    isPlaying: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if audio is supported
  const isAudioSupported = useCallback(() => {
    return typeof Audio !== 'undefined' && 'AudioContext' in window;
  }, []);

  // Create audio element
  const createAudio = useCallback((src: string): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.volume = state.volume;
    audio.preload = 'auto';
    return audio;
  }, [state.volume]);

  // Play sound with options
  const playSound = useCallback(async (
    src: string,
    options: AudioOptions = {}
  ): Promise<boolean> => {
    if (!state.isSupported || !state.isEnabled) {
      return false;
    }

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element
      const audio = createAudio(src);
      audioRef.current = audio;

      // Apply options
      if (options.volume !== undefined) {
        audio.volume = options.volume;
      }
      if (options.loop) {
        audio.loop = true;
      }

      // Fade in effect
      if (options.fadeIn) {
        audio.volume = 0;
        const fadeInInterval = setInterval(() => {
          if (audio.volume < (options.volume || state.volume)) {
            audio.volume += 0.1;
          } else {
            clearInterval(fadeInInterval);
          }
        }, 50);
      }

      // Set up fade out effect
      if (options.fadeOut) {
        const fadeOutDuration = 1000; // 1 second
        audio.addEventListener('ended', () => {
          const fadeOutInterval = setInterval(() => {
            if (audio.volume > 0) {
              audio.volume -= 0.1;
            } else {
              clearInterval(fadeOutInterval);
            }
          }, fadeOutDuration / 10);
        });
      }

      // Play the audio
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true }));

      // Clean up when finished
      audio.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      });

      return true;
    } catch (error) {
      // Silently fail for missing audio files or unsupported operations
      setState(prev => ({ ...prev, isPlaying: false }));
      return false;
    }
  }, [state.isSupported, state.isEnabled, state.volume, createAudio]);

  // Stop current audio
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  // Toggle audio enabled/disabled
  const toggleAudio = useCallback(() => {
    setState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
    if (!state.isEnabled && audioRef.current) {
      stopSound();
    }
  }, [state.isEnabled, stopSound]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setState(prev => ({ ...prev, volume: clampedVolume }));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Predefined sounds
  const sounds = {
    // Timer completion sound (gentle chime)
    completion: () => playSound('/sounds/completion.mp3', { fadeOut: true }),
    
    // Timer start sound (soft beep)
    start: () => playSound('/sounds/start.mp3'),
    
    // Button click sound (subtle tap)
    click: () => playSound('/sounds/click.mp3', { volume: 0.3 }),
    
    // Notification sound (attention-grabbing but pleasant)
    notification: () => playSound('/sounds/notification.mp3'),
    
    // Break reminder sound (calming)
    reminder: () => playSound('/sounds/reminder.mp3', { fadeIn: true }),
    
    // Error sound (gentle warning)
    error: () => playSound('/sounds/error.mp3'),
    
    // Success sound (positive feedback)
    success: () => playSound('/sounds/success.mp3', { fadeOut: true }),
  };

  // Generate audio data URLs for simple sounds (fallback)
  const generateBeep = useCallback((frequency: number, duration: number): string => {
    const sampleRate = 44100;
    const samples = sampleRate * duration / 1000;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate sine wave
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }, []);

  // Fallback sounds using generated audio
  const fallbackSounds = {
    completion: () => {
      const beep = generateBeep(800, 500);
      return playSound(beep, { fadeOut: true });
    },
    start: () => {
      const beep = generateBeep(600, 200);
      return playSound(beep);
    },
    click: () => {
      const beep = generateBeep(1000, 100);
      return playSound(beep, { volume: 0.2 });
    },
    notification: () => {
      const beep = generateBeep(440, 300);
      return playSound(beep);
    },
  };

  // Smart sound playing (tries real sounds first, falls back to generated)
  const playSmartSound = useCallback(async (soundType: keyof typeof sounds) => {
    try {
      // Try to play the real sound first
      const success = await sounds[soundType]();
      if (!success && fallbackSounds[soundType]) {
        // Fall back to generated sound
        await fallbackSounds[soundType]();
      }
    } catch (error) {
      console.error(`Error playing ${soundType} sound:`, error);
      // Try fallback if available
      if (fallbackSounds[soundType]) {
        await fallbackSounds[soundType]();
      }
    }
  }, [sounds, fallbackSounds]);

  return {
    // State
    isSupported: state.isSupported,
    isEnabled: state.isEnabled,
    volume: state.volume,
    isPlaying: state.isPlaying,
    
    // Actions
    playSound,
    stopSound,
    toggleAudio,
    setVolume,
    
    // Predefined sounds
    sounds: {
      ...sounds,
      playSmartSound,
    },
    
    // Utilities
    generateBeep,
  };
};
