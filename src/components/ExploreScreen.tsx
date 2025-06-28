import { useState } from 'react';
import { BookCard, Book } from './BookCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, TrendingUp, Star, BookOpen } from 'lucide-react';

interface ExploreScreenProps {
  userBooks: Book[];
  onToggleFavorite: (id: string) => void;
  onShare: (book: Book) => void;
  onBookClick: (book: Book) => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
}

export function ExploreScreen({ userBooks, onToggleFavorite, onShare, onBookClick, onAddBook }: ExploreScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock de livros recomendados e populares
  const recommendedBooks: Book[] = [
    {
      id: 'rec1',
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      cover: 'https://picsum.photos/300/400?random=10',
      rating: 4.6,
      isFavorite: false,
      status: 'want-to-read',
      pages: 432,
      year: 1967,
      genre: 'Realismo Mágico',
    },
    {
      id: 'rec2',
      title: 'O Nome do Vento',
      author: 'Patrick Rothfuss',
      cover: 'https://picsum.photos/300/400?random=11',
      rating: 4.8,
      isFavorite: false,
      status: 'want-to-read',
      pages: 672,
      year: 2007,
      genre: 'Fantasia',
    },
    {
      id: 'rec3',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      cover: 'https://picsum.photos/300/400?random=12',
      rating: 4.4,
      isFavorite: false,
      status: 'want-to-read',
      pages: 512,
      year: 2011,
      genre: 'História',
    },
  ];

  const trendingBooks: Book[] = [
    {
      id: 'trend1',
      title: 'Projeto Hail Mary',
      author: 'Andy Weir',
      cover: 'https://picsum.photos/300/400?random=13',
      rating: 4.7,
      isFavorite: false,
      status: 'want-to-read',
      pages: 496,
      year: 2021,
      genre: 'Ficção Científica',
    },
    {
      id: 'trend2',
      title: 'Klara e o Sol',
      author: 'Kazuo Ishiguro',
      cover: 'https://picsum.photos/300/400?random=14',
      rating: 4.3,
      isFavorite: false,
      status: 'want-to-read',
      pages: 352,
      year: 2021,
      genre: 'Ficção',
    },
    {
      id: 'trend3',
      title: 'O Sete Maridos de Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      cover: 'https://picsum.photos/300/400?random=15',
      rating: 4.9,
      isFavorite: false,
      status: 'want-to-read',
      pages: 400,
      year: 2017,
      genre: 'Ficção Contemporânea',
    },
  ];

  const searchResults = [...recommendedBooks, ...trendingBooks].filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToShelf = (book: Book) => {
    onAddBook({
      title: book.title,
      author: book.author,
      cover: book.cover,
      rating: 0,
      isFavorite: false,
      status: 'want-to-read',
      pages: book.pages,
      year: book.year,
      genre: book.genre,
    });
  };

  const userGenres = Array.from(new Set(userBooks.filter(b => b.genre).map(b => b.genre!)));
  const readAuthors = Array.from(new Set(userBooks.map(b => b.author)));

  return (
    <div className="pb-20">
      <div className="px-4 py-6 md:px-8">
        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Buscar livros, autores ou gêneros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {searchTerm ? (
          /* Resultados da busca */
          <div>
            <h2 className="text-lg font-medium mb-4">
              Resultados para "{searchTerm}" ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map((book) => (
                  <div key={book.id} className="space-y-2">
                    <BookCard
                      book={book}
                      onToggleFavorite={() => {}}
                      onShare={onShare}
                      onClick={onBookClick}
                      showActions={false}
                    />
                    <Button
                      size="sm"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => handleAddToShelf(book)}
                    >
                      Adicionar à estante
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">😔</div>
                <p className="text-muted-foreground">Nenhum resultado encontrado</p>
              </div>
            )}
          </div>
        ) : (
          /* Conteúdo principal */
          <div className="space-y-8">
            {/* Estatísticas pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Suas Preferências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Gêneros que você lê:</h4>
                    <div className="flex flex-wrap gap-2">
                      {userGenres.length > 0 ? (
                        userGenres.map((genre, index) => (
                          <Badge key={index} variant="outline">{genre}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Adicione mais livros para descobrir suas preferências
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Autores em sua estante:</h4>
                    <div className="flex flex-wrap gap-2">
                      {readAuthors.slice(0, 5).map((author, index) => (
                        <Badge key={index} variant="secondary">{author}</Badge>
                      ))}
                      {readAuthors.length > 5 && (
                        <Badge variant="secondary">+{readAuthors.length - 5}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recomendações baseadas em preferências */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-accent" size={20} />
                <h2 className="text-lg font-medium">Recomendado para você</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Baseado nos seus gêneros favoritos e histórico de leitura
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {recommendedBooks.map((book) => (
                  <div key={book.id} className="space-y-2">
                    <BookCard
                      book={book}
                      onToggleFavorite={() => {}}
                      onShare={onShare}
                      onClick={onBookClick}
                      showActions={false}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddToShelf(book)}
                    >
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendências */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-accent" size={20} />
                <h2 className="text-lg font-medium">Em alta</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Os livros mais adicionados esta semana
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {trendingBooks.map((book) => (
                  <div key={book.id} className="space-y-2">
                    <BookCard
                      book={book}
                      onToggleFavorite={() => {}}
                      onShare={onShare}
                      onClick={onBookClick}
                      showActions={false}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddToShelf(book)}
                    >
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gêneros populares */}
            <Card>
              <CardHeader>
                <CardTitle>Explorar por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    'Ficção', 'Romance', 'Mistério', 'Fantasia', 'Ficção Científica',
                    'Biografia', 'História', 'Autoajuda', 'Thriller', 'Horror',
                    'Literatura Brasileira', 'Clássicos'
                  ].map((genre) => (
                    <Button
                      key={genre}
                      variant="outline"
                      className="h-auto py-3 px-4 justify-start"
                      onClick={() => setSearchTerm(genre)}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}