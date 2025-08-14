// app/(studio)/generate/page.tsx
'use client'

import * as React from 'react'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import GenerateForm from '../../ui/generate-components/GenerateForm'
import { useEffect, useRef, useState } from 'react'
import { imageGenerationUtils, ImageI, ImageRandomPrompts } from '../../api/generate-image-utils'
import OutputImagesDisplay from '../../ui/transverse-components/ImagenOutputImagesDisplay'
import { appContextDataDefault, useAppContext } from '../../context/app-context'
import { Typography } from '@mui/material'
import theme from '../../theme'
import { InterpolImageI, OperationMetadataI, VideoGenerationStatusResult, videoGenerationUtils, VideoI, VideoRandomPrompts } from '../../api/generate-video-utils'
import { getVideoGenerationStatus } from '../../api/veo/action'
import { ChipGroup } from '../../ui/ux-components/InputChipGroup'
import OutputVideosDisplay from '../../ui/transverse-components/VeoOutputVideosDisplay'
import { downloadMediaFromGcs } from '../../api/cloud-storage/action'
import { getAspectRatio } from '../../ui/edit-components/EditImageDropzone'
import { useSearchParams } from 'next/navigation'

const { palette } = theme

const INITIAL_POLLING_INTERVAL_MS = 6000
const MAX_POLLING_INTERVAL_MS = 60000
const BACKOFF_FACTOR = 1.2
const MAX_POLLING_ATTEMPTS = 30
const JITTER_FACTOR = 0.2

