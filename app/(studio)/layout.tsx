// 文件路径: app/(studio)/layout.tsx (最终完整版)

'use client';

import SideNav from '../ui/transverse-components/SideNavigation';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import { CircularProgress, Drawer } from '@mui/material';

// [最终修复] 定义一个固定的侧边栏宽度
const drawerWidth = 265;

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
 return (
    // [最终修复] 整个页面容器，允许在需要时出现横向滚动条
  <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', overflowX: 'auto' }}>
   <Suspense fallback={<SideNavFallback />}>
      {/* [最终修复] SideNav 不再需要 open/setOpen props */}
    <SideNav />
   </Suspense>
    
    {/* [最终修复] 主内容区不再需要动态计算宽度，它会自然填充剩余空间 */}
   <Box 
    component="main" 
    sx={{ 
     flexGrow: 1, 
     bgcolor: 'background.default',
     p: 3,
    }}
   >
    {children}
   </Box>
  </Box>
 );
}
