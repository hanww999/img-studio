'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Box, Typography, Paper, Card, IconButton, CardMedia } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { ImageI } from '../../api/generate-image-utils';
import OutputImagesDisplay from './ImagenOutputImagesDisplay'; 

// Please place these sample images in your /public/samples/ directory
const sampleImages = [
  { id: 1, src: '/samples/789.jpeg', prompt: 'A photo of a deer running in the forest, fast shutter speed, movement tracking' },
  { id: 2, src: '/samples/456.png', prompt: "A photo of a photorealistic 3d render for an e-commerce website, showcasing a white, fluffy teddy bear toy sleeping peacefully on the floor of a beautifully decorated baby's bedroom. The room is filled with soft, pastel-colored toy boxes and other toys scattered playfully around. The composition is a gentle, slightly high-angle shot. The scene is illuminated by soft, diffused light from a large window, creating a warm and inviting atmosphere.Rendered in 8k with hyperdetailed fur textures to emphasize the toy's softness and quality." },
  { id: 3, src: '/samples/123.png', prompt: "A photo of a photograph of a stately library entrance with the words 'central library' carved into the stone" },
];

// A sub-component for the gallery cards
const ImageCard = ({ sample, onClick, isActive }: { sample: typeof sampleImages[0], onClick: () => void, isActive: boolean }) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        width: 220, 
        flexShrink: 0, 
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        border: isActive ? '3px solid #00BFFF' : '3px solid transparent',
        backgroundColor: '#333',
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: '0px 8px 20px rgba(0, 255, 255, 0.2)',
          zIndex: 10,
        } 
      }}
    >
      <CardMedia component="img" height="125" image={sample.src} alt={sample.prompt} />
    </Card>
  );
};

interface ImagePreviewAndGalleryPanelProps {
  isLoading: boolean;
  generatedImages: ImageI[];
  generatedCount: number;
  onSampleSelect: (prompt: string) => void; // Callback to update the form
}

export default function ImagePreviewAndGalleryPanel({
  isLoading,
  generatedImages,
  generatedCount,
  onSampleSelect,
}: ImagePreviewAndGalleryPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [featuredSample, setFeaturedSample] = useState(sampleImages[0]);

  const handleCardClick = (sample: typeof sampleImages[0]) => {
    setFeaturedSample(sample);
    onSampleSelect(sample.prompt); // Send the prompt back to the parent
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const hasUserGeneratedContent = generatedImages.length > 0;

  return (
    <Paper variant="outlined" sx={{ 
      height: 'calc(100vh - 48px)', 
      padding: 2.5, 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#1E1E1E',
      borderColor: '#424242',
      borderRadius: 2 
    }}>
      
      <Box sx={{ 
        height: 'calc(100% - 220px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        mb: 2,
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'rgba(255, 255, 255, 0.87)' }}>
          {hasUserGeneratedContent ? 'Your Results' : 'Sample Image'}
        </Typography>
        <Box sx={{
          flexGrow: 1,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: '#000', 
          borderRadius: 2, 
          overflow: 'hidden',
          position: 'relative',
        }}>
          {hasUserGeneratedContent ? (
            <OutputImagesDisplay
              isLoading={isLoading}
              generatedImagesInGCS={generatedImages}
              generatedCount={generatedCount}
              isPromptReplayAvailable={true}
            />
          ) : (
            <img src={featuredSample.src} alt={featuredSample.prompt} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </Box>
        {!hasUserGeneratedContent && (
          <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#333', borderRadius: 2, maxHeight: '6em', overflowY: 'auto' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <strong>Prompt:</strong> {featuredSample.prompt}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ height: '220px', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.87)' }}>
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
              backgroundColor: 'rgba(40, 40, 40, 0.8)', color: 'white', '&:hover': { backgroundColor: '#424242' },
              opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-in-out',
            }}
          >
            <ArrowBackIosNew />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
              backgroundColor: 'rgba(40, 40, 40, 0.8)', color: 'white', '&:hover': { backgroundColor: '#424242' },
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
            {sampleImages.map(sample => (
              <ImageCard 
                key={sample.id} 
                sample={sample}
                onClick={() => handleCardClick(sample)}
                isActive={sample.id === featuredSample.id && !hasUserGeneratedContent}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
