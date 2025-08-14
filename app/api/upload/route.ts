import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// 确保这个环境变量在您的部署环境中已设置
const gcsBucketName = process.env.NEXT_PUBLIC_GCS_UPLOAD_BUCKET;
if (!gcsBucketName) {
  console.error("FATAL ERROR: NEXT_PUBLIC_GCS_UPLOAD_BUCKET environment variable not set.");
  // 在生产环境中，您可能希望直接抛出错误以停止服务
  // throw new Error("GCS_UPLOAD_BUCKET environment variable not set.");
}

const storage = new Storage();
const bucket = storage.bucket(gcsBucketName!); // 使用非空断言，因为我们已经在上面检查过了

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 创建一个唯一的文件名以避免冲突
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const gcsFile = bucket.file(`video-uploads/${fileName}`);

    // 将文件流式上传到 GCS
    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // 构建 Gemini API 所需的 GCS URI
    const gcsUri = `gs://${gcsBucketName}/video-uploads/${fileName}`;

    console.log(`File ${file.name} uploaded to ${gcsUri}`);

    // 返回 GCS URI 给前端
    return NextResponse.json({ success: true, gcsUri: gcsUri });

  } catch (error: any) {
    console.error('Error uploading file to GCS:', error);
    return NextResponse.json({ error: 'Failed to upload file to the server.' }, { status: 500 });
  }
}
