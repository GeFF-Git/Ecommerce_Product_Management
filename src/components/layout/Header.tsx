import React from 'react';
import { motion } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Search, 
  Bell, 
  Settings, 
  Sun, 
  Moon, 
  Monitor,
  Command,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  sidebarOpen, 
  themeMode, 
  setTheme, 
  searchQuery, 
  setSearchQuery,
  notifications,
  toggleCommandPalette
} from '@/store/signals';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  useSignals();
  const [searchFocused, setSearchFocused] = React.useState(false);

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(themeMode.value);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (themeMode.value) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();
  const unreadNotifications = notifications.value.filter(n => !n.read).length;

  return (
    <motion.header
      animate={{ paddingLeft: sidebarOpen.value ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, categories..."
            value={searchQuery.value}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              'pl-10 pr-4 transition-all duration-200',
              searchFocused && 'ring-2 ring-primary'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCommandPalette}
          className="relative"
        >
          <Command className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          className="relative"
        >
          <motion.div
            key={themeMode.value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ThemeIcon className="h-4 w-4" />
          </motion.div>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </Badge>
            </motion.div>
          )}
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;