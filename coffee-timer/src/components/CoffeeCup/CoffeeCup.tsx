import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

interface CoffeeCupProps {
  level: number; // 0-100, coffee level percentage
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CoffeeCup: React.FC<CoffeeCupProps> = ({
  level,
  isAnimating = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-32',
    lg: 'w-32 h-40',
  };
  
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Coffee Cup SVG */}
      <motion.div
        className="relative w-full h-full"
        animate={isAnimating ? {
          scale: [1, 1.02, 1],
          rotate: [0, 1, 0, -1, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: isAnimating ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {/* Cup Container */}
        <div className="relative w-full h-full">
          {/* Cup Background */}
          <div className="absolute inset-0 bg-white rounded-lg border-2 border-coffee-400 shadow-lg">
            {/* Cup Handle */}
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-coffee-400 rounded-r-full border-2 border-coffee-500" />
            
            {/* Coffee Level */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-coffee-600 to-coffee-800 rounded-b-md border border-coffee-700"
              style={{
                height: `${Math.max(level, 5)}%`, // Minimum 5% to show some coffee
              }}
              animate={{
                height: `${Math.max(level, 5)}%`,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              {/* Coffee Surface Animation */}
              {level > 0 && (
                <motion.div
                  className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-coffee-400 to-coffee-600 rounded-t-md border-t border-coffee-500"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
            
            {/* Steam Animation */}
            {level > 0 && (
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: level > 50 ? 1 : 0.5 }}
              >
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-6 bg-coffee-300 rounded-full"
                      animate={{
                        scaleY: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Cup Saucer */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-3 bg-coffee-200 rounded-full border border-coffee-300 shadow-md" />
          </div>
          
          {/* Coffee Icon Overlay (when empty) */}
          {level <= 5 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Coffee
                size={iconSizes[size]}
                className="text-coffee-400 opacity-50"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Progress Ring (Optional) */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-coffee-500 opacity-30"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default CoffeeCup;

