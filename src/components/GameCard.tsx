import { useState, useEffect, useRef } from 'react';
import { Heart, Play, Star, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  rating: number;
  plays: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  // Renamed onPlay to onCardClick for clarity, as the primary click action now expands the card.
  onCardClick?: (id: string) => void;
 onClick?: (id: string) => void;
}

export const GameCard = ({ 
  id, 
  title, 
  image, 
  category, 
  rating, 
  plays, 
  isFavorited = false,
 onFavoriteToggle,
  onCardClick,
}: GameCardProps) => {const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited);
  const [gameContentSource, setGameContentSource] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [gameContent, setGameContent] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocalIsFavorited(!localIsFavorited);
    onFavoriteToggle?.(id);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Set the content source based on game ID or another property
      // For example, you could have a mapping of game IDs to content URLs/file paths
      setGameContentSource(`/game-content/${id}.html`); // Example: assuming content files are named by ID
    } else {
      setGameContentSource(null);
      setGameContent(null);
    }
  };

  useEffect(() => {
    const fetchGameContent = async () => {
      if (gameContentSource) {
        try {
          const response = await fetch(gameContentSource);
          if (response.ok) {
            const content = await response.text();
            setGameContent(content);
          } else {
            setGameContent(`<p>Failed to load content for ${title}.</p>`);
          }
        } catch (error) {
          setGameContent(`<p>Error fetching content for ${title}.</p>`);
        }
      }
    };

    fetchGameContent();
  }, [gameContentSource, title]);


  return (
    <Card 
      className="game-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => { handleCardClick(); onCardClick?.(id); }} // Call both handlers
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
              onClick={(e) => { e.stopPropagation(); onCardClick?.(id); }} // Call onCardClick on Play button too
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
 isFavorited ? 'text-red-500' : 'text-white/80 hover:text-red-500'
 } ${localIsFavorited ? 'text-red-500 fill-current' : ''}`}
          onClick={handleFavoriteClick}
        >
          <Heart className="w-4 h-4" />
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

      {/* Expanded Content */}
      {isExpanded && gameContent && (
        <div ref={contentRef} className="p-4 border-t mt-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setGameContent(null); }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: gameContent }} />
        </div>
      )}
    </Card>
  );
};