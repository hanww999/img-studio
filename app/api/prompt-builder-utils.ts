// 文件路径: app/api/prompt-builder-utils.ts 
import { AdUnits, Gamepad, Public, Villa } from '@mui/icons-material';

export interface PromptData {
  subject: string;
  context: string;
  action: string;
  cinematography: string;
  lightingVfx: string;
  negativePrompt: string;
  audio: string;
}

export interface Template {
  title: string;
  description: string;
  icon: React.ElementType;
  data: PromptData;
}

export const initialPromptData: PromptData = {
  subject: 'A lone astronaut in a sleek, white and orange advanced spacesuit, helmet visor reflecting the alien landscape.',
  context: 'Inside a vast, bioluminescent alien cave. Giant, glowing crystalline structures and otherworldly flora cover the walls, casting an ethereal blue and purple light.',
  action: 'The astronaut cautiously reaches out a gloved hand to touch a mysterious, pulsating orb of light that is floating silently in the center of the cave.',
  cinematography: 'Slow, smooth tracking shot from behind the astronaut, creating a sense of discovery. Shallow depth of field focuses on the hand and the orb, blurring the background. The shot has a slight, almost imperceptible, handheld feel to add tension.',
  lightingVfx: 'The primary light source is the bioluminescent environment itself, creating soft, volumetric, and colorful lighting. Dust motes dance in the air, caught in the light beams. The orb emits a gentle, pulsating glow.',
  negativePrompt: 'bright daylight, cartoony, hard shadows, human figures without suits, fast-paced action',
  audio: 'A low, ambient, and mysterious synthesizer pad creates a sense of wonder and tension. The only other sounds are the astronaut\'s soft, controlled breathing inside the helmet and a faint, high-frequency hum from the floating orb.',
};

export const industryKeywords = {
  common: {
    cinematography: [
      { label: '特写', value: 'Close-up' }, { label: '中景', value: 'Medium Shot' }, { label: '远景', value: 'Wide Shot' },
      { label: '跟踪镜头', value: 'Tracking Shot' }, { label: '手持拍摄', value: 'Handheld' }, { label: '浅景深', value: 'Shallow Depth of Field' },
      { label: '电影感', value: 'Cinematic' }, { label: '纪录片风格', value: 'Documentary Style' },
    ],
    lightingVfx: [
      { label: '自然光', value: 'Natural Light' }, { label: '影棚光', value: 'Studio Lighting' }, { label: '戏剧性阴影', value: 'Dramatic Shadows' },
      { label: '镜头光晕', value: 'Lens Flare' }, { label: '胶片颗粒', value: 'Film Grain' }, { label: 'HDR调色', value: 'HDR Color Grading' },
      { label: '体积光', value: 'Volumetric Light' },
    ],
  },
  gaming: {
    cinematography: [
      { label: '游戏CG预告片', value: 'Game CG Trailer' }, { label: '游戏引擎实机画面', value: 'In-Engine Look' }, { label: '概念艺术风格', value: 'Concept Art Style' },
      { label: '卡通渲染', value: 'Cel-Shading' }, { label: '像素艺术', value: 'Pixel Art' }, { label: '沉浸式第一人称视角', value: 'Immersive POV' },
      { label: '越肩视角', value: 'Over-the-Shoulder' }, { label: '子弹时间/慢动作', value: 'Bullet-Time/Slow-Mo' }, { label: '环绕运镜', value: 'Orbital Camera' },
      { label: '史诗级广角', value: 'Epic Wide-Angle' },
    ],
    lightingVfx: [
      { label: '锐利细节', value: 'Sharp Details' }, { label: '动态模糊', value: 'Motion Blur' }, { label: '魔法/技能特效', value: 'Magic/Skill VFX' },
      { label: 'UI/HUD界面元素', value: 'UI/HUD Elements' }, { label: '体积雾', value: 'Volumetric Fog' }, { label: '上帝光', value: 'God Rays' },
      { label: '霓虹光污染', value: 'Neon-drenched' }, { label: '暗黑幻想氛围', value: 'Dark Fantasy Mood' }, { label: '魔法光辉', value: 'Magical Glow' },
    ],
  },
  ecommerce: {
    cinematography: [
      { label: '干净的影棚产品', value: 'Clean Studio Product' }, { label: '生活化场景', value: 'Lifestyle Context' }, { label: '开箱视频', value: 'Unboxing Video' },
      { label: '360度旋转展示', value: '360° Spin' }, { label: '俯视平铺', value: 'Top-Down Flat Lay' }, { label: '微距/细节镜头', value: 'Macro/Detail Shot' },
      { label: '聚焦产品', value: 'Product-focused' }, { label: '固定机位', value: 'Static Tripod Shot' },
    ],
    lightingVfx: [
      { label: '清晰纹理', value: 'Clear Texture' }, { label: '纯白背景', value: 'White Background' }, { label: '色彩保真', value: 'True-to-Life Color' },
      { label: '光泽质感', value: 'Glossy Finish' }, { label: '柔光箱布光', value: 'Softbox Light' }, { label: '明亮通透', value: 'Bright and Airy' },
      { label: '自然窗光', value: 'Natural Window Light' },
    ],
  },
  advertising: {
    cinematography: [
      { label: 'UGC手机拍摄风格', value: 'UGC Phone-shot Style' }, { label: '电影化叙事', value: 'Cinematic Storytelling' }, { label: '高端商业广告', value: 'High-end Commercial' },
      { label: '抽象概念', value: 'Abstract Concept' }, { label: '情感特写', value: 'Emotional Close-up' }, { label: '戏剧性揭示', value: 'Dramatic Reveal' },
      { label: '大范围无人机航拍', value: 'Sweeping Drone Shot' },
    ],
    lightingVfx: [
      { label: '暖色调', value: 'Warm Color Grade' }, { label: '品牌色突出', value: 'Brand Color Pop' }, { label: '黄金时刻', value: 'Golden Hour' },
      { label: '高对比度/黑色电影', value: 'High-Contrast/Film Noir' }, { label: '舒适温馨', value: 'Cozy & Inviting' }, { label: '简洁干净', value: 'Clean & Minimalist' },
    ],
  },
};

export const professionalTemplates: Template[] = [
  { title: '电影感Vlog', description: '适用于旅行和生活方式内容', icon: Public, data: initialPromptData },
  {
    title: '游戏预告片镜头', description: '用于游戏推广的史诗级电影镜头', icon: Gamepad,
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
    title: '电商产品展示', description: '用于产品展示的干净影棚镜头', icon: Villa,
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
    title: '效果广告 (UGC风格)', description: '适用于社交媒体点击率优化', icon: AdUnits,
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
