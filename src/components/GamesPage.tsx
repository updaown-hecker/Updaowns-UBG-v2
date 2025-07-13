import { useState, useMemo } from 'react';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GamePlayer, GamePlayerProps } from '@/components/GamePlayer';

import gameRacing from '@/assets/game-racing.jpg';
import gamePuzzle from '@/assets/game-puzzle.jpg';
import gamePlatformer from '@/assets/game-platformer.jpg';
import gameAdventure from '@/assets/game-adventure.jpg';
import gameShooter from '@/assets/game-shooter.jpg';
import gameSports from '@/assets/game-sports.jpg';
import gameStrategy from '@/assets/game-strategy.jpg'; 
import gameFighting from '@/assets/game-fighting.jpg';
import { Search, Filter, Grid, List, XCircle } from 'lucide-react';

import game10MinutesTillDawn from '@/assets/tmtd.png';
import game1v1Lol from '@/assets/1v1-lol.png';
import game2048 from '@/assets/2048.png';
import gameMotoX3M from '@/assets/moto-x3m.png';
import gameWebeComeWhatWeBehold from '@/assets/WebeComeWhatWeBehold.png';
import gameAwesomeTanks2 from '@/assets/awesome-tanks-2.png';
import gameBasketRandom from '@/assets/basket-random.png';
import gameBitlife from '@/assets/bitlife.png';
import gameBoxingRandom from '@/assets/boxing-random.png';
import gameChroma from '@/assets/chroma.png';
import gameColoron from '@/assets/coloron.png';
import gameCookieClicker from '@/assets/cookie-clicker.png';
import gameDriftBoss from '@/assets/drift-boss.png';
import gameDriftHunters from '@/assets/drift-hunters.png';
import gameEarnToDie from '@/assets/earntodie.png';
import gameFireboyAndWatergirlForestTemple from '@/assets/fireboy-and-watergirl-1.png';
import gameFlappyBird from '@/assets/flappy-bird.png';
import gameFridayNightFunkin from '@/assets/fnf-icon.jpg';
import gameGeometryDash from '@/assets/geometry-dash.png';
import gameImpossibleQuiz from '@/assets/impossible-quiz.png';
import gameMario63 from '@/assets/mario63.png';
import gameMinecraft from '@/assets/minecraft.png';
import gameMonkeyMart from '@/assets/monkey.png';
import gamePaperio from '@/assets/paperio.png';
import gameRetroBowl from '@/assets/retro-bowl.png';
import gameRooftopSnipers from '@/assets/rooftop-snippers.png';
import gameScrapMetal3 from '@/assets/scrap.png';
import gameSlope2 from '@/assets/slope-2.png';
import gameSlope from '@/assets/slope.png';
import gameSnake from '@/assets/snake.png';
import gameStack from '@/assets/stack.png';
import gameSubwaySurfers from '@/assets/subway-surfers.png';
import gameTetris from '@/assets/tetris.png';
import gameTinyFishing from '@/assets/tiny-fishing.png';
import gameTombOfTheMask from '@/assets/tomb.jpg';
import gameTunnelRush from '@/assets/tunnelrush.png';
import gameVex3 from '@/assets/vex3.png';
import gameVex4 from '@/assets/vex4.png';
import gameVex5 from '@/assets/vex5.png';
import gameVex6 from '@/assets/vex6.png';
import gameWorldsHardestGame from '@/assets/world-hardest-game.png';
import gameXX142B2EXE from '@/assets/xx142b2exe.png';

