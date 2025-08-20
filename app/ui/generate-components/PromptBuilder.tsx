'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Box, Button, Grid, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, List, ListItemButton, ListItemText, Collapse, Chip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Check, Refresh, ExpandLess, ExpandMore, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { promptTemplates, UseCaseTemplate, SubTemplate } from '../../api/prompt-templates';
import theme from '../../theme';
import ChipInput from '../ux-components/ChipInput'; // 引入新的 ChipInput 组件

const veoTemplates = promptTemplates.veo;

export default function PromptBuilder({ onApply, onClose }: {
  onApply: (prompt: string, negativePrompt: string) => void;
  onClose: () => void;
}) {
  const industryKeys = Object.keys(veoTemplates.useCases);
  const firstIndustryKey = industryKeys[0];
  const firstUseCase = veoTemplates.useCases[firstIndustryKey];
  const firstSubTemplateKey = firstUseCase.subTemplates[0].key;

  const [selectedUseCaseKey, setSelectedUseCaseKey] = useState(firstIndustryKey);
  const [selectedSubTemplateKey, setSelectedSubTemplateKey] = useState(firstSubTemplateKey);
  
  const [formState, setFormState] = useState<Record<string, string>>({});

  const currentUseCase: UseCaseTemplate = useMemo(() => {
    return veoTemplates.useCases[selectedUseCaseKey];
  }, [selectedUseCaseKey]);

  const currentSubTemplate: SubTemplate | undefined = useMemo(() => {
    return currentUseCase?.subTemplates.find(st => st.key === selectedSubTemplateKey);
  }, [currentUseCase, selectedSubTemplateKey]);

  useEffect(() => {
    if (currentUseCase?.subTemplates?.length > 0) {
      setSelectedSubTemplateKey(currentUseCase.subTemplates[0].key);
    }
  }, [currentUseCase]);

  useEffect(() => {
    const defaultState: Record<string, string> = {};
    if (currentSubTemplate) {
        for (const key in currentSubTemplate.fields) {
            defaultState[key] = currentSubTemplate.fields[key].defaultValue;
        }
        defaultState.negativePrompt = currentSubTemplate.negativePrompt;
    }
    setFormState(defaultState);
  }, [currentSubTemplate]);

  const handleUseCaseSelect = (useCaseKey: string) => {
    setSelectedUseCaseKey(useCaseKey);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };
  
  // [新增] 专门处理关键词字段的变化
  const handleKeywordsChange = (value: string) => {
    setFormState(prevState => ({ ...prevState, keywords: value }));
  };

  const generateLivePrompt = () => {
    if (!currentSubTemplate) return '';
    let livePrompt = currentSubTemplate.promptTemplate;
    for (const key in formState) {
      // 确保只替换模板中存在的占位符
      if (livePrompt.includes(`{${key}}`)) {
        livePrompt = livePrompt.replace(`{${key}}`, formState[key] || '');
      }
    }
    // 清理空的占位符和多余的标点
    return livePrompt.replace(/\{[a-zA-Z_]+\}/g, '').replace(/, \./g, '.').replace(/\s\s+/g, ' ').replace(/,\s*$/, '').trim();
  };

  const handleReset = () => {
    const defaultState: Record<string, string> = {};
    if (currentSubTemplate) {
        for (const key in currentSubTemplate.fields) {
          defaultState[key] = currentSubTemplate.fields[key].defaultValue;
        }
        defaultState.negativePrompt = currentSubTemplate.negativePrompt;
        setFormState(defaultState);
    }
  };

  const handleApply = () => {
    const finalPrompt = generateLivePrompt();
    onApply(finalPrompt, formState.negativePrompt);
  };

  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {/* 列 1: 模板库 */}
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 1, height: '100%', borderColor: 'rgba(255, 255, 255, 0.23)' }}>
            <Typography variant="h6" sx={{ mb: 1, p: 1 }}>模板库</Typography>
            <List component="nav" dense>
              {Object.entries(veoTemplates.useCases).map(([useCaseKey, useCase]) => (
                <ListItemButton key={useCaseKey} selected={selectedUseCaseKey === useCaseKey} onClick={() => handleUseCaseSelect(useCaseKey)} sx={{ '&.Mui-selected': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '&:hover': { backgroundColor: theme.palette.primary.dark, } }, '& .MuiListItemText-primary': { color: selectedUseCaseKey === useCaseKey ? theme.palette.primary.contrastText : 'text.primary', fontWeight: selectedUseCaseKey === useCaseKey ? 600 : 400, } }}>
                  <ListItemText primary={useCase.label} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 列 2: 交互式工作区 */}
        <Grid item xs={12} md={9}>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
              <Typography variant="h6" gutterBottom>实时提示词预览</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: '60px', wordWrap: 'break-word' }}>
                {generateLivePrompt()}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, flexGrow: 1, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>场景选择</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {currentUseCase?.subTemplates.map(st => (
                    <Chip key={st.key} label={st.label} onClick={() => setSelectedSubTemplateKey(st.key)} variant={selectedSubTemplateKey === st.key ? 'filled' : 'outlined'} color={selectedSubTemplateKey === st.key ? 'primary' : 'default'} />
                  ))}
                </Stack>
              </Box>

              <Typography variant="h6" gutterBottom>参数化表单</Typography>
              <Grid container spacing={2}>
                {currentSubTemplate && Object.entries(currentSubTemplate.fields)
                  .filter(([key]) => key !== 'keywords') // 不渲染隐藏的关键词字段
                  .map(([key, field]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    {field.type === 'text' ? (
                      <TextField name={key} label={field.label} value={formState[key] || ''} onChange={handleFormChange} fullWidth multiline rows={2} variant="outlined" size="small" />
                    ) : (
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>{field.label}</InputLabel>
                        <Select name={key} value={formState[key] || ''} onChange={handleFormChange} label={field.label}>
                          {(currentUseCase.options[field.optionsKey!] || []).map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                ))}
              </Grid>
              
              {/* [新增UI] 专业关键词库 */}
              <Accordion sx={{ mt: 3, bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">专业关键词库</Typography></AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    <ChipInput label="附加关键词" value={formState.keywords || ''} onChange={handleKeywordsChange} keywords={currentUseCase.options.veo_cinematography_keywords || []} />
                    <ChipInput label="游戏风格" value={formState.keywords || ''} onChange={handleKeywordsChange} keywords={currentUseCase.options.veo_gaming_keywords || []} />
                    <ChipInput label="电商风格" value={formState.keywords || ''} onChange={handleKeywordsChange} keywords={currentUseCase.options.veo_ecommerce_keywords || []} />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
              <Typography variant="h6" gutterBottom>全局设置</Typography>
              <TextField name="negativePrompt" label="排除项 (负面提示词)" value={formState.negativePrompt || ''} onChange={handleFormChange} fullWidth multiline rows={2} variant="outlined" size="small" />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
      
      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center" sx={{ position: 'absolute', bottom: 16, right: 24 }}>
        <Button variant="text" onClick={handleReset} startIcon={<Refresh />}>重置为模板</Button>
        <Button variant="contained" onClick={handleApply} startIcon={<Check />} size="large">应用到表单</Button>
      </Stack>
    </Box>
  );
}
