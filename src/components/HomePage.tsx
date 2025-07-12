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

const featuredGames = [
  {
    id: '1',
    title: 'Neon Racer',
    image: gameRacing,
    category: 'Racing',
    rating: 4.8,
    plays: 125000,
  },
  {
    id: '2',
    title: 'Puzzle Master',
    image: gamePuzzle,
    category: 'Puzzle',
    rating: 4.6,
    plays: 89000,
  },
  {
    id: '3',
    title: 'Retro Jump',
    image: gamePlatformer,
    category: 'Platformer',
    rating: 4.9,
    plays: 156000,
  },
  {
    id: '4',
    title: 'Mystic Quest',
    image: gameAdventure,
    category: 'Adventure',
    rating: 4.7,
    plays: 98000,
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
            <h1 className="text-5xl md:text-7xl font-bold text-white slide-up">
              Play Anywhere,{' '}
              <span className="text-gradient">
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