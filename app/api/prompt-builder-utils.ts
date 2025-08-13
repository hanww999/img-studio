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

// 定义 Prompt Builder 中所有字段的数据结构
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

// 定义字段的初始默认值
export const initialPromptData: PromptData = {
  subject: 'Alex, a 25-year old travel vlogger with authentic energy, wearing casual outdoor gear',
  context: 'standing on a scenic mountain overlook during golden hour, backpack and hiking equipment visible',
  action: 'speaks directly to camera while gesturing toward breathtaking landscape, natural and conversational',
  visualStyle: '',
  cameraMovement: '',
  composition: 'medium close-up with scenic background, natural framing',
  lighting: 'golden hour lighting with warm, natural glow',
  audio: "enthusiastic narration: 'After 6 hours of hiking, this view makes every step worth it!' with gentle wind and nature sounds",
};

// 定义所有下拉菜单的选项
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
