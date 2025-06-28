import React from "react"

import { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { LoginScreen } from "./components/LoginScreen";
import { BookshelfScreen } from "./components/BookshelfScreen";
import { BookDetailScreen } from "./components/BookDetailScreen";
import { AddBookScreen } from "./components/AddBookScreen";
import { FavoritesScreen } from "./components/FavoritesScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ExploreScreen } from "./components/ExploreScreen";
import { ShareDialog } from "./components/ShareDialog";
import { Book } from "./components/BookCard";

const APP_VERSION = "1.0.12";

// Dados mock iniciais
const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "O Alquimista",
    author: "Paulo Coelho",
    cover: "https://picsum.photos/300/400?random=1",
    rating: 4.5,
    isFavorite: true,
    status: "read",
    pages: 163,
    year: 1988,
    genre: "Ficção",
    review:
      "Uma jornada inspiradora sobre seguir seus sonhos. Paulo Coelho cria uma fábula simples mas profunda sobre um jovem pastor que busca seu tesouro pessoal.",
    notes:
      'Lembrar da frase: "Quando você quer alguma coisa, todo o universo conspira para que você realize o seu desejo."',
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    cover: "https://picsum.photos/300/400?random=2",
    rating: 5.0,
    isFavorite: true,
    status: "reading",
    pages: 328,
    year: 1949,
    genre: "Ficção Científica",
    review:
      "Uma obra-prima distópica que se tornou ainda mais relevante nos dias atuais. Orwell previu com precisão assustadora muitos aspectos da sociedade moderna.",
    notes:
      "Conceitos importantes: Big Brother, duplipensar, novilíngua. Refletir sobre vigilância na era digital.",
  },
  {
    id: "3",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    cover: "https://picsum.photos/300/400?random=3",
    rating: 4.2,
    isFavorite: false,
    status: "read",
    pages: 208,
    year: 1899,
    genre: "Literatura Brasileira",
    review:
      "Clássico da literatura brasileira que levanta questões sobre ciúme, traição e a confiabilidade do narrador. Machado de Assis é genial.",
  },
  {
    id: "4",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://picsum.photos/300/400?random=4",
    rating: 4.8,
    isFavorite: true,
    status: "read",
    pages: 310,
    year: 1937,
    genre: "Fantasia",
    review:
      "Uma aventura encantadora na Terra Média. Tolkien criou um mundo rico e personagens memoráveis.",
  },
  {
    id: "5",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://picsum.photos/300/400?random=5",
    rating: 4.3,
    isFavorite: false,
    status: "want-to-read",
    pages: 512,
    year: 2011,
    genre: "História",
  },
  {
    id: "6",
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    cover: "https://picsum.photos/300/400?random=6",
    rating: 4.7,
    isFavorite: true,
    status: "read",
    pages: 96,
    year: 1943,
    genre: "Ficção",
    review:
      "Uma história tocante sobre amizade, amor e a importância de ver o mundo com os olhos de criança.",
  },
];

// Tipo para histórico de navegação
type NavigationHistory = {
  tab: string;
  book: Book | null;
  timestamp: number;
};

