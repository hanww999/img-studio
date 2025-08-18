// 文件路径: app/(studio)/layout.tsx (完整版)

'use client';

import SideNav from '../ui/transverse-components/SideNavigation';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import { CircularProgress, Drawer } from '@mui/material';

const SideNavFallback = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 265,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 265,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          border: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <CircularProgress color="primary" />
    </Drawer>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Suspense fallback={<SideNavFallback />}>
        <SideNav />
      </Suspense>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: '100%', 
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
