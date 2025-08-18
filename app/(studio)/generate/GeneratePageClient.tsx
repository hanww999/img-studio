// 文件路径: app/(studio)/generate/GeneratePageClient.tsx (最终完整版)

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

 const [generationMode, setGenerationMode] = useState('AI 图像创作');
 const [isLoading, setIsLoading] = useState(false);
 const [generatedImages, setGeneratedImages] = useState<ImageI[]>([]);
 const [generatedVideos, setGeneratedVideos] = useState<VideoI[]>([]);
 const [generatedCount, setGeneratedCount] = useState<number>(0);
 const [generationErrorMsg, setGenerationErrorMsg] = useState('');
 const { appContext, error: appContextError, setAppContext } = useAppContext();

 useEffect(() => {
  const targetMode = mode === 'video' ? 'AI 视频生成' : 'AI 图像创作';
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
   setGenerationMode('AI 图像创作');
   setInitialPrompt(appContext.promptToGenerateImage);
   setAppContext((prevContext) => {
    if (prevContext) return { ...prevContext, promptToGenerateImage: '' };
    else return { ...appContextDataDefault, promptToGenerateImage: '' };
   });
  }
  if (appContext && appContext.promptToGenerateVideo) {
   setGenerationMode('AI 视频生成');
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
    setGenerationMode('AI 视频生成');
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
      data && setInitialITVimage(initialITVimage as InterpolIma... (829 lines left)
