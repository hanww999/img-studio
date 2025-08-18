// 文件路径: app/(studio)/layout.tsx (最终完整修正版)

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
  // [核心修正] 在布局层面管理侧边栏的展开/折叠状态
  const [isSideNavOpen, setSideNavOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Suspense fallback={<SideNavFallback />}>
        {/* [核心修正] 将状态和状态设置函数传递给 SideNav */}
        <SideNav open={isSideNavOpen} setOpen={setSideNavOpen} />
      </Suspense>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: `calc(100% - ${isSideNavOpen ? drawerWidth : drawerWidthClosed}px)`, // [核心修正] 动态计算宽度
          bgcolor: 'background.default',
          p: 3,
          transition: (theme) => theme.transitions.create('width', { // [核心修正] 增加平滑过渡效果
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
