import { useState, useMemo } from 'react';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GamePlayer, GamePlayerProps } from '@/components/GamePlayer';
import { Search, Filter, Grid, List } from 'lucide-react';

// Import game images
import gameRacing from '@/assets/game-racing.jpg';
import gamePuzzle from '@/assets/game-puzzle.jpg';
import gamePlatformer from '@/assets/game-platformer.jpg';
import gameAdventure from '@/assets/game-adventure.jpg';
import gameShooter from '@/assets/game-shooter.jpg';
import gameSports from '@/assets/game-sports.jpg';
import gameStrategy from '@/assets/game-strategy.jpg';
import gameFighting from '@/assets/game-fighting.jpg';
import { useNavigate } from 'react-router-dom';

export const allGames = [
  {
    id: '1',
    title: 'Neon Racer',
    image: gameRacing,
    category: 'Racing',
    rating: 4.8,
    plays: 125000,
    tags: ['racing', 'cars', 'speed', 'neon'],
 gamePath: 'https://example.com/games/example/index.html',
  },
  {
    id: '2',
    title: 'Puzzle Master',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.6,
    plays: 89000,
    tags: ['puzzle', 'brain', 'logic', 'strategy'],
 gamePath: 'https://example.com/games/puzzle-master/index.html',
  },
  {
    id: '3',
    title: 'Retro Jump',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.9,
    plays: 156000,
    tags: ['platformer', 'retro', 'jumping', 'adventure'],
 gamePath: 'https://example.com/games/retro-jump/index.html',
  },
  {
    id: '4',
    title: 'Mystic Quest',
    image: gameAdventure,
    category: 'Adventure',
    rating: 4.7,
    plays: 98000,
    tags: ['adventure', 'fantasy', 'magic', 'quest'],
 gamePath: 'https://example.com/games/mystic-quest/index.html',
  },
  {
    id: '5',
    title: 'Space Blaster',
    image: gameShooter,
    category: 'Action',
    rating: 4.5,
    plays: 203000,
    tags: ['action', 'shooting', 'space', 'aliens'],
 gamePath: 'https://example.com/games/space-blaster/index.html',
  },
  {
    id: '6',
    title: 'Soccer Pro',
    image: gameSports,
    category: 'Sports',
    rating: 4.6,
    plays: 167000,
    tags: ['sports', 'soccer', 'football', 'competition'],
 gamePath: 'https://example.com/games/soccer-pro/index.html',
  },
  {
    id: '7',
    title: 'Tower Defense',
    image: gameStrategy,
    category: 'Strategy',
    rating: 4.8,
    plays: 134000,
    tags: ['strategy', 'defense', 'towers', 'tactical'],
 gamePath: 'https://example.com/games/tower-defense/index.html',
  },
  {
    id: '8',
    title: 'Fighter Arena',
    image: gameFighting,
    category: 'Fighting',
    rating: 4.7,
    plays: 178000,
    tags: ['fighting', 'combat', 'martial arts', 'arena'],
 gamePath: 'https://example.com/games/fighter-arena/index.html',
  },
  {
    id: '9',
    title: 'Cyber Runner',
    image: gameRacing,
    category: 'Racing',
    rating: 4.4,
    plays: 112000,
    tags: ['racing', 'cyber', 'futuristic', 'speed'],
 gamePath: 'https://example.com/games/cyber-runner/index.html',
  },
  {
    id: '10',
    title: 'Mind Bender',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.9,
    plays: 145000,
    tags: ['puzzle', 'mind', 'challenging', 'brain'],
 gamePath: 'https://example.com/games/mind-bender/index.html',
  },
  {
    id: '11',
    title: 'Sky Adventure',
    image: gameAdventure,
    category: 'Adventure',
    rating: 4.6,
    plays: 189000,
    tags: ['adventure', 'sky', 'flying', 'exploration'],
 gamePath: 'https://example.com/games/sky-adventure/index.html',
  },
  {
    id: '12',
    title: 'Pixel Warrior',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.8,
    plays: 223000,
    tags: ['platformer', 'pixel', 'warrior', 'retro'],
 gamePath: 'https://example.com/games/pixel-warrior/index.html',
  },
  {
    id: '13',
    title: 'Block Builder',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.4,
    plays: 78000,
    tags: ['puzzle', 'building', 'blocks', 'creativity'],
 gamePath: 'https://example.com/games/block-builder/index.html',
  },
  {
    id: '14',
    title: 'Forest Runner',
    image: gameAdventure,
    category: 'Adventure',
    rating: 4.6,
    plays: 92000,
    tags: ['adventure', 'running', 'forest', 'nature'],
 gamePath: 'https://example.com/games/forest-runner/index.html',
  },
  {
    id: '15',
    title: 'Combat Zone',
    image: gameFighting,
    category: 'Action',
    rating: 4.5,
    plays: 165000,
    tags: ['action', 'combat', 'zone', 'multiplayer'],
 gamePath: 'https://example.com/games/combat-zone/index.html',
  },
  {
    id: '16',
    title: 'Sports Champion',
    image: gameSports,
    category: 'Sports',
    rating: 4.7,
    plays: 142000,
    tags: ['sports', 'champion', 'competition', 'athletic'],
 gamePath: 'https://example.com/games/sports-champion/index.html',
  },
  {
    id: '17',
    title: 'Space Shooter',
    image: gameShooter, // Assuming you'll use the same image or add a new one
    category: 'Action',
    rating: 4.6,
    plays: 95000, // Example play count
    tags: ['action', 'shooting', 'space', 'aliens', 'arcade'],
 gamePath: 'https://example.com/games/space-shooter/index.html',
  },
];

export const categories = ['All', 'Action', 'Adventure', 'Puzzle', 'Racing', 'Platformer', 'Sports', 'Strategy', 'Fighting'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A-Z' },
];

interface GamesPageProps {
  onGamePlay?: (gameId: string) => void;
  favorites: string[];
  onFavoriteToggle: (gameId: string) => void;
}

export const GamesPage = ({ onGamePlay, favorites, onFavoriteToggle }: GamesPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const navigate = useNavigate();
    const filteredAndSortedGames = useMemo(() => {
    let filtered = allGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'popular':
        default:
          return b.plays - a.plays;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">Game Library</h1>
        <p className="text-xl text-muted-foreground">
          Discover {allGames.length}+ awesome unblocked games
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search games, genres, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg glass-card border-0 bg-background/50"
          />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "gradient-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg glass-card border-0 bg-background/50 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex border rounded-lg overflow-hidden glass-card">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedGames.length} games
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
          
          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {selectedCategory !== 'All' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('All')}>
                  {selectedCategory} ×
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                  "{searchQuery}" ×
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Games Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredAndSortedGames.map((game, index) => (
          <div key={game.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <GameCard
              {...game}
              isFavorite={favorites.includes(game.id)}
              onFavoriteToggle={onFavoriteToggle}
              onPlay={() => navigate({ pathname: '/', search: `?game-id=${game.id}` })}
            />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedGames.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full glass-card flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="gradient-primary"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};