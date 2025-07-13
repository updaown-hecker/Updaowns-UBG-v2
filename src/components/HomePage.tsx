import { useState, useEffect } from 'react';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Star } from 'lucide-react';

// Import game images
import heroBanner from '@/assets/hero-banner.jpg';
import gameRacing from '@/assets/game-racing.jpg';
import gamePuzzle from '@/assets/game-puzzle.jpg';
import gamePlatformer from '@/assets/game-platformer.jpg';
import gameAdventure from '@/assets/game-adventure.jpg';
import gameShooter from '@/assets/game-shooter.jpg';
import gameSports from '@/assets/game-sports.jpg';
import gameStrategy from '@/assets/game-strategy.jpg';
import gameFighting from '@/assets/game-fighting.jpg';

// Import specific game images
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

const featuredGames = [
  {
    id: '1',
    title: '10 Minutes Till Dawn',
    image: game10MinutesTillDawn,
    category: 'Action',
    rating: 4.5,
    plays: 100000,
  },
  {
    id: '2',
    title: '1v1 Lol',
    image: game1v1Lol,
    category: 'Action',
    rating: 4.7,
    plays: 250000,
  },
  {
    id: '3',
    title: '2048',
    image: game2048,
    category: 'Puzzle',
    rating: 4.2,
    plays: 80000,
  },
  {
    id: '4',
    title: 'Moto X3M',
    image: gameMotoX3M,
    category: 'Racing',
    rating: 4.6,
    plays: 180000,
  },
  {
    id: '5',
    title: 'Webe Come What We Behold',
    image: gameWebeComeWhatWeBehold,
    category: 'Adventure',
    rating: 3.9,
    plays: 50000,
  },
  {
    id: '6',
    title: 'Awesome Tanks 2',
    image: gameAwesomeTanks2,
    category: 'Action',
    rating: 4.3,
    plays: 90000,
  },
  {
    id: '7',
    title: 'Basket Random',
    image: gameBasketRandom,
    category: 'Sports',
    rating: 4.0,
    plays: 70000,
  },
  {
    id: '8',
    title: 'Bitlife',
    image: gameBitlife,
    category: 'Simulation',
    rating: 4.4,
    plays: 110000,
  },
  {
    id: '9',
    title: 'Boxing Random',
    image: gameBoxingRandom,
    category: 'Sports',
    rating: 4.1,
    plays: 65000,
  },
  {
    id: '10',
    title: 'Chroma',
    image: gameChroma,
    category: 'Puzzle',
    rating: 3.8,
    plays: 40000,
  },
  {
    id: '11',
    title: 'Coloron',
    image: gameColoron,
    category: 'Puzzle',
    rating: 3.7,
    plays: 35000,
  },
  {
    id: '12',
    title: 'Cookie Clicker',
    image: gameCookieClicker,
    category: 'Idle',
    rating: 4.5,
    plays: 150000,
  },
  {
    id: '13',
    title: 'Crazy Taxi',
    image: gameRacing,
    category: 'Racing',
    rating: 4.3,
    plays: 95000,
  },
  {
    id: '14',
    title: 'CSGO Clicker',
    image: gamePlatformer,
    category: 'Idle',
    rating: 4.0,
    plays: 60000,
  },
  {
    id: '15',
    title: 'Drift Boss',
    image: gameDriftBoss,
    category: 'Racing',
    rating: 4.1,
    plays: 85000,
  },
  {
    id: '16',
    title: 'Drift Hunters',
    image: gameDriftHunters,
    category: 'Racing',
    rating: 4.6,
    plays: 170000,
  },
  {
    id: '17',
    title: 'Drive Mad',
    image: gameRacing,
    category: 'Racing',
    rating: 4.2,
    plays: 75000,
  },
  {
    id: '18',
    title: 'Earn to Die',
    image: gameEarnToDie,
    category: 'Action',
    rating: 4.4,
    plays: 120000,
  },
  {
    id: '19',
    title: 'Fireboy and Watergirl Forest Temple',
    image: gameFireboyAndWatergirlForestTemple,
    category: 'Puzzle',
    rating: 4.5,
    plays: 130000,
  },
  {
    id: '20',
    title: 'Flappy Bird',
    image: gameFlappyBird,
    category: 'Arcade',
    rating: 3.5,
    plays: 200000,
  },
  {
    id: '21',
    title: 'Friday Night Funkin',
    image: gameFridayNightFunkin,
    category: 'Rhythm',
    rating: 4.7,
    plays: 300000,
  },
  {
    id: '22',
    title: 'Geometry Dash',
    image: gameGeometryDash,
    category: 'Platformer',
    rating: 4.6,
    plays: 220000,
  },
  {
    id: '23',
    title: 'Impossible Quiz',
    image: gameImpossibleQuiz,
    category: 'Puzzle',
    rating: 4.0,
    plays: 70000,
  },
  {
    id: '24',
    title: 'Mario 63',
    image: gameMario63,
    category: 'Platformer',
    rating: 4.8,
    plays: 190000,
  },
  {
    id: '25',
    title: 'Minecraft',
    image: gameMinecraft,
    category: 'Sandbox',
    rating: 4.9,
    plays: 500000,
  },
  {
    id: '26',
    title: 'Monkey Mart',
    image: gameMonkeyMart,
    category: 'Simulation',
    rating: 4.2,
    plays: 80000,
  },
  {
    id: '27',
    title: 'Paper.io',
    image: gamePaperio,
    category: 'Strategy',
    rating: 4.1,
    plays: 90000,
  },
  {
    id: '28',
    title: 'Retro Bowl',
    image: gameRetroBowl,
    category: 'Sports',
    rating: 4.7,
    plays: 160000,
  },
  {
    id: '29',
    title: 'Rooftop Snipers',
    image: gameRooftopSnipers,
    category: 'Action',
    rating: 4.3,
    plays: 110000,
  },
  {
    id: '30',
    title: 'Scrap Metal 3',
    image: gameScrapMetal3,
    category: 'Racing',
    rating: 4.0,
    plays: 60000,
  },
  {
    id: '31',
    title: 'Slope 2',
    image: gameSlope2,
    category: 'Racing',
    rating: 4.3,
    plays: 100000,
  },
  {
    id: '32',
    title: 'Slope',
    image: gameSlope,
    category: 'Racing',
    rating: 4.4,
    plays: 120000,
  },
  {
    id: '33',
    title: 'Snake',
    image: gameSnake,
    category: 'Arcade',
    rating: 3.6,
    plays: 50000,
  },
  {
    id: '34',
    title: 'Stack',
    image: gameStack,
    category: 'Arcade',
    rating: 3.9,
    plays: 45000,
  },
  {
    id: '35',
    title: 'Subway Surfers',
    image: gameSubwaySurfers,
    category: 'Endless Runner',
    rating: 4.5,
    plays: 180000,
  },
  {
    id: '36',
    title: 'SWF',
    image: gamePlatformer,
    category: 'Misc',
    rating: 3.0,
    plays: 10000,
  },
  {
    id: '37',
    title: 'Tetris',
    image: gameTetris,
    category: 'Puzzle',
    rating: 4.4,
    plays: 130000,
  },
  {
    id: '38',
    title: 'Tiny Fishing',
    image: gameTinyFishing,
    category: 'Simulation',
    rating: 3.8,
    plays: 55000,
  },
  {
    id: '39',
    title: 'Tomb of the Mask',
    image: gameTombOfTheMask,
    category: 'Arcade',
    rating: 4.2,
    plays: 90000,
  },
  {
    id: '40',
    title: 'Tunnel Rush',
    image: gameTunnelRush,
    category: 'Racing',
    rating: 4.0,
    plays: 70000,
  },
  {
    id: '41',
    title: 'Vex 3',
    image: gameVex3,
    category: 'Platformer',
    rating: 4.5,
    plays: 140000,
  },
  {
    id: '42',
    title: 'Vex 4',
    image: gameVex4,
    category: 'Platformer',
    rating: 4.6,
    plays: 150000,
  },
  {
    id: '43',
    title: 'Vex 5',
    image: gameVex5,
    category: 'Platformer',
    rating: 4.7,
    plays: 160000,
  },
  {
    id: '44',
    title: 'Vex 6',
    image: gameVex6,
    category: 'Platformer',
    rating: 4.8,
    plays: 170000,
  },
  {
    id: '45',
    title: 'Worlds Hardest Game',
    image: gameWorldsHardestGame,
    category: 'Puzzle',
    rating: 3.5,
    plays: 80000,
  },
  {
    id: '46',
    title: 'XX142B2EXE',
    image: gameXX142B2EXE,
    category: 'Misc',
    rating: 3.2,
    plays: 20000,
  },
];

