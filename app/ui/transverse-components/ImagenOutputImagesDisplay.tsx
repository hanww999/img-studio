// 文件路径: app/ui/transverse-components/ImagenOutputImagesDisplay.tsx (最终修复版)

'use client';

import * as React from 'react';
import { useState, useRef } from 'react';
import { CreateNewFolderRounded, Download, Edit, Favorite, VideocamRounded, ChevronLeft, ChevronRight, ContentCopy } from '@mui/icons-material';
import Image from 'next/image';
import {
 Box, IconButton, Modal, Skeleton, ImageListItem, ImageList,
 ImageListItemBar, Typography, Stack, Paper, Tooltip, Snackbar, Alert
} from '@mui/material';
import { ImageI } from '../../api/generate-image-utils';
import ExportStepper, { downloadBase64Media } from './ExportDialog';
import DownloadDialog from './DownloadDialog';
import { blurDataURL } from '../ux-components/BlurImage';
import { appContextDataDefault, useAppContext } from '../../context/app-context';
import { useRouter } from 'next/navigation';
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action';

interface ExampleImage { image: string; prompt: string; }

const PromptDisplay = ({ prompt }: { prompt: string }) => {
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const handleCopy = () => {
  navigator.clipboard.writeText(prompt);
  setOpenSnackbar(true);
 };

 return (
  <>
   <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderColor: 'grey.800' }}>
    <Typography variant="caption" sx={{ flexGrow: 1, wordBreak: 'break-word', maxHeight: '120px', overflowY: 'auto' }}>
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
 const [imageFullScreen, setImageFullScreen] = useState<ExampleImage | null>(null);
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const examplePrompts: ExampleImage[] = [
  { image: '/examples/222.png', prompt: 'A close up of a warm and fuzzy colorful Peruvian poncho laying on a top of a chair in a bright day' },
  { image: '/examples/111.png', prompt: 'A winning touchdown, fast shutter speed, movement tracking' },
  { image: '/examples/333.png', prompt: 'Aerial shot of a river flowing up a mystical valley' },
  { image: '/examples/444.png', prompt: 'A photo of a forest canopy with blue skies from below' },
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
       {examplePrompts.map((ex, index) => (
        <Tooltip title={ex.prompt} placement="top" arrow key={index}>
         <Paper elevation={3} onClick={() => setImageFullScreen(ex)} sx={{ width: 200, height: 200, overflow: 'hidden', position: 'relative', cursor: 'pointer', borderRadius: 3, transition: 'transform 0.2s ease-in-out', flexShrink: 0, '&:hover': { transform: 'scale(1.05)' } }}>
          <Image src={ex.image} alt={`Example ${index + 1}`} layout="fill" objectFit="cover" />
         </Paper>
        </Tooltip>
       ))}
      </Stack>
     </Box>
     <IconButton onClick={() => handleScroll('right')} sx={{ position: 'absolute', right: -10, zIndex: 2, bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}><ChevronRight /></IconButton>
    </Box>
   </Box>
   {imageFullScreen && (<Modal open={!!imageFullScreen} onClose={() => setImageFullScreen(null)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ maxHeight: '90vh', maxWidth: '90vw' }}><Image src={imageFullScreen.image} alt={imageFullScreen.prompt} width={800} height={800} style={{ width: 'auto', height: 'auto', maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} /></Box></Modal>)}
  </>
 );
};

