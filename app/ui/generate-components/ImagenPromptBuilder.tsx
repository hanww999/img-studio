// 文件路径: app/ui/generate-components/ImagenPromptBuilder.tsx (最终完整版)

'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Box, Button, Grid, Paper, Stack, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Tooltip, IconButton
} from '@mui/material';
import { Check, Refresh, Visibility, ContentCopy, Close as CloseIcon, Block, Palette, Camera, NoPhotography } from '@mui/icons-material';
import { 
  ImagenPromptData, 
  initialImagenPromptData, 
  imagenPromptBuilderOptions,
  ImagenPromptOptions,
  PromptOption
} from '../../api/imagen-prompt-builder-utils';

interface ImagenPromptBuilderProps {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}

// [核心] 用于结构化预览的辅助组件
const PreviewSection = ({ title, icon, data }: { title: string, icon: React.ReactNode, data: { [key: string]: string } }) => {
  const entries = Object.entries(data).filter(([, value]) => value && value.trim() !== '');
  if (entries.length === 0) return null;

  return (
    <Box mb={2}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" fontSize="1.1rem">{title}</Typography>
      </Stack>
      {entries.map(([key, value]) => (
        <Typography key={key} variant="body2" color="text.secondary" sx={{ pl: 4 }}>
          <span style={{ textTransform: 'capitalize', color: 'white' }}>{key.replace(/([A-Z])/g, ' $1')}: </span>{value}
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
    const {
      styleMedium, subject, detailedDescription, environment, composition,
      lighting, colorScheme, lensType, cameraSettings, filmType, quality
    } = formState;
    const promptParts = [
      styleMedium, subject, detailedDescription, environment, composition,
      lighting, colorScheme, lensType, cameraSettings, filmType, quality
    ];
    return promptParts.filter(part => part && part.trim() !== '').join(', ');
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleReset = () => {
    setFormState(initialImagenPromptData);
  };

  const handleApply = () => {
    const finalPrompt = generatePromptString();
    onApply(finalPrompt, formState.negativePrompt);
  };

  const handleCopy = () => {
    const fullPrompt = generatePromptString();
    navigator.clipboard.writeText(fullPrompt).then(() => {
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
      <Select
        name={name}
        value={formState[name as keyof ImagenPromptData]}
        onChange={handleSelectChange}
        label={label}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {imagenPromptBuilderOptions[name].map((option: PromptOption) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
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
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Stack spacing={2}>
              <Typography variant="h6">Exclusions (Negative Prompt)</Typography>
              {renderTextField('negativePrompt', 'Negative Prompt', 10)}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
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

      {/* [核心] 恢复您想要的结构化预览弹窗 */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Generated Prompt Preview
          <IconButton
            aria-label="close"
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <PreviewSection 
            title="Core Components" 
            icon={<Palette />}
            data={{
              'Style / Medium': formState.styleMedium,
              'Subject': formState.subject,
              'Detailed Description': formState.detailedDescription,
              'Environment / Background': formState.environment,
            }}
          />
          <PreviewSection 
            title="Photographic Style" 
            icon={<Camera />}
            data={{
              'Composition / View': formState.composition,
              'Lighting': formState.lighting,
              'Color Scheme': formState.colorScheme,
              'Lens Type': formState.lensType,
              'Camera Settings': formState.cameraSettings,
              'Film Type': formState.filmType,
              'Quality': formState.quality,
            }}
          />
          <PreviewSection 
            title="Exclusions (Negative Prompt)" 
            icon={<NoPhotography />}
            data={{
              'Negative Prompt': formState.negativePrompt,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} startIcon={<ContentCopy />}>
            {copySuccess || '复制全部 (Copy All)'}
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>关闭 (Close)</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
