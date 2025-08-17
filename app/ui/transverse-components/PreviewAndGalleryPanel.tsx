'use client';

import * as React from 'react';
import { Box, Typography, Skeleton, ImageList, ImageListItem, Card, CardMedia, Paper } from '@mui/material';
import { VideoI } from '../../api/generate-video-utils';

// [新增] 导入旧的视频展示组件，我们将复用它的内部逻辑
import OutputVideosDisplay from './VeoOutputVideosDisplay'; 

// [新增] 样本数据，URL 指向您 public 目录下的文件
const sampleMedias = [
  { id: 1, thumbnail: '/samples/1.mp4', prompt: 'Subject: Emma, a young woman in her 20s with anxious expression, wearing dark clothing,Context:dimly lit abandoned warehouse with shadows and mysterious atmosphere, fog effects,Action: moves cautiously through space, looking over shoulder with growing tension, subtle fearful reactions,Style: horror cinematography with dramatic chiaroscuro lighting, desaturated color palette,Camera: slow tracking shots with occasional quick movements, building suspense,Composition: dramatic angles with deep shadows, creating sense of unease,Ambiance: moody atmospheric lighting with stark contrasts, ominous shadows,Audio: tense atmospheric score with subtle environmental sounds, footsteps echoing, distant mysterious noises,Negative prompt: no text overlays, no watermarks, no cartoon effects, no unrealistic proportions, no blurry faces, no distorted hands, no artificial lighting, no oversaturation, no low resolution artifacts, no compression noise, no camera shake, no poor audio quality, no lip-sync issues, no unnatural movements' },
  { id: 2, thumbnail: '/samples/2.mp4', prompt: 'subject: a seasoned elf ranger dressed in forest camouflage leather armor, holding a shimmering rune longbow. scenario: on the top of an ancient, moss covered megalithic relic, the background is the dusk sky before a storm approaches. action: she leaped and jumped towards another stone pillar, drawing a bow and casting arrows in the air, with wind elemental energy condensed on the arrows. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder.' },
  { id: 3, thumbnail: '/samples/3.mp4', prompt: ' subject: a bottle of "fountain of life" potion in a delicate crystal bottle, with a bright emerald green liquid and slowly rotating golden light spots inside. scenario: on a seamless black background. action: the entire bottle body is slowly and uniformly rotating around the vertical axis. photography style: game asset display style, orthogonal projection, 45 degree top-down view, all details are clearly visible. lighting atmosphere: soft and uniform studio lighting clearly outlines the edges of the crystal bottle and the transparency of the liquid. special effects and post production: the potion itself emits a soft internal light, without any other environmental effects, requiring ultra-high resolution and sharp details. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder.' },
];

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
    <Paper variant="outlined" sx={{ height: 'calc(100vh - 80px)', padding: 2, display: 'flex', flexDirection: 'column' }}>
      {/* 1. 主预览区 (直接复用您现有的组件逻辑) */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'action.hover', borderRadius: 1, marginBottom: 2, overflow: 'hidden' }}>
        {/* 
          这里我们直接调用您已经写好的 OutputVideosDisplay。
          这避免了重写所有视频播放、全屏、下载的逻辑。
          我们只需要确保它的样式能适应新容器。
        */}
        <OutputVideosDisplay
          isLoading={isLoading}
          generatedVideosInGCS={generatedVideos}
          generatedCount={generatedCount}
        />
      </Box>

      {/* 2. 灵感画廊 */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h6" gutterBottom>
          灵感画廊 (Inspiration Gallery)
        </Typography>
        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, paddingBottom: 1 }}>
          {sampleMedias.map(sample => (
            <Card key={sample.id} sx={{ minWidth: 200, flexShrink: 0, cursor: 'pointer', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' } }}>
              <CardMedia component="img" height="110" image={sample.thumbnail} alt={sample.prompt} />
              <Typography variant="caption" sx={{ padding: 1, display: 'block', color: 'text.secondary' }}>
                {sample.prompt}
              </Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
