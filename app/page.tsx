'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Image from 'next/image';
import { pages } from './routes'; // 导入您的路由配置

// 专为新主页设计的导航栏组件 (已按要求更新)
const HomePageHeader = () => {
  // 1. 调整导航链接的顺序
  const navLinks = [
    pages.GenerateImage,
    pages.GenerateVideo,
    pages.VirtualTryOn, // "Generate a Try-On" 已移到此处
    pages.Edit,
    pages.Library,
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
      {/* 2. 更换 Logo */}
      <Link href="/" passHref>
        <Image 
          src="/cloudpuppy-logo.png" 
          alt="CloudPuppy Logo" 
          width={220} // 调整了宽度以适应新 Logo
          height={60}  // 调整了高度以适应新 Logo
        />
      </Link>

      {/* 右侧导航链接 (动态生成) */}
      <Box component="nav" sx={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {navLinks.map((page) =>
          page.status === 'true' || page.status === undefined ? (
            <Link key={page.name} href={page.href} style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
              {page.name}
            </Link>
          ) : null
        )}
        {/* 3. "Free Trial" 按钮已被移除 */}
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
        bgcolor: 'black',
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
            Try ImgStudio AI
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
