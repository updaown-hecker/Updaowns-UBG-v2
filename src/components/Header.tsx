import { useState } from 'react';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Header = ({ onSearch, onMenuToggle, isMenuOpen }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ pathname: '/search', search: `?search=${searchQuery}` });
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
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
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
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-0 bg-background/50"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link to="/profile">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};