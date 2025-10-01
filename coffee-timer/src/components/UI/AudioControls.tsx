import React from 'react';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import Button from './Button';

interface AudioControlsProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  className = '',
  showLabel = true,
  compact = false,
}) => {
  const {
    isSupported,
    isEnabled,
    volume,
    isPlaying,
    toggleAudio,
    setVolume,
    sounds,
  } = useAudio();

  // Don't render if audio is not supported
  if (!isSupported) {
    return null;
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (!isEnabled) return <VolumeX className="w-4 h-4" />;
    if (volume === 0) return <Volume className="w-4 h-4" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  const getVolumeLevel = () => {
    if (volume === 0) return 'Sessiz';
    if (volume < 0.3) return 'Düşük';
    if (volume < 0.7) return 'Orta';
    return 'Yüksek';
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAudio}
          className="p-2"
        >
          {getVolumeIcon()}
        </Button>
        
        {isEnabled && (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B4513 0%, #8B4513 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Ses Kontrolleri
          </label>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudio}
              className="flex items-center space-x-1"
            >
              {getVolumeIcon()}
              <span className="text-xs text-muted-foreground">
                {isEnabled ? 'Açık' : 'Kapalı'}
              </span>
            </Button>
          </div>
        </div>
      )}

      {isEnabled && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ses Seviyesi</span>
            <span className="text-xs text-muted-foreground">
              {getVolumeLevel()} ({Math.round(volume * 100)}%)
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B4513 0%, #8B4513 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Test Sound Button */}
      {isEnabled && (
        <div className="pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sounds.playSmartSound('click')}
            disabled={isPlaying}
            className="w-full"
          >
            {isPlaying ? 'Çalıyor...' : 'Ses Testi'}
          </Button>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Durum:</span>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isEnabled ? 'Aktif' : 'Devre Dışı'}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
