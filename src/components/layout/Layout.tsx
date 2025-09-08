import React from 'react';
import { motion } from 'framer-motion';
import { useSignals } from '@preact/signals-react/runtime';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import CommandPalette from '../features/CommandPalette';
import { sidebarOpen } from '@/store/signals';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useSignals();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <motion.main
          animate={{ paddingLeft: sidebarOpen.value ? 280 : 80 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 p-6"
          id="main-content"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.main>
      </div>
      
      {/* Global Components */}
      <CommandPalette />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
};

export default Layout;