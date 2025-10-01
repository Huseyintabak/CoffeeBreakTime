import React, { useState, useEffect } from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import Button from '../UI/Button';
import { getDefaultDurations } from '@/utils/timeUtils';
import { validateTimerInput } from '@/utils/errorHandling';

interface TimeInputProps {
  duration: number; // in seconds
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
  className?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  duration,
  onDurationChange,
  disabled = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const defaultDurations = getDefaultDurations();
  
  // Update input value when duration changes externally
  useEffect(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    setInputValue(seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes}`);
  }, [duration]);
  
  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);
    
    if (value === '') return;
    
    const validation = validateTimerInput(value);
    if (validation.isValid && validation.duration) {
      onDurationChange(validation.duration);
    } else {
      setError('Geçersiz süre formatı');
    }
  };
  
  // Handle preset duration selection
  const handlePresetSelect = (presetDuration: number) => {
    setInputValue('');
    setError(null);
    onDurationChange(presetDuration);
  };
  
  // Handle quick adjustments
  const handleAdjustDuration = (delta: number) => {
    const newDuration = Math.max(60, duration + delta); // Minimum 1 minute
    onDurationChange(newDuration);
  };
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${minutes}dk`;
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Manual Input */}
      <div className="space-y-2">
        <label htmlFor="duration-input" className="block text-sm font-medium text-foreground">
          Süre Girin
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="duration-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="25 veya 25:00"
            disabled={disabled}
            className={`input pl-10 ${error ? 'border-error' : ''}`}
          />
        </div>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
      
      {/* Quick Adjustments */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAdjustDuration(-60)}
          disabled={disabled || duration <= 60}
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <span className="text-sm font-mono text-foreground min-w-[60px] text-center">
          {formatDuration(duration)}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAdjustDuration(60)}
          disabled={disabled}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Preset Durations */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Hızlı Seçim
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {defaultDurations.map((presetDuration) => (
            <Button
              key={presetDuration}
              variant={duration === presetDuration ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePresetSelect(presetDuration)}
              disabled={disabled}
              className="text-xs"
            >
              {formatDuration(presetDuration)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeInput;

