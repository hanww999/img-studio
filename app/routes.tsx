export const pages = {
 GenerateImage: {
  name: 'Generate an Image',
  description: 'Create new images from scratch or with references',
  href: '/generate?mode=image', // 使用查询参数区分模式
  status: 'true',
 },
 // [修改] 将 Edit 移到 Generate a Video 的前面
 Edit: {
  name: 'Edit',
  description: 'Import, edit and transform existing content',
  href: '/edit',
  status: process.env.NEXT_PUBLIC_EDIT_ENABLED,
 },
 GenerateVideo: {
  name: 'Generate a Video',
  // [修改] 更新描述文字
  description: 'Produce dynamic videos from text or images',
  href: '/generate?mode=video', // 使用查询参数区分模式
  status: process.env.NEXT_PUBLIC_VEO_ENABLED, // 视频生成依赖 VEO
 },
 Library: {
  name: 'Browse',
  description: "Explore shared creations from your team's Library",
  href: '/library',
  status: 'true',
 },
};
