import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
} from 'lucide-react'; // Added missing imports
import { useEffect } from 'react'; // Added missing import

// Define interfaces for settings
interface PanicKeySettings { key: string; url: string }
interface TabCloakerSettings { title: string; icon: string }

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // State for new settings
  const [isSettingPanicKey, setIsSettingPanicKey] = useState(false); // New state to track if panic key input is focused
  const [aboutBlankEnabled, setAboutBlankEnabled] = useState(false);
  const [panicKeySettings, setPanicKeySettings] = useState<PanicKeySettings>({ key: '', url: 'https://www.google.com/' });
  const [tabCloakerSettings, setTabCloakerSettings] = useState<TabCloakerSettings>({ title: 'Default (No Cloak)', icon: '' });
  const [backgroundMediaUrl, setBackgroundMediaUrl] = useState('');
  const [backgroundMediaFile, setBackgroundMediaFile] = useState<File | null>(null);

  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAboutBlank = localStorage.getItem('settings-aboutBlankEnabled');
    if (savedAboutBlank !== null) setAboutBlankEnabled(JSON.parse(savedAboutBlank));

    const savedPanicKey = localStorage.getItem('settings-panicKey');
    const savedPanicUrl = localStorage.getItem('settings-panicUrl');
    if (savedPanicKey || savedPanicUrl) {
      setPanicKeySettings({ key: savedPanicKey || '', url: savedPanicUrl || 'https://www.google.com/' });
    }

    const savedCloakTitle = localStorage.getItem('settings-cloakTitle');
    const savedCloakIcon = localStorage.getItem('settings-cloakIcon');
    if (savedCloakTitle || savedCloakIcon) {
      setTabCloakerSettings({ title: savedCloakTitle || 'Default (No Cloak)', icon: savedCloakIcon || '' });
    }

    const savedBackgroundMedia = localStorage.getItem('settings-backgroundMedia');
    if (savedBackgroundMedia) {
      const { url, file } = JSON.parse(savedBackgroundMedia);
      setBackgroundMediaUrl(url);
    }

    const savedBackgroundMediaUrl = localStorage.getItem('settings-backgroundMediaUrl');
    if (savedBackgroundMediaUrl) setBackgroundMediaUrl(savedBackgroundMediaUrl);
  }, []);

  // Save settings to localStorage on change
  useEffect(() => {
    localStorage.setItem('settings-aboutBlankEnabled', JSON.stringify(aboutBlankEnabled));
  }, [aboutBlankEnabled]);

  useEffect(() => {
    localStorage.setItem('settings-panicKey', panicKeySettings.key);
    localStorage.setItem('settings-panicUrl', panicKeySettings.url);
  }, [panicKeySettings]);

  useEffect(() => {
    localStorage.setItem('settings-cloakTitle', tabCloakerSettings.title);
    localStorage.setItem('settings-cloakIcon', tabCloakerSettings.icon);
    // Apply the cloaking immediately
    document.title = tabCloakerSettings.title;
    const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (link) link.href = tabCloakerSettings.icon;
  }, [tabCloakerSettings]);

  useEffect(() => {
    const savedBackgroundMedia = localStorage.getItem('settings-backgroundMedia');
    let mediaUrlToApply = backgroundMediaUrl;

    if (!backgroundMediaUrl && savedBackgroundMedia) {
      const { url } = JSON.parse(savedBackgroundMedia);
      mediaUrlToApply = url;
    }

    localStorage.setItem('settings-backgroundMedia', JSON.stringify({ url: mediaUrlToApply, file: null })); // Assuming we store the file as a URL or data URL

    if (backgroundMediaUrl) {
      document.body.style.backgroundImage = `url('${backgroundMediaUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
    } else {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundSize = 'auto';
      document.body.style.backgroundPosition = 'initial';
      document.body.style.backgroundRepeat = 'repeat';
    }
  }, [backgroundMediaUrl, backgroundMediaFile]); // Depend on both URL and File state

  useEffect(() => {
    if (backgroundMediaUrl) {
      document.body.style.cssText += `
        body {
          background-image: url('${backgroundMediaUrl}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `;
      document.head.appendChild(style);
    }
    // Apply background media immediately
    if (backgroundMediaUrl) {
      document.body.style.backgroundImage = `url('${backgroundMediaUrl}')`;
    } else {
      document.body.style.backgroundImage = 'none';

    }
  }, [backgroundMediaUrl]);

  const handleClearCache = () => {
    // Clear all relevant localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('settings-') || key.startsWith('unblocked-games-')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('unblocked-games-recent');
    // Add clearing for new settings as well if they should be included in cache clear
    localStorage.removeItem('settings-aboutBlankEnabled');
    localStorage.removeItem('settings-panicKey');
    localStorage.removeItem('settings-panicUrl');
    localStorage.removeItem('settings-cloakTitle');
    localStorage.removeItem('settings-cloakIcon');
    localStorage.removeItem('settings-backgroundMedia');
    // Reset state to default values
    setAboutBlankEnabled(false);
    setPanicKeySettings({ key: '', url: 'https://www.google.com/' });
    setTabCloakerSettings({ title: 'Default (No Cloak)', icon: '' });
    setBackgroundMediaUrl('');
    setBackgroundMediaFile(null);
    alert('All cached data and settings cleared successfully!');
  };

  const handleExportData = () => {
    const data = {
      favorites: localStorage.getItem('unblocked-games-favorites') || '[]',
      settings: {
        theme,
        soundEnabled,
        performanceMode,
        autoSave,
        aboutBlankEnabled,
        panicKeySettings,
        tabCloakerSettings,
        backgroundMediaUrl,
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

  const handleOpenPopup = () => {
    const currentUrl = window.location.href;
    const aboutBlankWindow = window.open('about:blank', '_blank');
    if (aboutBlankWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${tabCloakerSettings.title}</title>
          <link rel="icon" type="image/png" href="${tabCloakerSettings.icon}">
          <style>
            body { margin: 0; overflow: hidden; }
            iframe { width: 100vw; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${currentUrl}"></iframe>
        </body>
        </html>
      `;
      aboutBlankWindow.document.write(htmlContent);
      aboutBlankWindow.document.close();
    }
  };

  const handlePanicKey = (event: KeyboardEvent) => {
    if (!isSettingPanicKey && event.key === panicKeySettings.key && panicKeySettings.url) { // Check if not setting the panic key
      window.location.href = panicKeySettings.url;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handlePanicKey);
    return () => {
      window.removeEventListener('keydown', handlePanicKey);
    };
  }, [panicKeySettings]); // Re-attach event listener if panic key settings change
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent transform-gpu hover:scale-105 transition-transform duration-300" style={{
          textShadow: `
            0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0,0,0,.1),
            0 0 5px rgba(0,0,0,.1),
            0 1px 3px rgba(0,0,0,.3),
            0 3px 5px rgba(0,0,0,.2),
            0 5px 10px rgba(0,0,0,.25)
          `,
          transform: 'perspective(1000px) rotateX(15deg) translateZ(50px)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          borderRadius: '10px',
          padding: '0.5em',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>Settings</h1>
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

      {/* About:Blank Settings */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">About:Blank</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Cloak on Startup</Label>
                <p className="text-sm text-muted-foreground">
                  Cloak the site in an about:blank page when the application starts (enabled by default).
                </p>
              </div>
              <Switch
                checked={aboutBlankEnabled}
                onCheckedChange={setAboutBlankEnabled}
              />
            </div>
            <Button onClick={handleOpenPopup}>Open Popup</Button>
          </div>
        </div>
      </Card>

      {/* Set Panic Key */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">Set Panic Key</h3>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Press any key to set it as your panic key. This key will redirect you to Google when pressed.</Label>
            <Input
              placeholder="Click here and press a key"
              value={panicKeySettings.key}
              onFocus={() => setIsSettingPanicKey(true)} // Set state when input is focused
              onBlur={() => setIsSettingPanicKey(false)} // Unset state when input loses focus
              onKeyDown={(e) => {
                e.preventDefault();
                setPanicKeySettings({ ...panicKeySettings, key: e.key });
              }}
              readOnly={true} // Keep readOnly to prevent direct typing
            />
            <Input
              placeholder="https://www.google.com/"
              value={panicKeySettings.url}
              onChange={(e) => setPanicKeySettings({ ...panicKeySettings, url: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button onClick={() => { localStorage.setItem('settings-panicKey', panicKeySettings.key); localStorage.setItem('settings-panicUrl', panicKeySettings.url); }}>Save</Button>

              <Button variant="outline" onClick={() => setPanicKeySettings({ key: '', url: 'https://www.google.com/' })}>Reset</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab Cloaker */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">Tab Cloaker</h3>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Change the title and icon of the page.</Label>
            <Select onValueChange={(value) => {
              // Simple example: split value by '|' to get title and icon
              const [title, icon] = value.split('|');
              setTabCloakerSettings({ title: title || 'Default (No Cloak)', icon: icon || '' });
            }}
            value={`${tabCloakerSettings.title}|${tabCloakerSettings.icon}`}
            >
              <SelectTrigger>
                <SelectValue placeholder="Default (No Cloak)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default (No Cloak)|">Default (No Cloak)</SelectItem>
                <SelectItem value="Google|https://www.google.com/favicon.ico">Google</SelectItem>
                <SelectItem value="Drive|https://ssl.gstatic.com/docs/doclist/images/favicon_24.ico">Drive</SelectItem>
                <SelectItem value="Classroom|https://ssl.gstatic.com/classroom/favicon.png">Classroom</SelectItem>
                {/* Add more options here */}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={() => { localStorage.setItem('settings-cloakTitle', tabCloakerSettings.title); localStorage.setItem('settings-cloakIcon', tabCloakerSettings.icon); }}>Save Cloak</Button>

            </div>
          </div> {/* Added missing closing div tag */}
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

      {/* Set Background Media */}
      <Card className="glass-card p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">Set Background Media</h3>
          </div>

          <div className="space-y-4">
            <Label className="text-base">Set a background image, GIF, or video. Enter a URL or upload a file.</Label>
            <Input
              placeholder="Enter media URL (image, GIF, or video)"
              value={backgroundMediaUrl}
              onChange={(e) => setBackgroundMediaUrl(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="file"
                onChange={(e) => setBackgroundMediaFile(e.target.files ? e.target.files[0] : null)}
              />
              <Button onClick={() => {
                if (backgroundMediaFile) {
                  const reader = new FileReader();
                  reader.onloadend = () => { // Use onloadend to ensure the file is fully read
                    // Save the file data as a Data URL in localStorage
                    localStorage.setItem('settings-backgroundMedia', JSON.stringify({ url: reader.result as string, file: backgroundMediaFile.name }));
                    setBackgroundMediaUrl(reader.result as string);
                  };
                  reader.readAsDataURL(backgroundMediaFile);
                } else if (backgroundMediaUrl) {
                   // If a URL is entered, save and apply it
                    setBackgroundMediaUrl(reader.result as string);
                  };
                  reader.readAsDataURL(backgroundMediaFile);
                }
              }}>Upload File</Button>
            </div>
            {/* Add a preview of the selected background media */}
            {backgroundMediaUrl && (
              <div className="mt-4">Selected Background: <span className="text-muted-foreground">{backgroundMediaUrl.substring(0, 50)}...</span></div>
            )}
            <div className="flex space-x-2">
              <Button onClick={() => localStorage.setItem('settings-backgroundMedia', JSON.stringify({ url: backgroundMediaUrl, file: backgroundMediaFile?.name || null }))}>Save Background</Button>
              <Button variant="outline" onClick={() => setBackgroundMediaUrl('')}>Reset</Button>
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