import { Brain, Home } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onHome?: () => void;
}

const Header = ({ onHome }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onHome}
        >
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Cognify AI</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Adaptive reading for every mind</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onHome && (
            <Button variant="ghost" size="sm" onClick={onHome}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;