// app/api/virtual-try-on/action.ts

'use server';

import { GoogleAuth } from 'google-auth-library';
import { v1 } from '@google-cloud/aiplatform';

import { AppContextI } from '../../context/app-context';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

// [新增] 从您的 imagen/action.ts 中复制过来的函数
function generateUniqueFolderId() {
  let number = Math.floor(Math.random() * 9) + 1;
  for (let i = 0; i < 12; i++) number = number * 10 + Math.floor(Math.random() * 10);
  return number.toString(); // 确保返回字符串
}

export const generateVtoImage = async (
  formData: VirtualTryOnFormI,
  appContext: AppContextI
): Promise<ImageI | { error: string }> => {
  if (!appContext.user.gcsBucket) {
    return { error: 'User GCS bucket is not configured in the application context.' };
  }

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });
  const clientOptions = {
    auth: auth,
    apiEndpoint: `${appContext.location}-aiplatform.googleapis.com`,
  };
  const predictionServiceClient = new v1.PredictionServiceClient(clientOptions);

  const instances = [
    {
      personImage: { image: { bytesBase64Encoded: formData.humanImage.base64Image } },
      productImages: formData.garmentImages.map(img => ({
        image: { bytesBase64Encoded: img.base64Image },
      })),
    },
  ];

  // [修改] 使用您现有的函数来生成唯一 ID
  const uniqueId = generateUniqueFolderId();
  const outputFileName = `${uniqueId}.png`;
  const storageUri = `gs://${appContext.user.gcsBucket}/vto-generations/${outputFileName}`;

  const parameters: { [key: string]: any } = {
    sampleCount: parseInt(formData.sampleCount, 10),
    personGeneration: formData.personGeneration,
    outputOptions: { mimeType: formData.outputFormat },
    storageUri: storageUri,
  };

  if (formData.seedNumber) {
    parameters.seed = parseInt(formData.seedNumber, 10);
  }

  const request = {
    endpoint: `projects/${appContext.project_id}/locations/${appContext.location}/publishers/google/models/${formData.modelVersion}`,
    instances: instances.map(instance => v1.helpers.toValue(instance)),
    parameters: v1.helpers.toValue(parameters),
  };

  try {
    const [response] = await predictionServiceClient.predict(request);

    if (!response.predictions || response.predictions.length === 0) {
      throw new Error('API returned no predictions.');
    }

    const predictionResult = v1.helpers.fromValue(response.predictions[0] as any);

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
    return {
      error: error.details || error.message || 'An unknown error occurred while generating the image.',
    };
  }
};
