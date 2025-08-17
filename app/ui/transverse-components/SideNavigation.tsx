

'use client';

import * as React from 'react';
// [修改] 导入 useSearchParams
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Drawer, List, ListItem, Typography, ListItemButton, Stack, IconButton, Box } from '@mui/material';

import Image from 'next/image';
import icon from '../../../public/CloudPuppy.png';
import { pages } from '../../routes';

import theme from '../../theme';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
const { palette } = theme;

const drawerWidth = 265;
const drawerWidthClosed = 75;

const CustomizedDrawer = {
  background: palette.background.paper,
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paperAnchorLeft': {
    width: drawerWidth,
    border: 0,
  },
};

const CustomizedDrawerClosed = {
  background: palette.background.paper,
  width: drawerWidthClosed,
  flexShrink: 0,
  '& .MuiDrawer-paperAnchorLeft': {
    width: drawerWidthClosed,
    border: 0,
  },
};

const CustomizedMenuItem = {
  px: 3,
  py: 2,
  '&:hover': { bgcolor: 'rgba(0,0,0,0.25)' },
  '&.Mui-selected, &.Mui-selected:hover': {
    bgcolor: 'rgba(0,0,0,0.5)',
  },
  '&.Mui-disabled': { bgcolor: 'transparent' },
  '&:hover, &.Mui-selected, &.Mui-selected:hover, &.Mui-disabled': {
    transition: 'none',
  },
};

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  // [新增] 获取 URL 查询参数
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(true);

  // [新增] 组合基础路径和查询参数，用于精确匹配
  const currentQuery = searchParams.get('mode');
  const fullPath = currentQuery ? `${pathname}?mode=${currentQuery}` : pathname;

  return (
    <Drawer variant="permanent" anchor="left" sx={open ? CustomizedDrawer : CustomizedDrawerClosed}>
      {!open && (
        <Box
          onClick={() => setOpen(!open)}
          sx={{
            pt: 6,
            cursor: 'pointer',
          }}
        >
          <Image
            priority
            src={icon}
            width={110}
            alt="ImgStudio"
            style={{
              transform: 'rotate(-90deg)',
            }}
          />
        </Box>
      )}
      {open && (
        <List dense>
          <ListItem onClick={() => setOpen(!open)} sx={{ px: 2.5, pt: 2, cursor: 'pointer' }}>
            <Image priority src={icon} width={200} alt="ImgStudio" />
          </ListItem>

          {Object.values(pages).map(({ name, description, href, status }) => {
            // [修改] 更新判断选中状态的逻辑，以精确匹配带查询参数的 href
            const isSelected = fullPath === href;

            return (
              <ListItemButton
                key={name}
                selected={isSelected} // [修改] 使用新的 isSelected 变量
                disabled={status == 'false'}
                onClick={() => router.push(href)}
                sx={CustomizedMenuItem}
              >
                <Stack alignItems="left" direction="column" sx={{ pr: 4 }}>
                  <Stack alignItems="center" direction="row" gap={1.2} pb={0.5}>
                    <Typography
                      variant="body1"
                      color={isSelected ? 'white' : palette.secondary.light} // [修改] 使用 isSelected
                      fontWeight={isSelected ? 500 : 400} // [修改] 使用 isSelected
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isSelected ? palette.primary.light : palette.secondary.light} // [修改] 使用 isSelected
                    >
                      {status == 'false' ? '/ SOON' : ''}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    color={isSelected ? palette.secondary.light : palette.secondary.main} // [修改] 使用 isSelected
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {description}
                  </Typography>
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      )}

      {open && (
        <Typography
          variant="caption"
          align="left"
          sx={{
            position: 'absolute',
            bottom: 15,
            left: 15,
            fontSize: '0.6rem',
            fontWeight: 400,
            color: palette.secondary.light,
          }}
        >
          / 欢迎合作 <span style={{ margin: 1, color: palette.primary.main }}>❤</span>{' '}
          <a
            href="https://cloudpuppy.ai/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'white',
              fontWeight: 700,
              textDecoration: 'none',
              margin: 2,
            }}
          >
            @CloudPuppy
          </a>
        </Typography>
      )}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'absolute',
          bottom: 5,
          p: 0,
          right: 15,
          fontSize: '0.6rem',
          fontWeight: 400,
          color: palette.secondary.light,
        }}
      >
        {open ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
    </Drawer>
  );
}
