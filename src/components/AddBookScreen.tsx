import { useState } from 'react';
import { Book } from './BookCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Search, Plus, Scan } from 'lucide-react';

interface AddBookScreenProps {
  onAddBook: (book: Omit<Book, 'id'>) => void;
}

export function AddBookScreen({ onAddBook }: AddBookScreenProps) {
  const [searchMode, setSearchMode] = useState<'manual' | 'isbn' | 'search'>('manual');
  const [isbnCode, setIsbnCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Formulário manual
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [pages, setPages] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<'reading' | 'read' | 'want-to-read'>('want-to-read');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBook: Omit<Book, 'id'> = {
      title,
      author,
      cover: cover || `https://picsum.photos/300/400?random=${Date.now()}`,
      rating: 0,
      isFavorite: false,
      status,
      pages: pages ? parseInt(pages) : undefined,
      year: year ? parseInt(year) : undefined,
      genre: genre || undefined,
    };
    
    onAddBook(newBook);
    
    // Reset form
    setTitle('');
    setAuthor('');
    setCover('');
    setPages('');
    setYear('');
    setGenre('');
    setStatus('want-to-read');
  };

  const handleIsbnSearch = () => {
    // Simular busca por ISBN
    if (isbnCode.trim()) {
      // Dados simulados baseados no ISBN
      setTitle('Livro encontrado via ISBN');
      setAuthor('Autor do livro');
      setCover(`https://picsum.photos/300/400?random=${isbnCode}`);
      setPages('320');
      setYear('2023');
      setGenre('Ficção');
      setSearchMode('manual');
    }
  };

  const mockSearchResults = [
    {
      title: 'O Alquimista',
      author: 'Paulo Coelho',
      cover: 'https://picsum.photos/300/400?random=1',
      year: 1988,
      genre: 'Ficção'
    },
    {
      title: '1984',
      author: 'George Orwell',
      cover: 'https://picsum.photos/300/400?random=2',
      year: 1949,
      genre: 'Ficção Científica'
    },
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      cover: 'https://picsum.photos/300/400?random=3',
      year: 1899,
      genre: 'Literatura Brasileira'
    }
  ];

  const handleSelectSearchResult = (result: any) => {
    setTitle(result.title);
    setAuthor(result.author);
    setCover(result.cover);
    setYear(result.year.toString());
    setGenre(result.genre);
    setSearchMode('manual');
  };

  return (
    <div className="pb-20">
      <div className="px-4 py-6 md:px-8 max-w-2xl mx-auto">
        {/* Modo de busca */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button
              variant={searchMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setSearchMode('manual')}
              className="text-sm"
            >
              <Plus size={16} className="mr-2" />
              Manual
            </Button>
            <Button
              variant={searchMode === 'isbn' ? 'default' : 'outline'}
              onClick={() => setSearchMode('isbn')}
              className="text-sm"
            >
              <Scan size={16} className="mr-2" />
              ISBN
            </Button>
            <Button
              variant={searchMode === 'search' ? 'default' : 'outline'}
              onClick={() => setSearchMode('search')}
              className="text-sm"
            >
              <Search size={16} className="mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Busca por ISBN */}
        {searchMode === 'isbn' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Buscar por ISBN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="isbn">Código ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="Digite ou escaneie o código ISBN"
                  value={isbnCode}
                  onChange={(e) => setIsbnCode(e.target.value)}
                />
              </div>
              <Button onClick={handleIsbnSearch} className="w-full">
                Buscar livro
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Busca online */}
        {searchMode === 'search' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Buscar online</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Título ou autor</Label>
                <Input
                  id="search"
                  placeholder="Digite o título ou autor do livro"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm && (
                <div className="space-y-2">
                  <h4 className="font-medium">Resultados encontrados:</h4>
                  {mockSearchResults
                    .filter(book => 
                      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      book.author.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted"
                        onClick={() => handleSelectSearchResult(result)}
                      >
                        <div className="w-12 h-16 bg-muted rounded overflow-hidden">
                          <img
                            src={result.cover}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{result.title}</h5>
                          <p className="text-sm text-muted-foreground">{result.author}</p>
                          <p className="text-xs text-muted-foreground">{result.genre} • {result.year}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulário manual */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar livro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Título do livro"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    placeholder="Nome do autor"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cover">URL da capa (opcional)</Label>
                <Input
                  id="cover"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pages">Páginas</Label>
                  <Input
                    id="pages"
                    type="number"
                    placeholder="320"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2023"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="genre">Gênero</Label>
                  <Input
                    id="genre"
                    placeholder="Ficção"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want-to-read">Quero ler</SelectItem>
                    <SelectItem value="reading">Lendo</SelectItem>
                    <SelectItem value="read">Lido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Adicionar à estante
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}