// app/api/virtual-try-on/action.ts

'use server';

import { GoogleAuth } from 'google-auth-library';
import { GaxiosOptions } from 'gaxios';

import { appContextDataI } from '../../context/app-context';
import { downloadMediaFromGcs } from '../cloud-storage/action';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

function generateUniqueFolderId() {
  let number = Math.floor(Math.random() * 9) + 1;
  for (let i = 0; i < 12; i++) number = number * 10 + Math.floor(Math.random() * 10);
  return number.toString();
}

interface Prediction {
  bytesBase64Encoded?: string;
  mimeType?: string;
  gcsUri?: string; // [新增] 明确定义 gcsUri 字段
  error?: { message?: string };
}

interface PredictionResponse {
  predictions: Prediction[];
}

export const generateVtoImage = async (
  formData: VirtualTryOnFormI,
  appContext: appContextDataI
): Promise<ImageI | { error: string }> => {
  if (!appContext?.gcsURI) {
    return { error: 'User GCS URI is not configured in the application context.' };
  }

  let client;
  try {
    const auth = new GoogleAuth({
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    client = await auth.getClient();
  } catch (error) {
    console.error('Authentication Error:', error);
    return { error: 'Unable to authenticate your account.' };
  }

  const location = process.env.NEXT_PUBLIC_VERTEX_API_LOCATION || 'us-central1';
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  
  if (!projectId) {
    return { error: 'Project ID is not configured in environment variables.' };
  }

  const modelVersion = formData.modelVersion;
  const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelVersion}:predict`;

  const uniqueId = generateUniqueFolderId();
  // [修改] 我们现在将 storageUri 理解为一个文件夹前缀
  const storageUriPrefix = `gs://${appContext.gcsURI.replace('gs://', '')}/vto-generations/${uniqueId}`;

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
      storageUri: storageUriPrefix, // [修改] 告知 API 使用这个前缀
      ...(formData.seedNumber && { seed: parseInt(formData.seedNumber, 10) }),
    },
  };

  const opts: GaxiosOptions = {
    url: apiUrl,
    method: 'POST',
    data: reqData,
  };

  try {
    const res = await client.request(opts);

    if (typeof res.data !== 'object' || res.data === null || !('predictions' in res.data)) {
      throw new Error('Unexpected API response structure.');
    }
    
    const responseData = res.data as PredictionResponse;

    if (!responseData.predictions || responseData.predictions.length === 0) {
      throw new Error('API returned no predictions.');
    }

    const predictionResult = responseData.predictions[0];

    if (predictionResult.error) {
      throw new Error(`API returned an error: ${predictionResult.error.message || 'Unknown error'}`);
    }

    let generatedImageBase64: string;
    const mimeType = predictionResult.mimeType || formData.outputFormat;
    // [最终修正] 优先使用 API 返回的真实 GCS 路径
    const finalGcsUri = predictionResult.gcsUri;

    if (!finalGcsUri) {
        throw new Error('API did not return a GCS URI for the generated image.');
    }

    if (predictionResult.bytesBase64Encoded) {
      generatedImageBase64 = predictionResult.bytesBase64Encoded;
    } else {
      console.log(`Bytes not found in API response, attempting to download from final GCS path: ${finalGcsUri}`);
      const downloadResult = await downloadMediaFromGcs(finalGcsUri);
      
      if (downloadResult.error) {
        throw new Error(`Failed to download generated image from GCS: ${downloadResult.error}`);
      }
      
      if (!downloadResult.data) {
        throw new Error(`Image data is missing after successful download from GCS.`);
      }

      generatedImageBase64 = downloadResult.data;
    }

    const resultImage: ImageI = {
      src: `data:${mimeType};base64,${generatedImageBase64}`,
      gcsUri: finalGcsUri, // [最终修正] 使用从 API 获取的真实路径
      ratio: '',
      width: 0,
      height: 0,
      altText: 'Generated try-on image',
      key: uniqueId,
      format: mimeType,
      prompt: `Try-on with model version: ${formData.modelVersion}`,
      date: new Date().toISOString(),
      author: appContext.userID || 'Unknown User',
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
