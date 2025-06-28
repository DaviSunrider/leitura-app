import { Book } from './BookCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Share2, Calendar, BookOpen, Star, Target, TrendingUp } from 'lucide-react';

interface ProfileScreenProps {
  books: Book[];
  onShare: () => void;
}

export function ProfileScreen({ books, onShare }: ProfileScreenProps) {
  const stats = {
    total: books.length,
    read: books.filter(b => b.status === 'read').length,
    reading: books.filter(b => b.status === 'reading').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    favorites: books.filter(b => b.isFavorite).length,
    totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
    averageRating: books.filter(b => b.rating > 0).reduce((sum, book) => sum + book.rating, 0) / books.filter(b => b.rating > 0).length || 0,
  };

  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(book => book.year === currentYear);
  
  const topGenres = books
    .filter(book => book.genre)
    .reduce((acc, book) => {
      const genre = book.genre!;
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedGenres = Object.entries(topGenres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const readingGoal = 24; // Meta de leitura anual
  const readingProgress = (stats.read / readingGoal) * 100;

  return (
    <div className="pb-20">
      <div className="px-4 py-6 md:px-8 max-w-4xl mx-auto">
        {/* Perfil do usuário */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>LC</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-medium">Leitor Conectado</h2>
                <p className="text-muted-foreground mb-2">Membro desde Janeiro 2024</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="outline" className="text-xs">
                    📚 Bibliófilo
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⭐ Avaliador
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    📝 Resenhista
                  </Badge>
                </div>
              </div>
              
              <Button onClick={onShare} variant="outline">
                <Share2 size={16} className="mr-2" />
                Compartilhar perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-accent">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total de livros</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">{stats.read}</div>
                <div className="text-sm text-muted-foreground">Livros lidos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">{stats.reading}</div>
                <div className="text-sm text-muted-foreground">Lendo agora</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-red-600">{stats.favorites}</div>
                <div className="text-sm text-muted-foreground">Favoritos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta de leitura */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Meta de Leitura {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Progresso: {stats.read} de {readingGoal} livros</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(readingProgress)}%
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(readingProgress, 100)}%` }}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                {readingGoal - stats.read > 0 
                  ? `Faltam ${readingGoal - stats.read} livros para atingir sua meta`
                  : '🎉 Parabéns! Você atingiu sua meta de leitura!'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Estatísticas de Leitura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total de páginas lidas:</span>
                <span className="font-medium">{stats.totalPages.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Avaliação média:</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-accent text-accent" />
                  <span className="font-medium">
                    {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Livros com resenha:</span>
                <span className="font-medium">
                  {books.filter(b => b.review).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Livros com anotações:</span>
                <span className="font-medium">
                  {books.filter(b => b.notes).length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={20} />
                Gêneros Favoritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedGenres.length > 0 ? (
                <div className="space-y-3">
                  {sortedGenres.map(([genre, count], index) => (
                    <div key={genre} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs text-accent-foreground">
                          {index + 1}
                        </div>
                        <span>{genre}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Adicione gêneros aos seus livros para ver suas preferências
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Atividade recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Adicionou "O Alquimista" à estante</span>
                <span className="text-muted-foreground ml-auto">2 dias atrás</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Começou a ler "1984"</span>
                <span className="text-muted-foreground ml-auto">1 semana atrás</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Avaliou "Dom Casmurro" com 5 estrelas</span>
                <span className="text-muted-foreground ml-auto">2 semanas atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}