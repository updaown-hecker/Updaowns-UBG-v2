import { useSearchParams } from 'react-router-dom';
import { allGames } from '@/components/GamesPage';
import { GameCard } from '@/components/GameCard';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsPageProps {
  onGamePlay?: (gameId: string) => void;
}

const SearchResultsPage = ({ onGamePlay }: SearchResultsPageProps) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const filteredGames = allGames.filter(game => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      game.title.toLowerCase().includes(lowerCaseQuery) ||
      game.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">Search Results</h1>
        <p className="text-xl text-muted-foreground">
          Showing results for "{searchQuery}"
        </p>
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full glass-card flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <div key={game.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* You will need to handle onPlay and favorite toggles here */}
              {/* For now, we'll just pass the game data */}
              <GameCard
                {...game}
                // onPlay will need to navigate to /?game-id=game.id
 onPlay={onGamePlay}
                // favorites and onFavoriteToggle will need to be managed higher up
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;