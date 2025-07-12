import { useState } from 'react';
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
  Star,
  Users,
  Clock
} from 'lucide-react';

interface GamePlayerProps {
  gameId: string;
  gameTitle: string;
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

  const handleFavoriteClick = () => {
    onFavoriteToggle?.(gameId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Game Header */}
      <div className="sticky top-16 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
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
                    <Badge variant="secondary">{category}</Badge>
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
                size="sm"
                onClick={handleFavoriteClick}
                className={isFavorite ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Frame */}
          <div className="lg:col-span-3">
            <Card className="game-card overflow-hidden">
              {/* Game Controls */}
              <div className="flex items-center justify-between p-4 bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className={`w-4 h-4 ${isMuted ? 'text-muted-foreground' : ''}`} />
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
              </div>

              {/* Game Area */}
              <div className={`relative bg-gradient-to-br from-blue-900 to-purple-900 ${
                isFullscreen ? 'h-screen' : 'aspect-video'
              }`}>
                <iframe
                  src={gamePath}
                  style={{ width: '100%', height: '100%', border: 'none' }}
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
                  <Badge variant="secondary">{category}</Badge>
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
                  <Heart className="w-4 h-4 mr-2" />
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