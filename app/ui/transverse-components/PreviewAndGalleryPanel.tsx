'use client';

import * as React from 'react';
import { Box, Typography, Skeleton, ImageList, ImageListItem, Card, CardMedia, Paper } from '@mui/material';
import { VideoI } from '../../api/generate-video-utils';

// [新增] 导入旧的视频展示组件，我们将复用它的内部逻辑
import OutputVideosDisplay from './VeoOutputVideosDisplay'; 

// [新增] 样本数据，URL 指向您 public 目录下的文件
const sampleMedias = [
  { id: 1, thumbnail: '/samples/thumb-1.jpg', prompt: 'A cinematic shot of a futuristic city at night.' },
  { id: 2, thumbnail: '/samples/thumb-2.jpg', prompt: 'A delicious donut rotating on a plate, macro shot.' },
  { id: 3, thumbnail: '/samples/thumb-3.jpg', prompt: 'A cute cat playing with a ball of yarn in a cozy living room.' },
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
