'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Button, Grid, Typography, Stack, Paper, Card, CardActionArea, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Chip, TextField, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ExpandMore, AccountCircle, Place, DirectionsRun, Palette, Mic, Movie,
  RestartAlt, AutoFixHigh, CheckCircle, Block, ContentCopy, WbSunny, Theaters
} from '@mui/icons-material';
import { initialPromptData, professionalTemplates, industryKeywords, PromptData, Template } from '../../api/prompt-builder-utils';

// ... (其他组件定义保持不变) ...
interface PromptBuilderProps {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
    {icon}
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
  </Stack>
);

const ChipInput = ({ label, value, onChange, keywords }: { label: string, value: string, onChange: (newValue: string) => void, keywords: string[] }) => {
  const handleAddChip = (chip: string) => {
    const currentValue = value || '';
    const newValue = currentValue ? `${currentValue}, ${chip}` : chip;
    onChange(newValue);
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder={`Type freely or add keywords from below...`}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {keywords.map((keyword) => (
          <Chip key={keyword} label={keyword} onClick={() => handleAddChip(keyword)} size="small" />
        ))}
      </Box>
    </Stack>
  );
};

// [新增] 用于 Preview 弹窗的卡片组件
const PreviewCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => {
  if (!content) return null; // 如果内容为空则不渲染
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {icon}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>{title}</Typography>
      </Stack>
      <Typography variant="body2">{content}</Typography>
    </Paper>
  );
};


export default function PromptBuilder({ onApply, onClose }: PromptBuilderProps) {
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('Cinematic Vlog');
  const [industry, setIndustry] = useState<'common' | 'gaming' | 'ecommerce' | 'advertising'>('common');
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy All');

  const keywords = useMemo(() => {
    const industryCinematography = industryKeywords[industry]?.cinematography || [];
    const industryLightingVfx = industryKeywords[industry]?.lightingVfx || [];
    
    return {
      cinematography: [...new Set([...industryKeywords.common.cinematography, ...industryCinematography])],
      lightingVfx: [...new Set([...industryKeywords.common.lightingVfx, ...industryLightingVfx])],
    };
  }, [industry]);

  const handleDataChange = (field: keyof PromptData, value: string) => {
    setPromptData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateClick = (template: Template) => {
    setPromptData(template.data);
    setSelectedTemplate(template.title);
  };

  const generateFinalPrompt = () => {
    const { subject, context, action, cinematography, lightingVfx, audio } = promptData;
    const parts = [
      `${subject}, ${action}, ${context}.`,
      cinematography ? `Cinematography: ${cinematography}.` : '',
      lightingVfx ? `Lighting and VFX: ${lightingVfx}.` : '',
      audio ? `Audio: ${audio}.` : '',
    ];
    return parts.filter(part => part).join(' ').replace(/\s+/g, ' ').trim();
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleCopyFromPreview = () => {
    const finalPrompt = generateFinalPrompt();
    const fullTextToCopy = `Prompt: ${finalPrompt}\n\nNegative Prompt: ${promptData.negativePrompt}`;
    navigator.clipboard.writeText(fullTextToCopy).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy All'), 2000);
    });
  };

  const handleApplyAndClose = () => {
    const finalPrompt = generateFinalPrompt();
    onApply(finalPrompt, promptData.negativePrompt);
    onClose();
  };

  const handleReset = () => {
    setPromptData(initialPromptData);
    setSelectedTemplate('Cinematic Vlog');
    setIndustry('common');
  };

  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: 'grey.50' }}>
      <Grid container spacing={3}>
        {/* 左侧模板列表 */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>Templates</Typography>
          <Stack spacing={1.5}>
            {professionalTemplates.map((template) => (
              <Card key={template.title} variant="outlined" sx={{ borderColor: selectedTemplate === template.title ? 'primary.main' : 'grey.300', borderWidth: 2 }}>
                <CardActionArea onClick={() => handleTemplateClick(template)}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <template.icon color="primary" />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{template.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{template.description}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* 右侧构建区域 */}
        <Grid item xs={12} md={9}>
          <Stack spacing={2}>
            {/* 核心创意区域 */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Core Creative</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField label="Subject" value={promptData.subject} onChange={(e) => handleDataChange('subject', e.target.value)} fullWidth multiline rows={2} /></Grid>
                <Grid item xs={12} md={6}><TextField label="Context & Scene" value={promptData.context} onChange={(e) => handleDataChange('context', e.target.value)} fullWidth multiline rows={3} /></Grid>
                <Grid item xs={12} md={6}><TextField label="Action & Performance" value={promptData.action} onChange={(e) => handleDataChange('action', e.target.value)} fullWidth multiline rows={3} /></Grid>
              </Grid>
            </Paper>

            {/* 专业控制区域 */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Professional Controls</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControl size="small" sx={{ maxWidth: 200 }}>
                    <InputLabel>Industry Focus</InputLabel>
                    <Select value={industry} label="Industry Focus" onChange={(e) => setIndustry(e.target.value as any)}>
                      <MenuItem value="common">General</MenuItem>
                      <MenuItem value="gaming">Gaming</MenuItem>
                      <MenuItem value="ecommerce">E-commerce</MenuItem>
                      <MenuItem value="advertising">Advertising</MenuItem>
                    </Select>
                  </FormControl>

                  <ChipInput label="Cinematography & Visuals" value={promptData.cinematography} onChange={(v) => handleDataChange('cinematography', v)} keywords={keywords.cinematography} />
                  <ChipInput label="Lighting & VFX" value={promptData.lightingVfx} onChange={(v) => handleDataChange('lightingVfx', v)} keywords={keywords.lightingVfx} />
                  
                  <TextField
                    label="Negative Prompt (what to avoid)"
                    value={promptData.negativePrompt}
                    onChange={(e) => handleDataChange('negativePrompt', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="e.g., blurry, low quality, watermark, text..."
                  />
                  <TextField label="Audio" value={promptData.audio} onChange={(e) => handleDataChange('audio', e.target.value)} fullWidth multiline rows={2} />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>

      {/* 底部操作按钮 */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3, p: 1 }}>
        <Button variant="outlined" onClick={handlePreview} startIcon={<AutoFixHigh />}>Preview Generated Prompt</Button>
        <Button variant="text" onClick={handleReset} startIcon={<RestartAlt />}>Reset</Button>
        <Button variant="contained" onClick={handleApplyAndClose} startIcon={<CheckCircle />} size="large">Apply to Form</Button>
      </Stack>

      {/* [核心修复] 全新的、结构化的 Preview 弹窗 */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Generated Prompt Preview</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <PreviewCard 
              icon={<Theaters fontSize="small" />} 
              title="Core Description" 
              content={`${promptData.subject}, ${promptData.action}, ${promptData.context}.`} 
            />
            <PreviewCard 
              icon={<Movie fontSize="small" />} 
              title="Cinematography & Visuals" 
              content={promptData.cinematography} 
            />
            <PreviewCard 
              icon={<WbSunny fontSize="small" />} 
              title="Lighting & VFX" 
              content={promptData.lightingVfx} 
            />
            <PreviewCard 
              icon={<Block fontSize="small" color="error" />} 
              title="Negative Prompt" 
              content={promptData.negativePrompt} 
            />
            <PreviewCard 
              icon={<Mic fontSize="small" />} 
              title="Audio" 
              content={promptData.audio} 
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyFromPreview} startIcon={<ContentCopy />}>
            {copyStatus}
          </Button>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
