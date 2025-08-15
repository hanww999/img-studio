'use server';

import { GoogleAuth } from 'google-auth-library';

import { AppContextI } from '../../context/app-context';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

// [复用] 从您的 imagen/action.ts 中复制过来的函数
function generateUniqueFolderId() {
  let number = Math.floor(Math.random() * 9) + 1;
  for (let i = 0; i < 12; i++) number = number * 10 + Math.floor(Math.random() * 10);
  return number.toString();
}

export const generateVtoImage = async (
  formData: VirtualTryOnFormI,
  appContext: AppContextI
): Promise<ImageI | { error: string }> => {
  // 1. 认证 (与您的 imagen/action.ts 完全一致)
  let client;
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    client = await auth.getClient();
  } catch (error) {
    console.error(error);
    return { error: 'Unable to authenticate your account.' };
  }

  if (!appContext.user.gcsBucket) {
    return { error: 'User GCS bucket is not configured in the application context.' };
  }

  // 2. 构建请求 URL (与您的 imagen/action.ts 完全一致)
  const location = process.env.NEXT_PUBLIC_VERTEX_API_LOCATION || 'us-central1';
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const modelVersion = formData.modelVersion;
  const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelVersion}:predict`;

  // 3. 构建请求体 (根据 VTO API 文档)
  const uniqueId = generateUniqueFolderId();
  const outputFileName = `${uniqueId}.png`;
  const storageUri = `gs://${appContext.user.gcsBucket}/vto-generations/${outputFileName}`;

  const reqData = {
    instances: [
      {
        personImage: { image: { bytesBase64Encoded: formData.humanImage.base64Image } },
        productImages: formData.garmentImages.map(img => ({
          image: { bytesBase64Encoded: img.base64Image },
        })),
      },
    ],
    parameters: {
      sampleCount: parseInt(formData.sampleCount, 10),
      personGeneration: formData.personGeneration,
      outputOptions: { mimeType: formData.outputFormat },
      storageUri: storageUri,
      ...(formData.seedNumber && { seed: parseInt(formData.seedNumber, 10) }), // 仅当有 seed 时才添加
    },
  };

  // 4. 构建请求选项 (与您的 imagen/action.ts 完全一致)
  const opts = {
    url: apiUrl,
    method: 'POST',
    data: reqData,
  };

  // 5. 发送请求 (与您的 imagen/action.ts 完全一致)
  try {
    const res = await client.request(opts);

    if (!res.data.predictions || res.data.predictions.length === 0) {
      throw new Error('API returned no predictions.');
    }

    const predictionResult = res.data.predictions[0];

    if (!predictionResult || typeof predictionResult !== 'object' || !('bytesBase64Encoded' in predictionResult)) {
      throw new Error('Invalid prediction format received from API.');
    }

    const generatedImageBase64 = predictionResult.bytesBase64Encoded as string;
    const mimeType = (predictionResult.mimeType as string) || formData.outputFormat;

    const resultImage: ImageI = {
      src: `data:${mimeType};base64,${generatedImageBase64}`,
      gcsUri: storageUri,
      ratio: '',
      width: 0,
      height: 0,
      altText: 'Generated try-on image',
      key: uniqueId,
      format: mimeType,
      prompt: `Try-on with model version: ${formData.modelVersion}`,
      date: new Date().toISOString(),
      author: appContext.user.email,
      modelVersion: formData.modelVersion,
      mode: 'try-on',
    };

    return resultImage;

  } catch (error: any) {
    console.error('Error calling Virtual Try-On API:', error);
    const errorMessage = error.response?.data?.error?.message || error.message || 'An unknown error occurred.';
    return { error: errorMessage };
  }
};
