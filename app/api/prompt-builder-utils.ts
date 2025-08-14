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

import { SportsEsports, TheaterComedy, Videocam } from '@mui/icons-material';

// Defines the data structure for all fields in the Prompt Builder
export interface PromptData {
  subject: string;
  context: string;
  action: string;
  visualStyle: string;
  cameraMovement: string;
  composition: string;
  lighting: string;
  audio: string;
}

// Defines the structure for a single Professional Template
export interface Template {
  title: string;
  description: string;
  icon: React.ElementType;
  data: PromptData;
}

// Default values for the fields when no template is selected
export const initialPromptData: PromptData = {
  subject: 'A 25-year old travel vlogger with authentic energy, wearing casual outdoor gear',
  context: 'standing on a scenic mountain overlook during golden hour, backpack and hiking equipment visible',
  action: 'speaks directly to camera while gesturing toward breathtaking landscape, natural and conversational',
  visualStyle: '',
  cameraMovement: '',
  composition: 'medium close-up with scenic background, natural framing',
  lighting: 'golden hour lighting with warm, natural glow',
  audio: "enthusiastic narration: 'After 6 hours of hiking, this view makes every step worth it!' with gentle wind and nature sounds",
};

// Options for the dropdown menus in the Prompt Builder
export const promptBuilderOptions = {
  visualStyle: [
    'cinematic corporate style with warm color grading',
    'documentary-style natural lighting and authentic feel',
    'high-end commercial production values with perfect lighting',
    'film noir with dramatic chiaroscuro lighting',
    'bright social-media optimized aesthetic',
    'National Geographic documentary style',
    'professional broadcast quality',
    'artistic with creative visual effects',
    'horror cinematography with dramatic lighting',
    'macro cinematography with extreme close-ups',
    'handheld POV style with personal intimacy',
    'street documentary with natural urban lighting',
  ],
  cameraMovement: [
    'smooth dolly-in from wide to medium shot',
    'tracking shot following subject movement',
    'slow push-in for emotional emphasis',
    'crane shot descending to eye level',
    'handheld documentary style with subtle shake',
    'smooth gimbal movement maintaining stability',
    'rack focus from foreground to subject',
    'slow zoom-in during key moment',
    'panning left to right revealing scene',
    'static shot with perfect framing',
    'overhead shot for unique perspective',
    'low angle shot for dramatic effect',
  ],
};

// Data for the Professional Templates sidebar
export const professionalTemplates: Template[] = [
  {
    title: 'Horror/Thriller Scene',
    description: 'Professional template',
    icon: TheaterComedy,
    data: {
      subject: 'A lone detective, haunted by his past, holding a flickering flashlight.',
      context: 'Inside a derelict, abandoned asylum during a thunderstorm. Dust motes dance in the flashlight beam.',
      action: 'He cautiously pushes open a heavy, creaking door, revealing a long, dark corridor. His breath is visible in the cold air.',
      visualStyle: 'film noir with dramatic chiaroscuro lighting',
      cameraMovement: 'slow push-in for emotional emphasis',
      composition: 'Extreme close-up on the detective\'s wide, fearful eyes, with the dark hallway reflected in them.',
      lighting: 'Harsh, directional light from the flashlight, creating long, distorted shadows. Occasional flashes of lightning illuminate the scene.',
      audio: 'The sound of dripping water, distant thunder, and the detective\'s own ragged breathing. A sudden, sharp, unidentifiable noise echoes from the end of the hall.',
    },
  },
  {
    title: 'Video Game Trailer',
    description: 'Professional template',
    icon: SportsEsports,
    data: {
      subject: 'A futuristic cyborg warrior, clad in glowing neon armor, wielding a plasma sword.',
      context: 'On the rain-slicked rooftops of a sprawling, Blade Runner-esque cyberpunk city at night.',
      action: 'The warrior dashes and leaps between skyscrapers, deflecting laser fire from flying drones with their sword in a fluid, acrobatic sequence.',
      visualStyle: 'high-end commercial production values with perfect lighting',
      cameraMovement: 'tracking shot following subject movement',
      composition: 'Dynamic wide shots showing the scale of the city, intercut with tight action shots of the swordplay.',
      lighting: 'Vibrant neon glow from holographic advertisements reflecting off wet surfaces, creating a high-contrast, colorful scene.',
      audio: 'An epic, high-energy electronic music track with heavy bass, mixed with the sounds of plasma sword clashes, explosions, and futuristic vehicle whooshes.',
    },
  },
  {
    title: 'Cinematic Vlog',
    description: 'Professional template',
    icon: Videocam,
    data: initialPromptData, // Uses the default data as a base
  },
];
