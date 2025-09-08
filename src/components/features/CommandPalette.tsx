import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Search, 
  Package, 
  FolderOpen, 
  Plus, 
  Settings, 
  BarChart3,
  Home
} from 'lucide-react';
import { commandPaletteOpen, toggleCommandPalette } from '@/store/signals';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
  group: string;
}

const CommandPalette: React.FC = () => {
  useSignals();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'Go to dashboard',
      icon: Home,
      action: () => navigate(ROUTES.DASHBOARD),
      group: 'Navigation',
    },
    {
      id: 'nav-products',
      label: 'Products',
      description: 'View all products',
      icon: Package,
      action: () => navigate(ROUTES.PRODUCTS),
      group: 'Navigation',
    },
    {
      id: 'nav-categories',
      label: 'Categories',
      description: 'View all categories',
      icon: FolderOpen,
      action: () => navigate(ROUTES.CATEGORIES),
      group: 'Navigation',
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      description: 'View analytics dashboard',
      icon: BarChart3,
      action: () => navigate(ROUTES.ANALYTICS),
      group: 'Navigation',
    },
    {
      id: 'nav-settings',
      label: 'Settings',
      description: 'Application settings',
      icon: Settings,
      action: () => navigate(ROUTES.SETTINGS),
      group: 'Navigation',
    },
    // Actions
    {
      id: 'action-create-product',
      label: 'Create Product',
      description: 'Add a new product',
      icon: Plus,
      action: () => navigate(ROUTES.PRODUCT_CREATE),
      shortcut: '⌘ + P',
      group: 'Actions',
    },
    {
      id: 'action-create-category',
      label: 'Create Category',
      description: 'Add a new category',
      icon: Plus,
      action: () => navigate(ROUTES.CATEGORY_CREATE),
      shortcut: '⌘ + C',
      group: 'Actions',
    },
  ];

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const group = command.group;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  const executeCommand = (command: Command) => {
    command.action();
    toggleCommandPalette();
    setQuery('');
    setSelectedIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen.value) {
        // Open command palette
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          toggleCommandPalette();
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          toggleCommandPalette();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen.value, filteredCommands, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {commandPaletteOpen.value && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={toggleCommandPalette}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg border bg-background shadow-lg"
          >
            {/* Search Input */}
            <div className="flex items-center border-b px-4">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Commands */}
            <div className="max-h-80 overflow-y-auto p-2">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              ) : (
                Object.entries(groupedCommands).map(([group, commands]) => (
                  <div key={group} className="mb-2">
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {group}
                    </div>
                    {commands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <motion.div
                          key={command.id}
                          className={cn(
                            'flex cursor-pointer items-center rounded-md px-2 py-2 text-sm transition-colors',
                            isSelected
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          )}
                          onClick={() => executeCommand(command)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <command.icon className="mr-2 h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium">{command.label}</div>
                            {command.description && (
                              <div className="text-xs text-muted-foreground">
                                {command.description}
                              </div>
                            )}
                          </div>
                          {command.shortcut && (
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                              {command.shortcut}
                            </kbd>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2 text-xs text-muted-foreground">
              Press <kbd className="rounded bg-muted px-1">↑</kbd> <kbd className="rounded bg-muted px-1">↓</kbd> to navigate, <kbd className="rounded bg-muted px-1">Enter</kbd> to select, <kbd className="rounded bg-muted px-1">Esc</kbd> to close
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;