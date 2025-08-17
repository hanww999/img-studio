// File Path: app/(studio)/generate/GeneratePageClient.tsx

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Grid, Box, Typography } from '@mui/material'; 

import GenerateForm from '../../ui/generate-components/GenerateForm';
import { imageGenerationUtils, ImageI, ImageRandomPrompts } from '../../api/generate-image-utils';
import { appContextDataDefault, useAppContext } from '../../context/app-context';
import {
 InterpolImageI,
 OperationMetadataI,
 VideoGenerationStatusResult,
 videoGenerationUtils,
 VideoI,
 VideoRandomPrompts,
} from '../../api/generate-video-utils';
import { getVideoGenerationStatus } from '../../api/veo/action';
import { downloadMediaFromGcs } from '../../api/cloud-storage/action';
import { getAspectRatio } from '../../ui/edit-components/EditImageDropzone';

import PreviewAndGalleryPanel from '../../ui/transverse-components/PreviewAndGalleryPanel';
import ImagePreviewAndGalleryPanel from '../../ui/transverse-components/ImagePreviewAndGalleryPanel';

const INITIAL_POLLING_INTERVAL_MS = 6000;
const MAX_POLLING_INTERVAL_MS = 60000;
const BACKOFF_FACTOR = 1.2;
const MAX_POLLING_ATTEMPTS = 30;
const JITTER_FACTOR = 0.2;

