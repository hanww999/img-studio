// app/page.tsx (Corrected Version)

// Copyright 2025 Google LLC
// ... (license header)

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Image from 'next/image';
import { pages } from './routes'; // 导入您的路由配置

// 专为新主页设计的导航栏组件 (已修正)
const HomePageHeader = () => {
  // 创建一个要显示的页面列表
  const navLinks = [
    pages.GenerateImage,
    pages.GenerateVideo,
    pages.Edit,
    pages.Library,
    pages.VirtualTryOn,
  ];

  return (
    <Box
      component="header"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        p: '20px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
      }}
    >
      {/* 左侧 Logo */}
      <Link href="/" passHref>
        <Image src="/ImgStudioLogoReversedMini.svg" alt="ImgStudio Logo" width={180} height={40} />
      </Link>

      {/* 右侧导航链接 (动态生成) */}
      <Box component="nav" sx={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {navLinks.map((page) =>
          // 检查 status 字段，只有当 status 为 'true' 或未定义时才显示
          page.status === 'true' || page.status === undefined ? (
            <Link key={page.name} href={page.href} style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
              {/* 使用 routes.tsx 中定义的 name */}
              {page.name}
            </Link>
          ) : null
        )}
        <Link href="#" passHref>
           <Box component="button" sx={{
              color: 'white',
              border: '1px solid white',
              backgroundColor: 'transparent',
              borderRadius: '20px',
              padding: '8px 20px',
              cursor: 'pointer',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
           }}>
            Free Trial
           </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default function Page() {
  return (
    <Box
      component="main"
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'black', // Fallback background color
      }}
    >
      {/* 视频背景 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 导航栏 */}
      <HomePageHeader />

      {/* 内容覆盖层 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box component="h1" sx={{ typography: 'h1', fontWeight: 'bold', fontSize: { xs: '3rem', md: '4.5rem' }, mb: 2 }}>
          AI Video Generator
        </Box>
        <Box component="h2" sx={{ typography: 'h3', fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' }, mb: 3 }}>
          Create Amazing Videos with AI
        </Box>
        <Box component="p" sx={{ typography: 'h6', maxWidth: '650px', mb: 5, px: 2 }}>
          Turn your text, images, or video prompts into high-quality videos in simple prompts. No technical skills required.
        </Box>

        {/* 主要行动号召按钮 */}
        <Link href={pages.GenerateImage.href} passHref>
          <Box
            component="button"
            sx={{
              padding: '18px 70px',
              fontSize: '1.5rem',
              color: 'white',
              background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(0, 198, 255, 0.5)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 25px rgba(0, 198, 255, 0.7)',
              },
            }}
          >
            {/* 您可以修改按钮文本 */}
            Try ImgStudio AI
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
