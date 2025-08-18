// 文件路径: app/ui/generate-components/GenerateSettings.tsx (最终完整修正版)

import * as React from 'react'
import { IconButton, Typography, Box, Menu, MenuItem, Avatar } from '@mui/material'
import { CustomizedAvatarButton, CustomizedIconButton, CustomizedIconButtonOpen } from '../ux-components/Button-SX'
import FormInputDropdown from '../ux-components/InputDropdown'
import FormInputChipGroup from '../ux-components/InputChipGroup'
import { GenerateSettingsI } from '../ux-components/InputInterface'
import { FormInputTextSmall } from '../ux-components/InputTextSmall'
import { Settings } from '@mui/icons-material'
import CustomTooltip from '../ux-components/Tooltip'
import { FormInputNumberSmall } from '../ux-components/FormInputNumberSmall'

export default function GenerateSettings({
  control,
  setValue,
  generalSettingsFields,
  advancedSettingsFields,
  warningMessage,
}: GenerateSettingsI) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  // [核心修正] 移除硬编码的白色背景，让 Menu 继承主题
  const CustomizedMenu = {
    '& .MuiPaper-root': {
      // bgcolor: 'background.paper' 会自动从主题继承
      boxShadow: 5,
      p: 1,
      width: 280, // 稍微加宽以获得更好的布局
      '& .MuiMenuItem-root': {
        p: 1, // 统一内边距
        borderRadius: 2, // 为菜单项增加圆角
      },
    },
  }

  return (
    <>
      <CustomTooltip title="Open settings" size="small">
        <IconButton onClick={handleClick} disableRipple sx={{ px: 0.5 }}>
          <Avatar sx={{ ...CustomizedAvatarButton, ...(open === true && CustomizedIconButtonOpen) }}>
            <Settings
              sx={{
                ...CustomizedIconButton,
                ...(open === true && CustomizedIconButtonOpen),
              }}
            />
          </Avatar>
        </IconButton>
      </CustomTooltip>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
        sx={CustomizedMenu}
      >
        {warningMessage !== '' && (
          <Typography
            color="warning.main"
            sx={{ m: 1, fontSize: '0.7rem', fontWeight: 400, fontStyle: 'italic', px: 1 }}
          >
            {warningMessage}
          </Typography>
        )}
        {Object.entries(generalSettingsFields).map(function ([param, field]) {
          return (
            <MenuItem key={param}>
              <FormInputChipGroup
                name={param}
                label={field.label}
                key={param}
                control={control}
                setValue={setValue}
                width="100%" // 使用100%宽度
                field={field}
                required={true}
              />
            </MenuItem>
          )
        })}

        {Object.entries(advancedSettingsFields).map(function ([param, field]) {
          return (
            <MenuItem key={param}>
              <FormInputDropdown
                name={param}
                label={field.label}
                key={param}
                control={control}
                field={field}
                styleSize="small"
                width="100%" // 使用100%宽度
                required={true}
              />
            </MenuItem>
          )
        })}
        <MenuItem key={'negativePrompt'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {'Negative prompt'}
            </Typography>
            <FormInputTextSmall
              rows={2}
              name="negativePrompt"
              label="" // 移除重复的 label
              control={control}
              required={false}
            />
          </Box>
        </MenuItem>
        <MenuItem key={'seedNumber'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {'Seed number (optional)'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal', mb: 1 }}>
              {'A specific seed and prompt will always produce the same output'}
            </Typography>
            <FormInputNumberSmall name="seedNumber" control={control} min={1} max={2147483647} />
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}
