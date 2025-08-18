// 文件路径: app/(studio)/layout.tsx 

'use client';

import SideNav, { drawerWidth, drawerWidthClosed } from '../ui/transverse-components/SideNavigation';
import Box from '@mui/material/Box';
import { Suspense, useState } from 'react';
import { CircularProgress, Drawer } from '@mui/material';

const SideNavFallback = () => {
 return (
  <Drawer
   variant="permanent"
   anchor="left"
   sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
     width: drawerWidth,
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
 const [isSideNavOpen, setSideNavOpen] = useState(true);

 return (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
   <Suspense fallback={<SideNavFallback />}>
    <SideNav open={isSideNavOpen} setOpen={setSideNavOpen} />
   </Suspense>
    
   <Box 
    component="main" 
    sx={{ 
     flexGrow: 1, 
     width: `calc(100% - ${isSideNavOpen ? drawerWidth : drawerWidthClosed}px)`,
     bgcolor: 'background.default',
     p: 3,
     transition: (theme) => theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
     }),
    }}
   >
    {children}
   </Box>
  </Box>
 );
}
