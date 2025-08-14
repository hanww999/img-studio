'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton,
  Slide, Stack, TextField, Typography, LinearProgress, Alert
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Check, Close, Replay, Send, Movie as MovieIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

import { getPromptFromVideoFromGemini } from '@/app/api/gemini/action';
import { CustomizedSendButton } from '../ux-components/Button-SX';
import theme from '../../theme';
const { palette } = theme;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function VideoDropzone({ onVideoSelect, onUploadError }: { onVideoSelect: (file: File) => void, onUploadError: (msg: string) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onVideoSelect(acceptedFiles[0]);
      }
    },
    accept: { 'video/mp4': ['.mp4'], 'video/quicktime': ['.mov'] },
    maxSize: 100 * 1024 * 1024, // 100 MB limit
    onDropRejected: (fileRejections) => {
      onUploadError(`File rejected: ${fileRejections[0].errors[0].message}`);
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        width: 280, height: 280, border: `2px dashed ${palette.secondary.light}`, borderRadius: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', cursor: 'pointer', bgcolor: isDragActive ? palette.action.hover : 'transparent',
        transition: 'background-color 0.2s ease-in-out', p: 2
      }}
    >
      <input {...getInputProps()} />
      <MovieIcon sx={{ fontSize: 60, color: palette.secondary.main }} />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>
        {isDragActive ? 'Drop the video here...' : 'Drag & drop a video here, or click to select (.mp4, .mov, max 100MB)'}
      </Typography>
    </Box>
  );
}

export default function VideoToPromptModal({
  open,
  setNewPrompt,
  setVideoToPromptOpen,
}: {
  open: boolean;
  setNewPrompt: (newPrompt: string) => void;
  setVideoToPromptOpen: (state: boolean) => void;
}) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    setErrorMsg('');
  };

  const handleGeneratePrompt = async () => {
    if (!videoFile) {
      setErrorMsg('Please select a video file first.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setPrompt('');

    try {
      // Step 1: Upload video to GCS via our API route
      const formData = new FormData();
      formData.append('file', videoFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload video.');
      }

      const { gcsUri } = await uploadResponse.json();
      if (!gcsUri) {
        throw new Error('Server did not return a GCS URI.');
      }

      // Step 2: Call Gemini with the GCS URI
      const geminiReturnedPrompt = await getPromptFromVideoFromGemini(gcsUri);

      if (typeof geminiReturnedPrompt === 'object' && 'error' in geminiReturnedPrompt) {
        setErrorMsg(geminiReturnedPrompt.error);
      } else {
        setPrompt(geminiReturnedPrompt as string);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const onValidate = () => {
    if (prompt) setNewPrompt(prompt);
    onClose();
  };

  const onReset = () => {
    setErrorMsg('');
    setIsLoading(false);
    setVideoFile(null);
    setPrompt('');
  };

  const onClose = () => {
    setVideoToPromptOpen(false);
    onReset();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} PaperProps={{ sx: { p: 1, maxWidth: '70%', width: '60%', borderRadius: 1 } }}>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: palette.secondary.dark }}>
        <Close sx={{ fontSize: '1.5rem', '&:hover': { color: palette.primary.main } }} />
      </IconButton>
      <DialogContent sx={{ m: 1 }}>
        <DialogTitle sx={{ p: 0, pb: 3 }}>
          <Typography sx={{ fontSize: '1.7rem', color: palette.text.primary, fontWeight: 400 }}>
            Video-to-Prompt Generator
          </Typography>
        </DialogTitle>
        <Stack direction="row" spacing={2.5} sx={{ pt: 2, px: 1 }}>
          <VideoDropzone onVideoSelect={handleVideoSelect} onUploadError={setErrorMsg} />
          <Stack direction="column" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
            {videoFile && <Typography variant="body2" noWrap>Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</Typography>}
            {isLoading && <LinearProgress sx={{ width: '98%' }} />}
            <TextField label="Generated Veo Prompt" disabled value={isLoading ? 'Uploading and analyzing video...' : prompt} multiline rows={8} sx={{ width: '98%' }} />
            {errorMsg && <Alert severity="error" sx={{ width: '98%' }}>{errorMsg}</Alert>}
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
              <Button onClick={handleGeneratePrompt} variant="contained" disabled={!videoFile || isLoading} endIcon={<Send />} sx={CustomizedSendButton}>
                Generate
              </Button>
              <Button onClick={onReset} variant="outlined" disabled={isLoading} endIcon={<Replay />}>
                Reset
              </Button>
              <Button onClick={onValidate} variant="contained" disabled={!prompt || isLoading} endIcon={<Check />} sx={CustomizedSendButton}>
                Use Prompt
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
