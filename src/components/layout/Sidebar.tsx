import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { 
  Home, 
  Package, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Plus,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarOpen, toggleSidebar } from '@/store/signals';
import { ROUTES } from '@/constants';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    id: 'products',
    label: 'Products',
    path: ROUTES.PRODUCTS,
    icon: Package,
    children: [
      {
        id: 'products-list',
        label: 'All Products',
        path: ROUTES.PRODUCTS,
        icon: List,
      },
      {
        id: 'products-create',
        label: 'Add Product',
        path: ROUTES.PRODUCT_CREATE,
        icon: Plus,
      },
    ],
  },
  {
    id: 'categories',
    label: 'Categories',
    path: ROUTES.CATEGORIES,
    icon: FolderOpen,
    children: [
      {
        id: 'categories-list',
        label: 'All Categories',
        path: ROUTES.CATEGORIES,
        icon: List,
      },
      {
        id: 'categories-create',
        label: 'Add Category',
        path: ROUTES.CATEGORY_CREATE,
        icon: Plus,
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];

const Sidebar: React.FC = () => {
  useSignals();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['products', 'categories']);

  const isItemActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === '/' || location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname.startsWith(path);
  };

  const isParentActive = (item: NavigationItem) => {
    if (item.children) {
      return item.children.some(child => isItemActive(child.path));
    }
    return isItemActive(item.path);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item.path);
    const isParentItemActive = isParentActive(item);
    const IconComponent = item.icon;

    return (
      <div key={item.id}>
        <div
          className={cn(
            'group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
            level > 0 && 'ml-4',
            isActive || isParentItemActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {item.children ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="flex w-full items-center"
            >
              <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen.value && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {sidebarOpen.value && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              )}
            </button>
          ) : (
            <Link to={item.path} className="flex w-full items-center">
              <IconComponent className="mr-3 h-4 w-4 flex-shrink-0" />
              <AnimatePresence>
                {sidebarOpen.value && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}
          
          {/* Active indicator */}
          {(isActive || isParentItemActive) && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-0 h-full w-1 bg-primary-foreground rounded-r-full"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </div>

        {/* Children */}
        <AnimatePresence>
          {item.children && isExpanded && sidebarOpen.value && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 space-y-1 border-l border-border pl-4">
                {item.children.map(child => renderNavigationItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      animate={{ width: sidebarOpen.value ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <AnimatePresence>
            {sidebarOpen.value && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">ProductHub</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-accent transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarOpen.value ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <AnimatePresence>
            {sidebarOpen.value && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground text-center"
              >
                ProductHub v1.0.0
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;