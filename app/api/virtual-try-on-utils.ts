// app/api/virtual-try-on-utils.ts

'use server';

// [修改] 导入您项目中已有的、经过验证的类型接口
import { chipGroupFieldsI, selectFieldsI } from './generate-image-utils';

export interface VtoImageObjectI {
  base64Image: string;
  format: string;
  width: number;
  height: number;
  key: string;
}

export interface VirtualTryOnFormI {
  humanImage: VtoImageObjectI;
  garmentImages: VtoImageObjectI[];
  sampleCount: string;
  personGeneration: string;
  seedNumber: string;
  outputFormat: string;
  modelVersion: string;
}

// [修改] 为所有字段提供精确的类型，确保与 UI 组件的 props 匹配
const virtualTryOnFormFields: {
  sampleCount: chipGroupFieldsI;
  personGeneration: selectFieldsI;
  outputFormat: selectFieldsI;
  seedNumber: { label?: string; type: string; default: string; isDataResetable: boolean; };
  modelVersion: { type: string; default: string; isDataResetable: boolean; };
} = {
  sampleCount: {
    label: 'Quantity of outputs',
    default: '1',
    options: ['1', '2', '3', '4'],
    // [删除] 移除了不符合 chipGroupFieldsI 类型的 'type' 属性
  },
  personGeneration: {
    label: 'People generation',
    default: 'allow_adult',
    options: [
      { value: 'allow_adult', label: 'Adults only' },
      { value: 'allow_all', label: 'Adults & Children' },
      { value: 'dont_allow', label: 'No people' },
    ],
  },
  outputFormat: {
    label: 'Output format',
    default: 'image/png',
    options: [
      { value: 'image/png', label: 'PNG' },
      { value: 'image/jpeg', label: 'JPEG' },
    ],
  },
  seedNumber: {
    label: 'Seed number (optional)',
    type: 'numberInput',
    default: '',
    isDataResetable: true,
  },
  modelVersion: {
    type: 'hidden',
    default: 'virtual-try-on-preview-08-04',
    isDataResetable: false,
  },
};

export const VtoImageDefaults: VtoImageObjectI = {
  base64Image: '',
  format: '',
  width: 0,
  height: 0,
  key: '',
};

const formDataDefaults: VirtualTryOnFormI = {
  humanImage: { ...VtoImageDefaults, key: 'human' },
  garmentImages: [{ ...VtoImageDefaults, key: Math.random().toString(36).substring(2, 15) }],
  sampleCount: virtualTryOnFormFields.sampleCount.default ?? '1',
  personGeneration: virtualTryOnFormFields.personGeneration.default ?? 'allow_adult',
  seedNumber: virtualTryOnFormFields.seedNumber.default ?? '',
  outputFormat: virtualTryOnFormFields.outputFormat.default ?? 'image/png',
  modelVersion: virtualTryOnFormFields.modelVersion.default ?? 'virtual-try-on-preview-08-04',
};

export const virtualTryOnFields = {
  fields: virtualTryOnFormFields,
  defaultValues: formDataDefaults,
};
