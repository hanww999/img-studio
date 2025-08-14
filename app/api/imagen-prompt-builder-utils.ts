// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You mayb obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Defines the data structure for all fields in the Imagen Prompt Builder
export interface ImagenPromptData {
  subject: string;
  styleMedium: string;
  detailedDescription: string;
  environment: string;
  composition: string;
  lighting: string;
  colorScheme: string;
  lensType: string;
  cameraSettings: string;
  filmType: string;
  quality: string;
  negativePrompt: string;
}

// Default values for the fields
export const initialImagenPromptData: ImagenPromptData = {
  subject: 'a majestic lion',
  styleMedium: 'photograph',
  detailedDescription: 'with a golden mane, looking directly at the camera',
  environment: 'in the Serengeti during sunset',
  composition: 'close-up shot',
  lighting: 'golden hour',
  colorScheme: 'warm tones',
  lensType: '85mm lens',
  cameraSettings: 'f/1.8',
  filmType: '',
  quality: 'highly detailed, 4k',
  negativePrompt: 'cartoon, drawing, illustration, blurry, grainy',
};

// Options for the dropdown menus in the Imagen Prompt Builder
export const imagenPromptBuilderOptions = {
  styleMedium: [
    'photograph',
    'oil painting',
    'watercolor sketch',
    '3D render',
    'line art',
    'anime',
    'cinematic',
    'abstract',
    'minimalist',
  ],
  composition: [
    'close-up shot',
    'medium shot',
    'full shot',
    'wide-angle shot',
    'extreme wide-angle',
    'portrait',
    'landscape',
    'from a low angle',
    'from a high angle (bird\'s-eye view)',
    'top-down view',
    'dutch angle',
  ],
  lighting: [
    'soft studio light',
    'dramatic lighting',
    'cinematic lighting',
    'golden hour',
    'blue hour',
    'backlit',
    'frontlit',
    'moonlight',
    'neon lighting',
    'ring light',
  ],
  colorScheme: [
    'vibrant colors',
    'monochromatic black and white',
    'pastel colors',
    'warm tones',
    'cool tones',
    'sepia',
    'high contrast',
  ],
  lensType: [
    'telephoto lens',
    'wide-angle lens',
    '85mm lens',
    '50mm lens',
    '35mm lens',
    'macro photography',
    'fisheye lens',
  ],
  cameraSettings: [
    'f/1.4',
    'f/1.8',
    'f/2.8',
    'f/8',
    'f/16',
    'long exposure',
    'motion blur',
    'high shutter speed',
    'shallow depth of field',
    'deep depth of field',
  ],
  filmType: [
    'shot on Kodachrome',
    'shot on Portra 400',
    'shot on Portra 800',
    'shot on Fujifilm Superia',
    'shot on Ilford HP5',
    'shot on CineStill 800T',
  ],
  quality: [
    'highly detailed',
    'sharp focus',
    '4k',
    '8k',
    'photorealistic',
    'hyperrealistic',
    'masterpiece',
  ],
};
