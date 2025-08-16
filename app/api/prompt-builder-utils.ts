import { AdUnits, Brush, Camera, Gamepad, Lightbulb, Mic, Movie, Palette, Place, Public, VideogameAsset, Villa } from '@mui/icons-material';

// 1. [核心修改] 定义新的、分层的数据结构
export interface PromptData {
  // 核心创意
  subject: string;
  context: string;
  action: string;
  // 专业控制
  cinematography: string;
  lightingVfx: string;
  negativePrompt: string;
  audio: string;
}

// 2. [核心修改] 定义新的模板接口
export interface Template {
  title: string;
  description: string;
  icon: React.ElementType;
  data: PromptData;
}

// 3. [核心修改] 更新默认数据以匹配新结构
export const initialPromptData: PromptData = {
  subject: 'A 25-year old travel vlogger with authentic energy, wearing casual outdoor gear',
  context: 'standing on a scenic mountain overlook during golden hour, backpack and hiking equipment visible',
  action: 'speaks directly to camera while gesturing toward breathtaking landscape, natural and conversational',
  cinematography: 'Medium close-up, smooth gimbal movement, natural framing',
  lightingVfx: 'Golden hour lighting with warm, natural glow, professional color correction',
  negativePrompt: 'blurry, low quality, watermark, text, ugly, deformed',
  audio: "Enthusiastic narration: 'After 6 hours of hiking, this view makes every step worth it!' with gentle wind and nature sounds",
};

// 4. [核心修改] 定义新的、面向行业的建议标签
export const industryKeywords = {
  common: {
    cinematography: ['Close-up', 'Medium Shot', 'Wide Shot', 'Tracking Shot', 'Handheld', 'Shallow Depth of Field', 'Cinematic', 'Documentary Style'],
    lightingVfx: ['Natural Light', 'Studio Lighting', 'Dramatic Shadows', 'Lens Flare', 'Film Grain', 'HDR Color Grading', 'Volumetric Light'],
  },
  gaming: {
    cinematography: ['Game CG Trailer', 'In-Engine Look', 'Concept Art Style', 'Cel-Shading', 'Pixel Art', 'Immersive POV', 'Over-the-Shoulder', 'Bullet-Time/Slow-Mo', 'Orbital Camera', 'Epic Wide-Angle'],
    lightingVfx: ['Sharp Details', 'Motion Blur', 'Magic/Skill VFX', 'UI/HUD Elements', 'Volumetric Fog', 'God Rays', 'Neon-drenched', 'Dark Fantasy Mood', 'Magical Glow'],
  },
  ecommerce: {
    cinematography: ['Clean Studio Product', 'Lifestyle Context', 'Unboxing Video', '360° Spin', 'Top-Down Flat Lay', 'Macro/Detail Shot', 'Product-focused', 'Static Tripod Shot'],
    lightingVfx: ['Clear Texture', 'White Background', 'True-to-Life Color', 'Glossy Finish', 'Softbox Light', 'Bright and Airy', 'Natural Window Light'],
  },
  advertising: {
    cinematography: ['UGC Phone-shot Style', 'Cinematic Storytelling', 'High-end Commercial', 'Abstract Concept', 'Emotional Close-up', 'Dramatic Reveal', 'Sweeping Drone Shot'],
    lightingVfx: ['Warm Color Grade', 'Brand Color Pop', 'Golden Hour', 'High-Contrast/Film Noir', 'Cozy & Inviting', 'Clean & Minimalist'],
  },
};

// 5. [核心修改] 定义新的、功能更强大的模板
export const professionalTemplates: Template[] = [
  {
    title: 'Cinematic Vlog',
    description: 'For travel and lifestyle content',
    icon: Public,
    data: initialPromptData,
  },
  {
    title: 'Game Trailer Shot',
    description: 'Epic cinematic for game promotion',
    icon: Gamepad,
    data: {
      subject: 'A battle-hardened elven ranger, clad in forest camouflage leather, holding a glowing runic longbow.',
      context: 'On the pinnacle of an ancient, moss-covered stone ruin, with a stormy dusk sky in the background.',
      action: 'She leaps towards another stone pillar, drawing an arrow mid-air that gathers wind elemental energy.',
      cinematography: 'Dynamic low-angle tracking shot, capturing her leap from below, combined with a bullet-time slow-motion effect. The background has intense motion blur.',
      lightingVfx: 'Dusk god rays pierce through the clouds, creating rim lighting on her silhouette. Distant lightning flashes illuminate the scene. The arrow has visible cyan wind magic particles. The overall color grade is cool and cinematic.',
      negativePrompt: 'cartoonish, plastic-like, static, overexposed',
      audio: 'Epic orchestral score, the creak of the bowstring, the howl of the wind, and distant thunder.',
    },
  },
  {
    title: 'E-commerce Product',
    description: 'Clean studio shot for product display',
    icon: Villa,
    data: {
      subject: 'A latest model of Sennheiser noise-canceling headphones, matte black with a brushed metal finish.',
      context: 'On a flawless, pure white seamless background.',
      action: 'Statically placed at an angle that best showcases its design.',
      cinematography: 'Professional product photography, commercial-grade, with a macro lens capturing the texture of the leather earcups and metal.',
      lightingVfx: 'Bright, clean commercial studio lighting with soft shadows to emphasize three-dimensionality. No stray light. Hyper-realistic with colors true to the actual product.',
      negativePrompt: 'cluttered background, color distortion, artistic filters, harsh reflections',
      audio: 'No audio needed.',
    },
  },
  {
    title: 'Performance Ad (UGC)',
    description: 'For social media click-through rates',
    icon: AdUnits,
    data: {
      subject: 'A relatable, ordinary woman in her 30s, with minimal or no makeup.',
      context: 'In a standard home bathroom, with bright but not professionally lit lighting.',
      action: 'She is speaking directly to her phone\'s front camera (first-person view), excitedly showing an acne serum and pointing to a before-and-after spot on her face.',
      cinematography: 'Shot on a phone front camera style, with slight shakes, looking like it\'s handheld. A text overlay at the top mimics a TikTok UI: "This thing actually works!"',
      lightingVfx: 'Standard bathroom overhead lighting, authentic, slightly overexposed. No special effects, no color grading, looks straight out of the phone.',
      negativePrompt: 'professional lighting, gimbal shot, cinematic color grading, staged, too perfect',
      audio: 'Her own slightly excited, fast-paced voiceover: "Girls, I have to show you this! I used it for one night, and this pimple is gone!"',
    },
  },
];
