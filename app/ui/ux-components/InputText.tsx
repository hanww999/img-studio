// 文件路径: app/ui/ux-components/InputText.tsx (最终修复版)

import React from 'react'
import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'
import { FormTextInputI } from './InputInterface'
import theme from '../../theme'
const { palette } = theme

// [核心] 在 props 中增加 endAdornment，并设为可选
export const FormInputText = ({ 
  name, 
  control, 
  label, 
  required, 
  rows, 
  promptIndication,
  endAdornment 
}: FormTextInputI & { endAdornment?: React.ReactNode }) => {
 return (
  <Controller
   name={name}
   control={control}
   rules={{ required: required }}
   render={({ field: { onChange, value }, fieldState: { error } }) => (
    <TextField
     onChange={onChange}
     value={value}
     label={label}
     helperText={error ? error.message : null}
     error={!!error}
     fullWidth
     required={required}
     multiline
     rows={rows}
     placeholder={promptIndication}
      // [核心] 将 endAdornment 传递给 InputProps
      InputProps={{
        endAdornment: endAdornment,
      }}
     sx={{
      fontSize: '4rem',
      '& .MuiOutlinedInput-root': {
          // [核心] 增加一个对齐方式，确保 adornment 在右下角
          alignItems: 'flex-end',
       '& fieldset': {
        borderColor: palette.secondary.light,
       },
       '&:hover fieldset': {
        borderColor: palette.secondary.main,
       },
       '&.Mui-focused fieldset': {
        border: 1,
        borderColor: palette.primary.main,
       },
      },
     }}
    />
   )}
  />
 )
}
