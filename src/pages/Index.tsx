import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { GamesPage } from '@/components/GamesPage';
import { SettingsPage } from '@/components/SettingsPage';
import { GamePlayer } from '@/components/GamePlayer';
import { useToast } from '@/hooks/use-toast';

// Import game images for player
import gameRacing from '@/assets/game-racing.jpg';
import gamePuzzle from '@/assets/game-puzzle.jpg';
import gamePlatformer from '@/assets/game-platformer.jpg';
import gameAdventure from '@/assets/game-adventure.jpg';
import gameShooter from '@/assets/game-shooter.jpg';
import gameSports from '@/assets/game-sports.jpg';
import gameStrategy from '@/assets/game-strategy.jpg';
import gameFighting from '@/assets/game-fighting.jpg';

// Game data for player component
const gameData: { [key: string]: any } = {
  '1': { title: 'Neon Racer', image: gameRacing, category: 'Racing', rating: 4.8, plays: 125000 },
  '2': { title: 'Puzzle Master', image: gamePuzzle, category: 'Puzzle', rating: 4.6, plays: 89000 },
  '3': { title: 'Retro Jump', image: gamePlatformer, category: 'Platformer', rating: 4.9, plays: 156000 },
  '4': { title: 'Mystic Quest', image: gameAdventure, category: 'Adventure', rating: 4.7, plays: 98000 },
  '5': { title: 'Space Blaster', image: gameShooter, category: 'Action', rating: 4.5, plays: 203000 },
  '6': { title: 'Soccer Pro', image: gameSports, category: 'Sports', rating: 4.6, plays: 167000 },
  '7': { title: 'Tower Defense', image: gameStrategy, category: 'Strategy', rating: 4.8, plays: 134000 },
  '8': { title: 'Fighter Arena', image: gameFighting, category: 'Fighting', rating: 4.7, plays: 178000 },
  '9': { title: 'Cyber Runner', image: gameRacing, category: 'Racing', rating: 4.4, plays: 112000 },
  '10': { title: 'Mind Bender', image: gamePuzzle, category: 'Puzzle', rating: 4.9, plays: 145000 },
  '11': { title: 'Sky Adventure', image: gameAdventure, category: 'Adventure', rating: 4.6, plays: 189000 },
  '12': { title: 'Pixel Warrior', image: gamePlatformer, category: 'Platformer', rating: 4.8, plays: 223000 },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
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
    setCurrentGame(gameId);
    toast({
      title: "Game Loading...",
      description: "Your game will start in a moment!",
    });
  };

  const handleBackToGames = () => {
    setCurrentGame(null);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setActiveTab('games');
      // Additional search logic could be implemented here
    }
  };

  const renderCurrentPage = () => {
    // Show game player if a game is selected
    if (currentGame && gameData[currentGame]) {
      const game = gameData[currentGame];
      return (
        <GamePlayer
          gameId={currentGame}
          gameTitle={game.title}
          gameImage={game.image}
          category={game.category}
          rating={game.rating}
          plays={game.plays}
          onBack={handleBackToGames}
          isFavorite={favorites.includes(currentGame)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      );
    }

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
    <ThemeProvider defaultTheme="system" storageKey="unblocked-games-theme">
      <div className="min-h-screen bg-background font-inter">
        {/* Only show header and navigation when not in game player */}
        {!currentGame && (
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
        )}
        
        <main className={currentGame ? "" : "container mx-auto px-4 pt-8"}>
          {renderCurrentPage()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
