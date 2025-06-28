import { Moon, Sun, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ title, showBack, onBack, isDark, onToggleTheme }: HeaderProps) {
  const handleBackClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (onBack) {
      console.log('Back button clicado');
      onBack();
    }
  };

  const handleThemeClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    console.log('Theme toggle clicado');
    onToggleTheme();
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 md:px-8">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBackClick}
              onTouchEnd={handleBackClick}
              className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <ArrowLeft size={20} strokeWidth={1.5} />
            </button>
          )}
          <h1 className="text-lg font-medium truncate">{title}</h1>
        </div>
        
        <button
          onClick={handleThemeClick}
          onTouchEnd={handleThemeClick}
          className="p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
          type="button"
        >
          {isDark ? (
            <Sun size={20} strokeWidth={1.5} />
          ) : (
            <Moon size={20} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </header>
  );
}