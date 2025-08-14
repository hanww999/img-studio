export const pages = {
  GenerateImage: {
    name: 'Generate an Image',
    description: 'Create new images from scratch or with references',
    href: '/generate?mode=image', // 使用查询参数区分模式
    status: 'true',
  },
  GenerateVideo: {
    name: 'Generate a Video',
    description: 'Create new videos from scratch or with references',
    href: '/generate?mode=video', // 使用查询参数区分模式
    status: process.env.NEXT_PUBLIC_VEO_ENABLED, // 视频生成依赖 VEO
  },
  Edit: {
    name: 'Edit',
    description: 'Import, edit and transform existing content',
    href: '/edit',
    status: process.env.NEXT_PUBLIC_EDIT_ENABLED,
  },
  Library: {
    name: 'Browse',
    description: "Explore shared creations from your team's Library",
    href: '/library',
    status: 'true',
  },
};
