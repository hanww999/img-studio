
export interface VtoImageObjectI {
  base64Image: string;
  format: string;
  width: number;
  height: number;
  key: string; // [新增] 添加一个唯一的 key 用于在 UI 中渲染列表
}

/**
 * 定义表单字段的通用接口。
 */
export interface VtoFieldI {
  label?: string;
  type: string;
  default?: string;
  options?:
    | string[]
    | {
        value: string;
        label: string;
      }[];
  isDataResetable: boolean;
}

/**
 * [修改] 定义 "Virtual Try-On" 表单的完整数据结构，与 API 参数对齐。
 */
export interface VirtualTryOnFormI {
  humanImage: VtoImageObjectI;
  garmentImages: VtoImageObjectI[]; // [修改] 改为数组以匹配 'productImages'
  sampleCount: string;
  personGeneration: string;
  seedNumber: string;
  outputFormat: string;
  modelVersion: string;
}


// --- FORM FIELDS DEFINITION ---

/**
 * [修改] 定义表单中每个字段的具体配置。
 */
const virtualTryOnFormFields: { [key in keyof Omit<VirtualTryOnFormI, 'humanImage' | 'garmentImages'>]: VtoFieldI } = {
  sampleCount: {
    label: 'Quantity of outputs',
    type: 'chip-group',
    default: '1',
    options: ['1', '2', '3', '4'], // API 支持 1-4
    isDataResetable: false,
  },
  personGeneration: {
    label: 'People generation',
    type: 'select',
    default: 'allow_adult',
    options: [
      { value: 'allow_adult', label: 'Adults only' },
      { value: 'allow_all', label: 'Adults & Children' },
      { value: 'dont_allow', label: 'No people' },
    ],
    isDataResetable: false,
  },
  seedNumber: {
    label: 'Seed number (optional)',
    type: 'numberInput',
    default: '',
    isDataResetable: true,
  },
  outputFormat: {
    label: 'Output format',
    type: 'select',
    default: 'image/png',
    options: [
      { value: 'image/png', label: 'PNG' },
      { value: 'image/jpeg', label: 'JPEG' },
    ],
    isDataResetable: false,
  },
  modelVersion: {
    type: 'hidden',
    default: 'virtual-try-on-preview-08-04',
    isDataResetable: false,
  },
};


// --- DEFAULTS ---

/**
 * 定义图片对象的默认空状态。
 */
export const VtoImageDefaults: VtoImageObjectI = {
  base64Image: '',
  format: '',
  width: 0,
  height: 0,
  key: '',
};

/**
 * [修改] 定义整个表单的默认值。
 */
const formDataDefaults: VirtualTryOnFormI = {
  humanImage: { ...VtoImageDefaults, key: 'human' },
  // [修改] garmentImages 初始化为一个带有一个空对象的数组，方便 UI 渲染第一个上传框
  garmentImages: [{ ...VtoImageDefaults, key: Math.random().toString(36).substring(2, 15) }],
  sampleCount: virtualTryOnFormFields.sampleCount.default ?? '1',
  personGeneration: virtualTryOnFormFields.personGeneration.default ?? 'allow_adult',
  seedNumber: virtualTryOnFormFields.seedNumber.default ?? '',
  outputFormat: virtualTryOnFormFields.outputFormat.default ?? 'image/png',
  modelVersion: virtualTryOnFormFields.modelVersion.default ?? 'virtual-try-on-preview-08-04',
};


// --- EXPORTED UTILITY OBJECT ---

/**
 * 将所有配置组合到一个对象中，方便在其他组件中导入和使用。
 */
export const virtualTryOnFields = {
  fields: virtualTryOnFormFields,
  defaultValues: formDataDefaults,
};
