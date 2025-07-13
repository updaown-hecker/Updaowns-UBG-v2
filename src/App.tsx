import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import Index from "./pages/Index"; // Assuming GamesPage is rendered by Index
import SearchResultsPage from "./pages/SearchResultsPage";
import NotFound from "./pages/NotFound";
import { GamePlayer, GamePlayerProps } from "@/components/GamePlayer";
import { allGames } from "@/components/GamesPage"; // Import allGames

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppContent = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('game-id');
  const navigate = useNavigate();

  const selectedGame = allGames.find(game => game.id === gameId);

 const handleBackToGames = () => {
    navigate('/');
  };

  if (gameId && selectedGame) {
 return (
 <GamePlayer
        gameId={selectedGame.id}
        gameTitle={selectedGame.title}
        gameImage={selectedGame.image}
        category={selectedGame.category}
        rating={selectedGame.rating} // Ensure rating is passed
        plays={selectedGame.plays} // Ensure plays is passed
        gamePath={selectedGame.gamePath}
        isFavorite={/* Determine if the game is a favorite here based on your logic */ false}
        onBack={handleBackToGames}
 />
    );
  }

  return (
    <Routes> {/* Render routes if no game-id */}
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default App;
