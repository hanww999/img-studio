'use client';

import * as React from 'react';
import { Box, Chip, Stack, TextField, Typography } from '@mui/material';

interface Keyword {
  label: string;
  value: string;
}

interface ChipInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  keywords: Keyword[];
  placeholder?: string;
}

export default function ChipInput({ label, value, onChange, keywords, placeholder }: ChipInputProps) {
  const handleAddChip = (chipValue: string) => {
    const currentValue = value || '';
    // 避免重复添加
    if (currentValue.toLowerCase().includes(chipValue.toLowerCase())) return;
    const newValue = currentValue ? `${currentValue}, ${chipValue}` : chipValue;
    onChange(newValue);
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{label}</Typography>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        size="small"
        placeholder={placeholder || `自由输入或从下方添加关键词...`}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {keywords.map((keyword) => (
          <Chip
            key={keyword.value}
            label={keyword.label}
            onClick={() => handleAddChip(keyword.value)}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Stack>
  );
}