// Funções de localStorage SIMPLES
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    if (typeof window === "undefined") return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Erro ao carregar ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Erro ao salvar ${key}:`, error);
  }
};

export default function App() {
  // Estados principais
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(
    null,
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareBook, setShareBook] = useState<
    Book | undefined
  >();
  const [isProfileShare, setIsProfileShare] = useState(false);

  // Estados de dados
  const [booksState, setBooksState] = useState<Book[]>([]);

  // Estados de busca e filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] =
    useState("all-genres");
  const [selectedStatus, setSelectedStatus] =
    useState("all-status");
  const [sortBy, setSortBy] = useState("title");

  // Histórico de navegação
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistory[]
  >([]);

  // Inicialização SIMPLES - mobile first
  useEffect(() => {
    const initializeApp = () => {
      console.log(
        "📚 Inicializando Skoob v" +
          APP_VERSION +
          " - Mobile First",
      );

      // Configurar idioma
      document.documentElement.lang = "pt-BR";
      document.body.classList.add("notranslate");
      document.body.setAttribute("translate", "no");

      // Detectar mobile simples
      const isMobile = /Mobi|Android/i.test(
        navigator.userAgent,
      );
      console.log("📱 Mobile:", isMobile);

      // Carregar dados simples
      const savedBooks = loadFromStorage(
        "skoob-books",
        INITIAL_BOOKS,
      );
      const savedLogin = loadFromStorage(
        "skoob-logged-in",
        false,
      );
      const savedTheme = loadFromStorage(
        "skoob-dark-mode",
        false,
      );
      const savedActiveTab = loadFromStorage(
        "skoob-active-tab",
        "home",
      );

      // Aplicar dados
      setBooksState(savedBooks);
      setIsLoggedIn(savedLogin);
      setIsDark(savedTheme);
      setActiveTab(savedActiveTab);

      console.log("✅ App inicializado - Mobile Ready");
      setIsLoading(false);
    };

    // Inicializar imediatamente
    initializeApp();
  }, []);

  // Salvar dados SIMPLES
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveToStorage("skoob-books", booksState);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [booksState, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveToStorage("skoob-logged-in", isLoggedIn);
    }
  }, [isLoggedIn, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveToStorage("skoob-dark-mode", isDark);
    }
  }, [isDark, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveToStorage("skoob-active-tab", activeTab);
    }
  }, [activeTab, isLoading]);

  // Theme management
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Controle de navegação
  useEffect(() => {
    if (!isLoading) {
      const historyEntry: NavigationHistory = {
        tab: activeTab,
        book: selectedBook,
        timestamp: Date.now(),
      };

      setNavigationHistory((prev) => [
        ...prev.slice(-9),
        historyEntry,
      ]);
    }
  }, [activeTab, selectedBook, isLoading]);

  // Interceptar botão voltar
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      handleBackNavigation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleBackNavigation();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // Handlers com useCallback
  const handleLogin = useCallback(() => {
    console.log("🔐 Login executado");
    setIsLoggedIn(true);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setBooksState((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? { ...book, isFavorite: !book.isFavorite }
          : book,
      ),
    );
  }, []);

  const handleShare = useCallback((book: Book) => {
    setShareBook(book);
    setIsProfileShare(false);
    setShareDialogOpen(true);
  }, []);

  const handleProfileShare = useCallback(() => {
    setShareBook(undefined);
    setIsProfileShare(true);
    setShareDialogOpen(true);
  }, []);

  const handleBookClick = useCallback((book: Book) => {
    console.log("📖 Abrindo livro:", book.title);
    setSelectedBook(book);
    window.history.pushState(
      { book: book.id },
      "",
      `#book-${book.id}`,
    );
  }, []);

  const handleBackNavigation = useCallback(() => {
    if (selectedBook) {
      setSelectedBook(null);
      window.history.pushState(
        { tab: activeTab },
        "",
        `#${activeTab}`,
      );
      return;
    }

    if (navigationHistory.length > 1) {
      const previousState =
        navigationHistory[navigationHistory.length - 2];
      if (previousState && previousState.tab !== activeTab) {
        setActiveTab(previousState.tab);
        setSelectedBook(previousState.book);
        setNavigationHistory((prev) => prev.slice(0, -1));
        return;
      }
    }

    if (activeTab !== "home") {
      setActiveTab("home");
      setSelectedBook(null);
    }
  }, [selectedBook, activeTab, navigationHistory]);

  const handleBackToList = useCallback(() => {
    handleBackNavigation();
  }, [handleBackNavigation]);

  const handleUpdateBook = useCallback((updatedBook: Book) => {
    setBooksState((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      ),
    );
    setSelectedBook(updatedBook);
  }, []);

  const handleAddBook = useCallback(
    (newBook: Omit<Book, "id">) => {
      const book: Book = {
        ...newBook,
        id: Date.now().toString(),
      };
      setBooksState((prevBooks) => [book, ...prevBooks]);
      if (activeTab === "add") {
        setActiveTab("home");
      }
    },
    [activeTab],
  );

  const handleTabChange = useCallback((tab: string) => {
    console.log("🔄 Mudando para tab:", tab);
    setActiveTab(tab);
    setSelectedBook(null);
    window.history.pushState({ tab }, "", `#${tab}`);
  }, []);

  // Funções de busca e filtro
  const getFilteredBooks = useCallback(() => {
    let filtered = [...booksState];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.genre &&
            book.genre.toLowerCase().includes(query)),
      );
    }

    if (selectedGenre && selectedGenre !== "all-genres") {
      filtered = filtered.filter(
        (book) => book.genre === selectedGenre,
      );
    }

    if (selectedStatus && selectedStatus !== "all-status") {
      filtered = filtered.filter(
        (book) => book.status === selectedStatus,
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "year":
          return (b.year || 0) - (a.year || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    booksState,
    searchQuery,
    selectedGenre,
    selectedStatus,
    sortBy,
  ]);

  const getPageTitle = useCallback(() => {
    if (selectedBook) return selectedBook.title;

    switch (activeTab) {
      case "home":
        return "Minha Estante";
      case "favorites":
        return "Favoritos";
      case "add":
        return "Adicionar Livro";
      case "explore":
        return "Explorar";
      case "profile":
        return "Meu Perfil";
      default:
        return "Minha Estante";
    }
  }, [selectedBook, activeTab]);

  const renderContent = useCallback(() => {
    if (selectedBook) {
      return (
        <BookDetailScreen
          book={selectedBook}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
          onUpdateBook={handleUpdateBook}
        />
      );
    }

    const filteredBooks = getFilteredBooks();

    switch (activeTab) {
      case "home":
        return (
          <BookshelfScreen
            books={filteredBooks}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
            onBookClick={handleBookClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            allBooks={booksState}
          />
        );
      case "favorites":
        return (
          <FavoritesScreen
            books={filteredBooks.filter(
              (book) => book.isFavorite,
            )}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
            onBookClick={handleBookClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case "add":
        return <AddBookScreen onAddBook={handleAddBook} />;
      case "explore":
        return (
          <ExploreScreen
            userBooks={booksState}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
            onBookClick={handleBookClick}
            onAddBook={handleAddBook}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            books={booksState}
            onShare={handleProfileShare}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl mb-2">
                Bem-vindo ao Skoob!
              </h2>
              <p className="text-muted-foreground">
                Use o menu inferior para navegar
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                v{APP_VERSION} - Mobile First
              </p>
            </div>
          </div>
        );
    }
  }, [
    selectedBook,
    activeTab,
    getFilteredBooks,
    booksState,
    searchQuery,
    selectedGenre,
    selectedStatus,
    sortBy,
    handleToggleFavorite,
    handleShare,
    handleBookClick,
    handleUpdateBook,
    handleAddBook,
    handleProfileShare,
  ]);

  // Tela de loading SIMPLES
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center loading-screen">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <h2 className="text-xl mb-2">Skoob</h2>
          <p className="text-muted-foreground">Carregando...</p>
          <div className="mt-4 w-32 h-2 bg-muted rounded-full overflow-hidden mx-auto relative">
            <div className="h-full bg-accent loading-bar absolute top-0 left-0 w-full"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            v{APP_VERSION} - Mobile First
          </p>
        </div>
      </div>
    );
  }

  // Tela de login
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <>
      <div
        className="min-h-screen bg-background"
        data-version={APP_VERSION}
      >
        <Header
          title={getPageTitle()}
          showBack={!!selectedBook}
          onBack={handleBackToList}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        <main>{renderContent()}</main>

        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          book={shareBook}
          isProfile={isProfileShare}
        />
      </div>

      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </>
  );
}
