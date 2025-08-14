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
 Card,
 CardActionArea,
 CardContent,
} from '@mui/material';
import {
 AccountCircle,
 Theaters,
 DirectionsRun,
 Palette,
 Videocam,
 FilterCenterFocus,
 WbSunny,
 GraphicEq,
 ContentCopy,
 RestartAlt,
 AutoFixHigh,
  CheckCircle, // Icon for the apply button
} from '@mui/icons-material';
import { initialPromptData, promptBuilderOptions, professionalTemplates, PromptData } from '../../api/prompt-builder-utils';
import theme from '../../theme';
const { palette } = theme;

// FIX: Define props for the component, including the onApply callback
interface PromptBuilderProps {
    onApply: (prompt: string) => void;
}

const PromptField = ({ icon, label, children, badge }: { icon: React.ReactNode; label: string; children: React.ReactNode; badge?: string }) => (
 <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
    {icon}
   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    {label}
   </Typography>
   {badge && (
    <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.2, borderRadius: '12px', fontSize: '0.7rem' }}>
     {badge}
    </Box>
   )}
  </Stack>
  <Box sx={{ flexGrow: 1 }}>
   {children}
  </Box>
 </Paper>
);

// FIX: Use the new props interface
export default function PromptBuilder({ onApply }: PromptBuilderProps) {
 const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
 const [generatedPrompt, setGeneratedPrompt] = useState('');
 const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setPromptData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSelectChange = (e: any) => {
  const { name, value } = e.target;
  setPromptData((prev) => ({ ...prev, [name]: value }));
 };

 const handleTemplateClick = (template: (typeof professionalTemplates)[0]) => {
  setPromptData(template.data);
  setSelectedTemplate(template.title);
  setGeneratedPrompt('');
 };

 const generateFinalPromptString = () => {
    return `Subject: ${promptData.subject}
Context: ${promptData.context}
Action: ${promptData.action}
Style: ${promptData.visualStyle}
Camera: ${promptData.cameraMovement}
Composition: ${promptData.composition}
Ambiance: ${promptData.lighting}
Audio: ${promptData.audio}

Negative prompt: no text overlays, no watermarks, no cartoon effects, no unrealistic proportions, no blurry faces, no distorted hands, no artificial lighting, no oversaturation, no low resolution artifacts, no compression noise, no camera shake, no poor audio quality, no lip-sync issues, no unnatural movements`;
  }

 const handleGeneratePrompt = () => {
  const finalPrompt = generateFinalPromptString();
  setGeneratedPrompt(finalPrompt);
 };

  // FIX: This function now calls the onApply callback passed from the parent
  const handleApplyPrompt = () => {
    const finalPrompt = generatedPrompt || generateFinalPromptString();
    onApply(finalPrompt);
  }

 const handleReset = () => {
  setPromptData(initialPromptData);
  setSelectedTemplate(null);
  setGeneratedPrompt('');
 };

 const handleCopy = () => {
  if (generatedPrompt) {
   navigator.clipboard.writeText(generatedPrompt);
  }
 };

 return (
    // FIX: Removed the outer Box with margin, as it's now inside a DialogContent
  <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
   <Grid container spacing={3}>
    {/* Left Sidebar: Professional Templates */}
    <Grid item xs={12} md={3} lg={2}>
     <Stack spacing={2}>
      {professionalTemplates.map((template) => (
       <Card key={template.title} variant="outlined" sx={{ borderColor: selectedTemplate === template.title ? 'primary.main' : 'rgba(0, 0, 0, 0.12)', borderWidth: 2, backgroundColor: '#fff' }}>
        <CardActionArea onClick={() => handleTemplateClick(template)}>
         <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
           <template.icon color="primary" />
           <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
             {template.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
             {template.description}
            </Typography>
           </Box>
          </Stack>
         </CardContent>
        </CardActionArea>
       </Card>
      ))}
     </Stack>
    </Grid>

    {/* Right Side: Prompt Builder */}
    <Grid item xs={12} md={9} lg={10}>
     <Grid container spacing={2}>
      <Grid item xs={12} md={6}><PromptField icon={<AccountCircle color="primary" />} label="Subject" badge="Core"><TextField name="subject" value={promptData.subject} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe the main character or object..." /></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<Theaters color="primary" />} label="Context & Scene"><TextField name="context" value={promptData.context} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe the environment, location, props..." /></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<DirectionsRun color="primary" />} label="Action & Movement"><TextField name="action" value={promptData.action} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe specific actions, gestures..." /></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<Palette color="primary" />} label="Visual Style"><FormControl fullWidth variant="outlined"><InputLabel id="visual-style-label">Choose visual style...</InputLabel><Select MenuProps={{ PaperProps: { sx: { backgroundColor: 'white' } } }} labelId="visual-style-label" id="visual-style-select" name="visualStyle" value={promptData.visualStyle} onChange={handleSelectChange} label="Choose visual style...">{promptBuilderOptions.visualStyle.map((item) => (<MenuItem key={item} value={item}>{item}</MenuItem>))}</Select></FormControl></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<Videocam color="primary" />} label="Camera Movement"><FormControl fullWidth variant="outlined"><InputLabel id="camera-movement-label">Choose camera movement...</InputLabel><Select MenuProps={{ PaperProps: { sx: { backgroundColor: 'white' } } }} labelId="camera-movement-label" id="camera-movement-select" name="cameraMovement" value={promptData.cameraMovement} onChange={handleSelectChange} label="Choose camera movement...">{promptBuilderOptions.cameraMovement.map((item) => (<MenuItem key={item} value={item}>{item}</MenuItem>))}</Select></FormControl></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<FilterCenterFocus color="primary" />} label="Composition"><TextField name="composition" value={promptData.composition} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe framing, depth of field..." /></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<WbSunny color="primary" />} label="Lighting & Ambiance"><TextField name="lighting" value={promptData.lighting} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe lighting, mood, and weather..." /></PromptField></Grid>
      <Grid item xs={12} md={6}><PromptField icon={<GraphicEq color="primary" />} label="Audio Description" badge="Important"><TextField name="audio" value={promptData.audio} onChange={handleInputChange} fullWidth multiline rows={4} variant="outlined" placeholder="Describe narration, sound effects, music..." /></PromptField></Grid>
     </Grid>

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
       <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Your Generated Prompt</Typography>
            <Button variant="text" startIcon={<ContentCopy />} onClick={handleCopy}>Copy</Button>
        </Stack>
       <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', m: 0, p: 2, backgroundColor: '#fff', borderRadius: 1, fontFamily: 'monospace', border: '1px solid', borderColor: 'grey.300' }}>{generatedPrompt}</Box>
       <Box sx={{ mt: 2, p: 2, backgroundColor: palette.primary.light, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: palette.primary.dark, fontWeight: 'bold' }}>
                Pro Tip: When you're ready, click "Apply to Form" to use this prompt.
            </Typography>
        </Box>
      </Paper>
     )}

      {/* FIX: Main action button to apply the prompt and close the dialog */}
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
    </Grid>
   </Grid>
  </Box>
 );
}
