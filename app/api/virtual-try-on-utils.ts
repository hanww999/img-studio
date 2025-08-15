// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 *  该文件定义了 "Virtual Try-On" 功能所需的数据结构、
 *  表单字段配置和默认值。
 */

// --- INTERFACES ---

/**
 * 定义上传图片对象的数据结构。
 */
export interface VtoImageObjectI {
  base64Image: string; // 图片的 base64 编码字符串
  format: string;      // 图片格式 (e.g., 'image/png')
  width: number;
  height: number;
}

/**
 * 定义表单字段的通用接口。
 */
export interface VtoFieldI {
  label?: string;
  type: string;
  default?: string;
  options?: {
    value: string;
    label: string;
  }[];
  isDataResetable: boolean;
}

/**
 * 定义 "Virtual Try-On" 表单的完整数据结构。
 */
export interface VirtualTryOnFormI {
  humanImage: VtoImageObjectI;
  garmentImage: VtoImageObjectI;
  garmentType: string;
  modelVersion: string; // 用于记录模型版本，保持一致性
}


// --- FORM FIELDS DEFINITION ---

/**
 * 定义表单中每个字段的具体配置。
 */
const virtualTryOnFormFields: { [key in keyof Omit<VirtualTryOnFormI, 'humanImage' | 'garmentImage'>]: VtoFieldI } = {
  garmentType: {
    label: 'Garment Type',
    type: 'select', // 将渲染为下拉选择框
    default: 'UPPER_BODY',
    // 根据 Google Cloud 官方文档定义选项
    options: [
      { value: 'UPPER_BODY', label: 'Upper Body (e.g. shirt, top, jacket)' },
      { value: 'LOWER_BODY', label: 'Lower Body (e.g. pants, shorts)' },
      { value: 'DRESS', label: 'Dress' },
    ],
    isDataResetable: false,
  },
  modelVersion: {
    type: 'hidden', // 此字段对用户不可见
    default: 'imagegeneration@006', // VTO 使用的特定模型版本
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
};

/**
 * 定义整个表单的默认值，用于初始化 react-hook-form。
 */
const formDataDefaults: VirtualTryOnFormI = {
  humanImage: { ...VtoImageDefaults },
  garmentImage: { ...VtoImageDefaults },
  garmentType: virtualTryOnFormFields.garmentType.default ?? 'UPPER_BODY',
  modelVersion: virtualTryOnFormFields.modelVersion.default ?? 'imagegeneration@006',
};


// --- EXPORTED UTILITY OBJECT ---

/**
 * 将所有配置组合到一个对象中，方便在其他组件中导入和使用。
 */
export const virtualTryOnFields = {
  fields: virtualTryOnFormFields,
  defaultValues: formDataDefaults,
};
