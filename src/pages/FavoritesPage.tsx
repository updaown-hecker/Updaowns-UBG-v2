import React from 'react';
import { GameCard } from '@/components/GameCard';
import { Game } from '@/components/GamesPage'; // Assuming Game interface is defined in GamesPage

interface FavoritesPageProps {
  favorites: string[];
  allGames: Game[]; // Assuming allGames data is passed as a prop
  onGamePlay: (gameId: string) => void;
  onFavoriteToggle: (gameId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  allGames,
  onGamePlay,
  onFavoriteToggle,
}) => {
  const favoriteGames = allGames.filter(game => favorites.includes(game.id));

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Favorite Games</h2>
      {favoriteGames.length === 0 ? (
        <p className="text-center text-muted-foreground">
          You haven't favorited any games yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteGames.map(game => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onFavoriteToggle={onFavoriteToggle}
              id={game.id}
              title={game.title}
              image={game.image}
              category={game.category}
              rating={game.rating}
              plays={game.plays}
              onGamePlay={onGamePlay}
            />
          ))}
        </div>
      )}
    </div>
  );
};