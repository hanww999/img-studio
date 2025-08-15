import * as React from 'react'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormDropdownInputI } from './InputInterface'

// [MODIFIED] Import Stack and Typography for the new layout
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

// [MODIFIED] This function no longer needs to handle the component's overall width
const CustomizedTextField = (styleSize: string) => {
 var customizedFont
 if (styleSize === 'big') {
  customizedFont = '37px'
 }
 if (styleSize === 'small') {
  customizedFont = '24px'
 }

 return {
  '& .MuiSvgIcon-root': {
   color: palette.text.secondary,
   fontSize: customizedFont,
  },
   // The TextField itself now has a defined minimum width
   minWidth: 120,
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

 return (
  <CustomTooltip title={itemIndication == null ? '' : itemIndication} size="big">
     {/* [MODIFIED] The FormControl now just provides context */}
   <FormControl size={'small'} sx={{ width: width }}>
    <Controller
     render={({ field: { onChange, value } }) => (
         // [MODIFIED] The core layout is now a horizontal Stack
         <Stack direction="row" alignItems="center" justifyContent="space-between">
           {/* The Label is now a separate Typography component */}
           <Typography sx={{
             color: palette.text.primary,
             fontWeight: 500,
             fontSize: '0.875rem', // Slightly smaller to fit better
             mr: 2, // Margin to separate it from the dropdown
             whiteSpace: 'nowrap', // Ensure the label itself doesn't wrap
           }}>
             {label}
           </Typography>

           {/* The TextField is now only for the value and dropdown arrow */}
          <TextField
          onChange={onChange}
          value={value == null ? field.default : value}
          select
          variant="standard"
          size="small"
          defaultValue={field.default}
             // [MODIFIED] The label is removed from the TextField itself
          InputProps={{ sx: CustomizedInput(styleSize) }}
          SelectProps={{ MenuProps: CustomizedMenu, displayEmpty: true }}
          sx={CustomizedTextField(styleSize)}
          required={required}
          >
          {field.options.map((field: { value: string; label: string; indication?: string }) => {
            return (
              <MenuItem
                onClick={() => handleClick(field.value, field.indication)}
                key={field.value}
                value={field.value}
                selected={selectedItem === field.value}
                sx={CustomizedMenuItem}
              >
                {field.label}
              </MenuItem>
            )
          })}
          </TextField>
         </Stack>
     )}
     control={control}
     name={name}
     rules={{ required: required }}
    />
   </FormControl>
  </CustomTooltip>
 )
}
