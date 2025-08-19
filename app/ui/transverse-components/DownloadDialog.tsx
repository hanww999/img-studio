import * as React from 'react'
import { useState } from 'react'

import {
 Dialog,
 DialogContent,
 DialogTitle,
 IconButton,
 RadioGroup,
 Slide,
 Box,
 Button,
 Typography,
 FormControlLabel,
 FormControl,
} from '@mui/material'
import { ImageI } from '../../api/generate-image-utils'
import { TransitionProps } from '@mui/material/transitions'
import { CustomizedSendButton } from '../ux-components/Button-SX'
import { Close, Send, WatchLater } from '@mui/icons-material'
import { CustomRadioButton, CustomRadioLabel } from '../ux-components/InputRadioButton'

import theme from '../../theme'
import { downloadMediaFromGcs } from '../../api/cloud-storage/action'
import { upscaleImage } from '../../api/imagen/action'
import { useAppContext } from '../../context/app-context'
import { ExportAlerts } from './ExportAlerts'

const { palette } = theme

const Transition = React.forwardRef(function Transition(
 props: TransitionProps & {
  children: React.ReactElement<any, any>
 },
 ref: React.Ref<unknown>
) {
 return <Slide direction="up" ref={ref} {...props} />
})

export const downloadBase64Media = (base64Data: any, filename: string, format: string) => {
 const link = document.createElement('a')
 link.href = `data:${format};base64,${base64Data}`
 link.download = filename
 document.body.appendChild(link)
 link.click()
 document.body.removeChild(link)
}

export default function DownloadDialog({
 open,
 mediaToDL,
 handleMediaDLClose,
}: {
 open: boolean
 mediaToDL: ImageI | undefined
 handleMediaDLClose: () => void
}) {
 const [upscaleFactor, setUpscaleFactor] = useState('no')
 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setUpscaleFactor((event.target as HTMLInputElement).value)
 }

 const [status, setStatus] = useState('')
 const [errorMsg, setErrorMsg] = useState('')

 const { appContext } = useAppContext()

 const handleImageDL = async () => {
  setStatus('正在开始...') // [汉化]

  const media = mediaToDL

  if (media) {
   try {
    // 1. Upscale if needed
    let res
    if (upscaleFactor === 'x2' || upscaleFactor === 'x4') {
     try {
      setStatus('正在放大...') // [汉化]

      res = await upscaleImage({ uri: media.gcsUri }, upscaleFactor, appContext)
      if (typeof res === 'object' && 'error' in res && res.error) throw Error(res.error.replaceAll('Error: ', ''))

      media.gcsUri = res.newGcsUri
     } catch (error: any) {
      throw Error(error)
     }
    }

    // 2. DL locally
    try {
     setStatus('正在准备下载...') // [汉化]
     const res = await downloadMediaFromGcs(media.gcsUri)
     const name = `${media.key}.${media.format.toLowerCase()}`
     downloadBase64Media(res.data, name, media.format)

     if (typeof res === 'object' && res.error) throw Error(res.error.replaceAll('Error: ', ''))
    } catch (error: any) {
     throw Error(error)
    }

    setStatus('')
    onClose()
   } catch (error: any) {
    console.log(error)
    setErrorMsg('放大图片时出错') // [汉化]
   }
  }
 }

 const onClose = () => {
  handleMediaDLClose()
  setErrorMsg('')
 }

 const isTooLarge = (width: number, height: number) => width > 5000 || height > 5000

 return (
  <Dialog
   open={open}
   onClose={onClose}
   aria-describedby="parameter the upscale of the media"
   TransitionComponent={Transition}
   PaperProps={{
    sx: {
     p: 1,
     cursor: 'pointer',
     borderRadius: 1,
      // [颜色修复] 使用主题中的 paper 背景色
     background: palette.background.paper,
     maxWidth: '350px',
    },
   }}
  >
   <IconButton
    aria-label="close"
    onClick={onClose}
    sx={{
     position: 'absolute',
     right: 8,
     top: 8,
     color: palette.secondary.dark,
    }}
   >
    <Close sx={{ fontSize: '1.5rem', '&:hover': { color: palette.primary.main } }} />
   </IconButton>
   <DialogContent sx={{ m: 1 }}>
    <DialogTitle sx={{ p: 0, pb: 1 }}>
     <Typography
      sx={{
       fontSize: '1.7rem',
       color: palette.text.primary,
       fontWeight: 400,
       display: 'flex',
       alignContent: 'center',
      }}
     >
          {/* [汉化] */}
      {'下载图片'}
     </Typography>
    </DialogTitle>
    <Typography variant="subtitle1" color={palette.secondary.main} sx={{ pl: 0, width: '90%' }}>
        {/* [汉化] */}
     {'您可以提升分辨率以获得更清晰锐利的外观。'}
    </Typography>
    <FormControl>
     <RadioGroup value={upscaleFactor} onChange={handleChange} sx={{ p: 2, pl: 0.5 }}>
      <FormControlLabel
       value="no"
       control={<CustomRadioButton />}
       label={CustomRadioLabel(
        'no',
            // [汉化]
        '不放大',
        mediaToDL ? `${mediaToDL.width} x ${mediaToDL.height} px` : '',
        upscaleFactor,
        true
       )}
      />
      <FormControlLabel
       value="x2"
       control={<CustomRadioButton />}
       label={CustomRadioLabel(
        'x2',
            // [汉化]
        '放大 x2',
        mediaToDL && isTooLarge(mediaToDL.width * 2, mediaToDL.height * 2)
         ? '不可用，图片尺寸过大' // [汉化]
         : mediaToDL
         ? `${mediaToDL.width * 2} x ${mediaToDL.height * 2} px`
         : '',
        upscaleFactor,
        true
       )}
       disabled={mediaToDL && isTooLarge(mediaToDL.width * 2, mediaToDL.height * 2)}
      />
      <FormControlLabel
       value="x4"
       control={<CustomRadioButton />}
       label={CustomRadioLabel(
        'x4',
            // [汉化]
        '放大 x4',
        mediaToDL && isTooLarge(mediaToDL.width * 4, mediaToDL.height * 4)
         ? '不可用，图片尺寸过大' // [汉化]
         : mediaToDL
         ? `${mediaToDL.width * 4} x ${mediaToDL.height * 4} px`
         : '',
        upscaleFactor,
        true
       )}
       disabled={mediaToDL && isTooLarge(mediaToDL.width * 4, mediaToDL.height * 4)}
      />
     </RadioGroup>
    </FormControl>

    <Box sx={{ m: 0, display: 'flex', justifyContent: 'flex-start' }}>
     <Button
      type="submit"
      variant="contained"
      disabled={status !== ''}
      onClick={handleImageDL}
      endIcon={status !== '' ? <WatchLater /> : <Send />}
      sx={CustomizedSendButton}
     >
          {/* [汉化] */}
      {status ? status : '下载'}
     </Button>
    </Box>
   </DialogContent>

   {errorMsg !== '' && (
    <ExportAlerts
     message={errorMsg}
     style="error"
     onClose={() => {
      setErrorMsg('')
      setStatus('')
     }}
    />
   )}
  </Dialog>
 )
}
