// 文件路径: app/ui/generate-components/ImagenPromptBuilder.tsx (最终完整版)

'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box, Button, Grid, Paper, Stack, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Check, Refresh, Visibility, ContentCopy, Close as CloseIcon, Palette, Camera, NoPhotography } from '@mui/icons-material';
import { 
  ImagenPromptData, initialImagenPromptData, imagenPromptBuilderOptions, ImagenPromptOptions, PromptOption
} from '../../api/imagen-prompt-builder-utils';

interface ImagenPromptBuilderProps { onApply: (prompt: string, negativePrompt: string) => void; onClose: () => void; }

const PreviewSection = ({ title, icon, data }: { title: string, icon: React.ReactNode, data: { [key: string]: string } }) => {
  const entries = Object.entries(data).filter(([, value]) => value && value.trim() !== '');
  if (entries.length === 0) return null;

  return (
    <Box mb={2}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" fontSize="1.1rem" fontWeight={600}>{title}</Typography>
      </Stack>
      {entries.map(([key, value]) => (
        <Typography key={key} variant="body2" color="text.secondary" sx={{ pl: 4.5, mb: 0.5 }}>
          <Typography component="span" variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{key}: </Typography>{value}
        </Typography>
      ))}
    </Box>
  );
};

export default function ImagenPromptBuilder({ onApply, onClose }: ImagenPromptBuilderProps) {
  const [formState, setFormState] = useState<ImagenPromptData>(initialImagenPromptData);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const generatePromptString = () => {
    const { styleMedium, subject, detailedDescription, environment, composition, lighting, colorScheme, lensType, cameraSettings, filmType, quality } = formState;
    return [styleMedium, subject, detailedDescription, environment, composition, lighting, colorScheme, lensType, cameraSettings, filmType, quality].filter(part => part && part.trim() !== '').join(', ');
  };

  const handleReset = () => setFormState(initialImagenPromptData);
  const handleApply = () => onApply(generatePromptString(), formState.negativePrompt);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePromptString()).then(() => {
      setCopySuccess('已复制!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('复制失败!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const renderSelect = (name: keyof ImagenPromptOptions, label: string) => (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel sx={{ fontSize: '0.9rem' }}>{label}</InputLabel>
      <Select name={name} value={formState[name as keyof ImagenPromptData]} onChange={handleSelectChange} label={label}>
        <MenuItem value=""><em>无</em></MenuItem>
        {imagenPromptBuilderOptions[name].map((option: PromptOption) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderTextField = (name: keyof ImagenPromptData, label: string, rows = 3) => (
     <TextField name={name} label={label} variant="outlined" fullWidth multiline rows={rows} value={formState[name]} onChange={handleInputChange} size="small" />
  );

  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><Paper variant="outlined" sx={{ p: 2, height: '100%' }}><Stack spacing={2.5}><Typography variant="h6">核心组件</Typography>{renderSelect('styleMedium', '风格 / 媒介')}{renderTextField('subject', '主体', 4)}{renderTextField('detailedDescription', '详细描述', 4)}{renderTextField('environment', '环境 / 背景', 4)}</Stack></Paper></Grid>
        <Grid item xs={12} md={4}><Paper variant="outlined" sx={{ p: 2, height: '100%' }}><Stack spacing={2.5}><Typography variant="h6">摄影风格</Typography>{renderSelect('composition', '构图 / 视角')}{renderSelect('lighting', '光照')}{renderSelect('colorScheme', '色系')}{renderSelect('lensType', '镜头类型')}{renderSelect('cameraSettings', '相机设置')}{renderSelect('filmType', '胶片类型')}{renderSelect('quality', '画质')}</Stack></Paper></Grid>
        <Grid item xs={12} md={4}><Paper variant="outlined" sx={{ p: 2, height: '100%' }}><Stack spacing={2}><Typography variant="h6">排除项 (负面提示词)</Typography>{renderTextField('negativePrompt', '负面提示词', 10)}</Stack></Paper></Grid>
      </Grid>
      
      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" sx={{ mt: 2, p: 1 }}>
        <Button variant="outlined" onClick={() => setPreviewOpen(true)} startIcon={<Visibility />}>预览</Button>
        <Button variant="text" onClick={handleReset} startIcon={<Refresh />}>重置</Button>
        <Button variant="contained" onClick={handleApply} startIcon={<Check />} size="large">应用到表单</Button>
      </Stack>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>生成的提示词预览<IconButton aria-label="close" onClick={() => setPreviewOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent dividers sx={{ p: 3, bgcolor: 'background.default' }}>
          <PreviewSection title="核心组件" icon={<Palette />} data={{ '风格 / 媒介': formState.styleMedium, '主体': formState.subject, '详细描述': formState.detailedDescription, '环境 / 背景': formState.environment }} />
          <PreviewSection title="摄影风格" icon={<Camera />} data={{ '构图 / 视角': formState.composition, '光照': formState.lighting, '色系': formState.colorScheme, '镜头类型': formState.lensType, '相机设置': formState.cameraSettings, '胶片类型': formState.filmType, '画质': formState.quality }} />
          <PreviewSection title="排除项 (负面提示词)" icon={<NoPhotography />} data={{ '负面提示词': formState.negativePrompt }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} startIcon={<ContentCopy />}>{copySuccess || '复制全部'}</Button>
          <Button onClick={() => setPreviewOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
