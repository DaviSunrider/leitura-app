import { Heart, Star, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRef, useState, useCallback } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  isFavorite: boolean;
  status: 'reading' | 'read' | 'want-to-read';
  pages?: number;
  year?: number;
  genre?: string;
  review?: string;
  notes?: string;
}

interface BookCardProps {
  book: Book;
  onToggleFavorite: (id: string) => void;
  onShare: (book: Book) => void;
  onBookClick: (book: Book) => void;
  showActions?: boolean;
}

export function BookCard({ book, onToggleFavorite, onShare, onBookClick, showActions = true }: BookCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const touchStartTime = useRef<number>(0);
  const touchMoved = useRef<boolean>(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'want-to-read': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reading': return 'Lendo';
      case 'read': return 'Lido';
      case 'want-to-read': return 'Quero ler';
      default: return status;
    }
  };

  // Handlers otimizados para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartTime.current = Date.now();
    touchMoved.current = false;
    setIsPressed(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchMoved.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsPressed(false);
    
    const touchDuration = Date.now() - touchStartTime.current;
    
    // Validar se foi um tap válido (não scroll e duração adequada)
    if (!touchMoved.current && touchDuration < 500) {
      console.log('📖 Livro selecionado (touch):', book.title);
      // Pequeno delay para melhor feedback visual
      setTimeout(() => {
        onBookClick(book);
      }, 50);
    }
  }, [book, onBookClick]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log('📖 Livro selecionado (click):', book.title);
    onBookClick(book);
  }, [book, onBookClick]);

  // Handlers para botões de ação
  const handleFavoriteClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('❤️ Favorito toggled:', book.title);
    onToggleFavorite(book.id);
  }, [book.id, book.title, onToggleFavorite]);

  const handleShareClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📤 Share:', book.title);
    onShare(book);
  }, [book, onShare]);

  return (
    <Card className={`book-card group cursor-pointer hover:shadow-lg transition-all duration-200 ${
      isPressed ? 'scale-95 shadow-sm' : 'scale-100'
    }`}>
      <CardContent className="p-3">
        <div className="relative mb-3">
          {/* Capa do livro - área clicável principal */}
          <div 
            className="aspect-[3/4] bg-muted rounded-md overflow-hidden relative"
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ImageWithFallback
              src={book.cover}
              alt={`Capa do livro ${book.title}`}
              className="w-full h-full object-cover"
            />
            
            {/* Badge de status */}
            <div className="absolute bottom-2 left-2">
              <Badge 
                className={`text-xs ${getStatusColor(book.status)}`}
              >
                {getStatusText(book.status)}
              </Badge>
            </div>
          </div>
          
          {/* Botões de ação */}
          {showActions && (
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                className="h-8 w-8 p-0 bg-white/90 dark:bg-black/90 rounded-md flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-black transition-colors"
                onClick={handleFavoriteClick}
                onTouchEnd={handleFavoriteClick}
                type="button"
                aria-label={book.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart 
                  size={16} 
                  className={book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} 
                />
              </button>
              <button
                className="h-8 w-8 p-0 bg-white/90 dark:bg-black/90 rounded-md flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-black transition-colors"
                onClick={handleShareClick}
                onTouchEnd={handleShareClick}
                type="button"
                aria-label="Compartilhar livro"
              >
                <Share2 size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
        
        {/* Informações do livro - também clicável */}
        <div 
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="cursor-pointer"
        >
          <h3 title={book.title} className="font-medium text-sm line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
          
          {book.rating && book.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-accent text-accent" />
              <span className="text-xs">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}