'use server';

import { GoogleAuth } from 'google-auth-library';
import { v1 } from '@google-cloud/aiplatform';

import { AppContextI } from '../../context/app-context';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

/**
 * 调用 Vertex AI Virtual Try-On API 生成试穿图片。
 * @param formData - 包含模特图、服装图和各项参数的表单数据。
 * @param appContext - 包含项目 ID、位置和用户信息的应用上下文。
 * @returns 返回一个包含生成图片信息的 ImageI 对象，或一个包含错误信息的对象。
 */
export const generateVtoImage = async (
  formData: VirtualTryOnFormI,
  appContext: AppContextI
): Promise<ImageI | { error: string }> => {
  // 1. 初始化认证和 Vertex AI 客户端
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });
  const clientOptions = {
    auth: auth,
    apiEndpoint: `${appContext.location}-aiplatform.googleapis.com`,
  };
  const predictionServiceClient = new v1.PredictionServiceClient(clientOptions);

  // 2. 构建 API 请求体 (Instances)
  const instances = [
    {
      personImage: {
        image: {
          bytesBase64Encoded: formData.humanImage.base64Image,
        },
      },
      // API 需要一个数组，我们目前只处理第一张服装图
      productImages: formData.garmentImages.map(img => ({
        image: {
          bytesBase64Encoded: img.base64Image,
        },
      })),
    },
  ];

  // 3. 构建 API 请求体 (Parameters)
  const parameters: { [key: string]: any } = {
    sampleCount: parseInt(formData.sampleCount, 10),
    personGeneration: formData.personGeneration,
    outputOptions: {
      mimeType: formData.outputFormat,
    },
  };

  // 只有当用户输入了 seed number 时才添加到参数中
  if (formData.seedNumber) {
    parameters.seed = parseInt(formData.seedNumber, 10);
  }

  // 4. 构建完整的请求
  const request = {
    endpoint: `projects/${appContext.project_id}/locations/${appContext.location}/publishers/google/models/${formData.modelVersion}`,
    instances: instances.map(instance => v1.helpers.toValue(instance)),
    parameters: v1.helpers.toValue(parameters),
  };

  try {
    // 5. 发送请求到 Vertex AI
    const [response] = await predictionServiceClient.predict(request);

    if (!response.predictions || response.predictions.length === 0) {
      throw new Error('API returned no predictions.');
    }

    // 6. 处理返回结果
    const predictionResult = v1.helpers.fromValue(response.predictions[0] as any);

    if (!predictionResult || typeof predictionResult !== 'object' || !('bytesBase64Encoded' in predictionResult)) {
      throw new Error('Invalid prediction format received from API.');
    }

    const generatedImageBase64 = predictionResult.bytesBase64Encoded as string;
    const mimeType = (predictionResult.mimeType as string) || formData.outputFormat;

    // 7. 将结果格式化为应用内部统一的 ImageI 格式
    const resultImage: ImageI = {
      src: generatedImageBase64,
      gcsUri: '', // API 不直接返回 GCS URI
      ratio: '', // 无法从 base64 直接获取，让前端处理
      width: 0,  // 无法从 base64 直接获取，让前端处理
      height: 0, // 无法从 base64 直接获取，让前端处理
      altText: 'Generated try-on image',
      key: Math.random().toString(36).substring(2, 15),
      format: mimeType,
      prompt: `Try-on with model version: ${formData.modelVersion}`, // 用有意义的信息填充
      date: new Date().toISOString(),
      author: appContext.user.email,
      modelVersion: formData.modelVersion,
      mode: 'try-on',
    };

    return resultImage;

  } catch (error: any) {
    console.error('Error calling Virtual Try-On API:', error);
    return {
      error: error.details || error.message || 'An unknown error occurred while generating the image.',
    };
  }
};
