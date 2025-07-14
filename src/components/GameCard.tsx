import { useState } from 'react';
import { Heart, Play, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Game } from './GamesPage'; // Assuming Game interface is exported from GamesPage

interface GameCardProps {
  id: string;
  game: Game; // Add the game prop
  title: string;
  image: string;
  category: string;
  rating: number;
  plays: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onPlay?: (id: string) => void;
  onGamePlay?: (id: string) => void; // Add onGamePlay prop
}

export const GameCard = ({ 
  id, 
  game, // Destructure the game prop
  title, 
  image, 
  category, 
  rating, 
  plays, 
  isFavorite = false,
  onFavoriteToggle,
  onPlay,
  onGamePlay // Destructure onGamePlay prop
}: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(id);
  };

  const handlePlayClick = () => {
    // Use onGamePlay if provided, otherwise use onPlay
    (onGamePlay || onPlay)?.(id);
  };

  return (
    <Card 
      className="game-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              size="lg" 
              className="gradient-primary hover:scale-110 transition-transform duration-200 glow-primary"
            >
              <Play className="w-6 h-6 mr-2" />
              Play Now
            </Button>
          </div>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 p-2 rounded-full glass-card transition-all duration-200 ${
            isFavorite ? 'text-red-500' : 'text-white/80 hover:text-red-500'
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card text-xs font-medium text-white/90">
          {category}
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current text-yellow-500" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
          
          <span>{plays.toLocaleString()} plays</span>
        </div>
      </div>
    </Card>
  );
};