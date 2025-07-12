import { Home, Gamepad, Search, Heart, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'games', label: 'Games', icon: Gamepad },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Navigation = ({ activeTab, onTabChange, isOpen = false }: NavigationProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col space-y-2 glass-card p-4 rounded-2xl">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`w-12 h-12 p-0 transition-all duration-200 ${
                  isActive 
                    ? 'gradient-primary glow-primary' 
                    : 'hover:scale-110'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed inset-x-0 top-16 z-40 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="mx-4 mt-2 glass-card rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={`h-16 flex-col space-y-1 transition-all duration-200 ${
                    isActive 
                      ? 'gradient-primary glow-primary' 
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40">
        <div className="glass-card border-t border-border/50 px-4 py-2">
          <div className="flex justify-around">
            {navigationItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`flex-col space-y-1 h-auto py-2 transition-all duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};