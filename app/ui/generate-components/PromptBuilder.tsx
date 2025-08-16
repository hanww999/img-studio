'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Button, Grid, Typography, Stack, Paper, Card, CardActionArea, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Chip, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  ExpandMore, AccountCircle, Place, DirectionsRun, Palette, Mic, Movie,
  RestartAlt, AutoFixHigh, CheckCircle, Block
} from '@mui/icons-material';
import { initialPromptData, professionalTemplates, industryKeywords, PromptData, Template } from '../../api/prompt-builder-utils';

// 定义组件的 Props 接口
interface PromptBuilderProps {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}

// 可复用的区域标题组件
const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
    {icon}
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
  </Stack>
);

// 可复用的标签输入框组件
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

export default function PromptBuilder({ onApply, onClose }: PromptBuilderProps) {
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('Cinematic Vlog');
  const [industry, setIndustry] = useState<'common' | 'gaming' | 'ecommerce' | 'advertising'>('common');

  // 使用 useMemo 优化关键字列表的计算
  const keywords = useMemo(() => {
    return {
      cinematography: [...industryKeywords.common.cinematography, ...(industryKeywords[industry]?.cinematography || [])],
      lightingVfx: [...industryKeywords.common.lightingVfx, ...(industryKeywords[industry]?.lightingVfx || [])],
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
        <Button variant="text" onClick={handleReset} startIcon={<RestartAlt />}>Reset</Button>
        <Button variant="contained" onClick={handleApplyAndClose} startIcon={<CheckCircle />} size="large">Apply to Form</Button>
      </Stack>
    </Box>
  );
}
