import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import SearchResultsPage from "./pages/SearchResultsPage"; // Import SearchResultsPage
import NotFound from "./pages/NotFound"; // Import NotFound
import { GamePlayer } from "@/components/GamePlayer"; // Import GamePlayer
import { allGames } from "@/components/GamesPage"; // Import allGames data

// Initialize QueryClient outside of the component to avoid re-creation on re-renders
const queryClient = new QueryClient();

// This component will contain the logic that uses React Router hooks
const AppContent = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('game-id');
  const navigate = useNavigate();

  // Find the selected game using useMemo for performance if allGames is large
  // For simplicity, directly find it here for now.
  const selectedGame = allGames.find(game => game.id === gameId);

  const handleBackToGames = () => {
    navigate('/');
  };

  // If a game-id is present in the URL and the game is found, display GamePlayer
  if (gameId && selectedGame) {
    return (
      <GamePlayer
        gameId={selectedGame.id}
        gameTitle={selectedGame.title}
        gameImage={selectedGame.image}
        category={selectedGame.category}
        rating={selectedGame.rating}
        plays={selectedGame.plays}
        gamePath={selectedGame.gamePath}
        isFavorite={false} // You'll need to implement actual favorite logic here
        onBack={handleBackToGames}
      />
    );
  }

  // Otherwise, render the main application routes
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<SearchResultsPage />} />
      {/* You can add a route for game playback without a direct gameId in the path if needed */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="unblocked-games-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent /> {/* Render the AppContent component */}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;