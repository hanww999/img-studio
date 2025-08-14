// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client';

import SideNav from '../ui/transverse-components/SideNavigation';
import Box from '@mui/material/Box';
// [新增] 导入 Suspense 和加载中 UI 组件
import { Suspense } from 'react';
import { CircularProgress, Drawer } from '@mui/material';

// [新增] 为 SideNav 创建一个加载状态的占位组件 (Fallback)
// 这可以防止在 SideNav 加载时页面布局发生跳动
const SideNavFallback = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 265, // 保持与 SideNav 展开时相同的宽度
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 265,
          boxSizing: 'border-box',
          backgroundColor: '#1D1D1F', // 匹配 SideNav 的背景色
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
    <Box sx={{ display: 'flex' }}>
      {/* [修改] 将 SideNav 组件用 Suspense 包裹起来 */}
      <Suspense fallback={<SideNavFallback />}>
        <SideNav />
      </Suspense>
      {/* [建议的改进] 将 children 也用 Box 包裹，以实现正确的内容布局 */}
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
