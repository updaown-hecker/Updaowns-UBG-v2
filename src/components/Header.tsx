import { useState } from 'react';
import { Search, Settings, Heart, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Header = ({ onSearch, onMenuToggle, isMenuOpen }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
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
              <h1 className="text-xl font-bold text-gradient hidden sm:block">
                Unblocked Games
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="w-4 h-4" />
              <span className="ml-2 hidden md:inline">Favorites</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4" />
              <span className="ml-2 hidden md:inline">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};