import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  RotateCcw, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Star,
  Users,
  Clock
} from 'lucide-react';

export interface GamePlayerProps {
  gameId: string;
  gameTitle: string;
  // Removed gamePlayedCount as it's now managed by localStorage
  gameImage: string;
  category: string;
  rating: number;
  plays: number;
  onBack: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (gameId: string) => void;
  gamePath: string; // Add gamePath prop
}

export const GamePlayer = ({ 
  gameId, 
  gameTitle, 
  // Removed gamePlayedCount from destructuring
  gameImage, 
  category, 
  rating, 
  plays, 
  onBack, 
  isFavorite,
  onFavoriteToggle,
  gamePath // Destructure gamePath
}: GamePlayerProps) => {

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // State to track if the game count has been incremented for this session
  const [gameCountIncremented, setGameCountIncremented] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reloadIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = gamePath;
    }
  }, [gamePath]);

  useEffect(() => {
    if (iframeRef.current && gamePath) {
      reloadIframe();
    }
  }, [gamePath, reloadIframe]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.allow = isMuted ? 'autoplay' : 'autoplay; microphone';
      iframeRef.current.contentWindow?.postMessage({ type: 'MUTE', muted: isMuted }, '*');
    }
  }, [isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Effect to increment game played count in localStorage once per game session
  useEffect(() => {
    // TODO: Implement logic to determine when a game is considered "finished"
    // This might involve listening to messages from the iframe, detecting exit, etc.
    // For now, let's assume the game starts when the component mounts and
    // we want to increment the count when the iframe loads.
    // This is a simplification and needs proper game completion detection.

    if (iframeRef.current && !gameCountIncremented) {
      // Placeholder: Increment count when iframe content loads
      iframeRef.current.onload = () => {
        incrementTotalGamesPlayed();
      };
    }
  }, [gameId, gameTitle, gameCountIncremented]);

  // Function to increment the total games played in localStorage
  const incrementTotalGamesPlayed = useCallback(() => {
    if (!gameCountIncremented) {
      const currentCount = parseInt(localStorage.getItem('totalGamesPlayed') || '0', 10);
      localStorage.setItem('totalGamesPlayed', (currentCount + 1).toString());
      console.log(`Game ${gameId} (${gameTitle}) played. Total games played: ${currentCount + 1}`);
      setGameCountIncremented(true); // Set the flag so it only increments once
    }
  }, [gameId, gameTitle, gameCountIncremented]);


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Game Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="hidden sm:flex items-center space-x-3">
                <img 
                  src={gameImage} 
                  alt={gameTitle}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h1 className="font-semibold text-lg">{gameTitle}</h1>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">

                    <Badge variant="secondary" className="capitalize">{category}</Badge>

                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      <span>{rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFavoriteToggle?.(gameId)}
                // className={isFavorite ? 'text-red-500' : ''} // Keep styling if needed, but logic removed
              >
                {/* Removed conditional fill logic as favorites removed */}
                {/* <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} /> */}
                <Heart className="w-4 h-4" />
                <span className="sr-only">Favorite</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
 </div>

      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Frame */}
          <div className="lg:col-span-3" >
            <Card className="game-card overflow-hidden">
              {/* Game Controls */}
              <div className="flex items-center justify-between p-4 bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={reloadIframe}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    <span className="sr-only">Restart</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { // Keep fullscreen logic
                    if (!isFullscreen) {
                      if (iframeRef.current?.requestFullscreen) {
                        iframeRef.current.requestFullscreen();
                      }
                    } else {
                      if (document.exitFullscreen) {
                        document.exitFullscreen();
                      }
                    }
                  }}
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} {/* Keep button text */}
                </Button>
              </div>
 {/* Game Area */}
              <div className={`relative bg-gradient-to-br from-blue-900 to-purple-900 ${isFullscreen ? 'h-screen' : 'aspect-video'} w-full h-full`}>
                <iframe
                  ref={iframeRef}
                  src={gamePath}
                  className="w-full h-full"
                ></iframe>
              </div>

 </Card>
</div>
          {/* Game Info Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Game Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-medium">{rating.toFixed(1)}/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Plays</span>
                  </div>
                  <span className="font-medium">{plays.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Category</span>
                  </div>
                  <Badge variant="secondary" className="capitalize">{category}</Badge>
                </div>
              </div>
            </Card>

            {/* Game Description */}
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">About This Game</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experience the thrill of {gameTitle}! This exciting {category.toLowerCase()} game 
                offers hours of entertainment with stunning graphics and engaging gameplay. 
                Perfect for quick gaming sessions during breaks.
              </p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Controls</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Move:</span>
                    <span>Arrow Keys / WASD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Action:</span>
                    <span>Spacebar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pause:</span>
                    <span>P</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full gradient-primary">
                  {/* Removed Heart icon as favorites removed */}
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Game
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};