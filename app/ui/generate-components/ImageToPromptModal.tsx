// Copyright 2025 Google LLC
// ... (license header)

import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Check, Close, Replay, Send } from '@mui/icons-material'; // [新增] 导入 Send 图标

import theme from '../../theme';
import ImageDropzone from './ImageDropzone';
import { getPromptFromImageFromGemini } from '@/app/api/gemini/action';
import { CustomizedSendButton } from '../ux-components/Button-SX';
const { palette } = theme;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageToPromptModal({
  open,
  setNewPrompt,
  setImageToPromptOpen,
  target,
}: {
  open: boolean;
  setNewPrompt: (newPormpt: string) => void;
  setImageToPromptOpen: (state: boolean) => void;
  target: 'Image' | 'Video';
}) {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // [新增] State 用于管理用户输入的文本
  const [userQuery, setUserQuery] = useState('');

  // [删除] 不再需要这个 useEffect，因为我们不再自动生成 prompt
  /*
  useEffect(() => {
    if (image !== '' && image !== null && prompt === '') {
      getPromptFromImage();
    }
  }, [image]);
  */

  // [修改] 函数现在接收用户查询作为参数
  const getPromptFromImage = async () => {
    // 如果没有图片，则不执行任何操作
    if (!image) {
      setErrorMsg('Please upload an image first.');
      return;
    }
    
    setIsGeneratingPrompt(true);
    setErrorMsg(''); // 清除旧的错误信息
    setPrompt(''); // 清除旧的 prompt

    try {
      // [修改] 将 userQuery 传递给后端 API
      const geminiReturnedPrompt = await getPromptFromImageFromGemini(image as string, target, userQuery);

      if (typeof geminiReturnedPrompt === 'object' && 'error' in geminiReturnedPrompt) {
        setErrorMsg(geminiReturnedPrompt.error);
      } else {
        setPrompt(geminiReturnedPrompt as string);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.toString());
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const onValidate = () => {
    if (prompt) setNewPrompt(prompt);
    onClose();
  };

  const onReset = () => {
    setErrorMsg('');
    setIsGeneratingPrompt(false);
    setImage(null);
    setPrompt('');
    setUserQuery(''); // [新增] 同时重置用户输入
  };

  const onClose = () => {
    setImageToPromptOpen(false);
    onReset();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="parameter the export of an image"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'left',
          p: 1,
          cursor: 'default', // [修改] 避免整个对话框都是指针样式
          height: 'auto', // [修改] 高度自适应
          minHeight: '63%', // 保持最小高度
          maxWidth: '70%',
          width: '60%',
          borderRadius: 1,
          background: 'white',
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
        <DialogTitle sx={{ p: 0, pb: 3 }}>
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: palette.text.primary,
              fontWeight: 400,
              display: 'flex',
              alignContent: 'center',
            }}
          >
            {'Image-to-prompt generator'}
          </Typography>
        </DialogTitle>
        <Stack
          direction="row"
          spacing={2.5}
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{ pt: 2, px: 1, width: '100%' }}
        >
          <ImageDropzone
            setImage={(base64Image: string) => setImage(base64Image)}
            image={image}
            onNewErrorMsg={setErrorMsg}
            size={{ width: '110vw', height: '110vw' }}
            maxSize={{ width: 280, height: 280 }}
            object={'contain'}
          />
          <Stack
            direction="column"
            spacing={2} // [修改] 调整间距
            justifyContent="space-between" // [修改] 更好地分布元素
            alignItems="flex-end"
            sx={{ width: '100%', height: 340 }} // [修改] 固定高度以对齐
          >
            <Box sx={{ position: 'relative', width: '100%' }}>
              {isGeneratingPrompt && (
                <CircularProgress
                  size={30}
                  thickness={6}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-15px', // 居中
                    marginLeft: '-15px', // 居中
                    zIndex: 1,
                  }}
                />
              )}
              <TextField
                label="Generated prompt"
                disabled
                error={errorMsg !== ''}
                helperText={errorMsg} // [新增] 显示错误信息
                value={isGeneratingPrompt ? 'Generating...' : prompt}
                multiline
                rows={6} // [修改] 减少行数以容纳新输入框
                sx={{ width: '98%', opacity: isGeneratingPrompt ? 0.5 : 1 }}
              />
            </Box>

            {/* [新增] 用户输入的文本框 */}
            <TextField
              label="Ask something specific about the image (optional)"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              disabled={isGeneratingPrompt || !image}
              multiline
              rows={2}
              sx={{ width: '98%' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  getPromptFromImage();
                }
              }}
            />
            
            <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="flex-end" sx={{ width: '100%' }}>
              {/* [新增] 独立的生成按钮 */}
              <Button
                onClick={getPromptFromImage}
                variant="contained"
                disabled={!image || isGeneratingPrompt}
                endIcon={<Send />}
                sx={CustomizedSendButton}
              >
                {'Generate'}
              </Button>
              <Button
                onClick={onReset}
                variant="outlined" // [修改] 样式
                disabled={isGeneratingPrompt}
                endIcon={<Replay />}
              >
                {'Reset'}
              </Button>
              <Button
                onClick={onValidate}
                variant="contained"
                disabled={!prompt || isGeneratingPrompt}
                endIcon={<Check />}
                sx={CustomizedSendButton}
              >
                {'Use prompt'}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
