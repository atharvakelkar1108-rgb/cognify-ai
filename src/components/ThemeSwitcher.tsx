import { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLOR_THEMES = [
  { name: 'Default', primary: '#10b981', bg: '#ffffff', label: '🟢' },
  { name: 'Purple', primary: '#8b5cf6', bg: '#ffffff', label: '🟣' },
  { name: 'Blue', primary: '#3b82f6', bg: '#ffffff', label: '🔵' },
  { name: 'Rose', primary: '#f43f5e', bg: '#ffffff', label: '🔴' },
  { name: 'Orange', primary: '#f97316', bg: '#ffffff', label: '🟠' },
  { name: 'Yellow', primary: '#eab308', bg: '#ffffff', label: '🟡' },
];

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('Default');

  useEffect(() => {
    const saved = localStorage.getItem('cognify-dark');
    const savedTheme = localStorage.getItem('cognify-theme');
    if (saved === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    if (savedTheme) {
      setActiveTheme(savedTheme);
      applyColorTheme(COLOR_THEMES.find(t => t.name === savedTheme)!);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('cognify-dark', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const applyColorTheme = (theme: typeof COLOR_THEMES[0]) => {
    if (!theme) return;
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hex = theme.primary;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    const hsl = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    root.style.setProperty('--primary', hsl);
    root.style.setProperty('--ring', hsl);
  };

  const handleThemeSelect = (theme: typeof COLOR_THEMES[0]) => {
    setActiveTheme(theme.name);
    localStorage.setItem('cognify-theme', theme.name);
    applyColorTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDark}
        className="h-9 w-9"
      >
        {isDark
          ? <Sun className="h-4 w-4 text-yellow-400" />
          : <Moon className="h-4 w-4" />
        }
      </Button>

      {/* Color theme picker */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(prev => !prev)}
          className="h-9 w-9"
        >
          <Palette className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-11 bg-card border border-border rounded-xl shadow-lg p-3 w-48 z-50">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
              Choose Color Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeSelect(theme)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors ${
                    activeTheme === theme.name ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span className="text-xs text-muted-foreground">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;