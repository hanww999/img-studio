// 文件路径: app/api/imagen-prompt-builder-utils.ts (最终版)

export interface PromptOption {
  value: string;
  label: string;
}

export interface ImagenPromptOptions {
  styleMedium: PromptOption[];
  composition: PromptOption[];
  lighting: PromptOption[];
  colorScheme: PromptOption[];
  lensType: PromptOption[];
  cameraSettings: PromptOption[];
  filmType: PromptOption[];
  quality: PromptOption[];
}

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

export const imagenPromptBuilderOptions: ImagenPromptOptions = {
 styleMedium: [
    { value: 'photograph', label: '照片' },
    { value: 'oil painting', label: '油画' },
    { value: 'watercolor sketch', label: '水彩素描' },
    { value: '3D render', label: '3D渲染' },
    { value: 'line art', label: '线条艺术' },
    { value: 'anime', label: '动漫' },
    { value: 'cinematic', label: '电影感' },
    { value: 'abstract', label: '抽象' },
    { value: 'minimalist', label: '极简主义' },
 ],
 composition: [
    { value: 'close-up shot', label: '特写镜头' },
    { value: 'medium shot', label: '中景镜头' },
    { value: 'full shot', label: '全景镜头' },
    { value: 'wide-angle shot', label: '广角镜头' },
    { value: 'extreme wide-angle', label: '超广角' },
    { value: 'portrait', label: '肖像' },
    { value: 'landscape', label: '风景' },
    { value: 'from a low angle', label: '低角度拍摄' },
    { value: "from a high angle (bird's-eye view)", label: '高角度拍摄 (鸟瞰)' },
    { value: 'top-down view', label: '俯视' },
    { value: 'dutch angle', label: '荷兰角' },
 ],
 lighting: [
    { value: 'soft studio light', label: '柔和摄影棚光' },
    { value: 'dramatic lighting', label: '戏剧性光照' },
    { value: 'cinematic lighting', label: '电影光照' },
    { value: 'golden hour', label: '黄金时刻' },
    { value: 'blue hour', label: '蓝色时刻' },
    { value: 'backlit', label: '逆光' },
    { value: 'frontlit', label: '顺光' },
    { value: 'moonlight', label: '月光' },
    { value: 'neon lighting', label: '霓虹灯光' },
    { value: 'ring light', label: '环形光' },
 ],
 colorScheme: [
    { value: 'vibrant colors', label: '鲜艳色彩' },
    { value: 'monochromatic black and white', label: '单色黑白' },
    { value: 'pastel colors', label: '粉彩色' },
    { value: 'warm tones', label: '暖色调' },
    { value: 'cool tones', label: '冷色调' },
    { value: 'sepia', label: '棕褐色' },
    { value: 'high contrast', label: '高对比度' },
 ],
 lensType: [
    { value: 'telephoto lens', label: '长焦镜头' },
    { value: 'wide-angle lens', label: '广角镜头' },
    { value: '85mm lens', label: '85mm 镜头' },
    { value: '50mm lens', label: '50mm 镜头' },
    { value: '35mm lens', label: '35mm 镜头' },
    { value: 'macro photography', label: '微距摄影' },
    { value: 'fisheye lens', label: '鱼眼镜头' },
 ],
 cameraSettings: [
    { value: 'f/1.4', label: 'f/1.4 光圈' },
    { value: 'f/1.8', label: 'f/1.8 光圈' },
    { value: 'f/2.8', label: 'f/2.8 光圈' },
    { value: 'f/8', label: 'f/8 光圈' },
    { value: 'f/16', label: 'f/16 光圈' },
    { value: 'long exposure', label: '长曝光' },
    { value: 'motion blur', label: '运动模糊' },
    { value: 'high shutter speed', label: '高速快门' },
    { value: 'shallow depth of field', label: '浅景深' },
    { value: 'deep depth of field', label: '深景深' },
 ],
 filmType: [
    { value: 'shot on Kodachrome', label: '柯达克罗姆胶片' },
    { value: 'shot on Portra 400', label: '波特拉400胶片' },
    { value: 'shot on Portra 800', label: '波特拉800胶片' },
    { value: 'shot on Fujifilm Superia', label: '富士Superia胶片' },
    { value: 'shot on Ilford HP5', label: '伊尔福HP5胶片' },
    { value: 'shot on CineStill 800T', label: 'CineStill 800T胶片' },
 ],
 quality: [
    { value: 'highly detailed', label: '高细节' },
    { value: 'sharp focus', label: '清晰对焦' },
    { value: '4k', label: '4K' },
    { value: '8k', label: '8K' },
    { value: 'photorealistic', label: '照片级真实感' },
    { value: 'hyperrealistic', label: '超现实主义' },
    { value: 'masterpiece', label: '杰作' },
 ],
};