export 
const allGames = [
  {
    id: '1',
    title: '10 Minutes Till Dawn',
    image: game10MinutesTillDawn,
    category: 'Action',
    rating: 4.5,
    plays: 100000,
    tags: ['action', 'shooter', 'survival'],
    gamePath: 'games/10-Minutes-Till-Dawn-main/index.html',
  },
  {
    id: '2',
    title: '1v1 Lol',
    image: game1v1Lol,
    category: 'Action',
    rating: 4.7,
    plays: 250000,
    tags: ['action', 'shooter', 'multiplayer'],
    gamePath: 'games/1v1-lol/index.html',
  },
  {
    id: '3',
    title: '2048',
    image: game2048,
    category: 'Puzzle',
    rating: 4.2,
    plays: 80000,
    tags: ['puzzle', 'numbers', 'logic'],
    gamePath: 'games/2048/index.html',
  },
  {
    id: '4',
    title: 'Moto X3M',
    image: gameMotoX3M,
    category: 'Racing',
    rating: 4.6,
    plays: 180000,
    tags: ['racing', 'bike', 'stunts'],
    gamePath: 'games/MotoX3M-master/index.html',
  },
  {
    id: '5',
    title: 'Webe Come What We Behold',
    image: gameWebeComeWhatWeBehold,
    category: 'Adventure',
    rating: 3.9,
    plays: 50000,
    tags: ['adventure', 'indie', 'unique'],
    gamePath: 'games/WebeComeWhatWeBehold/index.html',
  },
  {
    id: '6',
    title: 'Awesome Tanks 2',
    image: gameAwesomeTanks2,
    category: 'Action',
    rating: 4.3,
    plays: 90000,
    tags: ['action', 'tanks', 'shooter'],
    gamePath: 'games/awesome-tanks-2/index.html',
  },
  {
    id: '7',
    title: 'Basket Random',
    image: gameBasketRandom,
    category: 'Sports',
    rating: 4.0,
    plays: 70000,
    tags: ['sports', 'basketball', 'random'],
    gamePath: 'games/basket-random/index.html',
  },
  {
    id: '8',
    title: 'Bitlife',
    image: gameBitlife,
    category: 'Simulation',
    rating: 4.4,
    plays: 110000,
    tags: ['simulation', 'life', 'text-based'],
    gamePath: 'games/bitlife/index.html',
  },
  {
    id: '9',
    title: 'Boxing Random',
    image: gameBoxingRandom,
    category: 'Sports',
    rating: 4.1,
    plays: 65000,
    tags: ['sports', 'boxing', 'random'],
    gamePath: 'games/boxing-random/index.html',
  },
  {
    id: '10',
    title: 'Chroma',
    image: gameChroma,
    category: 'Puzzle',
    rating: 3.8,
    plays: 40000,
    tags: ['puzzle', 'color', 'logic'],
    gamePath: 'games/chroma/index.html',
  },
  {
    id: '11',
    title: 'Coloron',
    image: gameColoron,
    category: 'Puzzle',
    rating: 3.7,
    plays: 35000,
    tags: ['puzzle', 'color', 'matching'],
    gamePath: 'games/coloron/index.html',
  },
  {
    id: '12',
    title: 'Cookie Clicker',
    image: gameCookieClicker,
    category: 'Idle',
    rating: 4.5,
    plays: 150000,
    tags: ['idle', 'clicker', 'strategy'],
    gamePath: 'games/cookie-clicker/index.html',
  },
  {
    id: '13',
    title: 'Crazy Taxi',
    image: gameRacing,
    category: 'Racing',
    rating: 4.3,
    plays: 95000,
    tags: ['racing', 'taxi', 'driving'],
    gamePath: 'games/crazy-taxi.html',
  },
  {
    id: '14',
    title: 'CSGO Clicker',
    image: gamePlatformer,
    category: 'Idle',
    rating: 4.0,
    plays: 60000,
    tags: ['idle', 'clicker', 'csgo'],
    gamePath: 'games/csgoclicker/index.html',
  },
  {
    id: '15',
    title: 'Drift Boss',
    image: gameDriftBoss,
    category: 'Racing',
    rating: 4.1,
    plays: 85000,
    tags: ['racing', 'drift', 'driving'],
    gamePath: 'games/drift-boss/index.html',
  },
  {
    id: '16',
    title: 'Drift Hunters',
    image: gameDriftHunters,
    category: 'Racing',
    rating: 4.6,
    plays: 170000,
    tags: ['racing', 'drift', 'simulation'],
    gamePath: 'games/drifthunters/index.html',
  },
  {
    id: '17',
    title: 'Drive Mad',
    image: gameRacing,
    category: 'Racing',
    rating: 4.2,
    plays: 75000,
    tags: ['racing', 'driving', 'physics'],
    gamePath: 'games/drive-mad/index.html',
  },
  {
    id: '18',
    title: 'Earn to Die',
    image: gameShooter,
    category: 'Action',
    rating: 4.4,
    plays: 120000,
    tags: ['action', 'zombie', 'driving'],
    gamePath: 'games/earntodie/index.html',
  },
  {
    id: '19',
    title: 'Fireboy and Watergirl Forest Temple',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.5,
    plays: 130000,
    tags: ['puzzle', 'co-op', 'platformer'],
    gamePath: 'games/fireboy-and-watergirl-forest-temple/index.html',
  },
  {
    id: '20',
    title: 'Flappy Bird',
    image: gamePlatformer,
    category: 'Arcade',
    rating: 3.5,
    plays: 200000,
    tags: ['arcade', 'flappy', 'classic'],
    gamePath: 'games/flappybird/index.html',
  },
  {
    id: '21',
    title: 'Friday Night Funkin',
    image: gameFighting,
    category: 'Rhythm',
    rating: 4.7,
    plays: 300000,
    tags: ['rhythm', 'music', 'fighting'],
    gamePath: 'games/fridaynightfunkin/index.html',
  },
  {
    id: '22',
    title: 'Geometry Dash',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.6,
    plays: 220000,
    tags: ['platformer', 'rhythm', 'hard'],
    gamePath: 'games/geometry-dash/index.html',
  },
  {
    id: '23',
    title: 'Impossible Quiz',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.0,
    plays: 70000,
    tags: ['puzzle', 'quiz', 'trivia'],
    gamePath: 'games/impossible-quiz.html',
  },
  {
    id: '24',
    title: 'Mario 63',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.8,
    plays: 190000,
    tags: ['platformer', 'mario', 'adventure'],
    gamePath: 'games/mario-63.html',
  },
  {
    id: '25',
    title: 'Minecraft',
    image: gameAdventure,
    category: 'Sandbox',
    rating: 4.9,
    plays: 500000,
    tags: ['sandbox', 'crafting', 'adventure'],
    gamePath: 'games/minecraft.html',
  },
  {
    id: '26',
    title: 'Monkey Mart',
    image: gameStrategy,
    category: 'Simulation',
    rating: 4.2,
    plays: 80000,
    tags: ['simulation', 'management', 'farm'],
    gamePath: 'games/monkeymart/index.html',
  },
  {
    id: '27',
    title: 'Paper.io',
    image: gameStrategy,
    category: 'Strategy',
    rating: 4.1,
    plays: 90000,
    tags: ['strategy', 'io', 'multiplayer'],
    gamePath: 'games/paperio/index.html',
  },
  {
    id: '28',
    title: 'Retro Bowl',
    image: gameSports,
    category: 'Sports',
    rating: 4.7,
    plays: 160000,
    tags: ['sports', 'football', 'retro'],
    gamePath: 'games/retro-bowl/index.html',
  },
  {
    id: '29',
    title: 'Rooftop Snipers',
    image: gameFighting,
    category: 'Action',
    rating: 4.3,
    plays: 110000,
    tags: ['action', 'fighting', 'multiplayer'],
    gamePath: 'games/rooftop-snipers/index.html',
  },
  {
    id: '30',
    title: 'Scrap Metal 3',
    image: gameRacing,
    category: 'Racing',
    rating: 4.0,
    plays: 60000,
    tags: ['racing', 'driving', 'simulation'],
    gamePath: 'games/scrapmetal3/index.html',
  },
  {
    id: '31',
    title: 'Slope 2',
    image: gameRacing,
    category: 'Racing',
    rating: 4.3,
    plays: 100000,
    tags: ['racing', 'endless runner', 'ball'],
    gamePath: 'games/slope-2/index.html',
  },
  {
    id: '32',
    title: 'Slope',
    image: gameRacing,
    category: 'Racing',
    rating: 4.4,
    plays: 120000,
    tags: ['racing', 'endless runner', 'ball'],
    gamePath: 'games/slope/index.html',
  },
  {
    id: '33',
    title: 'Snake',
    image: gamePuzzle,
    category: 'Arcade',
    rating: 3.6,
    plays: 50000,
    tags: ['arcade', 'classic', 'snake'],
    gamePath: 'games/snake/index.html',
  },
  {
    id: '34',
    title: 'Stack',
    image: gamePuzzle,
    category: 'Arcade',
    rating: 3.9,
    plays: 45000,
    tags: ['arcade', 'stacking', 'tower'],
    gamePath: 'games/stack/index.html',
  },
  {
    id: '35',
    title: 'Subway Surfers',
    image: gamePlatformer,
    category: 'Endless Runner',
    rating: 4.5,
    plays: 180000,
    tags: ['endless runner', 'subway', 'running'],
    gamePath: 'games/subway-surfers/index.html',
  },
  {
    id: '36',
    title: 'SWF',
    image: gameAdventure,
    category: 'Misc',
    rating: 3.0,
    plays: 10000,
    tags: ['flash', 'misc'],
    gamePath: 'games/swf/index.html',
  },
  {
    id: '37',
    title: 'Tetris',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.4,
    plays: 130000,
    tags: ['puzzle', 'classic', 'blocks'],
    gamePath: 'games/tetris/index.html',
  },
  {
    id: '38',
    title: 'Tiny Fishing',
    image: gameAdventure,
    category: 'Simulation',
    rating: 3.8,
    plays: 55000,
    tags: ['simulation', 'fishing', 'idle'],
    gamePath: 'games/tinyfishing/index.html',
  },
  {
    id: '39',
    title: 'Tomb of the Mask',
    image: gamePlatformer,
    category: 'Arcade',
    rating: 4.2,
    plays: 90000,
    tags: ['arcade', 'platformer', 'maze'],
    gamePath: 'games/tombofthemask/index.html',
  },
  {
    id: '40',
    title: 'Tunnel Rush',
    image: gameRacing,
    category: 'Racing',
    rating: 4.0,
    plays: 70000,
    tags: ['racing', 'tunnel', 'avoidance'],
    gamePath: 'games/tunnelrush/index.html',
  },
  {
    id: '41',
    title: 'Vex 3',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.5,
    plays: 140000,
    tags: ['platformer', 'stickman', 'hard'],
    gamePath: 'games/vex3/index.html',
  },
  {
    id: '42',
    title: 'Vex 4',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.6,
    plays: 150000,
    tags: ['platformer', 'stickman', 'hard'],
    gamePath: 'games/vex4/index.html',
  },
  {
    id: '43',
    title: 'Vex 5',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.7,
    plays: 160000,
    tags: ['platformer', 'stickman', 'hard'],
    gamePath: 'games/vex5/index.html',
  },
  {
    id: '44',
    title: 'Vex 6',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.8,
    plays: 170000,
    tags: ['platformer', 'stickman', 'hard'],
    gamePath: 'games/vex6/index.html',
  },
  {
    id: '45',
    title: 'Worlds Hardest Game',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 3.5,
    plays: 80000,
    tags: ['puzzle', 'hard', 'challenge'],
    gamePath: 'games/worlds-hardest-game/index.html',
  },
  {
    id: '46',
    title: 'XX142B2EXE',
    image: gameAdventure,
    category: 'Misc',
    rating: 3.2,
    plays: 20000,
    tags: ['misc', 'exe', 'unblocked'],
    gamePath: 'games/xx142b2exe/index.html',
  },
];

