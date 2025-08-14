// app/ui/transverse-components/ImagenOutputImagesDisplay.tsx
'use client'
import * as React from 'react'
import { useState } from 'react'
import { CreateNewFolderRounded, Download, Edit, Favorite, VideocamRounded } from '@mui/icons-material'
import Image from 'next/image'
import { Avatar, Box, IconButton, Modal, Skeleton, ImageListItem, ImageList, ImageListItemBar, Typography, Stack } from '@mui/material'
import { ImageI } from '../../api/generate-image-utils'
import { CustomizedAvatarButton, CustomizedIconButton } from '../ux-components/Button-SX'
import ExportStepper, { downloadBase64Media } from './ExportDialog'
import DownloadDialog from './DownloadDialog'
import theme from '../../theme'
import { blurDataURL } from '../ux-components/BlurImage'
import { CustomWhiteTooltip } from '../ux-components/Tooltip'
import { appContextDataDefault, useAppContext } from '../../context/app-context'
import { useRouter } from 'next/navigation'
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action'
const { palette } = theme

export default function OutputImagesDisplay({
 isLoading,
 generatedImagesInGCS,
 generatedCount,
 isPromptReplayAvailable,
 isUpscaledDLAvailable = true,
}: {
 isLoading: boolean
 generatedImagesInGCS: ImageI[]
 generatedCount: number
 isPromptReplayAvailable: boolean
 isUpscaledDLAvailable?: boolean
}) {
 const [imageFullScreen, setImageFullScreen] = useState<ImageI | undefined>()
 const [imageToExport, setImageToExport] = useState<ImageI | undefined>()
 const [imageToDL, setImageToDL] = useState<ImageI | undefined>()
 const { setAppContext } = useAppContext()
 const router = useRouter()

 const handleMoreLikeThisClick = (prompt: string) => {
  setAppContext((prev) => ({ ...prev, promptToGenerateImage: prompt, promptToGenerateVideo: '' }))
    router.push('/generate?mode=image') // FIX: Ensure navigation to the correct mode
 }
 const handleEditClick = (imageGcsURI: string) => {
  setAppContext((prev) => ({ ...prev, imageToEdit: imageGcsURI }))
  router.push('/edit')
 }
 const handleITVClick = (imageGcsURI: string) => {
  setAppContext((prev) => ({ ...prev, imageToVideo: imageGcsURI }))
  router.push('/generate?mode=video') // FIX: Navigate to the same page but with video mode
 }
 const handleDLimage = async (image: ImageI) => { /* ... */ }

 return (
  <>
   <Box sx={{ height: '79vh', maxHeight: 650, width: '90%' }}>
      {/* ... (rest of the JSX is unchanged) ... */}
   </Box>
   {imageFullScreen && (<Modal open={true} onClose={() => setImageFullScreen(undefined)}>{/* ... */}</Modal>)}
   <ExportStepper open={imageToExport !== undefined} mediaToExport={imageToExport} handleMediaExportClose={() => setImageToExport(undefined)} />
   <DownloadDialog open={imageToDL !== undefined} mediaToDL={imageToDL} handleMediaDLClose={() => setImageToDL(undefined)} />
  </>
 )
}
