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

export interface SubTemplate {
  key: string;
  label: string;
  promptTemplate: string;
  fields: Record<string, TemplateField>;
  negativePrompt: string;
  aspectRatio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4';
}

export interface UseCaseTemplate {
  label:string;
  subTemplates: SubTemplate[];
  options: TemplateOptions;
}

export const promptTemplates: Record<string, { label: string; useCases: Record<string, UseCaseTemplate> }> = {
  gaming: {
    label: '游戏行业',
    useCases: {
      character_concept: {
        label: '角色概念艺术',
        subTemplates: [
          // 幻想与魔法
          {
            key: 'abyssal_paladin',
            label: '幻想 | 深海圣骑士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, in a stance of {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Photorealistic, dark fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'an abyssal paladin' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'ancient, barnacle-encrusted plate armor with bioluminescent coral growing on it' },
              pose: { label: '姿态', type: 'text', defaultValue: 'standing guard in a sunken cathedral while wielding a trident that glows with faint blue light' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'dramatic underwater god rays' },
              details: { label: '细节', type: 'text', defaultValue: 'highly detailed, cinematic, 8k' },
            },
            negativePrompt: 'painting, drawing, illustration, cartoon, anime, 3d render, deformed, disfigured, poorly drawn hands, blurry, low-resolution',
            aspectRatio: '16:9',
          },
          {
            key: 'magma_berserker',
            label: '幻想 | 熔岩狂战士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, in {pose}, lit by {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Digital, epic fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a female magma berserker with skin cracked like cooling lava and a fiery glow from within' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'armor forged from obsidian and dragon bones' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a roaring battle stance with a massive two-handed axe' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'the intense heat and glow of a volcano' },
              details: { label: '细节', type: 'text', defaultValue: 'trending on ArtStation' },
            },
            negativePrompt: 'photo, photorealistic, 3d render, deformed, disfigured, malformed, poorly drawn hands, blurry, grainy, cute, peaceful',
            aspectRatio: '16:9',
          },
          {
            key: 'celestial_scribe',
            label: '幻想 | 天空殿书记官',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, in a pose of {pose}, {lighting}, {details}, clean line art',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Cel-shaded, anime key visual style' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a celestial scribe, an androgynous figure with wings made of pure starlight' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'flowing white and gold silk robes' },
              pose: { label: '姿态', type: 'text', defaultValue: 'magically writing in a floating ethereal tome' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'soft and divine lighting' },
              details: { label: '细节', type: 'text', defaultValue: 'ethereal, graceful' },
            },
            negativePrompt: 'photorealistic, realistic, photo, 3d render, detailed textures, messy lines, dark, gritty, deformed hands',
            aspectRatio: '16:9',
          },
          {
            key: 'plague_alchemist',
            label: '幻想 | 瘟疫炼金术士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, holding {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Gritty, horror fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a plague doctor alchemist' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'a dark leather coat and a crow-like mask with glowing green lenses' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a bubbling potion and a bone saw' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'eerie green alchemical lighting' },
              details: { label: '细节', type: 'text', defaultValue: 'detailed textures, unsettling' },
            },
            negativePrompt: 'cartoon, anime, cute, clean, bright, cheerful, friendly, poorly drawn face, deformed, blurry',
            aspectRatio: '16:9',
          },
          {
            key: 'fungal_druid',
            label: '幻想 | 真菌德鲁伊',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, calmly holding {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Mystical, fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a young female fungal druid with glowing mushrooms in her hair' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'clothes intertwined with moss' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a staff made of a giant, bioluminescent mushroom' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'ethereal glow in a misty forest' },
              details: { label: '细节', type: 'text', defaultValue: 'detailed, atmospheric' },
            },
            negativePrompt: 'photorealistic, realistic, photo, bright, sunny, dry, urban, mechanical, deformed, disfigured',
            aspectRatio: '16:9',
          },
          // 科幻与赛博朋克
          {
            key: 'void_assassin',
            label: '科幻 | 虚空刺客',
            promptTemplate: '{style}, photorealistic character concept art of {character_description}, wearing {equipment}, in a {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Sci-fi, cyberpunk' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a void assassin' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'a sleek, form-fitting stealth suit that bends light' },
              pose: { label: '姿态', type: 'text', defaultValue: 'crouched pose on a skyscraper edge wielding two short, glowing energy daggers' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'lit by neon signs from below' },
              details: { label: '细节', type: 'text', defaultValue: 'stealthy, cinematic, sharp focus' },
            },
            negativePrompt: 'painting, drawing, illustration, cartoon, anime, daylight, bright, poorly drawn hands, blurry, disfigured',
            aspectRatio: '16:9',
          },
          {
            key: 'wasteland_mechanic',
            label: '科幻 | 废土机械师',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, leaning against {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Photorealistic, Mad Max style' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a grizzled old wasteland mechanic with a cybernetic arm' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'patched-up coveralls' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a rusty post-apocalyptic vehicle' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'harsh desert sunlight' },
              details: { label: '细节', type: 'text', defaultValue: 'ultra-detailed, gritty' },
            },
            negativePrompt: 'painting, drawing, cartoon, anime, clean, pristine, futuristic, sleek, lush, green, deformed, blurry',
            aspectRatio: '16:9',
          },
          {
            key: 'solarpunk_botanist',
            label: '科幻 | 太阳朋克植物学家',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, tending to {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Bright, solarpunk aesthetic' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a young female solarpunk botanist with a robotic companion' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'practical, clean-tech clothing' },
              pose: { label: '姿态', type: 'text', defaultValue: 'genetically engineered glowing flora in a massive rooftop greenhouse' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'warm, bright, natural sunlight' },
              details: { label: '细节', type: 'text', defaultValue: 'optimistic, detailed' },
            },
            negativePrompt: 'dark, gloomy, gritty, cyberpunk, post-apocalyptic, pollution, deformed, disfigured, blurry',
            aspectRatio: '16:9',
          },
          {
            key: 'gene_mod_gladiator',
            label: '科幻 | 基因改造角斗士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, in a {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Sci-fi, brutal' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a gene-mod gladiator, a massive brute whose body is a fusion of man and rhinoceros beetle' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'an iridescent carapace for armor' },
              pose: { label: '姿态', type: 'text', defaultValue: 'dynamic fighting pose in a futuristic arena' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'intense, dramatic arena floodlights' },
              details: { label: '细节', type: 'text', defaultValue: '8k' },
            },
            negativePrompt: 'cartoon, anime, slender, weak, peaceful, poorly drawn face, extra limbs, blurry, low-resolution',
            aspectRatio: '16:9',
          },
          {
            key: 'chrono_historian',
            label: '科幻 | 时空旅行历史学家',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, studying {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Intellectual sci-fi' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'an elegant older female time-traveling historian' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'a tweed suit fused with holographic devices' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a floating, glitching historical artifact' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'clean, high-key lighting' },
              details: { label: '细节', type: 'text', defaultValue: 'thoughtful, detailed' },
            },
            negativePrompt: 'action, fighting, chaotic, dark, gritty, fantasy, poorly drawn hands, disfigured, blurry',
            aspectRatio: '16:9',
          },
          // 混合题材
          {
            key: 'steampunk_captain',
            label: '混合 | 蒸汽朋克船长',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, confidently {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Digital painting, steampunk' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a charismatic steampunk sky-pirate captain with a brass prosthetic eye' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'a leather duster over a waistcoat' },
              pose: { label: '姿态', type: 'text', defaultValue: 'at the helm of his airship' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'golden hour lighting over a sea of clouds' },
              details: { label: '细节', type: 'text', defaultValue: 'adventurous, detailed' },
            },
            negativePrompt: 'photorealistic, modern, futuristic, minimalist, simple, poorly drawn face, deformed, blurry',
            aspectRatio: '16:9',
          },
          {
            key: 'undead_samurai',
            label: '混合 | 亡灵武士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, drawing {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Dark fantasy, Ghost of Tsushima style' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'an undead samurai warrior, an armored skeleton wreathed in faint blue soulfire' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'tattered samurai armor' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a cursed katana in a spooky bamboo forest' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'eerie moonlight' },
              details: { label: '细节', type: 'text', defaultValue: 'atmospheric, cinematic' },
            },
            negativePrompt: 'alive, human, flesh, cute, cheerful, bright, daylight, poorly drawn hands, disfigured',
            aspectRatio: '16:9',
          },
          {
            key: 'atlantean_guard',
            label: '混合 | 亚特兰蒂斯卫兵',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, standing {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Fantasy, majestic' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'an Atlantean royal guard' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'armor made of polished shells and enchanted coral' },
              pose: { label: '姿态', type: 'text', defaultValue: 'at attention before a massive underwater gate, holding a crystal-tipped spear' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'soft, magical light of the city of Atlantis' },
              details: { label: '细节', type: 'text', defaultValue: 'detailed' },
            },
            negativePrompt: 'land, desert, sky, fire, dirty, gritty, poorly drawn face, deformed, blurry, disfigured',
            aspectRatio: '16:9',
          },
          {
            key: 'aether_gunslinger',
            label: '混合 | 以太枪手',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, aiming {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Fantasy-western, cinematic' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a stoic female aether-gunslinger with glowing arcane tattoos' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'a duster' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a pair of ornate revolvers that crackle with magical energy' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'dramatic lens flare at sunset' },
              details: { label: '细节', type: 'text', defaultValue: 'dynamic' },
            },
            negativePrompt: 'modern, sci-fi, futuristic, poorly drawn hands, extra fingers, deformed, blurry, low-resolution',
            aspectRatio: '16:9',
          },
          {
            key: 'cosmic_cultist',
            label: '混合 | 宇宙邪教徒',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, raising {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Lovecraftian horror' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a cosmic cultist, face obscured by shadows' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'dark, tattered robes' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a strange, non-euclidean relic' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'unsettling, purple and green cosmic light' },
              details: { label: '细节', type: 'text', defaultValue: 'atmospheric' },
            },
            negativePrompt: 'bright, cheerful, friendly, normal, human, safe, daylight, poorly drawn face, deformed',
            aspectRatio: '16:9',
          },
          // 独特概念
          {
            key: 'living_ink_tattooist',
            label: '独特 | 活体墨水纹身师',
            promptTemplate: '{style} character concept art of {character_description}, using {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Urban fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a mystical tattooist whose own body is covered in animated tattoos' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a needle made of light to ink a glowing, magical pattern' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'warm, intimate, lantern-lit studio' },
              details: { label: '细节', type: 'text', defaultValue: 'magical, detailed' },
            },
            negativePrompt: 'photorealistic, 3d render, bright daylight, fighting, chaotic, deformed hands, blurry, disfigured',
            aspectRatio: '16:9',
          },
          {
            key: 'echo_knight',
            label: '独特 | 回声骑士',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, holding {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Digital painting, high-fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'an Echo Knight, a warrior followed by semi-transparent after-images' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'translucent, ghostly armor' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a shimmering greatsword in a desolate battlefield' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'ethereal and melancholic lighting' },
              details: { label: '细节', type: 'text', defaultValue: 'dynamic' },
            },
            negativePrompt: 'solid, opaque, colorful, cheerful, poorly drawn face, extra limbs, blurry, low-resolution',
            aspectRatio: '16:9',
          },
          {
            key: 'dream_weaver',
            label: '独特 | 梦境编织者',
            promptTemplate: '{style} character concept art of {character_description}, sitting on {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Surreal, Lisa Frank meets fantasy' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a Dream Weaver, a child-like entity made of stardust' },
              pose: { label: '姿态', type: 'text', defaultValue: 'a crescent moon and weaving strands of light into tangible dreams' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'magical, swirling vortex of colorful dream-matter' },
              details: { label: '细节', type: 'text', defaultValue: 'vibrant, whimsical' },
            },
            negativePrompt: 'realistic, photorealistic, dark, gritty, horror, scary, deformed, ugly, blurry',
            aspectRatio: '16:9',
          },
          {
            key: 'idol_guardian',
            label: '独特 | 神像守护者',
            promptTemplate: '{style} character concept art of {character_description}, wearing {equipment}, standing {pose}, {lighting}, {details}',
            fields: {
              style: { label: '风格', type: 'text', defaultValue: 'Fantasy, mysterious' },
              character_description: { label: '角色描述', type: 'text', defaultValue: 'a guardian, a small, nimble creature with large, expressive eyes' },
              equipment: { label: '服装/装备', type: 'text', defaultValue: 'makeshift armor' },
              pose: { label: '姿态', type: 'text', defaultValue: 'protectively in front of a giant, moss-covered stone head of a god' },
              lighting: { label: '灯光与情绪', type: 'text', defaultValue: 'dappled sunlight in a dense jungle' },
              details: { label: '细节', type: 'text', defaultValue: 'atmospheric, detailed' },
            },
            negativePrompt: 'large, giant, human, modern, city, technology, poorly drawn face, deformed, blurry',
            aspectRatio: '16:9',
          },
        ],
        options: {
          style: [],
          lighting: [],
          composition: [],
        },
      },
      worldbuilding: {
        label: '世界构建与复杂场景',
        subTemplates: [
          {
            key: 'cyberpunk_megacity',
            label: '赛博朋克大都市',
            promptTemplate: '{style} worldbuilding scene of a {scene_description}, featuring {key_elements}, {mood}, {composition}',
            fields: {
                style: { label: '风格', type: 'dropdown', defaultValue: 'Photorealistic digital painting', optionsKey: 'style' },
                scene_description: { label: '场景描述', type: 'text', defaultValue: 'bustling cyberpunk megacity at dusk' },
                key_elements: { label: '关键元素', type: 'text', defaultValue: 'glowing skyscrapers, flying cars in the distance, and neon signs reflecting off wet pavement' },
                mood: { label: '氛围与灯光', type: 'dropdown', defaultValue: 'dramatic lighting', optionsKey: 'mood' },
                composition: { label: '构图', type: 'dropdown', defaultValue: 'complex composition', optionsKey: 'composition' },
            },
            negativePrompt: 'blurry, ugly, simple, empty',
            aspectRatio: '16:9',
          }
        ],
        options: {
            style: [ { value: 'Photorealistic digital painting', label: '照片级数字绘画' }, { value: 'Epic matte painting', label: '史诗级绘景' }, { value: 'Impressionistic', label: '印象派' } ],
            mood: [ { value: 'dramatic lighting', label: '戏剧性光照' }, { value: 'serene and peaceful', label: '宁静祥和' }, { value: 'dark and foreboding', label: '黑暗不祥' } ],
            composition: [ { value: 'complex composition', label: '复杂构图' }, { value: 'wide-angle shot', label: '广角镜头' }, { value: 'symmetrical', label: '对称构图' } ],
        },
      },
      ui_signage: {
        label: '游戏内UI与标识',
        subTemplates: [
          {
            key: 'potion_shop_sign',
            label: '药水店招牌',
            promptTemplate: 'Clean, {style} in-game signage for a {purpose}, with the text "{text_content}", on a {background}, {lighting}',
            fields: {
              style: { label: '风格', type: 'dropdown', defaultValue: 'minimalist', optionsKey: 'style' },
              purpose: { label: '用途', type: 'text', defaultValue: 'potion shop' },
              text_content: { label: '文本内容', type: 'text', defaultValue: 'Elixirs & Brews' },
              background: { label: '背景', type: 'text', defaultValue: 'wooden background' },
              lighting: { label: '灯光', type: 'dropdown', defaultValue: 'natural lighting', optionsKey: 'lighting' },
            },
            negativePrompt: 'blurry, unreadable, messy, modern, corporate',
            aspectRatio: '1:1',
          }
        ],
        options: {
            style: [ { value: 'minimalist', label: '极简主义' }, { value: 'rustic serif font', label: '乡村衬线字体' }, { value: 'glowing neon', label: '发光霓虹灯' } ],
            lighting: [ { value: 'natural lighting', label: '自然光' }, { value: 'shop interior lighting', label: '商店室内光' }, { value: 'magical glow', label: '魔法光辉' } ],
        },
      },
    },
  },
  ecommerce: {
    label: '电子商务',
    useCases: {
      studio_shot: {
        label: '影棚产品图',
        subTemplates: [
          {
            key: 'default_studio',
            label: '默认影棚图',
            promptTemplate: 'Professional product photo of a {product}, on a {surface}, in a {environment}, {lighting}, {composition}, high-resolution',
            fields: {
              product: { label: '产品', type: 'text', defaultValue: 'stainless steel water bottle' },
              surface: { label: '表面/背景', type: 'text', defaultValue: 'marble countertop' },
              environment: { label: '环境', type: 'text', defaultValue: 'clean white studio setting' },
              lighting: { label: '灯光', type: 'dropdown', defaultValue: 'soft diffused lighting', optionsKey: 'lighting' },
              composition: { label: '构图', type: 'dropdown', defaultValue: 'centered', optionsKey: 'composition' },
            },
            negativePrompt: 'blurry, grainy, distorted, ugly, bad lighting, watermark, text, human hands',
            aspectRatio: '1:1',
          }
        ],
        options: {
          lighting: [ { value: 'soft diffused lighting', label: '柔和漫射光' }, { value: 'bright, clean commercial lighting', label: '明亮商业光' }, { value: 'single-source dramatic side light', label: '单光源戏剧性侧光' } ],
          composition: [ { value: 'centered', label: '居中构图' }, { value: 'off-center (rule of thirds)', label: '偏离中心 (三分法)' }, { value: 'top-down flat lay', label: '俯拍平铺' } ],
        },
      },
      lifestyle_shot: {
        label: '生活方式产品图',
        subTemplates: [
          {
            key: 'default_lifestyle',
            label: '默认生活方式图',
            promptTemplate: 'Lifestyle product photo of a {product}, in a {scene}, with {interaction}, {mood}, {composition}',
            fields: {
              product: { label: '产品', type: 'text', defaultValue: 'premium wireless earbuds' },
              scene: { label: '场景', type: 'text', defaultValue: 'on a stylish wooden coffee table in a cozy living room' },
              interaction: { label: '互动元素', type: 'text', defaultValue: 'natural sunlight filtering through a window' },
              mood: { label: '灯光与情绪', type: 'dropdown', defaultValue: 'warm and inviting light', optionsKey: 'mood' },
              composition: { label: '构图', type: 'dropdown', defaultValue: 'shallow depth of field', optionsKey: 'composition' },
            },
            negativePrompt: 'studio background, isolated, fake, unrealistic',
            aspectRatio: '4:3',
          }
        ],
        options: {
            mood: [ { value: 'warm and inviting light', label: '温暖舒适光' }, { value: 'bright and airy', label: '明亮通风' }, { value: 'cozy and intimate', label: '舒适私密' } ],
            composition: [ { value: 'shallow depth of field', label: '浅景深' }, { value: 'product in use by a model (no face)', label: '模特使用中(无面部)' }, { value: 'dynamic angle', label: '动态角度' } ],
        },
      },
      ad_creative: {
        label: '广告创意图',
        subTemplates: [
          {
            key: 'default_ad',
            label: '默认广告创意',
            promptTemplate: 'Eye-catching ad creative photo for a {product}, featuring {concept}, {lighting}, {colors}, ample negative space for text overlay',
            fields: {
              product: { label: '产品', type: 'text', defaultValue: 'new perfume' },
              concept: { label: '视觉概念', type: 'text', defaultValue: 'the bottle surrounded by elegant wavy lines of silk' },
              lighting: { label: '灯光', type: 'dropdown', defaultValue: 'luxury theme, studio lighting', optionsKey: 'lighting' },
              colors: { label: '色彩', type: 'text', defaultValue: 'in navy blue and gold brand colors' },
            },
            negativePrompt: 'boring, dull, cluttered, low resolution',
            aspectRatio: '3:4',
          }
        ],
        options: {
            lighting: [ { value: 'luxury theme, studio lighting', label: '奢华主题摄影棚光' }, { value: 'dynamic and energetic lighting', label: '动感活力光' }, { value: 'minimalist and clean lighting', label: '极简干净光' } ],
        },
      },
    },
  },
  social_media: {
    label: '社交媒体',
    useCases: {
      engagement_post: {
        label: '通用互动帖子',
        subTemplates: [
          {
            key: 'default_engagement',
            label: '默认互动帖',
            promptTemplate: '{style} of a {theme}, set against a {background}, in a {mood}, {composition}, leave space for text overlay',
            fields: {
              style: { label: '风格', type: 'dropdown', defaultValue: 'Vibrant, energetic illustration', optionsKey: 'style' },
              theme: { label: '内容主题', type: 'text', defaultValue: 'diverse group of people collaborating in a creative brainstorming session' },
              background: { label: '背景', type: 'text', defaultValue: 'modern office setting' },
              mood: { label: '情绪/色调', type: 'dropdown', defaultValue: 'bright and inviting composition, inspiring tone', optionsKey: 'mood' },
              composition: { label: '构图', type: 'dropdown', defaultValue: 'leave space on top for text overlay', optionsKey: 'composition' },
            },
            negativePrompt: 'dark, gloomy, sad, cluttered',
            aspectRatio: '1:1',
          }
        ],
        options: {
            style: [ { value: 'Vibrant, energetic illustration', label: '活力插画' }, { value: 'Clean, minimalist graphic', label: '干净极简图形' }, { value: 'Warm, authentic photo', label: '温暖真实照片' } ],
            mood: [ { value: 'bright and inviting, inspiring tone', label: '明亮邀请，鼓舞人心' }, { value: 'calm and focused', label: '冷静专注' }, { value: 'fun and playful', label: '有趣好玩' } ],
            composition: [ { value: 'leave space on top for text overlay', label: '顶部留白' }, { value: 'centered subject', label: '主体居中' }, { value: 'dynamic grid layout', label: '动态网格布局' } ],
        },
      },
      story_reels: {
        label: '故事与Reels视觉',
        subTemplates: [
          {
            key: 'default_story',
            label: '默认故事视觉',
            promptTemplate: 'Cinematic photo of a {theme}, {composition}, {mood}',
            fields: {
              theme: { label: '内容主题', type: 'text', defaultValue: 'vibrant festival scene with neon lights and a diverse crowd' },
              composition: { label: '构图', type: 'dropdown', defaultValue: 'dynamic composition', optionsKey: 'composition' },
              mood: { label: '情绪/氛围', type: 'dropdown', defaultValue: 'energetic mood', optionsKey: 'mood' },
            },
            negativePrompt: 'static, boring, bad quality, horizontal',
            aspectRatio: '9:16',
          }
        ],
        options: {
            composition: [ { value: 'dynamic composition', label: '动态构图' }, { value: 'close-up on details', label: '细节特写' }, { value: 'point-of-view (POV)', label: '第一人称视角' } ],
            mood: [ { value: 'energetic mood', label: '活力氛围' }, { value: 'dreamy and ethereal', label: '梦幻空灵' }, { value: 'raw and authentic', label: '原始真实' } ],
        },
      },
      ad_creative_social: {
        label: '广告创意',
        subTemplates: [
          {
            key: 'default_social_ad',
            label: '默认社交广告',
            promptTemplate: 'High-performance photo for a {platform} ad, featuring a {subject}, {concept}, {lighting}, ample negative space for text overlay',
            fields: {
              platform: { label: '平台', type: 'dropdown', defaultValue: 'Facebook', optionsKey: 'platform' },
              subject: { label: '产品/主体', type: 'text', defaultValue: 'flame-grilled burger on a stone slab' },
              concept: { label: '视觉概念', type: 'text', defaultValue: 'surrounded by fire and smoke' },
              lighting: { label: '灯光', type: 'dropdown', defaultValue: 'dramatic lighting', optionsKey: 'lighting' },
            },
            negativePrompt: 'dull, low-contrast, blurry, generic',
            aspectRatio: '3:4',
          }
        ],
        options: {
            platform: [ { value: 'Facebook', label: 'Facebook' }, { value: 'Instagram', label: 'Instagram' }, { value: 'TikTok', label: 'TikTok' } ],
            lighting: [ { value: 'dramatic lighting', label: '戏剧性光照' }, { value: 'bright, high-contrast lighting', label: '明亮高对比度光' }, { value: 'natural, authentic lighting', label: '自然真实光' } ],
        },
      },
    },
  },
};
