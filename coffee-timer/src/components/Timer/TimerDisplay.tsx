import React from 'react';
import { motion } from 'framer-motion';

interface TimerDisplayProps {
  time: string; // Formatted time string (MM:SS)
  progress: number; // 0-100
  isRunning: boolean;
  isCompleted: boolean;
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  progress,
  isRunning,
  isCompleted,
  className = '',
}) => {
  return (
    <div className={`text-center ${className}`}>
      {/* Main Timer Display */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative inline-block">
          {/* Timer Background */}
          <div className="relative bg-surface rounded-2xl p-8 shadow-lg border border-border">
            {/* Progress Ring */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-coffee-500 to-coffee-600 opacity-20"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((progress * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((progress * 3.6 - 90) * Math.PI / 180)}%)`,
                }}
                animate={{
                  opacity: isRunning ? [0.2, 0.4, 0.2] : 0.2,
                }}
                transition={{
                  duration: 2,
                  repeat: isRunning ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            </div>
            
            {/* Time Display */}
            <motion.div
              className="relative z-10"
              animate={isRunning ? {
                scale: [1, 1.02, 1],
              } : {}}
              transition={{
                duration: 1,
                repeat: isRunning ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <div className="text-6xl md:text-7xl font-mono font-bold text-foreground mb-2">
                {time}
              </div>
              
              {/* Status Text */}
              <motion.div
                className="text-lg font-medium"
                animate={{
                  color: isCompleted ? '#22c55e' : isRunning ? '#f59e0b' : '#6b7280',
                }}
              >
                {isCompleted ? 'Tamamlandı!' : isRunning ? 'Çalışıyor...' : 'Hazır'}
              </motion.div>
            </motion.div>
          </div>
          
          {/* Pulse Effect */}
          {isRunning && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-coffee-500"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </motion.div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">İlerleme</span>
          <span className="text-sm font-mono text-foreground">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-coffee-500 to-coffee-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={isRunning ? {
                x: ['-100%', '100%'],
              } : {}}
              transition={{
                duration: 2,
                repeat: isRunning ? Infinity : 0,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;

