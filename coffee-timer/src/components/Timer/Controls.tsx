import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import Button from '../UI/Button';

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  canStart: boolean;
  canPause: boolean;
  canReset: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettings?: () => void;
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isPaused,
  canStart,
  canPause,
  canReset,
  onStart,
  onPause,
  onReset,
  onSettings,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Main Control Buttons */}
      <div className="flex items-center space-x-4">
        {/* Start/Pause Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={isRunning ? onPause : onStart}
          disabled={!canStart && !canPause}
          className="min-w-[120px]"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Duraklat
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {isPaused ? 'Devam Et' : 'Başlat'}
            </>
          )}
        </Button>
        
        {/* Reset Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={!canReset}
          className="min-w-[100px]"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Sıfırla
        </Button>
      </div>
      
      {/* Secondary Controls */}
      {onSettings && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4 mr-1" />
            Ayarlar
          </Button>
        </div>
      )}
      
      {/* Status Indicators */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        {isRunning && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Aktif</span>
          </div>
        )}
        
        {isPaused && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>Duraklatıldı</span>
          </div>
        )}
        
        {!isRunning && !isPaused && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Hazır</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;

