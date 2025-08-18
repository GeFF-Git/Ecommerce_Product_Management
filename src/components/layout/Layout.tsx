import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useSignals } from '@preact/signals-react/runtime';
import { sidebarOpen } from '@/store/signals';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useSignals();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen.value 
            ? `${theme.custom.sidebar.width}px` 
            : `${theme.custom.sidebar.collapsedWidth}px`,
          mt: `${theme.custom.header.height}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: `calc(100vh - ${theme.custom.header.height}px)`,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            p: 3,
            maxWidth: '100%',
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;