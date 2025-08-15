'use server';

export interface VtoImageObjectI {
  base64Image: string;
  format: string;
  width: number;
  height: number;
  key: string;
}

export interface VtoFieldI {
  label?: string;
  type: string;
  default?: string;
  options?: string[] | { value: string; label: string; }[];
  isDataResetable: boolean;
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

const virtualTryOnFormFields: { [key in keyof Omit<VirtualTryOnFormI, 'humanImage' | 'garmentImages'>]: VtoFieldI } = {
  sampleCount: {
    label: 'Quantity of outputs',
    type: 'chip-group',
    default: '1',
    options: ['1', '2', '3', '4'],
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
