import { Search, Filter, SortAsc } from 'lucide-react';
import { BookCard, Book } from './BookCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { useState } from 'react';

interface BookshelfScreenProps {
  books: Book[];
  onToggleFavorite: (id: string) => void;
  onShare: (book: Book) => void;
  onBookClick: (book: Book) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedGenre?: string;
  onGenreChange?: (genre: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  allBooks?: Book[];
}

export function BookshelfScreen({ 
  books, 
  onToggleFavorite, 
  onShare, 
  onBookClick,
  searchQuery = '',
  onSearchChange = () => {},
  selectedGenre = '',
  onGenreChange = () => {},
  selectedStatus = '',
  onStatusChange = () => {},
  sortBy = 'title',
  onSortChange = () => {},
  allBooks = []
}: BookshelfScreenProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Calcular estatísticas
  const totalBooks = allBooks.length;
  const readBooks = allBooks.filter(book => book.status === 'read').length;
  const readingBooks = allBooks.filter(book => book.status === 'reading').length;
  const wantToReadBooks = allBooks.filter(book => book.status === 'want-to-read').length;

  // Status indicators com clique
  const statusIndicators = [
    { 
      id: 'all-status', 
      label: 'Total', 
      count: totalBooks, 
      color: 'text-foreground',
      bgColor: 'bg-card' 
    },
    { 
      id: 'reading', 
      label: 'Lendo', 
      count: readingBooks, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20' 
    },
    { 
      id: 'read', 
      label: 'Lidos', 
      count: readBooks, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20' 
    },
    { 
      id: 'want-to-read', 
      label: 'Quero Ler', 
      count: wantToReadBooks, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20' 
    }
  ];

  // Obter gêneros únicos
  const uniqueGenres = Array.from(new Set(allBooks.map(book => book.genre).filter(Boolean))).sort();
  
  // Opções de ordenação
  const sortOptions = [
    { value: 'title', label: 'Título' },
    { value: 'author', label: 'Autor' },
    { value: 'rating', label: 'Avaliação' },
    { value: 'year', label: 'Ano' }
  ];

  const handleStatusIndicatorClick = (statusId: string) => {
    console.log('📊 Status selecionado:', statusId);
    onStatusChange(statusId);
    // Limpar busca quando trocar de status
    if (searchQuery) {
      onSearchChange('');
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onGenreChange('all-genres');
    onStatusChange('all-status');
    onSortChange('title');
  };

  const hasActiveFilters = searchQuery || 
    (selectedGenre && selectedGenre !== 'all-genres') || 
    sortBy !== 'title';

  const getStatusLabel = (statusId: string) => {
    const indicator = statusIndicators.find(ind => ind.id === statusId);
    return indicator ? indicator.label : statusId;
  };

  const getSortLabel = (sort: string) => {
    const option = sortOptions.find(opt => opt.value === sort);
    return option ? option.label : sort;
  };

  return (
    <div className="p-4 pb-8 scroll-container">
      {/* Indicadores de Status no Topo */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {statusIndicators.map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => handleStatusIndicatorClick(indicator.id)}
              className={`status-indicator text-center py-3 rounded-lg transition-all ${
                (selectedStatus === indicator.id || (!selectedStatus && indicator.id === 'all-status'))
                  ? 'active'
                  : 'bg-card hover:bg-muted'
              }`}
            >
              <div className={`text-2xl mb-1 ${indicator.color}`}>
                {indicator.count}
              </div>
              <div className="text-sm">{indicator.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar livros, autores ou gêneros..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-3"
          />
        </div>
      </div>

      {/* Filtros Adicionais */}
      <div className="flex gap-2 mb-4">
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Filter size={16} className="mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs">
                  {[
                    searchQuery, 
                    selectedGenre && selectedGenre !== 'all-genres' ? selectedGenre : null
                  ].filter(Boolean).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent 
            data-sheet-content="true"
            className="w-full max-w-sm mx-auto"
            side="bottom"
          >
            <SheetHeader>
              <SheetTitle>Filtros e Ordenação</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Gênero */}
              <div>
                <label className="text-sm font-medium mb-2 block">Gênero</label>
                <Select value={selectedGenre || 'all-genres'} onValueChange={onGenreChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os gêneros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-genres">Todos os gêneros</SelectItem>
                    {uniqueGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Limpar filtros */}
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Button variant="outline" size="sm" className="px-3">
          <SortAsc size={16} />
        </Button>
      </div>

      {/* Tags de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <div className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Search size={12} />
              "{searchQuery}"
              <button 
                onClick={() => onSearchChange('')}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                ×
              </button>
            </div>
          )}
          {selectedGenre && selectedGenre !== 'all-genres' && (
            <div className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {selectedGenre}
              <button 
                onClick={() => onGenreChange('all-genres')}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                ×
              </button>
            </div>
          )}
          {sortBy !== 'title' && (
            <div className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <SortAsc size={12} />
              {getSortLabel(sortBy)}
            </div>
          )}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="mb-4">
        <p className="text-muted-foreground text-sm">
          {selectedStatus && selectedStatus !== 'all-status' ? (
            `${books.length} ${books.length === 1 ? 'livro' : 'livros'} • ${getStatusLabel(selectedStatus)}`
          ) : books.length === allBooks.length ? (
            `${books.length} ${books.length === 1 ? 'livro' : 'livros'} na estante`
          ) : (
            `${books.length} de ${allBooks.length} ${books.length === 1 ? 'livro encontrado' : 'livros encontrados'}`
          )}
        </p>
      </div>

      {/* Grade de livros */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg mb-2">
            {hasActiveFilters || (selectedStatus && selectedStatus !== 'all-status') 
              ? 'Nenhum livro encontrado' 
              : 'Sua estante está vazia'
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {hasActiveFilters || (selectedStatus && selectedStatus !== 'all-status')
              ? 'Tente ajustar os filtros ou fazer uma nova busca'
              : 'Adicione alguns livros para começar a organizar sua biblioteca pessoal'
            }
          </p>
          {hasActiveFilters || (selectedStatus && selectedStatus !== 'all-status') ? (
            <Button onClick={clearFilters} variant="outline">
              Limpar Filtros
            </Button>
          ) : (
            <Button onClick={() => console.log('Navegar para adicionar livro')}>
              Adicionar Primeiro Livro
            </Button>
          )}
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