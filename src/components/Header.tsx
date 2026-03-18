import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Cognify AI</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Adaptive reading for every mind</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
