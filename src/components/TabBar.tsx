import { Home, Heart, Plus, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const [isDark, setIsDark] = useState(false);

  // Detectar dark mode simples
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlHasDark = document.documentElement.classList.contains('dark');
      setIsDark(htmlHasDark);
    };

    checkDarkMode();

    // Observer para mudanças no dark mode
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: 'home', icon: Home, label: 'Estante' },
    { id: 'favorites', icon: Heart, label: 'Favoritos' },
    { id: 'add', icon: Plus, label: 'Adicionar' },
    { id: 'explore', icon: Search, label: 'Explorar' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  const backgroundColor = isDark ? '#272727' : '#EDEDED';
  const borderColor = isDark ? '#4a5568' : '#d1d5db';

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full z-50 block"
      style={{
        backgroundColor,
        borderTop: `1px solid ${borderColor}`,
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        width: '100%',
        zIndex: 9999,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      <div className="flex justify-around items-center px-2 py-2 pb-4 sm:pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isAddButton = tab.id === 'add';
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-colors min-h-[48px] min-w-[48px] ${
                isAddButton
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                  : isActive
                  ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                  : isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
              }`}
              type="button"
              aria-label={tab.label}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}