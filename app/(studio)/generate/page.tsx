// Copyright 2025 Google LLC
// ... (license header - assuming it's the same)

'use client';

import * as React from 'react';
// [新增] 导入 useSearchParams 以读取 URL 参数
import { useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import GenerateForm from '../../ui/generate-components/GenerateForm';
import { useEffect, useRef, useState } from 'react';
import { imageGenerationUtils, ImageI, ImageRandomPrompts } from '../../api/generate-image-utils';
import OutputImagesDisplay from '../../ui/transverse-components/ImagenOutputImagesDisplay';
import { appContextDataDefault, useAppContext } from '../../context/app-context';
import { Typography } from '@mui/material';

import theme from '../../theme';
const { palette } = theme;
import {
  InterpolImageI,
  OperationMetadataI,
  VideoGenerationStatusResult,
  videoGenerationUtils,
  VideoI,
  VideoRandomPrompts,
} from '../../api/generate-video-utils';
import { getVideoGenerationStatus } from '../../api/veo/action';
// [删除] ChipGroup 不再需要
// import { ChipGroup } from '../../ui/ux-components/InputChipGroup';
import OutputVideosDisplay from '../../ui/transverse-components/VeoOutputVideosDisplay';
import { downloadMediaFromGcs } from '../../api/cloud-storage/action';
import { getAspectRatio } from '../../ui/edit-components/EditImageDropzone';

// Video Polling Constants
const INITIAL_POLLING_INTERVAL_MS = 6000; // Start polling after 6 seconds
const MAX_POLLING_INTERVAL_MS = 60000; // Max interval 60 seconds
const BACKOFF_FACTOR = 1.2; // Increase interval by 20% each time
const MAX_POLLING_ATTEMPTS = 30; // Max 30 attempts
const JITTER_FACTOR = 0.2; // Add up to 20% jitter

export default function Page() {
  // [新增] 获取 URL 参数
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // [修改] generationMode 的状态现在由 URL 驱动
  const [generationMode, setGenerationMode] = useState('Generate an Image');

  const [isLoading, setIsLoading] = useState(false);

  const [generatedImages, setGeneratedImages] = useState<ImageI[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<VideoI[]>([]);
  const [generatedCount, setGeneratedCount] = useState<number>(0);

  const [generationErrorMsg, setGenerationErrorMsg] = useState('');
  const { appContext, error: appContextError, setAppContext } = useAppContext();

  // [新增] 新的 useEffect，用于根据 URL 参数设置页面模式
  useEffect(() => {
    // 默认是 image 模式
    const targetMode = mode === 'video' ? 'Generate a Video' : 'Generate an Image';
    if (targetMode !== generationMode) {
      setGenerationMode(targetMode);
      // 重置所有相关状态，确保模式切换时界面干净
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
      // 如果切换回图片模式，清除可能存在的 ITV 图片
      if (mode !== 'video') {
        setInitialITVimage(null);
      }
    }
  }, [mode, generationMode]);

  // [保留] 这个 useEffect 处理从 Library 页面跳转过来的情况，逻辑正确，予以保留
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
  }, [appContext?.promptToGenerateImage, appContext?.promptToGenerateVideo]);

  // [保留] 这个 useEffect 处理 Image-to-Video 流程，逻辑正确，予以保留
  const [initialITVimage, setInitialITVimage] = useState<InterpolImageI | null>(null);
  useEffect(() => {
    const fetchAndSetImage = async () => {
      if (appContext && appContext.imageToVideo) {
        // 即使 URL 不是 video 模式，只要 context 中有 imageToVideo，就强制切换
        setGenerationMode('Generate a Video');
        try {
          const { data } = await downloadMediaFromGcs(appContext.imageToVideo);
          const newImage = `data:image/png;base64,${data}`;

          const img = new window.Image();

          img.onload = () => {
            const width = img.width;
            const height = img.height;
            const ratio = getAspectRatio(img.width, img.height);

            const initialITVimage = {
              format: 'png',
              base64Image: newImage,
              purpose: 'first',
              ratio: ratio,
              width: width,
              height: height,
            };

            data && setInitialITVimage(initialITVimage as InterpolImageI);

            // 使用后立即清除 context 中的状态
            setAppContext((prevContext) => {
              if (prevContext) return { ...prevContext, imageToVideo: '' };
              else return { ...appContextDataDefault, imageToVideo: '' };
            });
          };

          img.onerror = () => {
            throw Error('Error loading image for dimension calculation.');
          };

          img.src = newImage;
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }
    };

    fetchAndSetImage();
  }, [appContext?.imageToVideo, setAppContext]);

  // Video Polling State
  const [pollingOperationName, setPollingOperationName] = useState<string | null>(null);
  const [operationMetadata, setOperationMetadata] = useState<OperationMetadataI | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptsRef = useRef<number>(0);
  const currentPollingIntervalRef = useRef<number>(INITIAL_POLLING_INTERVAL_MS);

  // [删除] generationModeSwitch 函数不再需要，因为模式由 URL 控制
  /*
  const generationModeSwitch = ({ clickedValue }: { clickedValue: string }) => {
    // ...
  };
  */

  // Handler called when GenerateForm starts ANY request
  const handleRequestSent = (loading: boolean, count: number) => {
    setIsLoading(loading);
    setGenerationErrorMsg('');
    setGeneratedCount(count);
    setGeneratedImages([]);
    setGeneratedVideos([]);
  };

  // Handler called on ANY final error (initial or polling) or polling timeout
  const handleNewErrorMsg = (newErrorMsg: string) => {
    setIsLoading(false);
    setGenerationErrorMsg(newErrorMsg);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setPollingOperationName(null); // Stop further polling by clearing operation name
    setOperationMetadata(null);
  };

  // Handler for successful IMAGE generation completion
  const [isPromptReplayAvailable, setIsPromptReplayAvailable] = useState(true);
  const handleImageGeneration = (newImages: ImageI[]) => {
    setGeneratedImages(newImages);
    setIsLoading(false);
    setGeneratedVideos([]);
    setGenerationErrorMsg('');
  };

  // Handler for successful VIDEO generation completion (called by polling effect)
  const handleVideoGenerationComplete = (newVideos: VideoI[]) => {
    setGeneratedVideos(newVideos);
    setGeneratedImages([]);
    setGenerationErrorMsg('');
    // isLoading is set to false within the polling effect's stopPolling call
  };

  // Handler called by GenerateForm ONLY when video generation is initiated successfully
  const handleVideoPollingStart = (operationName: string, metadata: OperationMetadataI) => {
    // Clear any existing polling timeout if a new generation starts
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setPollingOperationName(operationName);
    setOperationMetadata(metadata);
    pollingAttemptsRef.current = 0;
    currentPollingIntervalRef.current = INITIAL_POLLING_INTERVAL_MS;
    // setIsLoading(true) is handled by onRequestSent
  };

  // [保留] Video generation polling useEffect 逻辑完全正确，予以保留
  useEffect(() => {
    const stopPolling = (isSuccess: boolean, finalLoadingState = false) => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      setIsLoading(finalLoadingState);
    };

    const poll = async () => {
      if (!pollingOperationName || !operationMetadata) {
        console.warn('Poll called without active operation details.');
        stopPolling(false, false);
        return;
      }

      if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
        console.error(`Polling timeout for operation: ${pollingOperationName} after ${MAX_POLLING_ATTEMPTS} attempts.`);
        handleNewErrorMsg(
          `Video generation timed out after ${MAX_POLLING_ATTEMPTS} attempts. Please check operation status manually or try again.`
        );
        return;
      }

      pollingAttemptsRef.current++;

      try {
        const statusResult: VideoGenerationStatusResult = await getVideoGenerationStatus(
          pollingOperationName,
          appContext,
          operationMetadata.formData,
          operationMetadata.prompt
        );

        if (!pollingOperationName) {
          console.log('Polling stopped externally (operation name cleared) during async operation.');
          stopPolling(false, false);
          return;
        }

        if (statusResult.done) {
          if (statusResult.error) {
            handleNewErrorMsg(statusResult.error);
          } else if (statusResult.videos && statusResult.videos.length > 0) {
            handleVideoGenerationComplete(statusResult.videos);
            stopPolling(true, false);
            setPollingOperationName(null);
            setOperationMetadata(null);
          } else {
            console.warn(
              `Polling done, but no videos or error for ${pollingOperationName}. Videos array empty or undefined.`
            );
            handleNewErrorMsg('Video generation finished, but no valid results were returned.');
          }
        } else {
          const jitter = currentPollingIntervalRef.current * JITTER_FACTOR * (Math.random() - 0.5);
          const nextInterval = Math.round(currentPollingIntervalRef.current + jitter);
          timeoutIdRef.current = setTimeout(poll, nextInterval);
          currentPollingIntervalRef.current = Math.min(
            currentPollingIntervalRef.current * BACKOFF_FACTOR,
            MAX_POLLING_INTERVAL_MS
          );
        }
      } catch (error: any) {
        console.error(
          `Error during polling attempt ${pollingAttemptsRef.current} for ${pollingOperationName}:`,
          error.response?.data || error.message || error
        );
        if (!pollingOperationName) {
          console.log('Polling stopped externally (operation name cleared) during async error handling.');
          stopPolling(false, false);
          return;
        }
        const errorMessage = error.message || 'An unexpected error occurred while checking the video status.';
        handleNewErrorMsg(errorMessage);
      }
    };

    if (pollingOperationName && !timeoutIdRef.current) {
      timeoutIdRef.current = setTimeout(poll, currentPollingIntervalRef.current);
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        console.log(
          `Cleaned up active polling timeout on effect cleanup/re-run for ${
            pollingOperationName || 'previous operation'
          }`
        );
        timeoutIdRef.current = null;
      }
    };
  }, [pollingOperationName, operationMetadata, appContext]);

  if (appContext?.isLoading === true) {
    return (
      <Box p={5}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 400, color: appContextError === null ? palette.primary.main : palette.error.main }}
        >
          {appContextError === null
            ? 'Loading your profile content...'
            : 'Error while loading your profile content! Retry or contact you IT admin.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={5} sx={{ maxHeight: '100vh' }}>
      <Grid wrap="nowrap" container spacing={6} direction="row" columns={2}>
        <Grid size={1.1} flex={0} sx={{ maxWidth: 700, minWidth: 610 }}>
          {/* [删除] ChipGroup 组件被移除 */}

          {/* [新增] 添加一个标题来显示当前模式 */}
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 500, color: 'white' }}>
            {generationMode}
          </Typography>

          {generationMode === 'Generate an Image' && (
            <GenerateForm
              key="image-form"
              generationType="Image"
              isLoading={isLoading}
              onRequestSent={handleRequestSent}
              onImageGeneration={handleImageGeneration}
              onNewErrorMsg={handleNewErrorMsg}
              errorMsg={generationErrorMsg}
              randomPrompts={ImageRandomPrompts}
              generationFields={imageGenerationUtils}
              initialPrompt={initialPrompt ?? ''}
              promptIndication={
                'Describe your image: subjects, visual looks, actions, arrangement, setting (time/ place/ weather), style, lighting, colors, mood'
              }
            />
          )}

          {process.env.NEXT_PUBLIC_VEO_ENABLED === 'true' && generationMode === 'Generate a Video' && (
            <GenerateForm
              key="video-form"
              generationType="Video"
              isLoading={isLoading}
              onRequestSent={handleRequestSent}
              onVideoPollingStart={handleVideoPollingStart}
              onNewErrorMsg={handleNewErrorMsg}
              errorMsg={generationErrorMsg}
              randomPrompts={VideoRandomPrompts}
              generationFields={videoGenerationUtils}
              initialPrompt={initialPrompt ?? ''}
              initialITVimage={initialITVimage ?? undefined}
              promptIndication={
                'Describe your video: subjects, visual looks, actions, arrangement, movements, camera motion, setting (time/ place/ weather), style, lighting, colors, mood'
              }
            />
          )}
        </Grid>
        <Grid size={0.9} flex={1} sx={{ pt: 14, maxWidth: 850, minWidth: 400 }}>
          {generationMode === 'Generate an Image' ? (
            <OutputImagesDisplay
              isLoading={isLoading}
              generatedImagesInGCS={generatedImages}
              generatedCount={generatedCount}
              isPromptReplayAvailable={true}
            />
          ) : (
            <OutputVideosDisplay
              isLoading={isLoading}
              generatedVideosInGCS={generatedVideos}
              generatedCount={generatedCount}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
