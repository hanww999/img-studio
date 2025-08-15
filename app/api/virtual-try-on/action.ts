// app/api/virtual-try-on/action.ts

'use server';

import { GoogleAuth } from 'google-auth-library';
import { v1 } from '@google-cloud/aiplatform';
import { v4 as uuidv4 } from 'uuid';

// [修改] 导入 downloadMediaFromGcs 和 AppContextI
import { AppContextI } from '../../context/app-context';
import { downloadMediaFromGcs } from '../cloud-storage/action';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

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

  const uniqueId = uuidv4();
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

    if (!predictionResult || typeof predictionResult !== 'object') {
      throw new Error('Invalid prediction format: result is not an object.');
    }

    // [最终修正] 检查 API 是否在响应中返回了错误
    if ('error' in predictionResult && predictionResult.error) {
      const apiError = predictionResult.error as { message?: string };
      throw new Error(`API returned an error: ${apiError.message || 'Unknown error'}`);
    }

    let generatedImageBase64: string;
    const mimeType = (predictionResult.mimeType as string) || formData.outputFormat;

    // [最终修正] 检查 API 是否直接返回了 base64 数据
    if ('bytesBase64Encoded' in predictionResult && predictionResult.bytesBase64Encoded) {
      generatedImageBase64 = predictionResult.bytesBase64Encoded as string;
    } else {
      // 如果没有，就从我们指定的 GCS 路径下载刚刚生成的文件
      console.log(`Bytes not found in API response, attempting to download from GCS path: ${storageUri}`);
      const downloadResult = await downloadMediaFromGcs(storageUri);
      if (downloadResult.error) {
        throw new Error(`Failed to download generated image from GCS: ${downloadResult.error}`);
      }
      generatedImageBase64 = downloadResult.data;
    }

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
      error: error.message || 'An unknown error occurred while generating the image.',
    };
  }
};
