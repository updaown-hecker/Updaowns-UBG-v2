import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Monitor, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Zap, 
  Shield, 
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleClearCache = () => {
    localStorage.removeItem('unblocked-games-favorites');
    localStorage.removeItem('unblocked-games-recent');
    alert('Cache cleared successfully!');
  };

  const handleExportData = () => {
    const data = {
      favorites: localStorage.getItem('unblocked-games-favorites') || '[]',
      settings: {
        theme,
        soundEnabled,
        performanceMode,
        autoSave,
      },
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unblocked-games-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient">Settings</h1>
        <p className="text-xl text-muted-foreground">
          Customize your gaming experience
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <Label className="text-base">Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className={`h-20 flex-col space-y-2 ${theme === 'light' ? 'gradient-primary' : ''}`}
              >
                <Sun className="w-6 h-6" />
                <span>Light</span>
              </Button>
              
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className={`h-20 flex-col space-y-2 ${theme === 'dark' ? 'gradient-primary' : ''}`}
              >
                <Moon className="w-6 h-6" />
                <span>Dark</span>
              </Button>
              
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className={`h-20 flex-col space-y-2 ${theme === 'system' ? 'gradient-primary' : ''}`}
              >
                <Monitor className="w-6 h-6" />
                <span>System</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Audio Settings */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <h3 className="text-xl font-semibold">Audio</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Enable sound effects for games and interface
              </p>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Performance Settings */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Performance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Performance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce animations and effects for better performance
                </p>
              </div>
              <Switch
                checked={performanceMode}
                onCheckedChange={setPerformanceMode}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Auto-save Progress</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save your game progress and preferences
                </p>
              </div>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <h3 className="text-xl font-semibold">Privacy & Data</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Export Game Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download your favorites and settings as a backup
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Clear Cache</Label>
                <p className="text-sm text-muted-foreground">
                  Clear stored game data and preferences
                </p>
              </div>
              <Button variant="outline" onClick={handleClearCache}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" />
            <h3 className="text-xl font-semibold">App Information</h3>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>Today</span>
            </div>
            <div className="flex justify-between">
              <span>Games Available</span>
              <span>500+</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Made with ❤️ for students and casual gamers
            </p>
            <Button variant="outline" className="gradient-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};