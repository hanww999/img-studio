// 文件路径: app/ui/transverse-components/VeoOutputVideosDisplay.tsx (完整代码)

'use client'

import * as React from 'react'
import { useRef, useState } from 'react'
import Image from 'next/image';
import { CreateNewFolderRounded, Download, PlayArrowRounded, ChevronLeft, ChevronRight, ContentCopy } from '@mui/icons-material'
import {
 Box, IconButton, Modal, Skeleton, ImageListItem, ImageList,
 ImageListItemBar, Stack, CircularProgress, Typography, Paper, Tooltip, Snackbar, Alert
} from '@mui/material'
import { VideoI } from '../../api/generate-video-utils'
import ExportStepper, { downloadBase64Media } from './ExportDialog'
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action'

interface ExampleVideo { thumbnail: string; videoSrc: string; prompt: string; }

// [修改] PromptDisplay 组件现在只负责展示，不再有复杂的逻辑
const PromptDisplay = ({ prompt }: { prompt: string }) => {
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const handleCopy = () => {
  navigator.clipboard.writeText(prompt);
  setOpenSnackbar(true);
 };

 return (
  <>
   <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderColor: 'grey.800' }}>
    <Typography variant="caption" sx={{ flexGrow: 1, wordBreak: 'break-word' }}>
        {prompt}
      </Typography>
    <Tooltip title="复制提示词"><IconButton size="small" onClick={handleCopy}><ContentCopy fontSize="inherit" /></IconButton></Tooltip>
   </Paper>
   <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>提示词已复制!</Alert>
   </Snackbar>
  </>
 );
};

