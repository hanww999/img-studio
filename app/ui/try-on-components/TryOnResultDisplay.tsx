// app/ui/try-on-components/TryOnResultDisplay.tsx

'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Box, Skeleton, Modal, ImageListItem, ImageListItemBar, Stack, Typography, IconButton, Avatar, Alert, CircularProgress } from '@mui/material';
import { Edit, CreateNewFolderRounded, Download, VideocamRounded } from '@mui/icons-material';

import { ImageI } from '../../api/generate-image-utils';
import ExportStepper from '../transverse-components/ExportDialog';
import DownloadDialog from '../transverse-components/DownloadDialog';
import { appContextDataDefault, useAppContext } from '../../context/app-context';
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action';
import { blurDataURL } from '../ux-components/BlurImage';
import { CustomWhiteTooltip } from '../ux-components/Tooltip';
import { CustomizedAvatarButton, CustomizedIconButton } from '../ux-components/Button-SX';
import theme from '../../theme';
const { palette } = theme;

interface TryOnResultDisplayProps {
  isLoading: boolean;
  errorMsg: string;
  generatedImage: ImageI | null;
}

const containerStyles = {
  width: '100%',
  height: '100%',
  borderRadius: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: palette.grey[900],
  position: 'relative',
  overflow: 'hidden',
};

export default function TryOnResultDisplay({ isLoading, errorMsg, generatedImage }: TryOnResultDisplayProps) {
  const [imageFullScreen, setImageFullScreen] = useState<ImageI | undefined>();
  const [imageToExport, setImageToExport] = useState<ImageI | undefined>();
  const [imageToDL, setImageToDL] = useState<ImageI | undefined>();

  const { setAppContext } = useAppContext();
  const router = useRouter();

  const handleEditClick = (imageGcsURI: string) => {
    if (!imageGcsURI) {
      alert("Cannot edit: Image was not saved to Cloud Storage.");
      return;
    }
    setAppContext((prevContext) => ({ ...(prevContext || appContextDataDefault), imageToEdit: imageGcsURI }));
    router.push('/edit');
  };

  const handleITVClick = (imageGcsURI: string) => {
    if (!imageGcsURI) {
      alert("Cannot convert to video: Image was not saved to Cloud Storage.");
      return;
    }
    setAppContext((prevContext) => ({ ...(prevContext || appContextDataDefault), imageToVideo: imageGcsURI }));
    router.push('/generate?mode=video');
  };

  // 注意：这个函数现在由 DownloadDialog 内部调用，但我们保留它以备将来直接下载的需求
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

  return (
    <>
      <Box sx={containerStyles}>
        {isLoading && <CircularProgress color="primary" />}

        {!isLoading && errorMsg && (
          <Alert severity="error" sx={{ m: 2, width: '90%' }}>{errorMsg}</Alert>
        )}

        {!isLoading && !errorMsg && !generatedImage && (
          <Typography variant="h6" color="text.secondary">Your generated image will appear here</Typography>
        )}

        {!isLoading && generatedImage && (
          <ImageListItem
            key={generatedImage.key}
            sx={{
              boxShadow: '0px 5px 10px -1px rgb(0 0 0 / 70%)',
              transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              width: '100%', height: '100%', display: 'flex',
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Image
              src={generatedImage.src}
              alt={generatedImage.altText}
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              width={1024}
              height={1024}
              placeholder="blur"
              blurDataURL={blurDataURL}
              quality={90}
            />
            <Box
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', opacity: 0, transition: 'opacity 0.3s ease', '&:hover': { opacity: 1 } }}
              onClick={() => setImageFullScreen(generatedImage)}
            >
              <Typography variant="body1" sx={{ textAlign: 'center' }}>Click to see full screen</Typography>
            </Box>
            <ImageListItemBar
              sx={{ backgroundColor: 'transparent' }}
              position="top"
              actionIcon={
                <Stack direction="row" gap={0} pb={3}>
                  {process.env.NEXT_PUBLIC_EDIT_ENABLED === 'true' && (
                    <CustomWhiteTooltip title="Edit this image" size="small">
                      <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(generatedImage.gcsUri); }} sx={{ px: 0.2, zIndex: 10 }} disableRipple>
                        <Avatar sx={CustomizedAvatarButton}><Edit sx={CustomizedIconButton} /></Avatar>
                      </IconButton>
                    </CustomWhiteTooltip>
                  )}
                  {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && process.env.NEXT_PUBLIC_VEO_ITV_ENABLED === 'true' && (
                    <CustomWhiteTooltip title="Image to video" size="small">
                      <IconButton onClick={(e) => { e.stopPropagation(); handleITVClick(generatedImage.gcsUri); }} sx={{ px: 0.2, zIndex: 10 }} disableRipple>
                        <Avatar sx={CustomizedAvatarButton}><VideocamRounded sx={CustomizedIconButton} /></Avatar>
                      </IconButton>
                    </CustomWhiteTooltip>
                  )}
                  <CustomWhiteTooltip title="Export to library" size="small">
                    <IconButton onClick={(e) => { e.stopPropagation(); setImageToExport(generatedImage); }} sx={{ px: 0.2, zIndex: 10 }} disableRipple>
                      <Avatar sx={CustomizedAvatarButton}><CreateNewFolderRounded sx={CustomizedIconButton} /></Avatar>
                    </IconButton>
                  </CustomWhiteTooltip>
                  <CustomWhiteTooltip title="Download locally" size="small">
                    {/* [修改] 这里的 onClick 行为现在与“导出”按钮一致，都是打开一个对话框 */}
                    <IconButton onClick={(e) => { e.stopPropagation(); setImageToDL(generatedImage); }} sx={{ pr: 1, pl: 0.2, zIndex: 10 }} disableRipple>
                      <Avatar sx={CustomizedAvatarButton}><Download sx={CustomizedIconButton} /></Avatar>
                    </IconButton>
                  </CustomWhiteTooltip>
                </Stack>
              }
            />
          </ImageListItem>
        )}
      </Box>

      {imageFullScreen && (
        <Modal open={true} onClose={() => setImageFullScreen(undefined)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ maxHeight: '90vh', maxWidth: '90vw' }}>
            <Image
              src={imageFullScreen.src}
              alt={imageFullScreen.altText}
              width={1024}
              height={1024}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
        </Modal>
      )}
      <ExportStepper
        open={imageToExport !== undefined}
        upscaleAvailable={false}
        mediaToExport={imageToExport}
        handleMediaExportClose={() => setImageToExport(undefined)}
      />
      <DownloadDialog
        open={imageToDL !== undefined}
        mediaToDL={imageToDL}
        handleMediaDLClose={() => setImageToDL(undefined)}
      />
    </>
  );
}
