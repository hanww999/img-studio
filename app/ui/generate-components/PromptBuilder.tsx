// 文件路径: app/ui/generate-components/PromptBuilder.tsx (Veo - 最终汉化修复版)

'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Button, Grid, Typography, Stack, Paper, Card, CardActionArea, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Chip, TextField, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ExpandMore, RestartAlt, AutoFixHigh, CheckCircle, Block, ContentCopy, WbSunny, Theaters, Movie, Mic
} from '@mui/icons-material';
import { initialPromptData, professionalTemplates, industryKeywords, PromptData, Template } from '../../api/prompt-builder-utils';

interface Keyword { label: string; value: string; }
interface PromptBuilderProps { onApply: (prompt: string, negativePrompt: string) => void; onClose: () => void; }

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
    {icon}
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{title}</Typography>
  </Stack>
);

const ChipInput = ({ label, value, onChange, keywords }: { label: string, value: string, onChange: (newValue: string) => void, keywords: Keyword[] }) => {
  const handleAddChip = (chipValue: string) => {
    const currentValue = value || '';
    const newValue = currentValue ? `${currentValue}, ${chipValue}` : chipValue;
    onChange(newValue);
  };

  return (
    <Stack spacing={1.5}>
      <TextField
        label={label} value={value} onChange={(e) => onChange(e.target.value)}
        fullWidth multiline rows={3} variant="outlined" placeholder={`自由输入或从下方添加关键词...`}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {keywords.map((keyword) => (
          <Chip key={keyword.value} label={keyword.label} onClick={() => handleAddChip(keyword.value)} size="small" />
        ))}
      </Box>
    </Stack>
  );
};

const PreviewCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => {
  if (!content) return null;
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('电影感Vlog');
  const [industry, setIndustry] = useState<'common' | 'gaming' | 'ecommerce' | 'advertising'>('common');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('复制全部');

  const keywords = useMemo(() => {
    const industryCinematography = industryKeywords[industry]?.cinematography || [];
    const industryLightingVfx = industryKeywords[industry]?.lightingVfx || [];
    const combinedCinematography = [...industryKeywords.common.cinematography, ...industryCinematography];
    const combinedLightingVfx = [...industryKeywords.common.lightingVfx, ...industryLightingVfx];
    const uniqueCinematography = Array.from(new Map(combinedCinematography.map(item => [item.value, item])).values());
    const uniqueLightingVfx = Array.from(new Map(combinedLightingVfx.map(item => [item.value, item])).values());
    return { cinematography: uniqueCinematography, lightingVfx: uniqueLightingVfx };
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

  const handleCopyFromPreview = () => {
    const finalPrompt = generateFinalPrompt();
    const fullTextToCopy = `Prompt: ${finalPrompt}\n\nNegative Prompt: ${promptData.negativePrompt}`;
    navigator.clipboard.writeText(fullTextToCopy).then(() => {
      setCopyStatus('已复制!');
      setTimeout(() => setCopyStatus('复制全部'), 2000);
    });
  };

  const handleApplyAndClose = () => {
    onApply(generateFinalPrompt(), promptData.negativePrompt);
    onClose();
  };

  const handleReset = () => {
    setPromptData(initialPromptData);
    setSelectedTemplate('电影感Vlog');
    setIndustry('common');
  };

  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>模板</Typography>
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
        <Grid item xs={12} md={9}>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>核心创意</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField label="主体" value={promptData.subject} onChange={(e) => handleDataChange('subject', e.target.value)} fullWidth multiline rows={2} /></Grid>
                <Grid item xs={12} md={6}><TextField label="背景与场景" value={promptData.context} onChange={(e) => handleDataChange('context', e.target.value)} fullWidth multiline rows={3} /></Grid>
                <Grid item xs={12} md={6}><TextField label="动作与表演" value={promptData.action} onChange={(e) => handleDataChange('action', e.target.value)} fullWidth multiline rows={3} /></Grid>
              </Grid>
            </Paper>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}><Typography variant="h6">专业控制</Typography></AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControl size="small" sx={{ maxWidth: 200 }}>
                    <InputLabel>行业焦点</InputLabel>
                    <Select value={industry} label="行业焦点" onChange={(e) => setIndustry(e.target.value as any)}>
                      <MenuItem value="common">通用</MenuItem><MenuItem value="gaming">游戏</MenuItem>
                      <MenuItem value="ecommerce">电商</MenuItem><MenuItem value="advertising">广告</MenuItem>
                    </Select>
                  </FormControl>
                  <ChipInput label="电影摄影与视觉效果" value={promptData.cinematography} onChange={(v) => handleDataChange('cinematography', v)} keywords={keywords.cinematography} />
                  <ChipInput label="灯光与视觉特效" value={promptData.lightingVfx} onChange={(v) => handleDataChange('lightingVfx', v)} keywords={keywords.lightingVfx} />
                  <TextField label="负面提示词 (需要避免的内容)" value={promptData.negativePrompt} onChange={(e) => handleDataChange('negativePrompt', e.target.value)} fullWidth multiline rows={2} placeholder="例如：模糊, 低质量, 水印, 文字..." />
                  <TextField label="音频" value={promptData.audio} onChange={(e) => handleDataChange('audio', e.target.value)} fullWidth multiline rows={2} />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3, p: 1 }}>
        <Button variant="outlined" onClick={() => setPreviewOpen(true)} startIcon={<AutoFixHigh />}>预览生成的提示词</Button>
        <Button variant="text" onClick={handleReset} startIcon={<RestartAlt />}>重置</Button>
        <Button variant="contained" onClick={handleApplyAndClose} startIcon={<CheckCircle />} size="large">应用到表单</Button>
      </Stack>
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>生成的提示词预览</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <PreviewCard icon={<Theaters fontSize="small" />} title="核心描述" content={`${promptData.subject}, ${promptData.action}, ${promptData.context}.`} />
            <PreviewCard icon={<Movie fontSize="small" />} title="电影摄影与视觉效果" content={promptData.cinematography} />
            <PreviewCard icon={<WbSunny fontSize="small" />} title="灯光与视觉特效" content={promptData.lightingVfx} />
            <PreviewCard icon={<Block fontSize="small" color="error" />} title="负面提示词" content={promptData.negativePrompt} />
            <PreviewCard icon={<Mic fontSize="small" />} title="音频" content={promptData.audio} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyFromPreview} startIcon={<ContentCopy />}>{copyStatus}</Button>
          <Button onClick={() => setPreviewOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
