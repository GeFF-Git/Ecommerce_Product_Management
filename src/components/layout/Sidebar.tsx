import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  Inventory as ProductIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useSignals } from '@preact/signals-react/runtime';
import { sidebarOpen, currentPage, setCurrentPage } from '@/store/signals';
import { ROUTES } from '@/utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: DashboardIcon,
  },
  {
    id: 'categories',
    label: 'Categories',
    path: ROUTES.CATEGORIES,
    icon: CategoryIcon,
    children: [
      {
        id: 'categories-list',
        label: 'View All',
        path: ROUTES.CATEGORIES,
        icon: ListIcon,
      },
      {
        id: 'categories-create',
        label: 'Create New',
        path: `${ROUTES.CATEGORIES}/create`,
        icon: AddIcon,
      },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    path: ROUTES.PRODUCTS,
    icon: ProductIcon,
    children: [
      {
        id: 'products-list',
        label: 'View All',
        path: ROUTES.PRODUCTS,
        icon: ListIcon,
      },
      {
        id: 'products-create',
        label: 'Create New',
        path: `${ROUTES.PRODUCTS}/create`,
        icon: AddIcon,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: SettingsIcon,
  },
];

const Sidebar: React.FC = () => {
  useSignals();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['categories', 'products']);

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      // Toggle expansion for parent items
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      // Navigate to the route
      navigate(item.path);
      setCurrentPage(item.id);
    }
  };

  const isItemActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (item: NavigationItem) => {
    if (item.children) {
      return item.children.some(child => isItemActive(child.path));
    }
    return isItemActive(item.path);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isItemActive(item.path);
    const isParentItemActive = isParentActive(item);
    const IconComponent = item.icon;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: 2 + level * 2,
              pr: 2,
              py: 1.5,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              backgroundColor: isActive 
                ? alpha(theme.palette.primary.main, 0.1)
                : 'transparent',
              color: isActive || isParentItemActive
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(4px)',
              },
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              '&::before': isActive ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: '60%',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '0 2px 2px 0',
              } : {},
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'inherit',
                '& svg': {
                  fontSize: '1.3rem',
                },
              }}
            >
              <IconComponent />
            </ListItemIcon>
            
            {sidebarOpen.value && (
              <>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: isActive || isParentItemActive ? 600 : 400,
                    },
                  }}
                />
                {item.children && (
                  <Box sx={{ ml: 1 }}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {/* Render children */}
        {item.children && sidebarOpen.value && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={sidebarOpen.value}
      sx={{
        width: sidebarOpen.value ? theme.custom.sidebar.width : theme.custom.sidebar.collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarOpen.value ? theme.custom.sidebar.width : theme.custom.sidebar.collapsedWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          mt: `${theme.custom.header.height}px`,
          height: `calc(100vh - ${theme.custom.header.height}px)`,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Navigation Header */}
        {sidebarOpen.value && (
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Navigation
            </Typography>
          </Box>
        )}

        {/* Navigation Items */}
        <List sx={{ pt: 0 }}>
          {navigationItems.map(item => renderNavigationItem(item))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        {/* Footer */}
        {sidebarOpen.value && (
          <Box sx={{ p: 2, mt: 'auto' }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: 'block',
                textAlign: 'center',
              }}
            >
              Product Manager v1.0
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;