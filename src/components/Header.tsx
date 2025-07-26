import { Search, Moon, Sun, Menu, X, Globe, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from 'react';

interface HeaderProps {
  onWebSearch?: (url: string) => void;
  onProxySearch?: (query: string) => void;
  onSearch?: (query: string) => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Header = ({ onSearch, onMenuToggle, isMenuOpen, onWebSearch, onProxySearch }: HeaderProps) => {
  const [searchMode, setSearchMode] = useState<'games' | 'web'>('games');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchMode === 'web') {
        // Always navigate to /tl regardless of input
        navigate('/tl');
      } else {
        // If in 'games' mode, call the onSearch prop
        onSearch?.(searchQuery);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1
                className="text-lg md:text-xl lg:text-3xl font-bold hidden xs:block"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 100%)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  boxShadow: `
                    inset 0 0 30px rgba(255, 255, 255, 0.3),
                    inset 0 0 20px rgba(255, 255, 255, 0.3),
                    0 5px 15px rgba(0, 0, 0, 0.2),
                    0 15px 35px rgba(255, 255, 255, 0.1)
                  `,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  textShadow: `
                    2px 2px 4px rgba(0, 0, 0, 0.2),
                    -2px -2px 4px rgba(255, 255, 255, 0.1)
                  `,
                  transform: 'perspective(1000px) translateZ(10px)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  letterSpacing: '0.5px',
                  fontWeight: '800',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Unblocked Games
              </h1>
            </Link>

            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={searchMode === 'games' ? 'Search games...' : 'Enter URL or search term...'}
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-10 top-0"
                  onClick={() => setSearchMode(searchMode === 'games' ? 'web' : 'games')}
                >
                  {searchMode === 'games' ? <Gamepad className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                </Button>
              </div>
              <Button type="submit" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </form>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
