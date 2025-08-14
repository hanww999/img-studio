// app/routes.tsx
export const pages = {
  GenerateImage: {
    name: 'Generate an Image',
    description: 'Create new images from scratch or with references',
    href: '/generate?mode=image', // FIX: Point to the same page with a URL parameter
    status: 'true',
  },
  GenerateVideo: {
    name: 'Generate a Video',
    description: 'Create new videos from text or images',
    href: '/generate?mode=video', // FIX: Point to the same page with a URL parameter
    status: 'true',
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
}
