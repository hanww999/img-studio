
import { chipGroupFieldsI, selectFieldsI, ImageI } from './generate-image-utils'; // 确保导入 ImageI

// ==================== 修改内容 ====================
// 您的接口定义是正确的，但为了与 ImageDropzone 兼容，我们最好统一使用 ImageI
// 如果 VtoImageObjectI 和 ImageI 结构不同，请保留 VtoImageObjectI
// 这里假设 VtoImageObjectI 可以被 ImageI 替代或扩展
export interface VirtualTryOnFormI {
  model: string; // 确保 model 字段存在
  humanImage: ImageI;
  garmentImages: ImageI[];
  sampleCount: number;
  personGeneration: string;
  safetySetting: string;
  outputFormat: string;
  seedNumber: number;
}

const virtualTryOnFormFields: {
  sampleCount: chipGroupFieldsI;
  personGeneration: selectFieldsI;
  safetySetting: selectFieldsI;
  outputFormat: selectFieldsI;
  seedNumber: { label?: string; type: string; default: number; isDataResetable: boolean; };
  modelVersion: selectFieldsI; // 我们将修改这里
} = {
  sampleCount: {
    label: '生成数量',
    default: 1,
    options: [{ value: 1, label: '1' }],
  },
  personGeneration: {
    label: '人物生成',
    default: 'generate',
    options: [
      { value: 'generate', label: '生成新的人物' },
      { value: 'preserve', label: '保留原有人物' },
    ],
  },
  safetySetting: {
    label: '安全设置',
    default: 'block_most',
    options: [
      { value: 'block_most', label: '严格' },
      { value: 'block_some', label: '中等' },
      { value: 'block_few', label: '宽松' },
      { value: 'block_none', label: '无' },
    ],
  },
  outputFormat: {
    label: '输出格式',
    default: 'PNG',
    options: [
      { value: 'PNG', label: 'PNG' },
      { value: 'JPEG', label: 'JPEG' },
    ],
  },
  seedNumber: {
    label: '种子数 (0 表示随机)',
    type: 'numberInput',
    default: 0,
    isDataResetable: true,
  },
  // --- 这是关键修改点 ---
  modelVersion: {
    label: '模型', // [汉化]
    default: 'virtual-try-on-preview-08-04',
    options: [
     { value: 'virtual-try-on-preview-08-04', label: 'Try-On' }
    ]
  },
};

export const VtoImageDefaults: ImageI = {
  base64Image: '',
  gcsUri: '',
  key: '',
  prompt: '',
  altText: '',
  src: '',
  format: 'PNG',
  width: 0,
  height: 0,
};

const formDataDefaults: VirtualTryOnFormI = {
  model: virtualTryOnFormFields.modelVersion.default,
  humanImage: { ...VtoImageDefaults, key: 'human' },
  garmentImages: [{ ...VtoImageDefaults, key: Math.random().toString(36).substring(2, 15) }],
  sampleCount: virtualTryOnFormFields.sampleCount.default,
  personGeneration: virtualTryOnFormFields.personGeneration.default,
  safetySetting: virtualTryOnFormFields.safetySetting.default,
  seedNumber: virtualTryOnFormFields.seedNumber.default,
  outputFormat: virtualTryOnFormFields.outputFormat.default,
};

export const virtualTryOnFields = {
  fields: virtualTryOnFormFields,
  defaultValues: formDataDefaults,
};
