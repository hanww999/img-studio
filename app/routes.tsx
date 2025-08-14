// app/routes.tsx

// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export const pages = {
  // FIX: Replaced the old 'Generate' with two new specific routes
  GenerateImage: {
    name: 'Generate an Image',
    description: 'Create new images from scratch or with references',
    href: '/generate-image',
    status: 'true',
  },
  GenerateVideo: {
    name: 'Generate a Video',
    description: 'Create new videos from text or images',
    href: '/generate-video',
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
