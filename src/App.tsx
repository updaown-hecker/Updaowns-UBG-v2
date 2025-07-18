import { useEffect } from 'react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound"; // Import NotFound
import { ProfilePage } from "./pages/ProfilePage.tsx"; // Import ProfilePage
import { Toaster } from "@/components/ui/toaster";
import { GamePlayer } from "@/components/GamePlayer"; // Import GamePlayer
import { allGames } from "@/components/GamesPage"; // Import allGames data

import useTimeTracker from "./hooks/useTimeTracker";
// Initialize QueryClient outside of the component to avoid re-creation on re-renders
const queryClient = new QueryClient();

// This component will contain the logic that uses React Router hooks
const AppContent = () => {
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('game-id');
  const navigate = useNavigate();

  useEffect(() => {
    // Apply tab cloaking settings on mount
    const savedCloakTitle = localStorage.getItem('settings-cloakTitle');
    const savedCloakIcon = localStorage.getItem('settings-cloakIcon');
    if (savedCloakTitle) {
      document.title = savedCloakTitle;
    }

    // Load and apply background media settings from localStorage
    const savedBackgroundMedia = localStorage.getItem('settings-backgroundMedia');
    if (savedBackgroundMedia) {
      const { url } = JSON.parse(savedBackgroundMedia);
      // Apply background image style to the body
      if (url) document.body.style.backgroundImage = `url('${url}')`;
    }

    if (savedCloakIcon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = savedCloakIcon;
    }

    // Add a default favicon if no custom one is set
    if (!savedCloakIcon && !document.querySelector("link[rel~='icon']")) {
        // You can add logic here to set a default favicon if needed
    }
    // Handle about:blank on startup
    const aboutBlankEnabled = localStorage.getItem('aboutBlankOnStartup') === 'true';
    if (aboutBlankEnabled && window.location.href !== 'about:blank') {
        window.location.replace('about:blank');
    }
  }, []);

  // Find the selected game using useMemo for performance if allGames is large
  // For simplicity, directly find it here for now.
  const selectedGame = allGames.find(game => game.id === gameId);

  const handleBackToGames = () => {
    navigate('/');
  };

  // If a game-id is present in the URL and the game is found, display GamePlayer

  useTimeTracker(); // Start tracking time

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
      <Route path="/profile" element={<ProfilePage />} />
      {/* Add any custom routes before the catch-all route */}
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