import React from 'react'
import { Box, Fade, Tooltip } from '@mui/material'
import theme from '../../theme'
const { palette } = theme

// [保持不变] 这个组件用于不需要背景的 Tooltip
const CustomizedSmallTooltip = {
  sx: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'transparent',
      color: palette.text.primary,
      width: 85,
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 0.9,
      pt: 1,
      textAlign: 'center',
    },
  },
  modifiers: [
    {
      name: 'offset',
      options: { offset: [1, -35] },
    },
  ],
}

// [保持不变] 这个组件用于不需要背景的 Tooltip
const CustomizedBigTooltip = {
  sx: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'transparent',
      color: palette.text.primary,
    },
  },
}

// [保持不变] 这个组件强制使用白色背景
const CustomizedSmallWhiteTooltip = {
  sx: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: 'white',
      color: palette.text.primary,
      width: 80,
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 0.9,
      textAlign: 'center',
    },
  },
  modifiers: [
    {
      name: 'offset',
      options: { offset: [1, -17] },
    },
  ],
}

// [最终修复] 新增一个专门用于暗色主题画廊的 Tooltip 样式
const CustomizedDarkTooltipStyle = {
  sx: {
    '& .MuiTooltip-tooltip': {
      backgroundColor: palette.background.paper, // 使用主题中的 paper 背景色
      color: palette.text.primary,             // 使用主题中的主要文字颜色
      border: `1px solid ${palette.primary.main}`, // 添加一个主色调的边框
      fontSize: 12,
      fontWeight: 500,
    },
  },
}

// [保持不变] 原始的 CustomTooltip
export default function CustomTooltip({
  children,
  title,
  size,
}: {
  children: React.ReactElement
  title: string
  size: string
}) {
  const [open, setOpen] = React.useState(false)
  const handleTooltipOpen = () => { setOpen(true) }
  const handleTooltipClose = () => { setOpen(false) }

  return (
    <Tooltip
      title={title}
      open={open}
      placement={size === 'small' ? 'bottom' : size === 'big' ? 'right' : 'top'}
      disableInteractive
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      slotProps={{
        popper: { ...(size === 'small' && CustomizedSmallTooltip), ...(size === 'big' && CustomizedBigTooltip) },
      }}
    >
      <Box
        onMouseEnter={handleTooltipOpen}
        onMouseLeave={handleTooltipClose}
        onClick={handleTooltipClose}
        sx={{ display: 'flex' }}
      >
        {children ? children : null}
      </Box>
    </Tooltip>
  )
}

// [保持不变] 原始的 CustomWhiteTooltip
export function CustomWhiteTooltip({
  children,
  title,
  size,
}: {
  children: React.ReactElement
  title: string
  size: string
}) {
  const [open, setOpen] = React.useState(false)
  const handleTooltipOpen = () => { setOpen(true) }
  const handleTooltipClose = () => { setOpen(false) }

  return (
    <Tooltip
      title={title}
      open={open}
      placement={'bottom'}
      disableInteractive
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      slotProps={{
        popper: { ...CustomizedSmallWhiteTooltip },
      }}
    >
      <Box
        onMouseEnter={handleTooltipOpen}
        onMouseLeave={handleTooltipClose}
        onClick={handleTooltipClose}
        sx={{ display: 'flex' }}
      >
        {children ? children : null}
      </Box>
    </Tooltip>
  )
}

// [最终修复] 新增一个专门用于暗色主题画廊的 Tooltip 组件
export function CustomDarkTooltip({
  children,
  title,
}: {
  children: React.ReactElement
  title: string
}) {
  const [open, setOpen] = React.useState(false)
  const handleTooltipOpen = () => { setOpen(true) }
  const handleTooltipClose = () => { setOpen(false) }

  return (
    <Tooltip
      title={title}
      open={open}
      placement={'top'} // 默认放在顶部
      disableInteractive
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
      slotProps={{
        popper: { ...CustomizedDarkTooltipStyle }, // 使用我们新的暗色样式
      }}
    >
      <Box
        onMouseEnter={handleTooltipOpen}
        onMouseLeave={handleTooltipClose}
        onClick={handleTooltipClose}
        sx={{ display: 'flex' }}
      >
        {children ? children : null}
      </Box>
    </Tooltip>
  )
}
