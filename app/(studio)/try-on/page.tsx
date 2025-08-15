// app/(studio)/try-on/page.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form'; // [新增]
import { Box, Stack, Typography } from '@mui/material';

import VirtualTryOnForm from '../../ui/try-on-components/VirtualTryOnForm';
import TryOnResultDisplay from '../../ui/try-on-components/TryOnResultDisplay';
import { virtualTryOnFields, VirtualTryOnFormI } from '../../api/virtual-try-on-utils'; // [修改]
import { ImageI } from '../../api/generate-image-utils';
import FormInputDropdown from '../../ui/ux-components/InputDropdown'; // [新增]
import theme from '../../theme'; // [新增]
const { palette } = theme; // [新增]

export default function TryOnPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedImage, setGeneratedImage] = useState<ImageI | null>(null);

  // [新增] 为标题栏的下拉框添加 form control
  const { control } = useForm<VirtualTryOnFormI>({
    defaultValues: virtualTryOnFields.defaultValues,
  });

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
      {/* [修改] 使用新的标题栏，精确模仿 Generate an Image 页面 */}
      <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h1" color={palette.text.secondary} sx={{ fontSize: '1.8rem' }}>
          {'Generate with'}
        </Typography>
        {/* 这个下拉框只有一个选项且不可更改，纯粹为了 UI 一致性 */}
        <FormInputDropdown
          name="modelVersion"
          label=""
          control={control}
          field={virtualTryOnFields.fields.modelVersion}
          styleSize="big"
          width=""
          required={false}
        />
      </Stack>

      <Stack direction="row" spacing={4} sx={{ flex: 1, height: 'calc(100% - 72px)' }}>
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
