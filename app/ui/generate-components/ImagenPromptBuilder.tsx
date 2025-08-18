// 文件路径: app/ui/generate-components/ImagenPromptBuilder.tsx (最终完整版)

'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box, Button, Grid, Paper, Stack, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material';
import { Check, Refresh, Visibility } from '@mui/icons-material';

// [核心] 从您提供的权威 utils 文件中导入数据结构和选项
import { 
  ImagenPromptData, 
  initialImagenPromptData, 
  imagenPromptBuilderOptions 
} from '../../api/imagen-prompt-builder-utils';

// [核心修复] 定义组件期望接收的 props 类型，解决构建错误
interface ImagenPromptBuilderProps {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}

export default function ImagenPromptBuilder({ onApply, onClose }: ImagenPromptBuilderProps) {
  // [核心] 使用您提供的 initialImagenPromptData 初始化组件状态
  const [formState, setFormState] = useState<ImagenPromptData>(initialImagenPromptData);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const generatePromptString = () => {
    // [核心] 确保字段顺序和名称与您的 ImagenPromptData 接口一致
    const {
      styleMedium,
      subject,
      detailedDescription,
      environment,
      composition,
      lighting,
      colorScheme,
      lensType,
      cameraSettings,
      filmType,
      quality
    } = formState;

    const promptParts = [
      styleMedium,
      subject,
      detailedDescription,
      environment,
      composition,
      lighting,
      colorScheme,
      lensType,
      cameraSettings,
      filmType,
      quality
    ];
    return promptParts.filter(part => part && part.trim() !== '').join(', ');
  };

  const handlePreview = () => {
    const prompt = generatePromptString();
    setGeneratedPrompt(prompt);
    setPreviewOpen(true);
  };

  const handleReset = () => {
    // [核心] 重置时也使用您提供的初始数据
    setFormState(initialImagenPromptData);
  };

  const handleApply = () => {
    const finalPrompt = generatePromptString();
    onApply(finalPrompt, formState.negativePrompt);
  };

  const renderSelect = (name: keyof Omit<ImagenPromptData, 'subject' | 'detailedDescription' | 'environment' | 'negativePrompt'>, label: string) => (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel sx={{ fontSize: '0.9rem' }}>{label}</InputLabel>
      <Select
        name={name}
        value={formState[name]}
        onChange={handleSelectChange}
        label={label}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {imagenPromptBuilderOptions[name].map(option => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderTextField = (name: keyof ImagenPromptData, label: string, rows = 3) => (
     <TextField
        name={name}
        label={label}
        variant="outlined"
        fullWidth
        multiline
        rows={rows}
        value={formState[name]}
        onChange={handleInputChange}
        size="small"
      />
  );

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Grid container spacing={2}>
        {/* Column 1: Core Components */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Stack spacing={2.5}>
              <Typography variant="h6">Core Components (核心组件)</Typography>
              {renderSelect('styleMedium', 'Style / Medium')}
              {renderTextField('subject', 'Subject', 4)}
              {renderTextField('detailedDescription', 'Detailed Description', 4)}
              {renderTextField('environment', 'Environment / Background', 4)}
            </Stack>
          </Paper>
        </Grid>

        {/* Column 2: Photographic Style */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Stack spacing={2.5}>
              <Typography variant="h6">Photographic Style (摄影风格)</Typography>
              {renderSelect('composition', 'Composition / View')}
              {renderSelect('lighting', 'Lighting')}
              {renderSelect('colorScheme', 'Color Scheme')}
              {renderSelect('lensType', 'Lens Type')}
              {renderSelect('cameraSettings', 'Camera Settings')}
              {renderSelect('filmType', 'Film Type')}
              {renderSelect('quality', 'Quality')}
            </Stack>
          </Paper>
        </Grid>

        {/* Column 3: Exclusions */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="h6">Exclusions (Negative Prompt)</Typography>
              {renderTextField('negativePrompt', 'Negative Prompt', 10)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mt: 2, p: 1 }}>
        <Box>
          <Button variant="outlined" onClick={handlePreview} startIcon={<Visibility />}>
            预览生成的 Prompt (Preview)
          </Button>
          <Button variant="text" onClick={handleReset} startIcon={<Refresh />} sx={{ ml: 2 }}>
            全部重置 (Reset All)
          </Button>
        </Box>
        <Button variant="contained" onClick={handleApply} startIcon={<Check />}>
          应用到表单 (Apply to Form)
        </Button>
      </Stack>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Generated Prompt Preview</DialogTitle>
        <DialogContent>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {generatedPrompt}
            </Typography>
            <Chip label="Negative Prompt" size="small" sx={{ mt: 2, mb: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {formState.negativePrompt || 'None'}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
