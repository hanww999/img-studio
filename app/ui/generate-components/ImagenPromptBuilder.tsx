// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
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
  Divider,
} from '@mui/material';
import {
 RestartAlt,
 CheckCircle,
  AutoFixHigh, // FIX: Import icon for the preview button
} from '@mui/icons-material';
import { initialImagenPromptData, imagenPromptBuilderOptions, ImagenPromptData } from '../../api/imagen-prompt-builder-utils';
import theme from '../../theme'; // FIX: Import theme for palette access
const { palette } = theme;

interface ImagenPromptBuilderProps {
    onApply: (prompt: string) => void;
}

const SectionTitle = ({ title }: { title: string }) => (
    <Box sx={{ my: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Divider />
    </Box>
);

export default function ImagenPromptBuilder({ onApply }: ImagenPromptBuilderProps) {
 const [promptData, setPromptData] = useState<ImagenPromptData>(initialImagenPromptData);
  // FIX: Add state to hold the generated prompt for preview
 const [generatedPrompt, setGeneratedPrompt] = useState('');

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setPromptData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSelectChange = (e: any) => {
  const { name, value } = e.target;
  setPromptData((prev) => ({ ...prev, [name]: value }));
 };

 const generateFinalPromptString = () => {
    const coreParts = [
        promptData.styleMedium,
        promptData.subject,
        promptData.detailedDescription,
        promptData.environment,
    ].filter(Boolean);

    const styleParts = [
        promptData.composition,
        promptData.lighting,
        promptData.colorScheme,
    ].filter(Boolean);

    const photoParts = [
        promptData.lensType,
        promptData.cameraSettings,
        promptData.filmType,
        promptData.quality,
    ].filter(Boolean);

    let finalPrompt = [...coreParts, ...styleParts, ...photoParts].join(', ');

    // Use a more robust way to add the negative prompt to avoid confusion
    if (promptData.negativePrompt) {
        finalPrompt += ` --no ${promptData.negativePrompt}`;
    }
    
    return finalPrompt;
  }

  // FIX: Add handler for the preview button
  const handleGeneratePrompt = () => {
    const finalPrompt = generateFinalPromptString();
    setGeneratedPrompt(finalPrompt);
  };

 const handleApplyPrompt = () => {
    // Ensure the latest data is used, whether previewed or not
    const finalPrompt = generatedPrompt || generateFinalPromptString();
    onApply(finalPrompt);
  }

 const handleReset = () => {
  setPromptData(initialImagenPromptData);
  setGeneratedPrompt(''); // Also reset the preview
 };

 return (
    // FIX: Add a wrapping Box with white background and padding for consistency
  <Box sx={{ width: '100%', p: 3, backgroundColor: '#fff' }}>
    <Grid container spacing={3}>
        {/* Column 1: Core Components */}
        <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <SectionTitle title="Core Components" />
                <Stack spacing={3}>
                    <FormControl fullWidth><InputLabel>Style / Medium</InputLabel><Select name="styleMedium" value={promptData.styleMedium} label="Style / Medium" onChange={handleSelectChange}>{imagenPromptBuilderOptions.styleMedium.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <TextField name="subject" label="Subject" value={promptData.subject} onChange={handleInputChange} fullWidth multiline rows={2} placeholder="The core focus of the image..." />
                    <TextField name="detailedDescription" label="Detailed Description" value={promptData.detailedDescription} onChange={handleInputChange} fullWidth multiline rows={4} placeholder="Material, texture, emotion, clothing..." />
                    <TextField name="environment" label="Environment / Background" value={promptData.environment} onChange={handleInputChange} fullWidth multiline rows={3} placeholder="Where the subject is located..." />
                </Stack>
            </Paper>
        </Grid>

        {/* Column 2: Photographic Style */}
        <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <SectionTitle title="Photographic Style" />
                <Stack spacing={3}>
                    <FormControl fullWidth><InputLabel>Composition / View</InputLabel><Select name="composition" value={promptData.composition} label="Composition / View" onChange={handleSelectChange}>{imagenPromptBuilderOptions.composition.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Lighting</InputLabel><Select name="lighting" value={promptData.lighting} label="Lighting" onChange={handleSelectChange}>{imagenPromptBuilderOptions.lighting.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Color Scheme</InputLabel><Select name="colorScheme" value={promptData.colorScheme} label="Color Scheme" onChange={handleSelectChange}>{imagenPromptBuilderOptions.colorScheme.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Lens Type</InputLabel><Select name="lensType" value={promptData.lensType} label="Lens Type" onChange={handleSelectChange}>{imagenPromptBuilderOptions.lensType.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Camera Settings</InputLabel><Select name="cameraSettings" value={promptData.cameraSettings} label="Camera Settings" onChange={handleSelectChange}>{imagenPromptBuilderOptions.cameraSettings.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Film Type</InputLabel><Select name="filmType" value={promptData.filmType} label="Film Type" onChange={handleSelectChange}>{imagenPromptBuilderOptions.filmType.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                    <FormControl fullWidth><InputLabel>Quality</InputLabel><Select name="quality" value={promptData.quality} label="Quality" onChange={handleSelectChange}>{imagenPromptBuilderOptions.quality.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}</Select></FormControl>
                </Stack>
            </Paper>
        </Grid>

        {/* Column 3: Exclusions & Actions */}
        <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <SectionTitle title="Exclusions (Negative Prompt)" />
                <TextField name="negativePrompt" label="Negative Prompt" value={promptData.negativePrompt} onChange={handleInputChange} fullWidth multiline rows={10} placeholder="Things to exclude: blurry, text, watermark, bad anatomy..." sx={{ flexGrow: 1 }} />
            </Paper>
        </Grid>
    </Grid>

    {/* FIX: Add action buttons and preview area */}
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ my: 4 }}>
        <Button variant="outlined" startIcon={<AutoFixHigh />} onClick={handleGeneratePrompt} size="large">
            Preview Generated Prompt
        </Button>
        <Button variant="text" startIcon={<RestartAlt />} onClick={handleReset}>
            Reset All
        </Button>
    </Stack>

    {generatedPrompt && (
        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.100', border: '1px solid', borderColor: 'grey.300' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Your Generated Prompt</Typography>
            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', m: 0, p: 2, backgroundColor: '#fff', borderRadius: 1, fontFamily: 'monospace', border: '1px solid', borderColor: 'grey.300' }}>
                {generatedPrompt}
            </Box>
        </Paper>
    )}

    <Stack sx={{ mt: 4 }} alignItems="flex-end">
        <Button 
            variant="contained" 
            startIcon={<CheckCircle />} 
            onClick={handleApplyPrompt} 
            size="large"
            sx={{ py: 1.5, px: 4 }}
        >
            Apply to Form
        </Button>
    </Stack>
  </Box>
 );
}
