'use client';

import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Image from 'next/image';
import { ImageI } from '../../api/generate-image-utils';
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
  backgroundColor: palette.grey[900], // 深色背景
  position: 'relative',
  overflow: 'hidden',
};

export default function TryOnResultDisplay({ isLoading, errorMsg, generatedImage }: TryOnResultDisplayProps) {
  return (
    <Box sx={containerStyles}>
      {isLoading && <CircularProgress color="primary" />}

      {!isLoading && errorMsg && (
        <Alert severity="error" sx={{ m: 2, width: '90%' }}>
          {errorMsg}
        </Alert>
      )}

      {!isLoading && !errorMsg && !generatedImage && (
        <Typography variant="h6" color="text.secondary">
          Your generated image will appear here
        </Typography>
      )}

      {!isLoading && generatedImage && (
        <Image
          src={`data:${generatedImage.format};base64,${generatedImage.src}`}
          alt={generatedImage.altText}
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </Box>
  );
}
