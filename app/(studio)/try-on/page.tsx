'use client';

import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

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
    // [布局修改] 使用 Flexbox 替换原有的 Stack 和 Box 布局
  <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      gap: 3,
      height: 'calc(100vh - 48px)',
    }}>
      {/* [布局修改] 左侧表单区域 */}
    <Box sx={{
        flex: '0 1 40%',
        minWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Typography variant="h1" color="text.secondary" sx={{ fontSize: '1.8rem', pb: 5 }}>
            虚拟试穿
          </Typography>
          <VirtualTryOnForm
            isLoading={isLoading}
            errorMsg={errorMsg}
            generationFields={virtualTryOnFields}
            onRequestSent={handleRequestSent}
            onNewErrorMsg={handleNewErrorMsg}
            onImageGeneration={handleImageGeneration}
          />
        </Paper>
    </Box>
      {/* [布局修改] 右侧创意画布区域 */}
    <Box sx={{
        flex: '1 1 60%',
        minWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Paper sx={{ p: 3, borderRadius: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TryOnResultDisplay
            isLoading={isLoading}
            errorMsg={errorMsg}
            generatedImage={generatedImage}
          />
        </Paper>
    </Box>
  </Box>
 );
}
