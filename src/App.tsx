import { useEffect } from 'react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { Toaster } from "@/components/ui/toaster";
import { GamePlayer } from "@/components/GamePlayer";
import { allGames } from "@/components/GamesPage";
import useTimeTracker from "./hooks/useTimeTracker";
// Remove ProxyView import, not needed for static HTML iframe rendering

const queryClient = new QueryClient();

function GamePlayerWrapper() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameId = searchParams.get('game-id');
  const selectedGame = allGames.find(game => game.id === gameId);

  if (!gameId || !selectedGame) return <Index />;

  const handleBackToGames = () => {
    navigate('/');
  };

  return (
    <GamePlayer
      gameId={selectedGame.id}
      gameTitle={selectedGame.title}
      gameImage={selectedGame.image}
      category={selectedGame.category}
      rating={selectedGame.rating}
      plays={selectedGame.plays}
      gamePath={selectedGame.gamePath}
      isFavorite={false}
      onBack={handleBackToGames}
    />
  );
}

const AppContent = () => {
  useTimeTracker();

  useEffect(() => {
    const savedCloakTitle = localStorage.getItem('settings-cloakTitle');
    const savedCloakIcon = localStorage.getItem('settings-cloakIcon');
    if (savedCloakTitle) {
      document.title = savedCloakTitle;
    }
    const savedBackgroundMedia = localStorage.getItem('settings-backgroundMedia');
    if (savedBackgroundMedia) {
      const { url } = JSON.parse(savedBackgroundMedia);
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
    if (!savedCloakIcon && !document.querySelector("link[rel~='icon']")) {
      // Optionally set a default favicon
    }
    const aboutBlankEnabled = localStorage.getItem('aboutBlankOnStartup') === 'true';
    if (aboutBlankEnabled && window.location.href !== 'about:blank') {
      window.location.replace('about:blank');
    }
  }, []);

  // Helper components to render static HTML files in iframes
  const StaticIframe = ({ src, title }: { src: string; title: string }) => (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <iframe
        src={src}
        title={title}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<GamePlayerWrapper />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/tl" element={<StaticIframe src="http://localhost:3001/rx" title="Proxy" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="unblocked-games-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
