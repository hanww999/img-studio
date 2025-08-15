'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

// 注意：下面的组件和数据我们将在接下来的步骤中创建。
// 现在写入这些代码是为了预先定义好我们页面的完整结构。
import VirtualTryOnForm from '../../ui/try-on-components/VirtualTryOnForm';
import TryOnResultDisplay from '../../ui/try-on-components/TryOnResultDisplay';
import { virtualTryOnFields } from '../../api/virtual-try-on-utils';
import { ImageI } from '../../api/generate-image-utils';

/**
 * "Generate a Try-On" 功能的主页面组件。
 * 它负责管理整个页面的状态，包括加载、错误和生成结果，
 * 并将这些状态和操作函数传递给子组件。
 */
export default function TryOnPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedImage, setGeneratedImage] = useState<ImageI | null>(null);

  // 当表单提交、开始请求API时调用的处理函数
  const handleRequestSent = (loading: boolean) => {
    setIsLoading(loading);
    setErrorMsg(''); // 重置错误信息
    if (loading) {
      setGeneratedImage(null); // 在新请求开始时清除旧图片
    }
  };

  // 当API返回错误时调用的处理函数
  const handleNewErrorMsg = (newError: string) => {
    setErrorMsg(newError);
    setIsLoading(false); // 出错时停止加载
  };

  // 当成功生成图片后调用的处理函数
  const handleImageGeneration = (newImage: ImageI) => {
    setGeneratedImage(newImage);
    setIsLoading(false); // 成功后停止加载
    setErrorMsg(''); // 清除之前的错误信息
  };

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, flexShrink: 0 }}>
        Generate a Try-On
      </Typography>
      <Stack direction="row" spacing={4} sx={{ flex: 1, height: 'calc(100% - 48px)' }}>
        {/* 左侧：表单区域 */}
        <Box sx={{ width: '40%', minWidth: '450px', height: '100%', overflowY: 'auto', pr: 2 }}>
          {/* 我们将在下一步创建这个表单组件 */}
          <VirtualTryOnForm
            isLoading={isLoading}
            errorMsg={errorMsg}
            generationFields={virtualTryOnFields} // 此数据将来自我们稍后创建的 utils 文件
            onRequestSent={handleRequestSent}
            onNewErrorMsg={handleNewErrorMsg}
            onImageGeneration={handleImageGeneration}
          />
        </Box>
        {/* 右侧：结果展示区域 */}
        <Box sx={{ flex: 1, height: '100%' }}>
          {/* 我们也将创建这个结果展示组件 */}
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
