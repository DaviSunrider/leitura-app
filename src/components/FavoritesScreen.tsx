import { Search, Heart } from 'lucide-react';
import { BookCard, Book } from './BookCard';
import { Input } from './ui/input';

interface FavoritesScreenProps {
  books: Book[];
  onToggleFavorite: (id: string) => void;
  onShare: (book: Book) => void;
  onBookClick: (book: Book) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function FavoritesScreen({ 
  books, 
  onToggleFavorite, 
  onShare, 
  onBookClick,
  searchQuery = '',
  onSearchChange = () => {}
}: FavoritesScreenProps) {
  
  return (
    <div className="p-4 pb-8">
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-accent" size={24} />
          <div>
            <h1 className="text-xl">Favoritos</h1>
            <p className="text-muted-foreground text-sm">
              Seus livros marcados como favoritos
            </p>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar nos favoritos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3"
          />
        </div>
      </div>

      {/* Contador */}
      <div className="mb-4">
        <p className="text-muted-foreground text-sm">
          {books.length === 0 
            ? 'Nenhum favorito encontrado'
            : `${books.length} ${books.length === 1 ? 'favorito' : 'favoritos'}`
          }
        </p>
      </div>

      {/* Grade de livros */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">💛</div>
          <h3 className="text-lg mb-2">
            {searchQuery ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Tente uma busca diferente'
              : 'Marque alguns livros como favoritos tocando no coração'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onToggleFavorite={onToggleFavorite}
              onShare={onShare}
              onBookClick={onBookClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}