const EmptyState = () => {
 const [videoFullScreen, setVideoFullScreen] = useState<ExampleVideo | null>(null);
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const exampleVideos: ExampleVideo[] = [
  { thumbnail: '/examples/video_1.jpg', videoSrc: '/examples/1.mp4', prompt: "A cinematic of a latest model of sennheiser noise-canceling headphones, matte black with a brushed metal finish., statically placed at an angle that best showcases its design., on a flawless, pure white seamless background.. Cinematography: professional product photography, commercial-grade, with a macro lens capturing the texture of the leather earcups and metal.. Lighting and vfx: bright, clean commercial studio lighting with soft shadows to emphasize three-dimensionality. No stray light. Hyper-realistic with colors true to the actual product.. Audio: no audio needed.."},
  { thumbnail: '/examples/video_2.jpg', videoSrc: '/examples/2.mp4', prompt: "subject: a seasoned elf ranger dressed in forest camouflage leather armor, holding a shimmering rune longbow. scenario: on the top of an ancient, moss covered megalithic relic, the background is the dusk sky before a storm approaches. action: she leaped and jumped towards another stone pillar, drawing a bow and casting arrows in the air, with wind elemental energy condensed on the arrows. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder." },
  { thumbnail: '/examples/video_3.jpg', videoSrc: '/examples/3.mp4', prompt: "subject: a bottle of 'fountain of life' potion in a delicate crystal bottle, with a bright emerald green liquid and slowly rotating golden light spots inside. scenario: on a seamless black background. action: the entire bottle body is slowly and uniformly rotating around the vertical axis. photography style: game asset display style, orthogonal projection, 45 degree top-down view, all details are clearly visible. lighting atmosphere: soft and uniform studio lighting clearly outlines the edges of the crystal bottle and the transparency of the liquid. special effects and post production: the potion itself emits a soft internal light, without any other environmental effects, requiring ultra-high resolution and sharp details. photography style: the highly dynamic low angle tracking lens captures her jumping from bottom to top, combined with bullet time like slow motion effects, with a strong dynamic blur in the background. lighting atmosphere: the jesus light at dusk penetrates through the clouds, illuminating her contours to form edge lights, and lightning in the distance instantly illuminates the entire scene. special effects and post production: there are clear and visible blue wind magic particles on the arrows, and raindrops are captured by the camera in slow motion. The overall color scheme is movie grade with cool tones. audio: a majestic symphony, the creaking sound of bowstring tension, the wind, and distant thunder." },
 ];

 const handleScroll = (direction: 'left' | 'right') => {
  if (scrollContainerRef.current) {
   scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  }
 };

 return (
  <>
   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', p: 3 }}>
    <Image src="/cloudpuppy-illustration.svg" alt="CloudPuppy" width={150} height={150} />
    <Typography variant="h5" component="h2" sx={{ mt: 3, fontWeight: 'bold' }}>您的创意画廊</Typography>
    <Typography color="text.secondary" sx={{ mt: 1, mb: 4, maxWidth: '450px' }}>生成的作品将会出现在这里。看看这些例子获取灵感吧！</Typography>
    <Box sx={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
     <IconButton onClick={() => handleScroll('left')} sx={{ position: 'absolute', left: -10, zIndex: 2, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronLeft /></IconButton>
     <Box ref={scrollContainerRef} sx={{ width: '100%', overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ display: 'inline-flex', p: 1 }}>
       {exampleVideos.map((ex, index) => (
        <Tooltip title={ex.prompt} placement="top" arrow key={index}>
         <Paper elevation={3} onClick={() => setVideoFullScreen(ex)} sx={{ width: 200, height: 200, overflow: 'hidden', position: 'relative', cursor: 'pointer', borderRadius: 3, transition: 'transform 0.2s ease-in-out', flexShrink: 0, '&:hover': { transform: 'scale(1.05)' } }}>
          <Image src={ex.thumbnail} alt={`Example ${index + 1}`} layout="fill" objectFit="cover" />
          <PlayArrowRounded sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'rgba(255, 255, 255, 0.9)', pointerEvents: 'none' }} />
         </Paper>
        </Tooltip>
       ))}
      </Stack>
     </Box>
     <IconButton onClick={() => handleScroll('right')} sx={{ position: 'absolute', right: -10, zIndex: 2, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronRight /></IconButton>
    </Box>
   </Box>
   {videoFullScreen && (<Modal open={!!videoFullScreen} onClose={() => setVideoFullScreen(null)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ maxWidth: '80vw', maxHeight: '80vh', bgcolor: 'black' }}><video src={videoFullScreen.videoSrc} controls autoPlay style={{ width: '100%', height: '100%', maxHeight: '80vh' }} /></Box></Modal>)}
  </>
 );
};

export default function OutputVideosDisplay({ isLoading, generatedVideosInGCS, generatedCount }: { isLoading: boolean; generatedVideosInGCS: VideoI[]; generatedCount: number; }) {
 const [videoFullScreen, setVideoFullScreen] = useState<VideoI | undefined>();
 const fullScreenVideoRef = useRef<HTMLVideoElement>(null);
 const [videoToExport, setVideoToExport] = useState<VideoI | undefined>();
 const [isDLloading, setIsDLloading] = useState(false);
  // [新增] State to track the selected media for prompt display
 const [selectedMedia, setSelectedMedia] = useState<VideoI | null>(null);

 const handleCloseVideoFullScreen = () => { if (fullScreenVideoRef.current) { fullScreenVideoRef.current.pause(); fullScreenVideoRef.current.currentTime = 0; } setVideoFullScreen(undefined); };
 const handleVideoExportClose = () => setVideoToExport(undefined);
 const handleDLvideo = async (video: VideoI) => { setIsDLloading(true); try { const res = await downloadMediaFromGcs(video.gcsUri); downloadBase64Media(res.data, `${video.key}.${video.format.toLowerCase()}`, video.format); if (typeof res === 'object' && res.error) throw Error(res.error.replaceAll('Error: ', '')); } catch (error: any) { console.error(error); } finally { setIsDLloading(false); } };

 if (isLoading) {
  return (
   <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16}>
    {Array.from(new Array(generatedCount > 1 ? generatedCount : 1)).map((_, index) => (
     <ImageListItem key={index}><Skeleton variant="rounded" sx={{ width: '100%', paddingTop: '56.25%', height: 0, borderRadius: 3 }} /></ImageListItem>
    ))}
   </ImageList>
  );
 }

 if (!isLoading && generatedVideosInGCS.length === 0) {
  return <EmptyState />;
 }

 return (
    // [修改] 使用一个 Box 包裹画廊和下方的 Prompt 区域
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 画廊区域，占据大部分空间 */}
   <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16} sx={{ m: 0, flexGrow: 1, overflowY: 'auto' }}>
    {generatedVideosInGCS.map((video) => video.src ? (
     <ImageListItem key={video.key} 
          onClick={() => setSelectedMedia(video)} // [修改] 点击时设置选中的视频
          sx={{ 
            '&:hover .actions-bar': { opacity: 1 }, 
            borderRadius: 3, 
            overflow: 'hidden', 
            position: 'relative',
            cursor: 'pointer',
            // [新增] 为选中的视频添加边框
            border: selectedMedia?.key === video.key ? '3px solid' : '3px solid transparent',
            borderColor: selectedMedia?.key === video.key ? 'primary.main' : 'transparent',
            transition: 'border-color 0.2s ease-in-out',
          }}
        >
       <video src={video.src} width={video.width} height={video.height} style={{ width: '100%', height: 'auto', display: 'block' }} playsInline muted preload="metadata" />
       <ImageListItemBar className="actions-bar" sx={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s ease' }} position="bottom"
        actionIcon={
         <Stack direction="row" justifyContent="flex-end" gap={0.5} sx={{ p: 1, width: '100%' }}>
              {/* [修改] 在图标按钮上阻止事件冒泡 */}
          <Tooltip title="导出到媒体库"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); setVideoToExport(video); }}><CreateNewFolderRounded /></IconButton></Tooltip>
          <Tooltip title="下载"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); handleDLvideo(video); }}>{isDLloading ? <CircularProgress size={20} color="inherit" /> : <Download />}</IconButton></Tooltip>
         </Stack>
        }
       />
       <PlayArrowRounded sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'rgba(255, 255, 255, 0.9)', pointerEvents: 'none' }} />
      </ImageListItem>
    ) : null)}
   </ImageList>

    {/* [新增] 统一的 Prompt 显示区域，只在有选中项时显示 */}
    {selectedMedia && (
      <Box sx={{ flexShrink: 0, mt: 2, minHeight: '60px' /* 预留最小高度 */ }}>
        <PromptDisplay prompt={selectedMedia.prompt} />
      </Box>
    )}

    {/* 弹窗 Modals */}
   {videoFullScreen && (<Modal open={!!videoFullScreen} onClose={handleCloseVideoFullScreen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ maxWidth: '80vw', maxHeight: '80vh', bgcolor: 'black' }}><video ref={fullScreenVideoRef} src={videoFullScreen.src} controls autoPlay style={{ width: '100%', height: '100%', maxHeight: '80vh' }} /></Box></Modal>)}
   <ExportStepper open={!!videoToExport} upscaleAvailable={false} mediaToExport={videoToExport} handleMediaExportClose={handleVideoExportClose} />
  </>
 )
}