export default function OutputImagesDisplay({ isLoading, generatedImagesInGCS, generatedCount, isPromptReplayAvailable, isUpscaledDLAvailable = true }: { isLoading: boolean; generatedImagesInGCS: ImageI[]; generatedCount: number; isPromptReplayAvailable: boolean; isUpscaledDLAvailable?: boolean; }) {
 const [imageFullScreen, setImageFullScreen] = useState<ImageI | undefined>();
 const [imageToExport, setImageToExport] = useState<ImageI | undefined>();
 const [imageToDL, setImageToDL] = useState<ImageI | undefined>();
 const [selectedMedia, setSelectedMedia] = useState<ImageI | null>(null);
 const { setAppContext } = useAppContext();
 const router = useRouter();

 const handleMoreLikeThisClick = (prompt: string) => { setAppContext((prev) => ({ ...(prev ?? appContextDataDefault), promptToGenerateImage: prompt, promptToGenerateVideo: '' })); };
 const handleEditClick = (imageGcsURI: string) => { setAppContext((prev) => ({ ...(prev ?? appContextDataDefault), imageToEdit: imageGcsURI })); router.push('/edit'); };
 const handleITVClick = (imageGcsURI: string) => { setAppContext((prev) => ({ ...(prev ?? appContextDataDefault), imageToVideo: imageGcsURI })); router.push('/generate?mode=video'); };
 const handleDLimage = async (image: ImageI) => { try { const res = await downloadMediaFromGcs(image.gcsUri); downloadBase64Media(res.data, `${image.key}.${image.format.toLowerCase()}`, image.format); if (typeof res === 'object' && res.error) throw Error(res.error.replaceAll('Error: ', '')); } catch (error: any) { throw Error(error); } };

 if (isLoading) {
  return (
   <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16}>
    {Array.from(new Array(generatedCount > 1 ? generatedCount : 2)).map((_, index) => (
     <ImageListItem key={index}><Skeleton variant="rounded" sx={{ width: '100%', paddingTop: '100%', height: 0, borderRadius: 3 }} /></ImageListItem>
    ))}
   </ImageList>
  );
 }

 if (!isLoading && generatedImagesInGCS.length === 0) {
  return <EmptyState />;
 }

 return (
  <>
   <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
     <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16} sx={{ m: 0, flexGrow: 1, overflowY: 'auto' }}>
      {generatedImagesInGCS.map((image) => (
       <ImageListItem key={image.key}
            onClick={() => setSelectedMedia(image)}
            sx={{
              '&:hover .actions-bar': { opacity: 1 },
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              border: selectedMedia?.key === image.key ? '3px solid' : '3px solid transparent',
              borderColor: selectedMedia?.key === image.key ? 'primary.main' : 'transparent',
              transition: 'border-color 0.2s ease-in-out',
            }}
          >
         <Image src={image.src} alt={image.altText} width={image.width} height={image.height} style={{ width: '100%', height: 'auto', display: 'block' }} placeholder="blur" blurDataURL={blurDataURL} quality={80} />
         <ImageListItemBar className="actions-bar" sx={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s ease' }} position="bottom"
          actionIcon={
           <Stack direction="row" justifyContent="flex-end" gap={0.5} sx={{ p: 1, width: '100%' }}>
            {isPromptReplayAvailable && !image.prompt.includes('[1]') && (<Tooltip title="More like this!"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); handleMoreLikeThisClick(image.prompt); }}><Favorite /></IconButton></Tooltip>)}
            {process.env.NEXT_PUBLIC_EDIT_ENABLED === 'true' && (<Tooltip title="Edit this image"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); handleEditClick(image.gcsUri); }}><Edit /></IconButton></Tooltip>)}
            {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && process.env.NEXT_PUBLIC_VEO_ITV_ENABLED === 'true' && (<Tooltip title="Image to video"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); handleITVClick(image.gcsUri); }}><VideocamRounded /></IconButton></Tooltip>)}
            <Tooltip title="Export to library"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); setImageToExport(image); }}><CreateNewFolderRounded /></IconButton></Tooltip>
            <Tooltip title="Download"><IconButton size="small" sx={{ color: 'white' }} onClick={(e) => { e.stopPropagation(); isUpscaledDLAvailable ? setImageToDL(image) : handleDLimage(image); }}><Download /></IconButton></Tooltip>
           </Stack>
          }
         />
       </ImageListItem>
      ))}
     </ImageList>
     {selectedMedia && (
      <Box sx={{ flexShrink: 0, mt: 2, minHeight: '60px' }}>
       <PromptDisplay prompt={selectedMedia.prompt} />
      </Box>
     )}
   </Box>
   {imageFullScreen && (<Modal open={!!imageFullScreen} onClose={() => setImageFullScreen(undefined)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box sx={{ maxHeight: '90vh', maxWidth: '90vw' }}><Image src={imageFullScreen.src} alt={'displayed-image'} width={imageFullScreen.width} height={imageFullScreen.height} style={{ width: 'auto', height: 'auto', maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} quality={100} /></Box></Modal>)}
   <ExportStepper open={!!imageToExport} upscaleAvailable={true} mediaToExport={imageToExport} handleMediaExportClose={() => setImageToExport(undefined)} />
   <DownloadDialog open={!!imageToDL} mediaToDL={imageToDL} handleMediaDLClose={() => setImageToDL(undefined)} />
  </>
 );
}
