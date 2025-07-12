import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { GamesPage } from '@/components/GamesPage';
import { SettingsPage } from '@/components/SettingsPage';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('unblocked-games-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('unblocked-games-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const handleFavoriteToggle = (gameId: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(gameId);
      const newFavorites = isFavorite 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite ? "Game removed from your favorites list" : "Game added to your favorites list",
      });
      
      return newFavorites;
    });
  };

  const handleGamePlay = (gameId: string) => {
    toast({
      title: "Game Loading...",
      description: "Your game will start in a moment!",
    });
    
    // Here you would implement the actual game loading logic
    console.log('Playing game:', gameId);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setActiveTab('games');
      // Additional search logic could be implemented here
    }
  };

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onGamePlay={handleGamePlay}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        );
      case 'games':
      case 'search':
      case 'trending':
        return (
          <GamesPage
            onGamePlay={handleGamePlay}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        );
      case 'favorites':
        return (
          <GamesPage
            onGamePlay={handleGamePlay}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <HomePage 
            onGamePlay={handleGamePlay}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="unblocked-games-theme">
      <div className="min-h-screen bg-background font-inter">
        <Header 
          onSearch={handleSearch}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          isMenuOpen={isMenuOpen}
        />
        
        <Navigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isMenuOpen}
        />
        
        <main className="container mx-auto px-4 pt-8">
          {renderCurrentPage()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