export const categories = ['All', 'Action', 'Adventure', 'Puzzle', 'Racing', 'Platformer', 'Sports', 'Strategy', 'Fighting', 'Simulation', 'Idle', 'Arcade', 'Rhythm', 'Endless Runner', 'Misc'];
export const sortOptions = [
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(''); // Added local state for search

  const filteredAndSortedGames = useMemo(() => {
    let filtered = allGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || // Use local searchQuery
                          game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'popular':
        default:
          return b.plays - a.plays;
        case 'rating': // Handle rating sort
            return b.rating - a.rating;
      }
    });

    return filtered;

  }, [searchQuery, selectedCategory, sortBy, allGames]);

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
        {/* Filters and Controls */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search games on this page..." // Added placeholder
            value={searchQuery} // Use local searchQuery
            onChange={(e) => setSearchQuery(e.target.value)} // Update local searchQuery
            className="pl-10 glass-card border-0 bg-background/50"
          />
        </div>

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
            {selectedCategory !== 'All' && searchQuery && ` in ${selectedCategory}`} {/* Adjusted logic */}
          </p>
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
              onPlay={() => onGamePlay?.(game.id)} // Use onGamePlay prop
            />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedGames.length === 0 && ( // Check if filtered results are 0
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full glass-card flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          {(searchQuery || selectedCategory !== 'All') ? ( // Conditional message based on filters
            <>
              <h3 className="text-2xl font-semibold mb-2">No games found for "{searchQuery}" {selectedCategory !== 'All' && `in ${selectedCategory}`}</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
            </>
          ) : ( // This is the 'else' part for when no search query or category is active
            <>
              <h3 className="text-2xl font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
            </>
          )}
          {(searchQuery || selectedCategory !== 'All') && (
            <Button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};