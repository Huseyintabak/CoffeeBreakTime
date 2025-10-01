import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
}

export const useTheme = () => {
  const [state, setState] = useState<ThemeState>({
    theme: 'system',
    resolvedTheme: 'light',
    systemTheme: 'light',
  });

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme based on current setting
  const resolveTheme = (theme: Theme, systemTheme: 'light' | 'dark'): 'light' | 'dark' => {
    if (theme === 'system') {
      return systemTheme;
    }
    return theme;
  };

  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Set data attribute for CSS
    root.setAttribute('data-theme', theme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#2C1810' : '#FFF8DC');
    }
  };

  // Initialize theme
  useEffect(() => {
    const systemTheme = getSystemTheme();
    const savedTheme = localStorage.getItem('coffee-timer-theme') as Theme || 'system';
    const resolvedTheme = resolveTheme(savedTheme, systemTheme);
    
    setState({
      theme: savedTheme,
      resolvedTheme,
      systemTheme,
    });
    
    applyTheme(resolvedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      const resolvedTheme = resolveTheme(state.theme, newSystemTheme);
      
      setState(prev => ({
        ...prev,
        systemTheme: newSystemTheme,
        resolvedTheme,
      }));
      
      applyTheme(resolvedTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [state.theme]);

  // Set theme
  const setTheme = (theme: Theme) => {
    const systemTheme = getSystemTheme();
    const resolvedTheme = resolveTheme(theme, systemTheme);
    
    setState({
      theme,
      resolvedTheme,
      systemTheme,
    });
    
    applyTheme(resolvedTheme);
    
    // Save to localStorage
    localStorage.setItem('coffee-timer-theme', theme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = state.resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Cycle through themes
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(state.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Get theme display name
  const getThemeDisplayName = (theme: Theme): string => {
    switch (theme) {
      case 'light': return 'Açık';
      case 'dark': return 'Koyu';
      case 'system': return 'Sistem';
      default: return 'Bilinmiyor';
    }
  };

  // Get theme icon
  const getThemeIcon = (theme: Theme): string => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '⚙️';
      default: return '❓';
    }
  };

  // Check if theme is active
  const isThemeActive = (theme: Theme): boolean => {
    return state.theme === theme;
  };

  // Get theme colors
  const getThemeColors = () => {
    if (state.resolvedTheme === 'dark') {
      return {
        background: '#2C1810',
        foreground: '#DEB887',
        surface: '#3C2418',
        primary: '#CD853F',
        secondary: '#DEB887',
        accent: '#F4A460',
        muted: '#1A0F08',
        border: '#5D4037',
      };
    }
    
    return {
      background: '#FFF8DC',
      foreground: '#2C1810',
      surface: '#FFFFFF',
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#CD853F',
      muted: '#F5F5DC',
      border: '#DDBEA9',
    };
  };

  return {
    // State
    theme: state.theme,
    resolvedTheme: state.resolvedTheme,
    systemTheme: state.systemTheme,
    
    // Actions
    setTheme,
    toggleTheme,
    cycleTheme,
    
    // Utilities
    getThemeDisplayName,
    getThemeIcon,
    isThemeActive,
    getThemeColors,
  };
};
