import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './Button';

interface ThemeToggleProps {
  variant?: 'button' | 'select' | 'compact';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  showLabel = true,
  className = '',
}) => {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    cycleTheme,
    getThemeDisplayName,
    getThemeIcon,
    isThemeActive,
  } = useTheme();

  if (variant === 'button') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showLabel && (
          <label className="text-sm font-medium text-foreground">
            Tema
          </label>
        )}
        
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {(['light', 'dark', 'system'] as const).map((themeOption) => (
            <Button
              key={themeOption}
              variant={isThemeActive(themeOption) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme(themeOption)}
              className="flex-1"
            >
              <span className="mr-1">{getThemeIcon(themeOption)}</span>
              {getThemeDisplayName(themeOption)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'select') {
    return (
      <div className={`space-y-2 ${className}`}>
        {showLabel && (
          <label htmlFor="theme-select" className="text-sm font-medium text-foreground">
            Tema
          </label>
        )}
        
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="input"
        >
          <option value="light">☀️ Açık</option>
          <option value="dark">🌙 Koyu</option>
          <option value="system">⚙️ Sistem</option>
        </select>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`p-2 ${className}`}
        title={`Tema: ${getThemeDisplayName(theme)}`}
      >
        {resolvedTheme === 'light' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>
    );
  }

  // Default: cycle button
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={`flex items-center space-x-1 ${className}`}
      title={`Mevcut tema: ${getThemeDisplayName(theme)}`}
    >
      {resolvedTheme === 'light' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      {showLabel && (
        <span className="text-sm">{getThemeDisplayName(theme)}</span>
      )}
    </Button>
  );
};

export default ThemeToggle;
