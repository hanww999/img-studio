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

/*
 Note:
 - If your Next version uses the new Image API, replace `layout="fill"` with `fill` and use style prop:
   <Image src={...} alt={...} fill style={{ objectFit: 'cover' }} />
 - For generated videos we render a small <video> element as thumbnail (safe and avoids needing a `thumbnail` field).
*/

const PromptDisplay = ({ prompt }: { prompt: string }) => {
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const handleCopy = () => {
  navigator.clipboard.writeText(prompt);
  setOpenSnackbar(true);
 };

 return (
  <>
   <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderColor: 'grey.800' }}>
    <Typography variant="body2" sx={{ flexGrow: 1, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{prompt}</Typography>
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
    <Typography color="text.secondary" sx={{ mt: 1, mb: 2, maxWidth: '450px' }}>生成的作品将会出现在这里。看看这些例子获取灵感吧！</Typography>

    <Box sx={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
     <IconButton onClick={() => handleScroll('left')} sx={{ position: 'absolute', left: -10, zIndex: 2, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronLeft /></IconButton>
     <Box ref={scrollContainerRef} sx={{ width: '100%', overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ display: 'inline-flex', p: 1 }}>
       {exampleVideos.map((ex, index) => (
        <Paper key={index} elevation={3} onClick={() => setVideoFullScreen(ex)} sx={{ width: 200, height: 200, overflow: 'hidden', position: 'relative', cursor: 'pointer', borderRadius: 3, transition: 'transform 0.2s ease-in-out', flexShrink: 0, '&:hover': { transform: 'scale(1.05)' } }}>
         <Image src={ex.thumbnail} alt={`Example ${index + 1}`} layout="fill" objectFit="cover" />
         <PlayArrowRounded sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'rgba(255, 255, 255, 0.9)', pointerEvents: 'none' }} />
         <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, bgcolor: '#f1c40f', color: 'black', py: 0.5, px: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.prompt}</Box>
        </Paper>
       ))}
      </Stack>
     </Box>
     <IconButton onClick={() => handleScroll('right')} sx={{ position: 'absolute', right: -10, zIndex: 2, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronRight /></IconButton>
    </Box>
   </Box>

   {videoFullScreen && (
    <Modal open={!!videoFullScreen} onClose={() => setVideoFullScreen(null)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <Box sx={{ maxWidth: '80vw', maxHeight: '80vh', bgcolor: 'black' }}>
      <video src={videoFullScreen.videoSrc} controls autoPlay style={{ width: '100%', height: '100%', maxHeight: '80vh' }} />
     </Box>
    </Modal>
   )}
  </>
 );
};

export default function OutputVideosDisplay({ isLoading, generatedVideosInGCS, generatedCount }: { isLoading: boolean; generatedVideosInGCS: VideoI[]; generatedCount: number; }) {
 const [videoFullScreen, setVideoFullScreen] = useState<VideoI | undefined>();
 const fullScreenVideoRef = useRef<HTMLVideoElement>(null);
 const [videoToExport, setVideoToExport] = useState<VideoI | undefined>();
 const [isDLloading, setIsDLloading] = useState(false);
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
  <>
   <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
     <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16} sx={{ m: 0, flexGrow: 1, overflowY: 'auto' }}>
      {generatedVideosInGCS.map((video) => video.src ? (
       <ImageListItem key={video.key}
            onClick={() => setSelectedMedia(video)}
            sx={{
              '&:hover .actions-bar': { opacity: 1 },
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              border: selectedMedia?.key === video.key ? '3px solid' : '3px solid transparent',
              borderColor: selectedMedia?.key === video.key ? 'primary.main' : 'transparent',
              transition: 'border-color 0.2s ease-in-out',
            }}
          >
         {/* —— 修复点 ——  
              这里使用 <Box> + 内嵌 <video> 作为缩略显示（类型安全，不依赖 VideoI.thumbnail 字段）。
              当视频没有可用缩略图时，这能正确展示一个可播放的小片段。
         */}
         <Box onClick={() => setVideoFullScreen(video)} sx={{ position: 'relative', width: '100%', pt: `${(video.height && video.width) ? Math.max(1, (video.height / video.width) * 100) : 56.25}%`, bgcolor: 'background.default', cursor: 'pointer' }}>
           {/* 绝对定位填充父容器 */}
           <Box component="video" src={video.src} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted preload="metadata" />
           <PlayArrowRounded sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'rgba(255,255,255,0.9)', pointerEvents: 'none' }} />
           <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, bgcolor: '#f1c40f', color: 'black', py: 0.5, px: 1, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(video as any).prompt ?? ''}</Box>
         </Box>

         <ImageListItemBar className="actions-bar" sx={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s ease' }} position="bottom"
          actionIcon={
           <Stack direction="row" justifyContent="flex-end" gap={0.5} sx={{ p: 1, width: '100%' }}>
            <Tooltip title="导出到媒体库"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); setVideoToExport(video); }}><CreateNewFolderRounded /></IconButton></Tooltip>
            <Tooltip title="下载"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); handleDLvideo(video); }}>{isDLloading ? <CircularProgress size={20} color="inherit" /> : <Download />}</IconButton></Tooltip>
           </Stack>
          }
         />
         <PlayArrowRounded sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', color: 'rgba(255, 255, 255, 0.9)', pointerEvents: 'none', opacity: 0 }} />
       </ImageListItem>
      ) : null)}
     </ImageList>

     {/* footer prompt 区（保留） */}
     <Box sx={{ flexShrink: 0, mt: 2, minHeight: '110px', maxHeight: '220px', overflowY: 'auto', px: 0 }}>
      {selectedMedia ? (
        <Box sx={{ p: 1 }}><PromptDisplay prompt={(selectedMedia as any).prompt} /></Box>
      ) : (
        <Box sx={{ p: 1, color: 'text.secondary' }}><Typography variant="body2">请选择一个视频（点击缩略图），它的提示词会显示在缩略图底部及此处。</Typography></Box>
      )}
     </Box>
   </Box>

   {videoFullScreen && (
    <Modal open={!!videoFullScreen} onClose={handleCloseVideoFullScreen} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: '80vw', maxHeight: '80vh', bgcolor: 'black' }}>
       <video ref={fullScreenVideoRef} src={(videoFullScreen as any).src ?? (videoFullScreen as any).videoSrc} controls autoPlay style={{ width: '100%', height: '100%', maxHeight: '80vh' }} />
      </Box>
    </Modal>
   )}

   <ExportStepper open={!!videoToExport} upscaleAvailable={false} mediaToExport={videoToExport} handleMediaExportClose={handleVideoExportClose} />
  </>
 )
}
