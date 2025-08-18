// 文件路径: app/ui/generate-components/ImagenPromptBuilder.tsx (最终完整修正版)

'use client';

import React, { useState } from 'react';
import {
  Box, Button, Grid, Typography, Stack, Paper, TextField, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  RestartAlt, AutoFixHigh, CheckCircle, ContentCopy, Block, Style, CameraAlt
} from '@mui/icons-material';
import { initialImagenPromptData, imagenPromptBuilderOptions, ImagenPromptData } from '../../api/imagen-prompt-builder-utils';

interface ImagenPromptBuilderProps {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}

const PreviewCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string | undefined }) => {
  if (!content) return null;
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {icon}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{title}</Typography>
      </Stack>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</Typography>
    </Paper>
  );
};

export default function ImagenPromptBuilder({ onApply, onClose }: ImagenPromptBuilderProps) {
  const [promptData, setPromptData] = useState<ImagenPromptData>(initialImagenPromptData);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy All');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const generateFinalPrompt = () => {
    const parts = [
      promptData.styleMedium,
      `of ${promptData.subject}`,
      promptData.detailedDescription,
      promptData.environment,
      promptData.composition,
      promptData.lighting,
      promptData.colorScheme,
      promptData.lensType,
      promptData.cameraSettings,
      promptData.filmType,
      promptData.quality,
    ];
    return parts.filter(part => part).join(', ');
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleCopy = () => {
    const finalPrompt = generateFinalPrompt();
    const fullTextToCopy = `Prompt: ${finalPrompt}\n\nNegative Prompt: ${promptData.negativePrompt}`;
    navigator.clipboard.writeText(fullTextToCopy).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy All'), 2000);
    });
  };

  const handleApply = () => {
    const finalPrompt = generateFinalPrompt();
    onApply(finalPrompt, promptData.negativePrompt);
    onClose();
  };

  const handleReset = () => {
    setPromptData(initialImagenPromptData);
  };

  // [核心修正] 移除 bgcolor，让组件继承 Dialog 的背景色
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>Core Components</Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Style / Medium</InputLabel>
                <Select name="styleMedium" value={promptData.styleMedium} label="Style / Medium" onChange={handleSelectChange}>
                  {imagenPromptBuilderOptions.styleMedium.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField name="subject" label="Subject" value={promptData.subject} onChange={handleInputChange} size="small" />
              <TextField name="detailedDescription" label="Detailed Description" value={promptData.detailedDescription} onChange={handleInputChange} multiline rows={4} />
              <TextField name="environment" label="Environment / Background" value={promptData.environment} onChange={handleInputChange} multiline rows={3} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>Photographic Style</Typography>
            <Stack spacing={2}>
              <FormControl fullWidth size="small"><InputLabel>Composition / View</InputLabel><Select name="composition" value={promptData.composition} label="Composition / View" onChange={handleSelectChange}>{imagenPromptBuilderOptions.composition.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Lighting</InputLabel><Select name="lighting" value={promptData.lighting} label="Lighting" onChange={handleSelectChange}>{imagenPromptBuilderOptions.lighting.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Color Scheme</InputLabel><Select name="colorScheme" value={promptData.colorScheme} label="Color Scheme" onChange={handleSelectChange}>{imagenPromptBuilderOptions.colorScheme.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Lens Type</InputLabel><Select name="lensType" value={promptData.lensType} label="Lens Type" onChange={handleSelectChange}>{imagenPromptBuilderOptions.lensType.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Camera Settings</InputLabel><Select name="cameraSettings" value={promptData.cameraSettings} label="Camera Settings" onChange={handleSelectChange}>{imagenPromptBuilderOptions.cameraSettings.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Film Type</InputLabel><Select name="filmType" value={promptData.filmType} label="Film Type" onChange={handleSelectChange}>{imagenPromptBuilderOptions.filmType.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
              <FormControl fullWidth size="small"><InputLabel>Quality</InputLabel><Select name="quality" value={promptData.quality} label="Quality" onChange={handleSelectChange}>{imagenPromptBuilderOptions.quality.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>Exclusions (Negative Prompt)</Typography>
            <TextField name="negativePrompt" label="Negative Prompt" value={promptData.negativePrompt} onChange={handleInputChange} fullWidth multiline rows={10} />
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={handlePreview} startIcon={<AutoFixHigh />}>Preview Generated Prompt</Button>
        <Button variant="text" onClick={handleReset} startIcon={<RestartAlt />}>Reset All</Button>
      </Stack>

      <Stack sx={{ mt: 4 }} alignItems="flex-end">
        <Button variant="contained" startIcon={<CheckCircle />} onClick={handleApply} size="large">Apply to Form</Button>
      </Stack>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Generated Prompt Preview</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <PreviewCard icon={<Style fontSize="small" />} title="Core Components" content={`Style / Medium: ${promptData.styleMedium}\nSubject: ${promptData.subject}\nDetailed Description: ${promptData.detailedDescription}\nEnvironment / Background: ${promptData.environment}`} />
            <PreviewCard icon={<CameraAlt fontSize="small" />} title="Photographic Style" content={`Composition / View: ${promptData.composition}\nLighting: ${promptData.lighting}\nColor Scheme: ${promptData.colorScheme}\nLens Type: ${promptData.lensType}\nCamera Settings: ${promptData.cameraSettings}\nFilm Type: ${promptData.filmType}\nQuality: ${promptData.quality}`} />
            <PreviewCard icon={<Block fontSize="small" color="error" />} title="Exclusions (Negative Prompt)" content={promptData.negativePrompt} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} startIcon={<ContentCopy />}>{copyStatus}</Button>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
