import { useState } from 'react';
import { Book } from './BookCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Star, Heart, Share2, Edit3, Calendar, BookOpen, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BookDetailScreenProps {
  book: Book;
  onToggleFavorite: (id: string) => void;
  onShare: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
}

export function BookDetailScreen({ book, onToggleFavorite, onShare, onUpdateBook }: BookDetailScreenProps) {
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempReview, setTempReview] = useState(book?.review || '');
  const [tempNotes, setTempNotes] = useState(book?.notes || '');
  const [rating, setRating] = useState(book?.rating || 0);

  // Verificação de segurança
  if (!book) {
    console.error('BookDetailScreen: book é null ou undefined');
    return (
      <div className="flex items-center justify-center h-96 pb-20">
        <div className="text-center">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-muted-foreground">Livro não encontrado</p>
        </div>
      </div>
    );
  }

  const handleSaveReview = () => {
    try {
      onUpdateBook({ ...book, review: tempReview });
      setIsEditingReview(false);
    } catch (error) {
      console.error('Erro ao salvar resenha:', error);
    }
  };

  const handleSaveNotes = () => {
    try {
      onUpdateBook({ ...book, notes: tempNotes });
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    try {
      setRating(newRating);
      onUpdateBook({ ...book, rating: newRating });
    } catch (error) {
      console.error('Erro ao alterar rating:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'bg-accent text-accent-foreground';
      case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'want-to-read': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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

  return (
    <div className="pb-20 min-h-screen">
      {/* Capa e informações principais */}
      <div className="px-4 py-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          {/* Capa do livro */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-40 h-60 sm:w-48 sm:h-72 bg-muted rounded-lg overflow-hidden shadow-lg">
              {book.cover ? (
                <ImageWithFallback
                  src={book.cover}
                  alt={book.title || 'Livro'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-4xl">📚</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Informações do livro */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center md:text-left">
                {book.title || 'Título não disponível'}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                <User size={16} />
                <span className="text-sm sm:text-base">{book.author || 'Autor desconhecido'}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                <Badge className={getStatusColor(book.status)}>
                  {getStatusText(book.status)}
                </Badge>
                {book.genre && (
                  <Badge variant="outline">{book.genre}</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {book.pages && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <BookOpen size={16} className="text-muted-foreground" />
                    <span>{book.pages} páginas</span>
                  </div>
                )}
                {book.year && (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{book.year}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Avaliação */}
            <div className="text-center md:text-left">
              <label className="block mb-2 text-sm font-medium">Sua avaliação:</label>
              <div className="flex gap-1 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="p-1 rounded hover:bg-muted transition-colors touch-manipulation"
                    type="button"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? 'fill-accent text-accent' : 'text-muted-foreground'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => onToggleFavorite(book.id)}
                className="flex-1 touch-manipulation"
                type="button"
              >
                <Heart 
                  size={16} 
                  className={`mr-2 ${book.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
                {book.isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onShare(book)}
                className="flex-1 touch-manipulation"
                type="button"
              >
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Review */}
      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Minha Resenha</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingReview(!isEditingReview)}
                  className="touch-manipulation"
                  type="button"
                >
                  <Edit3 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingReview ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escreva sua resenha sobre este livro..."
                    value={tempReview}
                    onChange={(e) => setTempReview(e.target.value)}
                    rows={6}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleSaveReview} 
                      size="sm"
                      className="touch-manipulation"
                      type="button"
                    >
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setTempReview(book.review || '');
                        setIsEditingReview(false);
                      }}
                      size="sm"
                      className="touch-manipulation"
                      type="button"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[60px]">
                  {book.review ? (
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {book.review}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic text-sm sm:text-base">
                      Ainda não há resenha para este livro. Clique no ícone de edição para adicionar uma.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Anotações */}
      <div className="px-4 pb-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Minhas Anotações</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className="touch-manipulation"
                  type="button"
                >
                  <Edit3 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Adicione suas anotações pessoais sobre este livro..."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    rows={4}
                    className="min-h-[100px] resize-none"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleSaveNotes} 
                      size="sm"
                      className="touch-manipulation"
                      type="button"
                    >
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setTempNotes(book.notes || '');
                        setIsEditingNotes(false);
                      }}
                      size="sm"
                      className="touch-manipulation"
                      type="button"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[60px]">
                  {book.notes ? (
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {book.notes}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic text-sm sm:text-base">
                      Ainda não há anotações para este livro. Clique no ícone de edição para adicionar algumas.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}