// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  advancedSettingsI,
  generalSettingsI,
  GenerateFieldI1,
  GenerateFieldSecondartStyleI,
  GenerateFieldStyleI,
  selectFieldsI,
} from './generate-image-utils'

export interface GenerateVideoFormFieldsI {
  prompt: GenerateFieldI1
  modelVersion: GenerateFieldI1
  sampleCount: GenerateFieldI1
  negativePrompt: GenerateFieldI1
  seedNumber: GenerateFieldI1
  aspectRatio: GenerateFieldI1
  resolution: GenerateFieldI1
  durationSeconds: GenerateFieldI1
  personGeneration: GenerateFieldI1
  style: GenerateFieldStyleI
  secondary_style: GenerateFieldSecondartStyleI
  motion: GenerateFieldI1
  effects: GenerateFieldI1
  framing: GenerateFieldI1
  angle: GenerateFieldI1
  ambiance: GenerateFieldI1
  interpolImageFirst: GenerateFieldI1
  interpolImageLast: GenerateFieldI1
  cameraPreset: GenerateFieldI1
}

export const GenerateVideoFormFields = {
  prompt: {
    type: 'textInput',
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  modelVersion: {
    type: 'select',
    default: 'veo-3.0-generate-preview',
    options: [
      {
        value: 'veo-3.0-generate-preview',
        label: 'Veo 3',
        indication: 'Standard model version: Text-to-video & Image-to-video + Audio',
      },
      {
        value: 'veo-3.0-fast-generate-preview',
        label: 'Veo 3 Fast',
        indication: 'Low latency model version: Text-to-video + Audio',
      },
      {
        value: 'veo-2.0-generate-001',
        label: 'Veo 2',
        indication: 'Standard model version: Text-to-video & Image-to-video',
      },
    ],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  isVideoWithAudio: {
    type: 'toggleSwitch',
    default: false,
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  sampleCount: {
    label: 'Quantity of outputs',
    type: 'chip-group',
    default: '1',
    options: ['1', '2', '3', '4'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  negativePrompt: {
    type: 'textInput',
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  seedNumber: {
    type: 'numberInput',
    default: '',
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  aspectRatio: {
    label: 'Aspect ratio',
    type: 'chip-group',
    default: '16:9',
    options: ['16:9', '9:16'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  resolution: {
    label: 'Resolution',
    type: 'chip-group',
    default: '720p',
    options: ['720p'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  durationSeconds: {
    label: 'Video duration (seconds)',
    type: 'chip-group',
    default: '8',
    options: ['5', '6', '7', '8'],
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  personGeneration: {
    label: 'People generation',
    type: 'select',
    default: 'allow_adult',
    options: [
      {
        value: 'allow_adult',
        label: 'Adults only',
      },
      {
        value: 'dont_allow',
        label: 'No people',
      },
    ],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  style: {
    type: 'select',
    default: 'cinematic',
    defaultSub: 'cinematicSub',
    options: [
      {
        value: 'cinematic',
        label: 'Cinematic',
        subID: 'cinematicSub',
      },
      {
        value: 'animation',
        label: 'Animation',
        subID: 'animationSub',
      },
    ],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  secondary_style: {
    type: 'controled-chip-group',
    options: [
      {
        label: 'Cinematic style',
        subID: 'cinematicSub',
        type: 'select',
        options: [
          'Film',
          'Black & White',
          'Horror',
          'Fantasy',
          'Western',
          'Silent film',
          'Vintage',
          'Documentary',
          'Action sequence',
          'Footage',
          'Drone footage',
        ],
        default: '',
      },
      {
        label: 'Animation style',
        subID: 'animationSub',
        type: 'select',
        options: [
          '3D animation',
          '3D cartoon',
          'Japan anime',
          'Classic cartoon',
          'Comic book',
          'Stop-motion',
          'Claymation',
          'Pixel art',
          'Vector art',
          'Motion graphics',
          'Whiteboard',
          'Cutout',
        ],
        default: '',
      },
    ],
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  motion: {
    label: 'Camera motion',
    type: 'chip-group',
    options: ['Aerial', 'Tracking', 'POV', 'Orbit', 'Zoom in', 'Zoom out', 'Static', 'Panning', 'Tilting', 'Handheld'],
    isDataResetable: true,
    isFullPromptAdditionalField: true,
  },
  framing: {
    label: 'Framing',
    type: 'chip-group',
    options: ['Extreme wide', 'Wide', 'Medium', 'Close-up', 'Extreme close-Up', 'Over-the-shoulder'],
    isDataResetable: true,
    isFullPromptAdditionalField: true,
  },
  angle: {
    label: 'Angle',
    type: 'chip-group',
    options: ['High', 'Low', 'Eye-level', "Bird's eye"],
    isDataResetable: true,
    isFullPromptAdditionalField: true,
  },
  ambiance: {
    label: 'Ambiance',
    type: 'chip-group',
    options: ['Bright daylight', 'Golden hour', 'Night scene', 'Moody', 'Monochrome', 'Neon', 'Silhouette', 'Dramatic'],
    isDataResetable: true,
    isFullPromptAdditionalField: true,
  },
  effects: {
    label: 'Special effects',
    type: 'chip-group',
    options: [
      'Film grain',
      'Slow motion',
      'Hyperlapse',
      'Split screen',
      'Glitch',
      'Analog noise',
      'Projection',
      'Visual collage',
      'Motion blur',
    ],
    isDataResetable: true,
    isFullPromptAdditionalField: true,
  },
  interpolImageFirst: {
    type: 'image',
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  interpolImageLast: {
    type: 'image',
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  cameraPreset: {
    label: 'Camera preset',
    type: 'chip-group',
    default: '',
    options: [
      'Fixed',
      'Pan left',
      'Pan right',
      'Push in',
      'Pull out',
      'Pedestal down',
      'Pedestal up',
      'Truck left',
      'Truck right',
      'Tilt down',
      'Tilt up',
    ],
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
}

// Camera preset options
export const cameraPresetsOptions = [
  {
    value: 'FIXED',
    label: 'Fixed',
  },
  {
    value: 'PAN_LEFT',
    label: 'Pan left',
  },
  {
    value: 'PAN_RIGHT',
    label: 'Pan right',
  },
  {
    value: 'PULL_OUT',
    label: 'Pull out',
  },
  {
    value: 'PUSH_IN',
    label: 'Push in',
  },
  {
    value: 'PEDESTAL_DOWN',
    label: 'Pedestal down',
  },
  {
    value: 'PEDESTAL_UP',
    label: 'Pedestal up',
  },
  {
    value: 'TRUCK_LEFT',
    label: 'Truck left',
  },
  {
    value: 'TRUCK_RIGHT',
    label: 'Truck right',
  },
  {
    value: 'TILT_DOWN',
    label: 'Tilt down',
  },
  {
    value: 'TILT_UP',
    label: 'Tilt up',
  },
]

// Interface of Image use for interpolation during video generation
export const InterpolImageDefaults = {
  format: 'image/png',
  base64Image: '',
  purpose: '',
  ratio: '',
  width: 0,
  height: 0,
}

export interface InterpolImageI {
  format: string
  base64Image: string
  purpose: 'first' | 'last'
  ratio: string
  width: number
  height: number
}

// Set default values for Generate Form
const generateFieldList: [keyof GenerateVideoFormFieldsI] = Object.keys(GenerateVideoFormFields) as [
  keyof GenerateVideoFormFieldsI
]
var formDataDefaults: any
generateFieldList.forEach((field) => {
  const fieldParams: GenerateFieldI1 | GenerateFieldStyleI | GenerateFieldSecondartStyleI =
    GenerateVideoFormFields[field]
  const defaultValue = 'default' in fieldParams ? fieldParams.default : ''
  formDataDefaults = { ...formDataDefaults, [field]: defaultValue }
})
formDataDefaults.interpolImageFirst = { ...InterpolImageDefaults, purpose: 'first' }
formDataDefaults.interpolImageLast = { ...InterpolImageDefaults, purpose: 'last' }

interface CompositionFieldsI {
  motion: GenerateFieldI1
  framing: GenerateFieldI1
  ambiance: GenerateFieldI1
  effects: GenerateFieldI1
  angle: GenerateFieldI1
}
export interface VideoGenerationFieldsI {
  model: GenerateFieldI1
  settings: generalSettingsI
  advancedSettings: advancedSettingsI
  styleOptions: GenerateFieldStyleI
  subStyleOptions: GenerateFieldSecondartStyleI
  compositionOptions: CompositionFieldsI
  cameraPreset: GenerateFieldI1
  resetableFields: (keyof GenerateVideoFormFieldsI)[]
  fullPromptFields: (keyof GenerateVideoFormFieldsI)[]
  defaultValues: any
}

// Sort out Generate fields depending on purpose
export const videoGenerationUtils: VideoGenerationFieldsI = {
  model: GenerateVideoFormFields.modelVersion,
  settings: {
    aspectRatio: GenerateVideoFormFields.aspectRatio,
    resolution: GenerateVideoFormFields.resolution,
    durationSeconds: GenerateVideoFormFields.durationSeconds,
    sampleCount: GenerateVideoFormFields.sampleCount,
  },
  advancedSettings: {
    personGeneration: GenerateVideoFormFields.personGeneration,
  },
  styleOptions: GenerateVideoFormFields.style,
  subStyleOptions: GenerateVideoFormFields.secondary_style,
  compositionOptions: {
    ambiance: GenerateVideoFormFields.ambiance,
    effects: GenerateVideoFormFields.effects,
    framing: GenerateVideoFormFields.framing,
    motion: GenerateVideoFormFields.motion,
    angle: GenerateVideoFormFields.angle,
  },
  cameraPreset: GenerateVideoFormFields.cameraPreset,
  resetableFields: generateFieldList.filter((field) => GenerateVideoFormFields[field].isDataResetable == true),
  fullPromptFields: generateFieldList.filter(
    (field) => GenerateVideoFormFields[field].isFullPromptAdditionalField == true
  ),
  defaultValues: formDataDefaults,
}

//TODO temp - remove when Veo 3 is fully released
export const tempVeo3specificSettings = {
  sampleCount: {
    label: 'Quantity of outputs',
    type: 'chip-group',
    default: '1',
    options: ['1', '2'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  aspectRatio: {
    label: 'Aspect ratio',
    type: 'chip-group',
    default: '16:9',
    options: ['16:9'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
  durationSeconds: {
    label: 'Video duration (seconds)',
    type: 'chip-group',
    default: '8',
    options: ['8'],
    isDataResetable: true,
    isFullPromptAdditionalField: false,
  },
  resolution: {
    label: 'Resolution',
    type: 'chip-group',
    default: '720p',
    options: ['720p', '1080p'],
    isDataResetable: false,
    isFullPromptAdditionalField: false,
  },
}

// Interface of Generate form fields
export interface GenerateVideoFormI {
  prompt: string
  modelVersion: string
  isVideoWithAudio: boolean
  sampleCount: string
  negativePrompt: string
  seedNumber: string
  aspectRatio: string
  durationSeconds: string
  resolution: string
  personGeneration: string
  style: string
  secondary_style: string
  motion: string
  effects: string
  composition: string
  angle: string
  ambiance: string
  interpolImageFirst: InterpolImageI
  interpolImageLast: InterpolImageI
  cameraPreset: string
}

// Interface of Video object created after image generation
export interface VideoI {
  src: string
  gcsUri: string
  ratio: string
  resolution: string
  duration: number
  thumbnailGcsUri: string
  width: number
  height: number
  altText: string
  key: string
  format: string
  prompt: string
  date: string
  author: string
  modelVersion: string
  mode: string
}

// Interface for the successful initiation response
export interface GenerateVideoInitiationResult {
  operationName: string
  prompt: string
}

// Interface for error responses
export interface ErrorResult {
  error: string
}

// Interface definitions needed for polling
export interface VideoSample {
  video: { uri: string; encoding: string }
}
export interface PollingSuccessResponse {
  '@type': string
  generatedSamples: VideoSample[]
}
export interface PollingResponse {
  name: string
  done: boolean
  error?: { code: number; message: string; details: any[] }
  response?: {
    raiMediaFilteredReasons: boolean
    '@type': string
    videos?: VideoSample[]
  }
}

export interface VideoGenerationStatusResult {
  done: boolean
  name?: string
  videos?: VideoI[]
  error?: string
}

// Interface of result sent back by Veo within GCS
export interface VeoModelResultI {
  gcsUri: string
  mimeType: string
}

// Interface defining the input structure for clarity and type safety
export interface BuildVideoListParams {
  videosInGCS: VeoModelResultI[]
  aspectRatio: string
  resolution: string
  duration: number
  width: number
  height: number
  usedPrompt: string
  userID: string
  modelVersion: string
  mode: string
}

// Interface defining the potential output objects from the map before filtering
export type ProcessedVideoResult = VideoI | { warning: string } | { error: string }

// Metadata needed for polling result processing
export interface OperationMetadataI {
  formData: GenerateVideoFormI
  prompt: string
}

// List of Veo available ratio and their corresponding generation dimentions
export const VideoRatioToPixel = [
  { ratio: '9:16', width: 720, height: 1280 },
  { ratio: '16:9', width: 1280, height: 720 },
]

// Random prompt list the user can use if they lack prompt ideas
export const VideoRandomPrompts = [
  'A cinematic advertisement for a luxury watch. The video starts with an extreme close-up on the watch face, the second hand sweeping smoothly. The camera pulls back to reveal a man in a tailored suit dialing a vintage rotary phone in a moody, dimly lit office. The shallow depth of field and green neon light from the window create a mysterious, film noir atmosphere, associating the product with sophistication and intrigue.',
  'A tracking drone shot for a car commercial. A new model red convertible drives along the scenic coastal highways of California. The video is shot in a retro 1970s film style with warm sunlight, long shadows, and a slight film grain, evoking a sense of freedom, nostalgia, and classic cool. The focus is on the car’s sleek design and smooth handling on the open road.',
  'A cinematic for a narrative-driven video game. The shot is a POV from the driver\'s seat of a car moving through the rain-slicked, neon-lit streets of Tokyo at night. The mood is atmospheric and mysterious, setting the tone for a cyberpunk thriller. The windshield wipers swipe back and forth, momentarily clearing the view of the dense, futuristic cityscape.',
  'A scene from a horror movie trailer. The shot is over the shoulder of a young woman in the passenger seat of a car, looking nervously into the back seat. The scene is styled to look like a 1970s horror film, with heavy film grain and dark, ominous lighting. The car is driving down a deserted country road at night, building suspense and a sense of dread.',
  'A cinematic trailer for a detective video game. In a classic black and white, film noir style, a detective and a mysterious woman walk together on a foggy, rain-soaked street. The high-contrast lighting from a single streetlamp casts long shadows, creating an atmosphere of mystery and suspense as they discuss a case in hushed tones.',
  'An animated character reveal for a new family movie or video game. A cute creature with soft, white, snow leopard-like fur and big, expressive blue eyes playfully walks through a magical, sparkling winter forest. The animation is a high-quality 3D render with smooth, fluid movements and a whimsical, heartwarming style.',
  'An architectural fly-through video for a luxury real estate advertisement. The camera smoothly glides around a stunning, futuristic apartment building made of white concrete with flowing, organic shapes. The building is covered in lush greenery and integrated with advanced technology, showcasing a utopian vision of sustainable, high-end living.',
  'An opening cinematic for a sci-fi movie or game. An extreme close-up of a character\'s eye. Reflected in their shimmering iris is a vast, futuristic cityscape with flying vehicles and towering skyscrapers. The camera slowly pushes in on the eye, the reflection becoming clearer, building a sense of wonder and epic scale.',
  'An advertisement for a travel destination or surfwear brand. A wide, slow-motion cinematic shot of a surfer walking on a beautiful, secluded beach, carrying their surfboard. The sun is setting over the ocean, casting a warm, golden glow over the entire scene and creating a silhouette effect. The mood is peaceful, aspirational, and serene.',
  'A commercial for a pet food brand or animal shelter. A heartwarming, cinematic close-up of a young girl giggling as she holds an adorable, fluffy golden retriever puppy. They are in a park, and the scene is backlit by warm, bright sunlight, creating a soft, dreamy glow and emphasizing a moment of pure joy and connection.',
  'A scene from a dramatic indie film. A cinematic close-up of a sad woman riding a public bus at night as rain streaks down the window next to her. The scene is shot with cool, blue tones, and the reflection of blurred city lights plays across her melancholic face, perfectly capturing a mood of loneliness and introspection.',
  'An artistic brand video for a fashion or perfume company. A beautiful double exposure shot combines the silhouette of a woman walking gracefully with cinematic footage of a misty, enchanted forest and a serene lake at dawn. The effect is ethereal and dreamlike, connecting the brand to nature, beauty, and introspection.',
  'A high-fashion makeup or technology advertisement. A stunning close-up shot of a model’s face in a dark studio. Bright blue light and complex geometric patterns are projected onto her face, highlighting her features and the product. The camera slowly pans across her face, creating a futuristic, artistic, and visually arresting look.',
  'An opening title sequence for a TV series or film. The silhouette of a man in a long coat walks resolutely forward against a dynamic, fast-moving collage of international cityscapes at different times of day. The visual style is modern and graphic, suggesting a story involving global travel, espionage, or a character navigating a complex world.',
  'A music video or an ad for a cutting-edge tech brand. A dynamic, glitchy camera effect is used on a close-up of a woman’s face as she speaks or sings. The image flickers, distorts, and is saturated with vibrant neon colors and digital artifacts, creating a high-energy, futuristic, and cyberpunk aesthetic.',
]
