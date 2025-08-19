export interface TemplateField {
  label: string;
  type: 'text' | 'dropdown';
  defaultValue: string;
  optionsKey?: keyof TemplateOptions;
}

export interface TemplateOptions {
  style?: { value: string; label:string }[];
  lighting?: { value: string; label:string }[];
  composition?: { value: string; label:string }[];
  mood?: { value: string; label:string }[];
  platform?: { value: string; label:string }[];
}

export interface UseCaseTemplate {
  label: string;
  promptTemplate: string;
  fields: Record<string, TemplateField>;
  options: TemplateOptions;
  negativePrompt: string;
  // [修正点] 确保类型只包含支持的宽高比
  aspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4';
}

export const promptTemplates: Record<string, { label: string; useCases: Record<string, UseCaseTemplate> }> = {
  gaming: {
    label: '游戏行业',
    useCases: {
      character_concept: {
        label: '角色概念艺术',
        promptTemplate: '{style} character concept art of a {character_description}, wearing {equipment}, in a {pose}, {lighting}, {details}',
        fields: {
          style: { label: '风格', type: 'dropdown', defaultValue: 'Photorealistic 2D', optionsKey: 'style' },
          character_description: { label: '角色描述', type: 'text', defaultValue: 'heroic fantasy elf mage' },
          equipment: { label: '服装/装备', type: 'text', defaultValue: 'intricate leather armor with glowing runes, holding a staff' },
          pose: { label: '姿态', type: 'text', defaultValue: 'dynamic pose' },
          lighting: { label: '灯光与情绪', type: 'dropdown', defaultValue: 'natural lighting with accurate shadows', optionsKey: 'lighting' },
          details: { label: '细节', type: 'text', defaultValue: 'high fidelity' },
        },
        options: {
          style: [ { value: 'Photorealistic 2D', label: '2D照片级真实感' }, { value: 'Splash art style', label: '游戏闪屏艺术' }, { value: 'Realistic 3D render', label: '写实3D渲染' }, { value: 'Pixel art', label: '像素艺术' } ],
          lighting: [ { value: 'natural lighting with accurate shadows', label: '自然光与精确阴影' }, { value: 'dramatic cinematic lighting', label: '戏剧性电影光照' }, { value: 'Mystical glow', label: '神秘辉光' } ],
        },
        negativePrompt: 'cartoon, blurry, grainy, deformed hands, ugly, low quality',
        aspectRatio: '16:9',
      },
      worldbuilding: {
        label: '世界构建与复杂场景',
        promptTemplate: '{style} worldbuilding scene of a {scene_description}, featuring {key_elements}, {mood}, {composition}',
        fields: {
            style: { label: '风格', type: 'dropdown', defaultValue: 'Photorealistic digital painting', optionsKey: 'style' },
            scene_description: { label: '场景描述', type: 'text', defaultValue: 'bustling cyberpunk megacity at dusk' },
            key_elements: { label: '关键元素', type: 'text', defaultValue: 'glowing skyscrapers, flying cars in the distance, and neon signs reflecting off wet pavement' },
            mood: { label: '氛围与灯光', type: 'dropdown', defaultValue: 'dramatic lighting', optionsKey: 'mood' },
            composition: { label: '构图', type: 'dropdown', defaultValue: 'complex composition', optionsKey: 'composition' },
        },
        options: {
            style: [ { value: 'Photorealistic digital painting', label: '照片级数字绘画' }, { value: 'Epic matte painting', label: '史诗级绘景' }, { value: 'Impressionistic', label: '印象派' } ],
            mood: [ { value: 'dramatic lighting', label: '戏剧性光照' }, { value: 'serene and peaceful', label: '宁静祥和' }, { value: 'dark and foreboding', label: '黑暗不祥' } ],
            composition: [ { value: 'complex composition', label: '复杂构图' }, { value: 'wide-angle shot', label: '广角镜头' }, { value: 'symmetrical', label: '对称构图' } ],
        },
        negativePrompt: 'blurry, ugly, simple, empty',
        aspectRatio: '16:9',
      },
      ui_signage: {
        label: '游戏内UI与标识',
        promptTemplate: 'Clean, {style} in-game signage for a {purpose}, with the text "{text_content}", on a {background}, {lighting}',
        fields: {
            style: { label: '风格', type: 'dropdown', defaultValue: 'minimalist', optionsKey: 'style' },
            purpose: { label: '用途', type: 'text', defaultValue: 'potion shop' },
            text_content: { label: '文本内容', type: 'text', defaultValue: 'Elixirs & Brews' },
            background: { label: '背景', type: 'text', defaultValue: 'wooden background' },
            lighting: { label: '灯光', type: 'dropdown', defaultValue: 'natural lighting', optionsKey: 'lighting' },
        },
        options: {
            style: [ { value: 'minimalist', label: '极简主义' }, { value: 'rustic serif font', label: '乡村衬线字体' }, { value: 'glowing neon', label: '发光霓虹灯' } ],
            lighting: [ { value: 'natural lighting', label: '自然光' }, { value: 'shop interior lighting', label: '商店室内光' }, { value: 'magical glow', label: '魔法光辉' } ],
        },
        negativePrompt: 'blurry, unreadable, messy, modern, corporate',
        aspectRatio: '1:1',
      },
    },
  },
  ecommerce: {
    label: '电子商务',
    useCases: {
      studio_shot: {
        label: '影棚产品图',
        promptTemplate: 'Professional product photo of a {product}, on a {surface}, in a {environment}, {lighting}, {composition}, high-resolution',
        fields: {
          product: { label: '产品', type: 'text', defaultValue: 'stainless steel water bottle' },
          surface: { label: '表面/背景', type: 'text', defaultValue: 'marble countertop' },
          environment: { label: '环境', type: 'text', defaultValue: 'clean white studio setting' },
          lighting: { label: '灯光', type: 'dropdown', defaultValue: 'soft diffused lighting', optionsKey: 'lighting' },
          composition: { label: '构图', type: 'dropdown', defaultValue: 'centered', optionsKey: 'composition' },
        },
        options: {
          lighting: [ { value: 'soft diffused lighting', label: '柔和漫射光' }, { value: 'bright, clean commercial lighting', label: '明亮商业光' }, { value: 'single-source dramatic side light', label: '单光源戏剧性侧光' } ],
          composition: [ { value: 'centered', label: '居中构图' }, { value: 'off-center (rule of thirds)', label: '偏离中心 (三分法)' }, { value: 'top-down flat lay', label: '俯拍平铺' } ],
        },
        negativePrompt: 'blurry, grainy, distorted, ugly, bad lighting, watermark, text, human hands',
        aspectRatio: '16:9',
      },
      lifestyle_shot: {
        label: '生活方式产品图',
        promptTemplate: 'Lifestyle product photo of a {product}, in a {scene}, with {interaction}, {mood}, {composition}',
        fields: {
            product: { label: '产品', type: 'text', defaultValue: 'premium wireless earbuds' },
            scene: { label: '场景', type: 'text', defaultValue: 'on a stylish wooden coffee table in a cozy living room' },
            interaction: { label: '互动元素', type: 'text', defaultValue: 'natural sunlight filtering through a window' },
            mood: { label: '灯光与情绪', type: 'dropdown', defaultValue: 'warm and inviting light', optionsKey: 'mood' },
            composition: { label: '构图', type: 'dropdown', defaultValue: 'shallow depth of field', optionsKey: 'composition' },
        },
        options: {
            mood: [ { value: 'warm and inviting light', label: '温暖舒适光' }, { value: 'bright and airy', label: '明亮通风' }, { value: 'cozy and intimate', label: '舒适私密' } ],
            composition: [ { value: 'shallow depth of field', label: '浅景深' }, { value: 'product in use by a model (no face)', label: '模特使用中(无面部)' }, { value: 'dynamic angle', label: '动态角度' } ],
        },
        negativePrompt: 'studio background, isolated, fake, unrealistic',
        aspectRatio: '4:3',
      },
      ad_creative: {
        label: '广告创意图',
        promptTemplate: 'Eye-catching ad creative photo for a {product}, featuring {concept}, {lighting}, {colors}, ample negative space for text overlay',
        fields: {
            product: { label: '产品', type: 'text', defaultValue: 'new perfume' },
            concept: { label: '视觉概念', type: 'text', defaultValue: 'the bottle surrounded by elegant wavy lines of silk' },
            lighting: { label: '灯光', type: 'dropdown', defaultValue: 'luxury theme, studio lighting', optionsKey: 'lighting' },
            colors: { label: '色彩', type: 'text', defaultValue: 'in navy blue and gold brand colors' },
        },
        options: {
            lighting: [ { value: 'luxury theme, studio lighting', label: '奢华主题摄影棚光' }, { value: 'dynamic and energetic lighting', label: '动感活力光' }, { value: 'minimalist and clean lighting', label: '极简干净光' } ],
        },
        // [修正点] 将 4:5 改为支持的 4:3
        negativePrompt: 'boring, dull, cluttered, low resolution',
        aspectRatio: '4:3',
      },
    },
  },
  social_media: {
    label: '社交媒体',
    useCases: {
      engagement_post: {
        label: '通用互动帖子',
        promptTemplate: '{style} of a {theme}, set against a {background}, in a {mood}, {composition}, leave space for text overlay',
        fields: {
            style: { label: '风格', type: 'dropdown', defaultValue: 'Vibrant, energetic illustration', optionsKey: 'style' },
            theme: { label: '内容主题', type: 'text', defaultValue: 'diverse group of people collaborating in a creative brainstorming session' },
            background: { label: '背景', type: 'text', defaultValue: 'modern office setting' },
            mood: { label: '情绪/色调', type: 'dropdown', defaultValue: 'bright and inviting composition, inspiring tone', optionsKey: 'mood' },
            composition: { label: '构图', type: 'dropdown', defaultValue: 'leave space on top for text overlay', optionsKey: 'composition' },
        },
        options: {
            style: [ { value: 'Vibrant, energetic illustration', label: '活力插画' }, { value: 'Clean, minimalist graphic', label: '干净极简图形' }, { value: 'Warm, authentic photo', label: '温暖真实照片' } ],
            mood: [ { value: 'bright and inviting, inspiring tone', label: '明亮邀请，鼓舞人心' }, { value: 'calm and focused', label: '冷静专注' }, { value: 'fun and playful', label: '有趣好玩' } ],
            composition: [ { value: 'leave space on top for text overlay', label: '顶部留白' }, { value: 'centered subject', label: '主体居中' }, { value: 'dynamic grid layout', label: '动态网格布局' } ],
        },
        negativePrompt: 'dark, gloomy, sad, cluttered',
        aspectRatio: '1:1',
      },
      story_reels: {
        label: '故事与Reels视觉',
        promptTemplate: 'Cinematic photo of a {theme}, {composition}, {mood}',
        fields: {
            theme: { label: '内容主题', type: 'text', defaultValue: 'vibrant festival scene with neon lights and a diverse crowd' },
            composition: { label: '构图', type: 'dropdown', defaultValue: 'dynamic composition', optionsKey: 'composition' },
            mood: { label: '情绪/氛围', type: 'dropdown', defaultValue: 'energetic mood', optionsKey: 'mood' },
        },
        options: {
            composition: [ { value: 'dynamic composition', label: '动态构图' }, { value: 'close-up on details', label: '细节特写' }, { value: 'point-of-view (POV)', label: '第一人称视角' } ],
            mood: [ { value: 'energetic mood', label: '活力氛围' }, { value: 'dreamy and ethereal', label: '梦幻空灵' }, { value: 'raw and authentic', label: '原始真实' } ],
        },
        negativePrompt: 'static, boring, bad quality, horizontal',
        aspectRatio: '9:16',
      },
      ad_creative_social: {
        label: '广告创意',
        promptTemplate: 'High-performance photo for a {platform} ad, featuring a {subject}, {concept}, {lighting}, ample negative space for text overlay',
        fields: {
            platform: { label: '平台', type: 'dropdown', defaultValue: 'Facebook', optionsKey: 'platform' },
            subject: { label: '产品/主体', type: 'text', defaultValue: 'flame-grilled burger on a stone slab' },
            concept: { label: '视觉概念', type: 'text', defaultValue: 'surrounded by fire and smoke' },
            lighting: { label: '灯光', type: 'dropdown', defaultValue: 'dramatic lighting', optionsKey: 'lighting' },
        },
        options: {
            platform: [ { value: 'Facebook', label: 'Facebook' }, { value: 'Instagram', label: 'Instagram' }, { value: 'TikTok', label: 'TikTok' } ],
            lighting: [ { value: 'dramatic lighting', label: '戏剧性光照' }, { value: 'bright, high-contrast lighting', label: '明亮高对比度光' }, { value: 'natural, authentic lighting', label: '自然真实光' } ],
        },
        // [修正点] 将 4:5 改为支持的 4:3
        negativePrompt: 'dull, low-contrast, blurry, generic',
        aspectRatio: '4:3',
      },
    },
  },
};
