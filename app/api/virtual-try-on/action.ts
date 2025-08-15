// app/api/virtual-try-on/action.ts

'use server';

import { GoogleAuth } from 'google-auth-library';

import { appContextDataI } from '../../context/app-context';
import { VirtualTryOnFormI } from '../virtual-try-on-utils';
import { ImageI } from '../generate-image-utils';

function generateUniqueFolderId() {
  let number = Math.floor(Math.random() * 9) + 1;
  for (let i = 0; i < 12; i++) number = number * 10 + Math.floor(Math.random() * 10);
  return number.toString();
}

export const generateVtoImage = async (
  formData: VirtualTryOnFormI,
  appContext: appContextDataI
): Promise<ImageI | { error: string }> => {
  // [修改] 将 gcsBucket 修正为 gcsURI，与您现有代码保持一致
  if (!appContext.gcsURI) {
    return { error: 'User GCS URI is not configured in the application context.' };
  }

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

  const location = process.env.NEXT_PUBLIC_VERTEX_API_LOCATION || 'us-central1';
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  const modelVersion = formData.modelVersion;
  const apiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelVersion}:predict`;

  const uniqueId = generateUniqueFolderId();
  const outputFileName = `${uniqueId}.png`;
  // [修改] 从 gcsURI 中提取 bucket 名称
  const bucketName = appContext.gcsURI.replace('gs://', '');
  const storageUri = `gs://${bucketName}/vto-generations/${outputFileName}`;

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
      ...(formData.seedNumber && { seed: parseInt(formData.seedNumber, 10) }),
    },
  };

  const opts = {
    url: apiUrl,
    method: 'POST',
    data: reqData,
  };

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
      author: appContext.userID,
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
