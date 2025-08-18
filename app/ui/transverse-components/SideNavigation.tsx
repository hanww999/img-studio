// 文件路径: app/ui/transverse-components/SideNavigation.tsx (最终完整版)

'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Drawer, List, ListItem, Typography, ListItemButton, Box } from '@mui/material';
import Image from 'next/image';
import { pages } from '../../routes'; 

// [最终修复] 宽度是固定的
const drawerWidth = 265;

export default function SideNav() {
 const router = useRouter();
 const pathname = usePathname();
 const searchParams = useSearchParams();
 const currentQuery = searchParams.get('mode');
 const fullPath = currentQuery ? `${pathname}?mode=${currentQuery}` : pathname;

 const CustomizedDrawer = {
  width: drawerWidth,
  flexShrink: 0, // 固定宽度，不收缩
  '& .MuiDrawer-paper': {
   width: drawerWidth,
   boxSizing: 'border-box',
   bgcolor: 'background.paper',
   borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  },
 };

 return (
  <Drawer variant="permanent" anchor="left" sx={CustomizedDrawer}>
   <List sx={{ p: 0 }}>
    <ListItem sx={{ height: 80, display: 'flex', alignItems: 'center', px: 2 }}>
     <Image
       priority
       src="/CloudPuppy.svg"
       width={180}
       height={50}
       alt="CloudPuppy 标志"
      />
    </ListItem>

    {Object.values(pages).map(({ name, description, href, status }) => {
     const isSelected = fullPath === href;
     return (
      <ListItemButton
       key={name}
       selected={isSelected}
       disabled={status === 'false'}
       onClick={() => router.push(href)}
       sx={{
        py: 1.5,
        px: 3,
        mb: 1,
        mx: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        '&.Mui-selected': {
         backgroundColor: 'primary.main',
         color: 'white',
         '& .MuiTypography-root': {
          color: 'white',
         },
        },
        '&.Mui-selected:hover': {
         backgroundColor: 'primary.dark',
        },
       }}
      >
       <Typography variant="body1" fontWeight={600} color={isSelected ? 'white' : 'text.primary'}>
        {name}
       </Typography>
       <Typography variant="body2" color={isSelected ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '0.8rem' }}>
        {description}
       </Typography>
      </ListItemButton>
     );
    })}
   </List>

   <Box sx={{ position: 'absolute', bottom: 15, left: 24, width: 'calc(100% - 48px)' }}>
     <Typography variant="caption" color="text.secondary">
      / 欢迎合作 <span style={{ margin: 1 }}>❤</span>{' '}
      <a href="https://cloudpuppy.ai/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none' }}>
       @CloudPuppy
      </a>
     </Typography>
   </Box>
  </Drawer>
 );
}
