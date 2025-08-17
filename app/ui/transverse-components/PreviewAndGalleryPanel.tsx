'use client';

import * as React from 'react';
import { useRef } from 'react';
import { Box, Typography, Paper, Card } from '@mui/material';
import { VideoI } from '../../api/generate-video-utils';
import OutputVideosDisplay from './VeoOutputVideosDisplay'; 

// [修改] 使用您提供的样本数据
const sampleMedias = [
  { id: 1, thumbnail: '/samples/1.mp4', prompt: 'Subject: Emma, a young woman in her 20s with anxious expression, wearing dark clothing,Context:dimly lit abandoned warehouse with shadows and mysterious atmosphere, fog effects,Action: moves cautiously through space, looking over shoulder with growing tension, subtle fearful reactions,Style: horror cinematography with dramatic chiaroscuro lighting, desaturated color palette,Camera: slow tracking shots with occasional quick movements, building suspense,Composition: dramatic angles with deep shadows, creating sense of unease,Ambiance: moody atmospheric lighting with stark contrasts, ominous shadows,Audio: tense atmospheric score with subtle environmental sounds, footsteps echoing, distant mysterious noises,Negative prompt: no text overlays, no watermarks, no cartoon effects, no unrealistic proportions, no blurry faces, no distorted hands, no artificial lighting, no oversaturation, no low resolution artifacts, no compression noise, no camera shake, no poor audio quality, no lip-sync issues, no unnatural movements' },
  { id: 2, thumbnail: '/samples/2.mp4', prompt: 'subject: a seasoned elf ranger dressed in forest camouflage leather armor, holding a shimmering rune longbow. scenario: on the top of an ancient, moss covered megalithic relic, the background is the dusk sky before a storm approaches. action: she leaped and jumped towards another stone pillar, drawing a bow and casting arrows in the air, with wind elemental energy condensed on the arrows. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder.' },
  { id: 3, thumbnail: '/samples/3.mp4', prompt: ' subject: a bottle of "fountain of life" potion in a delicate crystal bottle, with a bright emerald green liquid and slowly rotating golden light spots inside. scenario: on a seamless black background. action: the entire bottle body is slowly and uniformly rotating around the vertical axis. photography style: game asset display style, orthogonal projection, 45 degree top-down view, all details are clearly visible. lighting atmosphere: soft and uniform studio lighting clearly outlines the edges of the crystal bottle and the transparency of the liquid. special effects and post production: the potion itself emits a soft internal light, without any other environmental effects, requiring ultra-high resolution and sharp details. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder.' },
];

// [新增] 一个专门用于展示视频卡片的子组件
const VideoCard = ({ sample }: { sample: typeof sampleMedias[0] }) => {
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
      sx={{ 
        minWidth: 240, 
        flexShrink: 0, 
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: 3,
          zIndex: 10,
        } 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={sample.thumbnail}
        muted
        loop
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '135px', objectFit: 'cover', display: 'block', background: '#000' }}
      />
      <Typography variant="caption" sx={{ p: 1, display: 'block', color: 'text.secondary', height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {sample.prompt}
      </Typography>
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
  return (
    <Paper variant="outlined" sx={{ height: 'calc(100vh - 48px)', padding: 2.5, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5', borderRadius: 2 }}>
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
        <OutputVideosDisplay
          isLoading={isLoading}
          generatedVideosInGCS={generatedVideos}
          generatedCount={generatedCount}
        />
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.primary' }}>
          灵感画廊 (Inspiration Gallery)
        </Typography>
        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, padding: 1, '::-webkit-scrollbar': { height: '8px' }, '::-webkit-scrollbar-thumb': { backgroundColor: '#bdbdbd', borderRadius: '4px' } }}>
          {sampleMedias.map(sample => (
            <VideoCard key={sample.id} sample={sample} />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
