// 文件路径: app/ui/transverse-components/VeoOutputVideosDisplay.tsx

'use client'

import * as React from 'react'
import { useRef, useState } from 'react'

import { CreateNewFolderRounded, Download, FileUpload, PlayArrowRounded } from '@mui/icons-material'

import {
 Avatar,
 Box,
 IconButton,
 Modal,
 Skeleton,
 ImageListItem,
 ImageList,
 ImageListItemBar,
 Stack,
 CircularProgress,
 Typography,
} from '@mui/material'

import { VideoI } from '../../api/generate-video-utils'
import { CustomizedAvatarButton, CustomizedIconButton } from '../ux-components/Button-SX'
import ExportStepper, { downloadBase64Media } from './ExportDialog'

import theme from '../../theme'
import { CustomWhiteTooltip } from '../ux-components/Tooltip'
import { downloadMediaFromGcs } from '@/app/api/cloud-storage/action'
const { palette } = theme

export default function OutputVideosDisplay({
 isLoading,
 generatedVideosInGCS,
 generatedCount,
}: {
 isLoading: boolean
 generatedVideosInGCS: VideoI[]
 generatedCount: number
}) {
 // [保留] 所有现有的 state 和 handler 函数都完整保留
 const [videoFullScreen, setVideoFullScreen] = useState<VideoI | undefined>()
 const handleOpenVideoFullScreen = (video: VideoI) => setVideoFullScreen(video)
 const handleCloseVideoFullScreen = () => {
  if (fullScreenVideoRef.current) {
   fullScreenVideoRef.current.pause()
   fullScreenVideoRef.current.currentTime = 0
  }
  setVideoFullScreen(undefined)
 }
 const handleContextMenuVideo = (event: React.MouseEvent<HTMLVideoElement>) => {
  event.preventDefault()
 }

 const fullScreenVideoRef = useRef<HTMLVideoElement>(null)

 const [videoExportOpen, setVideoExportOpen] = useState(false)
 const [videoToExport, setVideoToExport] = useState<VideoI | undefined>()
 const handleVideoExportOpen = (video: VideoI) => {
  setVideoToExport(video)
  setVideoExportOpen(true)
 }
 const handleVideoExportClose = () => {
  setVideoToExport(undefined)
  setVideoExportOpen(false)
 }

 const [isDLloading, setIsDLloading] = useState(false)
 const handleDLvideo = async (video: VideoI) => {
  setIsDLloading(true)
  try {
   const res = await downloadMediaFromGcs(video.gcsUri)
   const name = `${video.key}.${video.format.toLowerCase()}`
   downloadBase64Media(res.data, name, video.format)

   if (typeof res === 'object' && res.error) throw Error(res.error.replaceAll('Error: ', ''))
  } catch (error: any) {
   throw Error(error)
  } finally {
   setIsDLloading(false)
  }
 }

 return (
  <>
   {/* [修改] 将根 <Box> 的样式调整为100%，使其填满父容器 */}
   <Box
    sx={{
     height: '100%',
     width: '100%',
     display: 'flex',
     justifyContent: 'center',
     alignItems: 'center',
      p: 1,
    }}
   >
    {isLoading ? (
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={50} />
        <Typography variant="h6" color="text.secondary">正在生成中，请稍候...</Typography>
      </Stack>
    // [新增] 增加一个当没有视频时的默认显示状态
    ) : generatedVideosInGCS.length === 0 ? (
      <Typography variant="h5" color="text.secondary">您的生成结果将显示在这里</Typography>
    ) : (
     <ImageList
      cols={generatedCount > 1 ? 2 : 1}
      gap={16}
      // [修改] 让 ImageList 也能更好地适应
      sx={{ width: '100%', height: '100%', margin: 0, cursor: 'pointer', overflowY: 'auto' }}
     >
      {generatedVideosInGCS.map((video) =>
       video.src ? (
        <ImageListItem
         key={video.key}
         sx={{
          boxShadow: '0px 5px 10px -1px rgb(0 0 0 / 70%)',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          overflow: 'hidden',
            borderRadius: 2,
         }}
        >
         <video
          src={video.src}
          width={video.width}
          height={video.height}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          playsInline
          muted
          onContextMenu={handleContextMenuVideo}
          preload="metadata"
         />
         <PlayArrowRounded
          sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           fontSize: '4rem',
           color: 'rgba(255, 255, 255, 0.89)',
           zIndex: 2,
           pointerEvents: 'none',
          }}
         />
         <Box
          sx={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           backgroundColor: 'rgba(0, 0, 0, 0.5)',
           color: 'white',
           opacity: 0,
           transition: 'opacity 0.3s ease',
           '&:hover': {
            opacity: 1,
           },
          }}
          onClick={() => handleOpenVideoFullScreen(video)}
         />

         <ImageListItemBar
          sx={{
           height: 10,
           display: 'flex',
           backgroundColor: 'transparent',
           flexWrap: 'wrap',
           '&:hover': {
            backgroundColor: 'transparent',
            border: 0,
            boxShadow: 0,
           },
          }}
          position="top"
          actionIcon={
           <Stack direction="row" gap={0} pb={3}>
            <CustomWhiteTooltip title="Export to library" size="small">
             <IconButton
              onClick={() => handleVideoExportOpen(video)}
              aria-label="Export video"
              sx={{
               pr: 0.5,
               pl: 0.5,
               '&:hover': {
                backgroundColor: 'transparent',
                border: 0,
                boxShadow: 0,
              },
              }}
             >
              <Avatar sx={CustomizedAvatarButton}>
               <CreateNewFolderRounded sx={CustomizedIconButton} />
              </Avatar>
             </IconButton>
            </CustomWhiteTooltip>
            <CustomWhiteTooltip title="Download locally" size="small">
             <IconButton
              onClick={() => handleDLvideo(video)}
              aria-label="Download video"
              sx={{
               pr: 1,
               pl: 0,
               '&:hover': {
                backgroundColor: 'transparent',
                border: 0,
                boxShadow: 0,
               },
              }}
             >
              <Avatar sx={CustomizedAvatarButton}>
               {isDLloading ? (
                <CircularProgress size={18} thickness={6} color="primary" />
               ) : (
                <Download sx={CustomizedIconButton} />
               )}
              </Avatar>
             </IconButton>
            </CustomWhiteTooltip>
           </Stack>
          }
         />
        </ImageListItem>
       ) : null
      )}
     </ImageList>
    )}
   </Box>

   {/* [保留] Modal 和 ExportStepper 的 JSX 和逻辑完全不变 */}
   {videoFullScreen !== undefined && (
    <Modal
     open={videoFullScreen !== undefined}
     onClose={handleCloseVideoFullScreen}
     sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
     }}
     onClick={handleCloseVideoFullScreen}
     disableAutoFocus={true}
    >
     <Box
      sx={{
       aspectRatio: `${videoFullScreen.ratio.replace(':', '/')}`,
       maxWidth: '65vw',
       maxHeight: '65vh',
       bgcolor: 'black',
       display: 'flex',
      }}
      onClick={(e) => e.stopPropagation()}
     >
      <video
       key={'displayed-video'}
       ref={fullScreenVideoRef}
       src={videoFullScreen.src}
       controls
       controlsList="nodownload noplaybackrate nopictureinpicture"
       preload="metadata"
       style={{
        width: '100%',
        height: '100%',
        display: 'block',
        outline: 'none',
        objectFit: 'contain',
       }}
       onContextMenu={handleContextMenuVideo}
        autoPlay
      />
     </Box>
    </Modal>
   )}
   <ExportStepper
    open={videoExportOpen}
    upscaleAvailable={false}
    mediaToExport={videoToExport}
    handleMediaExportClose={handleVideoExportClose}
   />
  </>
 )
}
