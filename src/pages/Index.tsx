import { useState, useEffect, Fragment } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { GamesPage } from '@/components/GamesPage';
import { SettingsPage } from '@/components/SettingsPage';
import { GamePlayer } from '@/components/GamePlayer';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Import game images for player
import gameRacing from '@/assets/game-racing.jpg';
import gamePuzzle from '@/assets/game-puzzle.jpg';
import gamePlatformer from '@/assets/game-platformer.jpg';
import gameAdventure from '@/assets/game-adventure.jpg';
import gameShooter from '@/assets/game-shooter.jpg';
import gameSports from '@/assets/game-sports.jpg';
import gameStrategy from '@/assets/game-strategy.jpg';
import gameFighting from '@/assets/game-fighting.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Declare isMenuOpen state
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, ] = useSearchParams();
  const gameIdFromUrl = searchParams.get('game-id');
  const { theme } = useTheme(); // Access theme from context

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
    setActiveTab(tab); // Keep setActiveTab
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
    navigate({ pathname: '/', search: `?game-id=${gameId}` });
     toast({ // Keep the toast notification
  });
};
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setActiveTab('games');
      // Additional search logic could be implemented here
    }
  };

  const renderCurrentPage = () => {
    // Show regular pages
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

      <div className="min-h-screen bg-background font-inter">
        {/* Always show header and navigation */}

          <>
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
          </>

        {/* Main content area */}
        <main className="container mx-auto px-4 pt-8">
          {renderCurrentPage()}
        </main>
      </div>
  );
};

export default Index;
