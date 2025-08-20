'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Box, Button, Grid, Paper, Stack, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, TextField, List, ListItemButton, ListItemText, Collapse, Chip
} from '@mui/material';
import { Check, Refresh, ExpandLess, ExpandMore } from '@mui/icons-material';
import { promptTemplates, UseCaseTemplate, SubTemplate } from '../../api/prompt-templates';
import theme from '../../theme';

export default function ImagenPromptBuilder({ onApply, onClose }: {
  onApply: (prompt: string, negativePrompt: string, aspectRatio: string) => void;
  onClose: () => void;
}) {
  const industryKeys = Object.keys(promptTemplates);
  const firstIndustryKey = industryKeys[0];
  const firstUseCaseKey = Object.keys(promptTemplates[firstIndustryKey].useCases)[0];
  const firstSubTemplateKey = promptTemplates[firstIndustryKey].useCases[firstUseCaseKey].subTemplates[0].key;

  const [openIndustries, setOpenIndustries] = useState<Record<string, boolean>>({ [firstIndustryKey]: true });
  const [selectedIndustry, setSelectedIndustry] = useState(firstIndustryKey);
  const [selectedUseCase, setSelectedUseCase] = useState(firstUseCaseKey);
  const [selectedSubTemplateKey, setSelectedSubTemplateKey] = useState(firstSubTemplateKey);
  
  const [formState, setFormState] = useState<Record<string, string>>({});

  const currentUseCase: UseCaseTemplate = useMemo(() => {
    return promptTemplates[selectedIndustry].useCases[selectedUseCase];
  }, [selectedIndustry, selectedUseCase]);

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
        // [关键逻辑] 自动加载子模板专属的负面提示词和宽高比
        defaultState.aspectRatio = currentSubTemplate.aspectRatio;
        defaultState.negativePrompt = currentSubTemplate.negativePrompt;
    }
    setFormState(defaultState);
  }, [currentSubTemplate]);

  const handleIndustryClick = (industryKey: string) => {
    setOpenIndustries(prev => ({ ...prev, [industryKey]: !prev[industryKey] }));
  };

  const handleUseCaseSelect = (industryKey: string, useCaseKey: string) => {
    setSelectedIndustry(industryKey);
    setSelectedUseCase(useCaseKey);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const generateLivePrompt = () => {
    if (!currentSubTemplate) return '';
    let livePrompt = currentSubTemplate.promptTemplate;
    for (const key in formState) {
      if (currentSubTemplate.fields[key]) {
        livePrompt = livePrompt.replace(`{${key}}`, formState[key] || '');
      }
    }
    return livePrompt.replace(/, \s*$/, '').replace(/,\s*,/g, ',').trim();
  };

  const handleReset = () => {
    const defaultState: Record<string, string> = {};
    if (currentSubTemplate) {
        for (const key in currentSubTemplate.fields) {
          defaultState[key] = currentSubTemplate.fields[key].defaultValue;
        }
        defaultState.aspectRatio = currentSubTemplate.aspectRatio;
        defaultState.negativePrompt = currentSubTemplate.negativePrompt;
        setFormState(defaultState);
    }
  };

  const handleApply = () => {
    const finalPrompt = generateLivePrompt();
    onApply(finalPrompt, formState.negativePrompt, formState.aspectRatio);
  };

  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={2}>
        {/* 列 1: 模板库 */}
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 1, height: '100%', borderColor: 'rgba(255, 255, 255, 0.23)' }}>
            <Typography variant="h6" sx={{ mb: 1, p: 1 }}>模板库</Typography>
            <List component="nav" dense>
              {Object.entries(promptTemplates).map(([industryKey, industry]) => (
                <React.Fragment key={industryKey}>
                  <ListItemButton onClick={() => handleIndustryClick(industryKey)}>
                    <ListItemText primary={industry.label} primaryTypographyProps={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.9rem' }} />
                    {openIndustries[industryKey] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openIndustries[industryKey]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {Object.entries(industry.useCases).map(([useCaseKey, useCase]) => (
                        <ListItemButton key={useCaseKey} selected={selectedIndustry === industryKey && selectedUseCase === useCaseKey} onClick={() => handleUseCaseSelect(industryKey, useCaseKey)} sx={{ pl: 4, '&.Mui-selected': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '&:hover': { backgroundColor: theme.palette.primary.dark, } }, '& .MuiListItemText-primary': { color: selectedIndustry === industryKey && selectedUseCase === useCaseKey ? theme.palette.primary.contrastText : 'text.primary', fontWeight: selectedIndustry === industryKey && selectedUseCase === useCaseKey ? 600 : 400, } }}>
                          <ListItemText primary={useCase.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
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
                    <Chip
                      key={st.key}
                      label={st.label}
                      onClick={() => setSelectedSubTemplateKey(st.key)}
                      variant={selectedSubTemplateKey === st.key ? 'filled' : 'outlined'}
                      color={selectedSubTemplateKey === st.key ? 'primary' : 'default'}
                    />
                  ))}
                </Stack>
              </Box>

              <Typography variant="h6" gutterBottom>参数化表单</Typography>
              <Grid container spacing={2}>
                {currentSubTemplate && Object.entries(currentSubTemplate.fields).map(([key, field]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    {field.type === 'text' ? (
                      <TextField name={key} label={field.label} value={formState[key] || ''} onChange={handleFormChange} fullWidth variant="outlined" size="small" />
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
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderColor: 'rgba(255, 255, 255, 0.23)' }}>
              <Typography variant="h6" gutterBottom>全局设置</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                   <FormControl fullWidth variant="outlined" size="small">
                      <InputLabel>宽高比</InputLabel>
                      <Select name="aspectRatio" value={formState.aspectRatio || '16:9'} onChange={handleFormChange} label="宽高比">
                        <MenuItem value="16:9">16:9 (宽屏)</MenuItem>
                        <MenuItem value="4:3">4:3 (标准)</MenuItem>
                        <MenuItem value="1:1">1:1 (方形)</MenuItem>
                        <MenuItem value="3:4">3:4 (垂直)</MenuItem>
                        <MenuItem value="9:16">9:16 (故事)</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* [关键逻辑] 这个输入框的值，由 formState.negativePrompt 决定，而该值已在 useEffect 中从子模板自动加载 */}
                  <TextField name="negativePrompt" label="排除项 (负面提示词)" value={formState.negativePrompt || ''} onChange={handleFormChange} fullWidth multiline rows={2} variant="outlined" size="small" />
                </Grid>
              </Grid>
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