const recentGames = [
  ...featuredGames.slice().reverse(),
];

const trendingGames = [
  featuredGames[2],
  featuredGames[0],
  featuredGames[3],
  featuredGames[1],
];

interface HomePageProps {
  onGamePlay?: (gameId: string) => void;
  favorites: string[];
  onFavoriteToggle: (gameId: string) => void;
}

export const HomePage = ({ onGamePlay, favorites, onFavoriteToggle }: HomePageProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(featuredGames.length / 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden rounded-3xl">
        <img 
          src={heroBanner}
          alt="Unblocked Games Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-6 max-w-4xl px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white slide-up relative backdrop-blur-[2px] after:absolute after:inset-0 after:bg-white/10 after:backdrop-blur-[2px] after:rounded-lg">
              Play Anywhere,{' '}
              <span className="relative text-white backdrop-blur-[2px]">
                Anytime
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 slide-up" style={{ animationDelay: '0.2s' }}>
              100% Unblocked • Lightning Fast • Ad-Free Gaming
            </p>
            <Button 
              size="lg" 
              className="gradient-primary hover:scale-110 transition-transform duration-200 glow-primary bounce-in text-lg px-8 py-6"
              style={{ animationDelay: '0.4s' }}
            >
              Start Playing Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Games Carousel */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span>Featured Games</span>
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevSlide}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(featuredGames.length / 4) }, (_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredGames
                    .slice(slideIndex * 4, (slideIndex + 1) * 4)
                    .map((game) => (
                      <GameCard
                        key={game.id}
                        {...game}
                        isFavorite={favorites.includes(game.id)}
                        onFavoriteToggle={onFavoriteToggle}
                        onPlay={onGamePlay}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <Clock className="w-8 h-8 text-blue-500" />
          <span>Recently Played</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentGames.map((game) => (
            <GameCard
              key={`recent-${game.id}`}
              {...game}
              isFavorite={favorites.includes(game.id)}
              onFavoriteToggle={onFavoriteToggle}
              onPlay={onGamePlay}
            />
          ))}
        </div>
      </section>

      {/* Trending Games */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-green-500" />
          <span>Trending Now</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingGames.map((game) => (
            <GameCard
              key={`trending-${game.id}`}
              {...game}
              isFavorite={favorites.includes(game.id)}
              onFavoriteToggle={onFavoriteToggle}
              onPlay={onGamePlay}
            />
          ))}
        </div>
      </section>
    </div>
  );
};