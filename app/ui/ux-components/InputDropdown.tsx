import * as React from 'react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormDropdownInputI } from './InputInterface'

import { TextField, MenuItem, FormControl, Stack, Typography } from '@mui/material'

import theme from '../../theme'
import CustomTooltip from './Tooltip'
const { palette } = theme

const CustomizedInput = (styleSize: string) => {
 var style = { color: palette.primary.main }
 if (styleSize === 'big') {
  style = { ...style, ...{ fontWeight: 700, fontSize: '2.5rem', pr: 2 } }
 }
 if (styleSize === 'small') {
  style = { ...style, ...{ fontWeight: 400, fontSize: '1rem', pr: 0.5 } }
 }

 return style
}

const CustomizedTextField = (styleSize: string, width: string) => {
 var customizedFont
 var customizedWidth = {}
 if (styleSize === 'big') {
  customizedFont = '37px'
 }
 if (styleSize === 'small') {
  customizedFont = '24px'
   // For the small variant, the width is now handled by the Stack's parent
  customizedWidth = { minWidth: 120 }
 }

 return {
  ...{
   '& .MuiSvgIcon-root': {
    color: palette.text.secondary,
    fontSize: customizedFont,
    },
  },
  ...customizedWidth,
 }
}

const CustomizedSelected = {
 background: 'transparent',
 color: palette.primary.main,
 fontWeight: 500,
 '&:hover &:active': { background: 'transparent' },
}

const CustomizedMenu = {
 sx: {
  '& .MuiPaper-root': {
   background: 'white',
   color: palette.text.primary,
   boxShadow: 1,
   '& .MuiMenu-list': {
    pt: 0.5,
    pb: 1,
    background: 'transparent',
   },
   '& .MuiMenuItem-root': {
    background: 'transparent',
    py: 0.5,
    '&:hover': {
     fontWeight: 500,
     pl: 2.5,
    },
    '&.Mui-selected': CustomizedSelected,
   },
  },
 },
}

const CustomizedMenuItem = {
 '&.Mui-selected': CustomizedSelected,
}

export default function FormInputDropdown({
 styleSize,
 width,
 name,
 control,
 label,
 field,
 required,
}: FormDropdownInputI) {
 const [selectedItem, setSelectedItem] = useState(String)
 const [itemIndication, setItemIndication] = useState(String)

 const handleClick = (value: string, indication: string | undefined) => {
  setSelectedItem(value)
  setItemIndication(indication !== undefined ? indication : '')
 }

 // [MODIFIED] The core logic is now conditional based on styleSize
 const renderInput = (onChange: (...event: any[]) => void, value: any) => {
    // If the style is 'small', use the new layout with a separate label
  if (styleSize === 'small') {
   return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
     <Typography sx={{ color: palette.text.primary, fontWeight: 500, fontSize: '0.875rem', mr: 2, whiteSpace: 'nowrap' }}>
      {label}
     </Typography>
     <TextField
      onChange={onChange}
      value={value == null ? field.default : value}
      select
      variant="standard"
      size="small"
      defaultValue={field.default}
      InputProps={{ sx: CustomizedInput(styleSize) }}
      SelectProps={{ MenuProps: CustomizedMenu, displayEmpty: true }}
      sx={CustomizedTextField(styleSize, width)}
      required={required}
     >
      {field.options.map((option: { value: string; label: string; indication?: string }) => (
       <MenuItem onClick={() => handleClick(option.value, option.indication)} key={option.value} value={option.value} selected={selectedItem === option.value} sx={CustomizedMenuItem}>
        {option.label}
       </MenuItem>
      ))}
     </TextField>
    </Stack>
   )
  }

    // Otherwise (for 'big' style), use the original, more compact layout
  return (
   <TextField
    onChange={onChange}
    value={value == null ? field.default : value}
    select
    variant="standard"
    size="small"
    defaultValue={field.default}
    label={label == null ? '' : label}
    InputLabelProps={{
     sx: { color: palette.text.primary, fontWeight: 500, fontSize: '1rem' },
    }}
    InputProps={{ sx: CustomizedInput(styleSize) }}
    SelectProps={{ MenuProps: CustomizedMenu, displayEmpty: true }}
    sx={CustomizedTextField(styleSize, width)}
    required={required}
   >
    {field.options.map((option: { value: string; label: string; indication?: string }) => (
     <MenuItem onClick={() => handleClick(option.value, option.indication)} key={option.value} value={option.value} selected={selectedItem === option.value} sx={CustomizedMenuItem}>
      {option.label}
     </MenuItem>
    ))}
   </TextField>
  )
 }

 return (
  <CustomTooltip title={itemIndication == null ? '' : itemIndication} size="big">
   <FormControl size={'small'} sx={{ width: width }}>
    <Controller
     render={({ field: { onChange, value } }) => renderInput(onChange, value)}
     control={control}
     name={name}
     rules={{ required: required }}
    />
   </FormControl>
  </CustomTooltip>
 )
}
