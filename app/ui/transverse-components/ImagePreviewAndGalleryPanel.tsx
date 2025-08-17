'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Typography, Paper, Card, CardMedia, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { ImageI } from '../../api/generate-image-utils';
// [REMOVED] We no longer need the full OutputImagesDisplay component inside this panel.
import OutputImagesDisplay from './ImagenOutputImagesDisplay';

const imageSampleMedias = [
  { id: 1, src: '/samples/789.jpeg', prompt: 'A photo of a deer running in the forest, fast shutter speed, movement tracking' },
  { id: 2, src: '/samples/456.png', prompt: "A photo of a photorealistic 3d render for an e-commerce website, showcasing a white, fluffy teddy bear toy sleeping peacefully on the floor of a beautifully decorated baby's bedroom. The room is filled with soft, pastel-colored toy boxes and other toys scattered playfully around. The composition is a gentle, slightly high-angle shot. The scene is illuminated by soft, diffused light from a large window, creating a warm and inviting atmosphere.Rendered in 8k with hyperdetailed fur textures to emphasize the toy's softness and quality." },
  { id: 3, src: '/samples/123.png', prompt: "A photo of a photograph of a stately library entrance with the words 'central library' carved into the stone" },
];

const FeaturedImagePlayer = ({ imageSrc }: { imageSrc: string }) => (
  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src={imageSrc}
      alt="Featured Sample"
      style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px', objectFit: 'contain' }}
    />
  </Box>
);

const ImageCard = ({ sample, onClick, isActive }: { sample: typeof imageSampleMedias[0], onClick: () => void, isActive: boolean }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      width: 260, 
      flexShrink: 0, 
      transition: 'all 0.2s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      border: isActive ? '3px solid #1976d2' : '3px solid transparent',
      '&:hover': { transform: 'scale(1.05)', boxShadow: 6, zIndex: 10 } 
    }}
  >
    <CardMedia
      component="img"
      image={sample.src}
      alt={sample.prompt}
      sx={{ width: '100%', height: 145, objectFit: 'cover' }}
    />
    <Box sx={{ p: 1, flexGrow: 1 }}>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {sample.prompt}
      </Typography>
    </Box>
  </Card>
);

// [REMOVED] onSampleSelect is no longer needed in the props.
interface ImagePreviewPanelProps {
  // No props are needed anymore as this is a self-contained initial state display.
}

export default function ImagePreviewAndGalleryPanel({}: ImagePreviewPanelProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [featuredSample, setFeaturedSample] = useState(imageSampleMedias[0]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // [MODIFIED] This handler now ONLY updates the local state.
  const handleCardClick = (sample: typeof imageSampleMedias[0]) => {
    setFeaturedSample(sample);
  };

  return (
    <Paper variant="outlined" sx={{ height: 'calc(100vh - 48px)', padding: 2.5, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Box sx={{ 
        height: 'calc(100% - 260px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Sample Image
        </Typography>
        <Box sx={{
          flexGrow: 1,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#e0e0e0', 
          borderRadius: 2, 
          overflow: 'hidden',
          position: 'relative',
        }}>
          <FeaturedImagePlayer imageSrc={featuredSample.src} />
        </Box>
        <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#e0e0e0', borderRadius: 2, maxHeight: '6em', overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Prompt:</strong> {featuredSample.prompt}
            </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
          Inspiration Gallery
        </Typography>
        <Box 
          sx={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'white' },
              opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <ArrowBackIosNew />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'white' },
              opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <ArrowForwardIos />
          </IconButton>

          <Box 
            ref={scrollContainerRef}
            sx={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: 2, 
              py: 1,
              height: '100%',
              scrollSnapType: 'x mandatory',
              '& > *': { scrollSnapAlign: 'start' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {imageSampleMedias.map(sample => (
              <ImageCard 
                key={sample.id} 
                sample={sample}
                onClick={() => handleCardClick(sample)}
                isActive={sample.id === featuredSample.id}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
