// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle, // Subject
  Theaters, // Context & Scene
  DirectionsRun, // Action & Movement
  Palette, // Visual Style
  Videocam, // Camera Movement
  FilterCenterFocus, // Composition
  WbSunny, // Lighting & Ambiance
  GraphicEq, // Audio Description
  ContentCopy,
  RestartAlt,
  AutoFixHigh, // Generate Professional Prompt
} from '@mui/icons-material';
// [MODIFICATION] Changed the import path to a relative path
import { initialPromptData, promptBuilderOptions, PromptData } from '../../api/prompt-builder-utils';
import theme from '../../theme';
const { palette } = theme;

// Helper component for each input field
const PromptField = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <Stack spacing={1}>
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
    </Stack>
    {children}
  </Stack>
);

export default function PromptBuilder() {
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setPromptData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneratePrompt = () => {
    const finalPrompt = `Subject: ${promptData.subject}
Context: ${promptData.context}
Action: ${promptData.action}
Style: ${promptData.visualStyle}
Camera: ${promptData.cameraMovement}
Composition: ${promptData.composition}
Ambiance: ${promptData.lighting}
Audio: ${promptData.audio}

Negative prompt: no text overlays, no watermarks, no cartoon effects, no unrealistic proportions, no blurry faces, no distorted hands, no artificial lighting, no oversaturation, no low resolution artifacts, no compression noise, no camera shake, no poor audio quality, no lip-sync issues, no unnatural movements`;
    setGeneratedPrompt(finalPrompt);
  };

  const handleReset = () => {
    setPromptData(initialPromptData);
    setGeneratedPrompt('');
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Prompt Builder
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        A component professional framework
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <PromptField icon={<AccountCircle color="primary" />} label="Subject">
              <TextField name="subject" value={promptData.subject} onChange={handleInputChange} fullWidth multiline rows={3} variant="outlined" />
            </PromptField>
            <PromptField icon={<DirectionsRun color="primary" />} label="Action & Movement">
              <TextField name="action" value={promptData.action} onChange={handleInputChange} fullWidth multiline rows={3} variant="outlined" />
            </PromptField>
            <PromptField icon={<Videocam color="primary" />} label="Camera Movement">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Choose camera movement...</InputLabel>
                <Select name="cameraMovement" value={promptData.cameraMovement} onChange={handleSelectChange} label="Choose camera movement...">
                  {promptBuilderOptions.cameraMovement.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </PromptField>
            <PromptField icon={<WbSunny color="primary" />} label="Lighting & Ambiance">
              <TextField name="lighting" value={promptData.lighting} onChange={handleInputChange} fullWidth multiline rows={2} variant="outlined" />
            </PromptField>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <PromptField icon={<Theaters color="primary" />} label="Context & Scene">
              <TextField name="context" value={promptData.context} onChange={handleInputChange} fullWidth multiline rows={3} variant="outlined" />
            </PromptField>
            <PromptField icon={<Palette color="primary" />} label="Visual Style">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Choose visual style...</InputLabel>
                <Select name="visualStyle" value={promptData.visualStyle} onChange={handleSelectChange} label="Choose visual style...">
                  {promptBuilderOptions.visualStyle.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </PromptField>
            <PromptField icon={<FilterCenterFocus color="primary" />} label="Composition">
              <TextField name="composition" value={promptData.composition} onChange={handleInputChange} fullWidth multiline rows={2} variant="outlined" />
            </PromptField>
            <PromptField icon={<GraphicEq color="primary" />} label="Audio Description">
              <TextField name="audio" value={promptData.audio} onChange={handleInputChange} fullWidth multiline rows={3} variant="outlined" />
            </PromptField>
          </Stack>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Button variant="contained" startIcon={<AutoFixHigh />} onClick={handleGeneratePrompt} size="large">
          Generate Professional Prompt
        </Button>
        <Button variant="text" startIcon={<RestartAlt />} onClick={handleReset}>
          Reset All
        </Button>
      </Stack>

      {generatedPrompt && (
        <Paper elevation={2} sx={{ p: 2, backgroundColor: 'grey.100' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Your Generated Prompt
            </Typography>
            <Button variant="contained" startIcon={<ContentCopy />} onClick={handleCopy}>
              Copy
            </Button>
          </Stack>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', m: 0, p: 1, backgroundColor: '#fff', borderRadius: 1, fontFamily: 'monospace' }}>
            {generatedPrompt}
          </Box>
          <Box sx={{ mt: 2, p: 2, backgroundColor: palette.primary.light, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: palette.primary.dark, fontWeight: 'bold' }}>
              Pro Tip: Copy this prompt and paste it into Veo 3 to generate professional-quality AI videos. The 8-component framework ensures optimal results.
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
