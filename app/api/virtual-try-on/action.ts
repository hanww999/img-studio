'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import VirtualTryOnForm from '../../ui/try-on-components/VirtualTryOnForm';
import TryOnResultDisplay from '../../ui/try-on-components/TryOnResultDisplay';
import { virtualTryOnFields } from '../../api/virtual-try-on-utils';
import { ImageI } from '../../api/generate-image-utils';

export default function TryOnPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedImage, setGeneratedImage] = useState<ImageI | null>(null);

  const handleRequestSent = (loading: boolean) => {
    setIsLoading(loading);
    setErrorMsg('');
    if (loading) {
      setGeneratedImage(null);
    }
  };

  const handleNewErrorMsg = (newError: string) => {
    setErrorMsg(newError);
    setIsLoading(false);
  };

  const handleImageGeneration = (newImage: ImageI) => {
    setGeneratedImage(newImage);
    setIsLoading(false);
    setErrorMsg('');
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, flexShrink: 0 }}>
        Generate a Try-On
      </Typography>
      <Stack direction="row" spacing={4} sx={{ flex: 1, height: 'calc(100% - 48px)' }}>
        <Box sx={{ width: '40%', minWidth: '450px', height: '100%', overflowY: 'auto', pr: 2 }}>
          <VirtualTryOnForm
            isLoading={isLoading}
            errorMsg={errorMsg}
            generationFields={virtualTryOnFields}
            onRequestSent={handleRequestSent}
            onNewErrorMsg={handleNewErrorMsg}
            onImageGeneration={handleImageGeneration}
          />
        </Box>
        <Box sx={{ flex: 1, height: '100%' }}>
          <TryOnResultDisplay
            isLoading={isLoading}
            errorMsg={errorMsg}
            generatedImage={generatedImage}
          />
        </Box>
      </Stack>
    </Box>
  );
}