export default function Page() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'video' ? 'Generate a Video' : 'Generate an Image'
  const [generationMode, setGenerationMode] = useState(initialMode)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<ImageI[]>([])
  const [generatedVideos, setGeneratedVideos] = useState<VideoI[]>([])
  const [generatedCount, setGeneratedCount] = useState<number>(0)
  const [generationErrorMsg, setGenerationErrorMsg] = useState('')
  const { appContext, error: appContextError, setAppContext } = useAppContext()

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'video' && generationMode !== 'Generate a Video') {
        setGenerationMode('Generate a Video')
    } else if (mode !== 'video' && generationMode !== 'Generate an Image') {
        setGenerationMode('Generate an Image')
    }
  }, [searchParams, generationMode])

 // Handle 'Replay prompt' from Library
 const [initialPrompt, setInitialPrompt] = useState<string | null>(null)
 useEffect(() => {
 if (appContext && appContext.promptToGenerateImage) {
  setGenerationMode('Generate an Image')
  setInitialPrompt(appContext.promptToGenerateImage)
    // FIX: Ensure we spread a valid object, not null
  setAppContext((prev) => ({ ...(prev || appContextDataDefault), promptToGenerateImage: '' }))
 }
 if (appContext && appContext.promptToGenerateVideo) {
  setGenerationMode('Generate a Video')
  setInitialPrompt(appContext.promptToGenerateVideo)
    // FIX: Ensure we spread a valid object, not null
  setAppContext((prev) => ({ ...(prev || appContextDataDefault), promptToGenerateVideo: '' }))
 }
 }, [appContext, setAppContext])

 // Handle Image to video from generated or edited image
 const [initialITVimage, setInitialITVimage] = useState<InterpolImageI | null>(null)
 useEffect(() => {
 const fetchAndSetImage = async () => {
  if (appContext && appContext.imageToVideo) {
  setGenerationMode('Generate a Video')
  try {
   const { data } = await downloadMediaFromGcs(appContext.imageToVideo)
   const newImage = `data:image/png;base64,${data}`
   const img = new window.Image()
   img.onload = () => {
   const initialITVimage = {
    format: 'png', base64Image: newImage, purpose: 'first',
    ratio: getAspectRatio(img.width, img.height), width: img.width, height: img.height,
   }
   setInitialITVimage(initialITVimage as InterpolImageI)
    // FIX: Ensure we spread a valid object, not null
   setAppContext((prev) => ({ ...(prev || appContextDataDefault), imageToVideo: '' }))
   }
   img.onerror = () => { throw Error('Error loading image.') }
   img.src = newImage
  } catch (error) { console.error('Error fetching image:', error) }
  }
 }
 fetchAndSetImage()
 }, [appContext, setAppContext])

 // ... (All other logic, handlers, and the polling useEffect remain exactly the same) ...
  const [pollingOperationName, setPollingOperationName] = useState<string | null>(null)
  const [operationMetadata, setOperationMetadata] = useState<OperationMetadataI | null>(null)
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  const pollingAttemptsRef = useRef<number>(0)
  const currentPollingIntervalRef = useRef<number>(INITIAL_POLLING_INTERVAL_MS)

  const generationModeSwitch = ({ clickedValue }: { clickedValue: string }) => {
    if (clickedValue !== generationMode && !isLoading) {
      setGenerationMode(clickedValue)
      setGenerationErrorMsg('')
      setGeneratedImages([])
      setGeneratedVideos([])
      setInitialPrompt(null)
      if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; }
      setPollingOperationName(null)
      setOperationMetadata(null)
      setIsLoading(false)
      if (clickedValue === 'Generate an Image') setInitialITVimage(null)
    }
  }
  const handleRequestSent = (loading: boolean, count: number) => { setIsLoading(loading); setGenerationErrorMsg(''); setGeneratedCount(count); setGeneratedImages([]); setGeneratedVideos([]); }
  const handleNewErrorMsg = (newErrorMsg: string) => { setIsLoading(false); setGenerationErrorMsg(newErrorMsg); if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; } setPollingOperationName(null); setOperationMetadata(null); }
  const [isPromptReplayAvailable, setIsPromptReplayAvailable] = useState(true)
  const handleImageGeneration = (newImages: ImageI[]) => { setGeneratedImages(newImages); setIsLoading(false); setGeneratedVideos([]); setGenerationErrorMsg(''); }
  const handleVideoGenerationComplete = (newVideos: VideoI[]) => { setGeneratedVideos(newVideos); setGeneratedImages([]); setGenerationErrorMsg(''); }
  const handleVideoPollingStart = (operationName: string, metadata: OperationMetadataI) => { if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; } setPollingOperationName(operationName); setOperationMetadata(metadata); pollingAttemptsRef.current = 0; currentPollingIntervalRef.current = INITIAL_POLLING_INTERVAL_MS; }
  useEffect(() => {
    const stopPolling = (isSuccess: boolean, finalLoadingState = false) => { if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; } setIsLoading(finalLoadingState); }
    const poll = async () => {
      if (!pollingOperationName || !operationMetadata) { stopPolling(false, false); return; }
      if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) { handleNewErrorMsg(`Video generation timed out after ${MAX_POLLING_ATTEMPTS} attempts.`); return; }
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
        const errorMessage = error.message || 'An unexpected error occurred while checking the video status.';
        handleNewErrorMsg(errorMessage);
      }
    }
    if (pollingOperationName && !timeoutIdRef.current) { timeoutIdRef.current = setTimeout(poll, currentPollingIntervalRef.current); }
    return () => { if (timeoutIdRef.current) { clearTimeout(timeoutIdRef.current); timeoutIdRef.current = null; } }
  }, [pollingOperationName, operationMetadata, appContext]);


 if (appContext?.isLoading === true) {
 return (
  <Box p={5}>
  <Typography variant="h3" sx={{ fontWeight: 400, color: appContextError === null ? palette.primary.main : palette.error.main }}>
   {appContextError === null ? 'Loading your profile content...' : 'Error while loading your profile content!'}
  </Typography>
  </Box>
 )
 }

 return (
 <Box p={5} sx={{ maxHeight: '100vh' }}>
  <Grid wrap="nowrap" container spacing={6} direction="row" columns={2}>
  <Grid size={1.1} flex={0} sx={{ maxWidth: 700, minWidth: 610 }}>
   <ChipGroup
   width={'100%'}
   required={false}
   options={['Generate an Image', 'Generate a Video']}
   value={generationMode}
   disabled={isLoading || process.env.NEXT_PUBLIC_VEO_ENABLED !== 'true'}
   onChange={generationModeSwitch}
   handleChipClick={generationModeSwitch}
   weight={500}
   />
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
    promptIndication={'Describe your image...'}
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
    promptIndication={'Describe your video...'}
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
 )
}
