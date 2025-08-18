export const pages = {
  GenerateImage: {
    name: 'Generate an Image',
    description: 'Create new images from scratch or with references',
    href: '/generate?mode=image',
    status: 'true',
  },
  VirtualTryOn: {
    name: 'Generate a Try-On',
    description: 'Generate a try-on image with a model and a garment',
    href: '/try-on',
    status: process.env.NEXT_PUBLIC_VTO_ENABLED,
  },
  Edit: {
    name: 'Generate an Edit',
    description: 'Import, edit and transform existing content',
    href: '/edit',
    status: process.env.NEXT_PUBLIC_EDIT_ENABLED,
  },
  GenerateVideo: {
    name: 'Generate a Video',
    description: 'Produce dynamic videos from text or images',
    href: '/generate?mode=video',
    status: process.env.NEXT_PUBLIC_VEO_ENABLED,
  },
  Library: {
    name: 'Browse',
    description: "Browse and manage your personal creations",
    href: '/library',
    status: 'true',
  },
};
