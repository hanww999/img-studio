// 文件路径: app/ui/transverse-components/SideNavigation.tsx (最终完整修正版)

'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Drawer, List, ListItem, Typography, ListItemButton, Stack, IconButton, Box } from '@mui/material';
import Image from 'next/image';
import { pages } from '../../routes';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// [核心修正] 导出宽度常量，供父布局使用
export const drawerWidth = 265;
export const drawerWidthClosed = 75;

// [核心修正] 接收 open 和 setOpen 作为 props
interface SideNavProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideNav({ open, setOpen }: SideNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('mode');
  const fullPath = currentQuery ? `${pathname}?mode=${currentQuery}` : pathname;

  const CustomizedDrawer = {
    '& .MuiDrawer-paper': {
      width: open ? drawerWidth : drawerWidthClosed,
      boxSizing: 'border-box',
      bgcolor: 'background.paper',
      borderRight: '1px solid rgba(255, 255, 255, 0.12)',
      transition: (theme: { transitions: { create: (arg0: string, arg1: { easing: any; duration: any; }) => any; easing: { sharp: any; }; duration: { enteringScreen: any; }; }; }) => theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowX: 'hidden',
    },
  };

  return (
    <Drawer variant="permanent" anchor="left" sx={CustomizedDrawer}>
      <List sx={{ p: 0 }}>
        <ListItem sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', px: open ? 2 : 0 }}>
          {open && (
            <Image
              priority
              src="/CloudPuppy.svg"
              width={180}
              height={50}
              alt="CloudPuppy Logo"
            />
          )}
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </ListItem>

        {Object.values(pages).map(({ name, description, href, status }) => {
          const isSelected = fullPath === href;
          return (
            <ListItemButton
              key={name}
              selected={isSelected}
              disabled={status == 'false'}
              onClick={() => router.push(href)}
              sx={{
                py: 1.5,
                px: 3,
                mb: 1,
                mx: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: open ? 'column' : 'row',
                alignItems: open ? 'flex-start' : 'center',
                justifyContent: 'center',
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
              {open && (
                <Typography variant="body2" color={isSelected ? 'rgba(255,255,255,0.8)' : 'text.secondary'} sx={{ fontSize: '0.8rem' }}>
                  {description}
                </Typography>
              )}
            </ListItemButton>
          );
        })}
      </List>

      {open && (
        <Box sx={{ position: 'absolute', bottom: 15, left: 24, width: 'calc(100% - 48px)' }}>
          <Typography variant="caption" color="text.secondary">
            / 欢迎合作 <span style={{ margin: 1 }}>❤</span>{' '}
            <a href="https://cloudpuppy.ai/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none' }}>
              @CloudPuppy
            </a>
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}
