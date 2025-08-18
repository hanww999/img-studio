// 文件路径: app/(studio)/generate/GeneratePageClient.tsx (完整版)

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import GenerateForm from '../../ui/generate-components/GenerateForm';
import { useEffect, useRef, useState } from 'react';
import { imageGenerationUtils, ImageI, ImageRandomPrompts } from '../../api/generate-image-utils';
import OutputImagesDisplay from '../../ui/transverse-components/ImagenOutputImagesDisplay';
import { appContextDataDefault, useAppContext } from '../../context/app-context';
import { Paper, Typography } from '@mui/material';
import {
  InterpolImageI,
  OperationMetadataI,
  VideoGenerationStatusResult,
  videoGenerationUtils,
  VideoI,
  VideoRandomPrompts,
} from '../../api/generate-video-utils';
import { getVideoGenerationStatus } from '../../api/veo/action';
import OutputVideosDisplay from '../../ui/transverse-components/VeoOutputVideosDisplay';
import { downloadMediaFromGcs } from '../../api/cloud-storage/action';
import { getAspectRatio } from '../../ui/edit-components/EditImageDropzone';

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

  useEffect(() => {
    const targetMode = mode === 'video' ? 'Generate a Video' : 'Generate an Image';
    if (targetMode !== generationMode) {
      setGenerationMode(targetMode);
      setGenerationErrorMsg('');
      setGeneratedImages([]);
      setGeneratedVideos([]);
      setInitialPrompt(null);
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

  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  useEffect(() => {
    if (appContext && appContext.promptToGenerateImage) {
      setGenerationMode('Generate an Image');
      setInitialPrompt(appContext.promptToGenerateImage);
      setAppContext((prevContext) => {
        if (prevContext) return { ...prevContext, promptToGenerateImage: '' };
        else return { ...appContextDataDefault, promptToGenerateImage: '' };
      });
    }
    if (appContext && appContext.promptToGenerateVideo) {
      setGenerationMode('Generate a Video');
      setInitialPrompt(appContext.promptToGenerateVideo);
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
    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 48px)' }}>
      <Box sx={{ flex: '0 1 550px', minWidth: 450, maxWidth: 650, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {generationMode === 'Generate an Image' && (
            <GenerateForm key="image-form" generationType="Image" isLoading={isLoading} onRequestSent={handleRequestSent} onImageGeneration={handleImageGeneration} onNewErrorMsg={handleNewErrorMsg} errorMsg={generationErrorMsg} randomPrompts={ImageRandomPrompts} generationFields={imageGenerationUtils} initialPrompt={initialPrompt ?? ''} promptIndication={'Describe your image...'} />
          )}
          {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && generationMode === 'Generate a Video' && (
            <GenerateForm key="video-form" generationType="Video" isLoading={isLoading} onRequestSent={handleRequestSent} onVideoPollingStart={handleVideoPollingStart} onNewErrorMsg={handleNewErrorMsg} errorMsg={generationErrorMsg} randomPrompts={VideoRandomPrompts} generationFields={videoGenerationUtils} initialPrompt={initialPrompt ?? ''} initialITVimage={initialITVimage ?? undefined} promptIndication={'Describe your video...'} />
          )}
        </Paper>
      </Box>

      <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
        {generationMode === 'Generate an Image' ? (
          <OutputImagesDisplay isLoading={isLoading} generatedImagesInGCS={generatedImages} generatedCount={generatedCount} isPromptReplayAvailable={true} />
        ) : (
          <OutputVideosDisplay isLoading={isLoading} generatedVideosInGCS={generatedVideos} generatedCount={generatedCount} />
        )}
      </Box>
    </Box>
  );
}
