// File Path: app/ui/transverse-components/PreviewAndGalleryPanel.tsx

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { Box, Typography, Paper, Card, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { VideoI } from '../../api/generate-video-utils';
import OutputVideosDisplay from './VeoOutputVideosDisplay'; 

const sampleMedias = [
  { id: 1, thumbnail: '/samples/1.mp4', prompt: 'Subject: Emma, a young woman in her 20s with anxious expression, wearing dark clothing,Context:dimly lit abandoned warehouse with shadows and mysterious atmosphere, fog effects,Action: moves cautiously through space, looking over shoulder with growing tension, subtle fearful reactions,Style: horror cinematography with dramatic chiaroscuro lighting, desaturated color palette,Camera: slow tracking shots with occasional quick movements, building suspense,Composition: dramatic angles with deep shadows, creating sense of unease,Ambiance: moody atmospheric lighting with stark contrasts, ominous shadows,Audio: tense atmospheric score with subtle environmental sounds, footsteps echoing, distant mysterious noises,Negative prompt: no text overlays, no watermarks, no cartoon effects, no unrealistic proportions, no blurry faces, no distorted hands, no artificial lighting, no oversaturation, no low resolution artifacts, no compression noise, no camera shake, no poor audio quality, no lip-sync issues, no unnatural movements' },
  { id: 2, thumbnail: '/samples/2.mp4', prompt: 'subject: a seasoned elf ranger dressed in forest camouflage leather armor, holding a shimmering rune longbow. scenario: on the top of an ancient, moss covered megalithic relic, the background is the dusk sky before a storm approaches. action: she leaped and jumped towards another stone pillar, drawing a bow and casting arrows in the air, with wind elemental energy condensed on the arrows. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder.' },
  { id: 3, thumbnail: '/samples/3.mp4', prompt: ' subject: a bottle of "fountain of life" potion in a delicate crystal bottle, with a bright emerald green liquid and slowly rotating golden light spots inside. scenario: on a seamless black background. action: the entire bottle body is slowly and uniformly rotating around the vertical axis. photography style: game asset display style, orthogonal projection, 45 degree top-down view, all details are clearly visible. lighting atmosphere: soft and uniform studio lighting clearly outlines the edges of the crystal bottle and the transparency of the liquid. special effects and post production: the potion itself emits a soft internal light, without any other environmental effects, requiring ultra-high resolution and sharp details. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, ahe wind, and distant thunder.' },
];

// [NEW] Featured Sample Player Component
const FeaturedSamplePlayer = ({ videoSrc }: { videoSrc: string }) => (
  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <video
      key={videoSrc} // Using src as key ensures the component re-renders when the video changes
      src={videoSrc}
      controls
      autoPlay
      muted
      loop
      playsInline
      style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
    />
  </Box>
);

// [MODIFIED] VideoCard component, added onClick and isActive props
const VideoCard = ({ sample, onClick, isActive }: { sample: typeof sampleMedias[0], onClick: () => void, isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Autoplay was prevented.", error));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        minWidth: 260, 
        flexShrink: 0, 
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        border: isActive ? '3px solid #1976d2' : '3px solid transparent', // Highlight the active card
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: 6,
          zIndex: 10,
        } 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ width: '100%', paddingTop: '56.25%', position: 'relative' }}> {/* 16:9 aspect ratio container */}
        <video
          ref={videoRef}
          src={sample.thumbnail}
          muted
          loop
          playsInline
          preload="metadata"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
        />
      </Box>
      <Box sx={{ p: 1, flexGrow: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3, // Show max 3 lines
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sample.prompt}
        </Typography>
      </Box>
    </Card>
  );
};

interface PreviewAndGalleryPanelProps {
  isLoading: boolean;
  generatedVideos: VideoI[];
  generatedCount: number;
}

export default function PreviewAndGalleryPanel({
  isLoading,
  generatedVideos,
  generatedCount,
}: PreviewAndGalleryPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  // [NEW] Internal state to track the featured sample
  const [featuredSample, setFeaturedSample] = useState(sampleMedias[0]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Paper variant="outlined" sx={{ height: 'calc(100vh - 48px)', padding: 2.5, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      {/* [CORE CHANGE] Main preview area is now dynamic */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#e0e0e0', 
        borderRadius: 2, 
        marginBottom: 2, 
        overflow: 'hidden',
        position: 'relative',
      }}>
        {generatedVideos.length > 0 ? (
          // State 2: If the user has generated results, display them
          <OutputVideosDisplay
            isLoading={isLoading}
            generatedVideosInGCS={generatedVideos}
            generatedCount={generatedCount}
          />
        ) : (
          // State 1: If the user has no results, display the featured sample
          <FeaturedSamplePlayer videoSrc={featuredSample.thumbnail} />
        )}
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
          Sample Video
        </Typography>
        {/* [NEW] Parent container with relative positioning for navigation buttons */}
        <Box 
          sx={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* [NEW] Left/right navigation buttons */}
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

          {/* [MODIFIED] Gallery container, hiding the native scrollbar */}
          <Box 
            ref={scrollContainerRef}
            sx={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: 2, 
              py: 1,
              scrollSnapType: 'x mandatory',
              '& > *': { scrollSnapAlign: 'start' },
              scrollbarWidth: 'none', // for Firefox
              '&::-webkit-scrollbar': { display: 'none' }, // for Chrome, Safari, and Opera
            }}
          >
            {sampleMedias.map(sample => (
              <VideoCard 
                key={sample.id} 
                sample={sample}
                // [NEW] Update featured video on click
                onClick={() => setFeaturedSample(sample)}
                // [NEW] Check if the current card is the active/featured one
                isActive={sample.id === featuredSample.id && generatedVideos.length === 0}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
