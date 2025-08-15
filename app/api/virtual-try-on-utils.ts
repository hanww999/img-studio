
// app/api/virtual-try-on-utils.ts

import { chipGroupFieldsI, selectFieldsI } from './generate-image-utils';

export interface VtoImageObjectI {
 base64Image: string;
 format: string;
 width: number;
 height: number;
 key: string;
}

// [STEP 1] Ensure the interface includes safetySetting
export interface VirtualTryOnFormI {
 humanImage: VtoImageObjectI;
 garmentImages: VtoImageObjectI[];
 sampleCount: string;
 personGeneration: string;
 safetySetting: string; // <-- 必须有这一行
 seedNumber: string;
 outputFormat: string;
 modelVersion: string;
}

// [STEP 2] Ensure the type definition and the object value both include safetySetting
const virtualTryOnFormFields: {
 sampleCount: chipGroupFieldsI;
 personGeneration: selectFieldsI;
 safetySetting: selectFieldsI; // <-- 必须有这一行 (类型定义)
 outputFormat: selectFieldsI;
 seedNumber: { label?: string; type: string; default: string; isDataResetable: boolean; };
 modelVersion: selectFieldsI;
} = {
 sampleCount: {
  label: 'Quantity of outputs',
  default: '1',
  options: ['1'],
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
  safetySetting: { // <-- 必须有这个对象 (对象值)
    label: 'Safety',
    default: 'block_only_high',
    options: [
      { value: 'block_low_and_above', label: 'Strongest' },
      { value: 'block_medium_and_above', label: 'Medium' },
      { value: 'block_only_high', label: 'Less' },
      { value: 'block_none', label: 'None' },
    ],
  },
 outputFormat: {
  label: 'Format', // <-- 同时修复了标签过长的问题
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
  label: 'Model',
  default: 'virtual-try-on-preview-08-04',
  options: [
   { value: 'virtual-try-on-preview-08-04', label: 'Try-On' }
  ]
 },
};

export const VtoImageDefaults: VtoImageObjectI = {
 base64Image: '',
 format: '',
 width: 0,
 height: 0,
 key: '',
};

// [STEP 3] Ensure the default values object includes safetySetting
const formDataDefaults: VirtualTryOnFormI = {
 humanImage: { ...VtoImageDefaults, key: 'human' },
 garmentImages: [{ ...VtoImageDefaults, key: Math.random().toString(36).substring(2, 15) }],
 sampleCount: String(virtualTryOnFormFields.sampleCount.default ?? '1'),
 personGeneration: virtualTryOnFormFields.personGeneration.default ?? 'allow_adult',
 safetySetting: virtualTryOnFormFields.safetySetting.default ?? 'block_only_high', // <-- 必须有这一行
 seedNumber: virtualTryOnFormFields.seedNumber.default ?? '',
 outputFormat: virtualTryOnFormFields.outputFormat.default ?? 'image/png',
 modelVersion: virtualTryOnFormFields.modelVersion.default ?? 'virtual-try-on-preview-08-04',
};

export const virtualTryOnFields = {
 fields: virtualTryOnFormFields,
 defaultValues: formDataDefaults,
};