export default function GeneratePageClient() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const [generationMode, setGenerationMode] = useState('Generate an Image');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<ImageI[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<VideoI[]>([]);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [generationErrorMsg, setGenerationErrorMsg] = useState('');
  const { appContext, error: appContextError, setAppContext } = useAppContext();

  // [修改] 将 initialPrompt 重命名为 currentPrompt，并用它来驱动表单
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

  useEffect(() => {
    const targetMode = mode === 'video' ? 'Generate a Video' : 'Generate an Image';
    if (targetMode !== generationMode) {
      setGenerationMode(targetMode);
      setGenerationErrorMsg('');
      setGeneratedImages([]);
      setGeneratedVideos([]);
      setCurrentPrompt(null); // [修改]
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      setPollingOperationName(null);
      setOperationMetadata(null);
      setIsLoading(false);
      if (mode !== 'video') {
        setInitialITVimage(null);
      }
    }
  }, [mode, generationMode]);

  useEffect(() => {
    if (appContext && appContext.promptToGenerateImage) {
      setGenerationMode('Generate an Image');
      setCurrentPrompt(appContext.promptToGenerateImage); // [修改]
      setAppContext((prevContext) => {
        if (prevContext) return { ...prevContext, promptToGenerateImage: '' };
        else return { ...appContextDataDefault, promptToGenerateImage: '' };
      });
    }
    if (appContext && appContext.promptToGenerateVideo) {
      setGenerationMode('Generate a Video');
      setCurrentPrompt(appContext.promptToGenerateVideo); // [修改]
      setAppContext((prevContext) => {
        if (prevContext) return { ...prevContext, promptToGenerateVideo: '' };
        else return { ...appContextDataDefault, promptToGenerateVideo: '' };
      });
    }
  }, [appContext?.promptToGenerateImage, appContext?.promptToGenerateVideo, setAppContext]);

  const [initialITVimage, setInitialITVimage] = useState<InterpolImageI | null>(null);
  useEffect(() => {
    const fetchAndSetImage = async () => {
      if (appContext && appContext.imageToVideo) {
        setGenerationMode('Generate a Video');
        try {
          const { data } = await downloadMediaFromGcs(appContext.imageToVideo);
          const newImage = `data:image/png;base64,${data}`;
          const img = new window.Image();
          img.onload = () => {
            const initialITVimage = {
              format: 'png',
              base64Image: newImage,
              purpose: 'first',
              ratio: getAspectRatio(img.width, img.height),
              width: img.width,
              height: img.height,
            };
            data && setInitialITVimage(initialITVimage as InterpolImageI);
            setAppContext((prevContext) => {
              if (prevContext) return { ...prevContext, imageToVideo: '' };
              else return { ...appContextDataDefault, imageToVideo: '' };
            });
          };
          img.onerror = () => { throw Error('Error loading image for dimension calculation.'); };
          img.src = newImage;
        } catch (error) { console.error('Error fetching image:', error); }
      }
    };
    fetchAndSetImage();
  }, [appContext?.imageToVideo, setAppContext]);

  const [pollingOperationName, setPollingOperationName] = useState<string | null>(null);
  const [operationMetadata, setOperationMetadata] = useState<OperationMetadataI | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptsRef = useRef<number>(0);
  const currentPollingIntervalRef = useRef<number>(INITIAL_POLLING_INTERVAL_MS);

  const handleRequestSent = (loading: boolean, count: number) => {
    setIsLoading(loading);
    setGenerationErrorMsg('');
    setGeneratedCount(count);
    setGeneratedImages([]);
    setGeneratedVideos([]);
  };

  const handleNewErrorMsg = (newErrorMsg: string) => {
    setIsLoading(false);
    setGenerationErrorMsg(newErrorMsg);
    if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
    setPollingOperationName(null);
    setOperationMetadata(null);
  };

  const handleImageGeneration = (newImages: ImageI[]) => {
    setGeneratedImages(newImages);
    setIsLoading(false);
    setGeneratedVideos([]);
    setGenerationErrorMsg('');
  };

  const handleVideoGenerationComplete = (newVideos: VideoI[]) => {
    setGeneratedVideos(newVideos);
    setGeneratedImages([]);
    setGenerationErrorMsg('');
  };

  const handleVideoPollingStart = (operationName: string, metadata: OperationMetadataI) => {
    if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
    setPollingOperationName(operationName);
    setOperationMetadata(metadata);
    pollingAttemptsRef.current = 0;
    currentPollingIntervalRef.current = INITIAL_POLLING_INTERVAL_MS;
  };

  // [ADD] The handler function that was missing
  const handleSampleSelect = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  useEffect(() => {
    const stopPolling = (isSuccess: boolean, finalLoadingState = false) => {
      if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
      setIsLoading(finalLoadingState);
    };
    const poll = async () => {
      if (!pollingOperationName || !operationMetadata) { stopPolling(false, false); return; }
      if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) { handleNewErrorMsg(`Video generation timed out...`); return; }
      pollingAttemptsRef.current++;
      try {
        const statusResult: VideoGenerationStatusResult = await getVideoGenerationStatus(pollingOperationName, appContext, operationMetadata.formData, operationMetadata.prompt);
        if (!pollingOperationName) { stopPolling(false, false); return; }
        if (statusResult.done) {
          if (statusResult.error) { handleNewErrorMsg(statusResult.error); }
          else if (statusResult.videos && statusResult.videos.length > 0) { handleVideoGenerationComplete(statusResult.videos); stopPolling(true, false); setPollingOperationName(null); setOperationMetadata(null); }
          else { handleNewErrorMsg('Video generation finished, but no valid results were returned.'); }
        } else {
          const jitter = currentPollingIntervalRef.current * JITTER_FACTOR * (Math.random() - 0.5);
          const nextInterval = Math.round(currentPollingIntervalRef.current + jitter);
          timeoutIdRef.current = setTimeout(poll, nextInterval);
          currentPollingIntervalRef.current = Math.min(currentPollingIntervalRef.current * BACKOFF_FACTOR, MAX_POLLING_INTERVAL_MS);
        }
      } catch (error: any) {
        if (!pollingOperationName) { stopPolling(false, false); return; }
        handleNewErrorMsg(error.message || 'An unexpected error occurred while checking the video status.');
      }
    };
    if (pollingOperationName && !timeoutIdRef.current) { timeoutIdRef.current = setTimeout(poll, currentPollingIntervalRef.current); }
    return () => { if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; } };
  }, [pollingOperationName, operationMetadata, appContext]);

  if (appContext?.isLoading === true) {
    return (
      <Box p={5}>
        <Typography variant="h3" sx={{ fontWeight: 400, color: appContextError === null ? 'primary.main' : 'error.main' }}>
          {appContextError === null ? 'Loading your profile content...' : 'Error while loading your profile content!'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid container spacing={3} sx={{ height: '100%', flexWrap: 'nowrap' }}>
        
        <Grid item xs={12} md={5} lg={4.5} xl={4} sx={{ 
          height: 'calc(100vh - 48px)', 
          overflowY: 'auto',
          pr: 1,
          '::-webkit-scrollbar': { width: '8px' },
          '::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' }
        }}>
          {generationMode === 'Generate an Image' && (
            <GenerateForm 
              // [MODIFY] Use a key to force re-render when prompt changes from gallery
              key={`image-form-${currentPrompt}`} 
              generationType="Image" 
              isLoading={isLoading} 
              onRequestSent={handleRequestSent} 
              onImageGeneration={handleImageGeneration} 
              onNewErrorMsg={handleNewErrorMsg} 
              errorMsg={generationErrorMsg} 
              randomPrompts={ImageRandomPrompts} 
              generationFields={imageGenerationUtils} 
              initialPrompt={currentPrompt ?? ''} // [MODIFY]
              promptIndication={'Describe your image...'} 
            />
          )}
          {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && generationMode === 'Generate a Video' && (
            <GenerateForm
              // [MODIFY] Use a key to force re-render when prompt changes from gallery
              key={`video-form-${currentPrompt}`}
              generationType="Video"
              isLoading={isLoading}
              onRequestSent={handleRequestSent}
              onVideoPollingStart={handleVideoPollingStart}
              onNewErrorMsg={handleNewErrorMsg}
              errorMsg={generationErrorMsg}
              randomPrompts={VideoRandomPrompts}
              generationFields={videoGenerationUtils}
              initialPrompt={currentPrompt ?? ''} // [MODIFY]
              initialITVimage={initialITVimage ?? undefined}
              promptIndication={'Describe your video...'}
            />
          )}
        </Grid>

        <Grid item xs={12} md={7} lg={7.5} xl={8} sx={{ height: '100%' }}>
          {generationMode === 'Generate an Image' ? (
            <ImagePreviewAndGalleryPanel
              isLoading={isLoading}
              generatedImages={generatedImages}
              generatedCount={generatedCount}
              onSampleSelect={handleSampleSelect} // [ADD] Pass the handler function
            />
          ) : (
            <PreviewAndGalleryPanel
              isLoading={isLoading}
              generatedVideos={generatedVideos}
              generatedCount={generatedCount}
              // @ts-ignore - We can ignore this for the video panel for now or implement it
              onSampleSelect={handleSampleSelect} 
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
