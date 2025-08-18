// 文件路径: app/ui/transverse-components/ImagenOutputImagesDisplay.tsx (完整版)

'use client';

import * as React from 'react';
import { useState } from 'react';
import { CreateNewFolderRounded, Download, Edit, Favorite, VideocamRounded } from '@mui/icons-material';
import Image from 'next/image';
import {
  Box, IconButton, Modal, Skeleton, ImageListItem, ImageList,
  ImageListItemBar, Typography, Stack, Paper, Grid, Tooltip,
} from '@mui/material';
import { ImageI } from '../../api/generate-image-utils';
import ExportStepper, { downloadBase64Media } from './ExportDialog';
import DownloadDialog from './DownloadDialog';
import { blurDataURL } from '../ux-components/BlurImage';
import { useAppContext } from '../../context/app-context';
import { useRouter } from 'next/navigation';
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action';

const EmptyState = () => {
  const examplePrompts = [
    { image: '/examples/222.png', prompt: 'A close up of a warm and fuzzy colorful Peruvian poncho laying on a top of a chair in a bright day' },
    { image: '/examples/111.png', prompt: 'A winning touchdown, fast shutter speed, movement tracking' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', p: 3 }}>
      <Image src="/cloudpuppy-illustration.svg" alt="CloudPuppy" width={150} height={150} />
      <Typography variant="h5" component="h2" sx={{ mt: 3, fontWeight: 'bold' }}>
        Your Creative Gallery
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4, maxWidth: '450px' }}>
        Your masterpieces will appear here. Type your wildest ideas on the left and let CloudPuppy bring them to life!
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {examplePrompts.map((ex, index) => (
          <Grid item key={index}>
            <Tooltip title={ex.prompt} placement="top" arrow>
              <Paper
                elevation={3}
                sx={{
                  width: 200,
                  height: 200,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Image src={ex.image} alt={`Example ${index + 1}`} layout="fill" objectFit="cover" />
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default function OutputImagesDisplay({
  isLoading,
  generatedImagesInGCS,
  generatedCount,
  isPromptReplayAvailable,
  isUpscaledDLAvailable = true,
}: {
  isLoading: boolean;
  generatedImagesInGCS: ImageI[];
  generatedCount: number;
  isPromptReplayAvailable: boolean;
  isUpscaledDLAvailable?: boolean;
}) {
  const [imageFullScreen, setImageFullScreen] = useState<ImageI | undefined>();
  const [imageToExport, setImageToExport] = useState<ImageI | undefined>();
  const [imageToDL, setImageToDL] = useState<ImageI | undefined>();
  const { setAppContext } = useAppContext();
  const router = useRouter();

  const handleMoreLikeThisClick = (prompt: string) => {
    setAppContext((prevContext) => ({ ...prevContext, promptToGenerateImage: prompt, promptToGenerateVideo: '' }));
  };
  const handleEditClick = (imageGcsURI: string) => {
    setAppContext((prevContext) => ({ ...prevContext, imageToEdit: imageGcsURI }));
    router.push('/edit');
  };
  const handleITVClick = (imageGcsURI: string) => {
    setAppContext((prevContext) => ({ ...prevContext, imageToVideo: imageGcsURI }));
    router.push('/generate?mode=video');
  };
  const handleDLimage = async (image: ImageI) => {
    try {
      const res = await downloadMediaFromGcs(image.gcsUri);
      const name = `${image.key}.${image.format.toLowerCase()}`;
      downloadBase64Media(res.data, name, image.format);
      if (typeof res === 'object' && res.error) throw Error(res.error.replaceAll('Error: ', ''));
    } catch (error: any) {
      throw Error(error);
    }
  };

  if (isLoading) {
    return (
      <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16}>
        {Array.from(new Array(generatedCount > 1 ? generatedCount : 2)).map((_, index) => (
          <ImageListItem key={index}>
            <Skeleton variant="rounded" sx={{ width: '100%', paddingTop: '100%', height: 0, borderRadius: 3 }} />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }

  if (!isLoading && generatedImagesInGCS.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ImageList cols={generatedCount > 1 ? 2 : 1} gap={16} sx={{ m: 0 }}>
        {generatedImagesInGCS.map((image) => (
          <ImageListItem key={image.key} sx={{ '&:hover .actions-bar': { opacity: 1 }, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <Image
              src={image.src}
              alt={image.altText}
              width={image.width}
              height={image.height}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              placeholder="blur"
              blurDataURL={blurDataURL}
              quality={80}
              onClick={() => setImageFullScreen(image)}
            />
            <ImageListItemBar
              className="actions-bar"
              sx={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
              position="bottom"
              actionIcon={
                <Stack direction="row" justifyContent="flex-end" gap={0.5} sx={{ p: 1, width: '100%' }}>
                  {isPromptReplayAvailable && !image.prompt.includes('[1]') && (
                    <Tooltip title="More like this!"><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleMoreLikeThisClick(image.prompt)}><Favorite /></IconButton></Tooltip>
                  )}
                  {process.env.NEXT_PUBLIC_EDIT_ENABLED === 'true' && (
                    <Tooltip title="Edit this image"><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleEditClick(image.gcsUri)}><Edit /></IconButton></Tooltip>
                  )}
                  {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && process.env.NEXT_PUBLIC_VEO_ITV_ENABLED === 'true' && (
                    <Tooltip title="Image to video"><IconButton size="small" sx={{ color: 'white' }} onClick={() => handleITVClick(image.gcsUri)}><VideocamRounded /></IconButton></Tooltip>
                  )}
                  <Tooltip title="Export to library"><IconButton size="small" sx={{ color: 'white' }} onClick={() => setImageToExport(image)}><CreateNewFolderRounded /></IconButton></Tooltip>
                  <Tooltip title="Download"><IconButton size="small" sx={{ color: 'white' }} onClick={isUpscaledDLAvailable ? () => setImageToDL(image) : () => handleDLimage(image)}><Download /></IconButton></Tooltip>
                </Stack>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      
      {imageFullScreen !== undefined && (
        <Modal open={imageFullScreen !== undefined} onClose={() => setImageFullScreen(undefined)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ maxHeight: '90vh', maxWidth: '90vw' }}>
            <Image
              src={imageFullScreen.src}
              alt={'displayed-image'}
              width={imageFullScreen.width}
              height={imageFullScreen.height}
              style={{ width: 'auto', height: 'auto', maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
              quality={100}
            />
          </Box>
        </Modal>
      )}
      <ExportStepper open={imageToExport !== undefined} upscaleAvailable={true} mediaToExport={imageToExport} handleMediaExportClose={() => setImageToExport(undefined)} />
      <DownloadDialog open={imageToDL !== undefined} mediaToDL={imageToDL} handleMediaDLClose={() => setImageToDL(undefined)} />
    </>
  );
}
