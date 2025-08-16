'use server'

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
ffmpeg.setFfprobePath(ffprobeInstaller.path)

const { Storage } = require('@google-cloud/storage')

interface optionsI {
  version: 'v2' | 'v4'
  action: 'read' | 'write' | 'delete' | 'resumable'
  expires: number
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

export async function decomposeUri(uri: string) {
  const sourceUriParts = uri.replace('gs://', '').split('/')
  const sourceBucketName = sourceUriParts[0]
  const sourceObjectName = sourceUriParts.slice(1).join('/')

  return {
    bucketName: sourceBucketName,
    fileName: sourceObjectName,
  }
}

export async function getSignedURL(gcsURI: string) {
  const { bucketName, fileName } = await decomposeUri(gcsURI)

  const storage = new Storage({ projectId })

  const options: optionsI = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000,
  }

  try {
    const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options)
    return url
  } catch (error) {
    console.error(error)
    // 保持这个函数的错误返回对象，因为它被多处使用
    return {
      error: 'Error while getting secured access to content.',
    }
  }
}

// <-- 核心修复：修改此函数以在失败时抛出错误 -->
export async function copyImageToTeamBucket(sourceGcsUri: string, id: string): Promise<string> {
  const storage = new Storage({ projectId })

  try {
    if (!sourceGcsUri || !sourceGcsUri.startsWith('gs://')) {
      console.error('Invalid source GCS URI provided:', sourceGcsUri)
      // 抛出错误而不是返回对象
      throw new Error('Invalid source GCS URI format. It must start with gs://')
    }
    if (!id) {
      console.error('Invalid id provided:', id)
      // 抛出错误而不是返回对象
      throw new Error('Invalid id. It cannot be empty.')
    }

    const { bucketName, fileName } = await decomposeUri(sourceGcsUri)

    const destinationBucketName = process.env.NEXT_PUBLIC_TEAM_BUCKET

    if (!bucketName || !fileName || !destinationBucketName) {
      throw new Error('Invalid source or destination URI.')
    }

    const sourceObject = storage.bucket(bucketName).file(fileName)
    const destinationBucket = storage.bucket(destinationBucketName)
    const destinationFile = destinationBucket.file(id)

    const [exists] = await destinationFile.exists()
    if (!exists) {
      await sourceObject.copy(destinationFile)
    }

    // 成功时返回 string
    return `gs://${destinationBucketName}/${id}`
  } catch (error) {
    console.error('Error in copyImageToTeamBucket:', error)
    // 重新抛出错误，以便调用方可以捕获它
    throw new Error(`Error while moving media to team Library: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function downloadMediaFromGcs(gcsUri: string): Promise<{ data?: string; error?: string }> {
  const storage = new Storage()

  if (!gcsUri || !gcsUri.startsWith('gs://')) {
    console.error('Invalid GCS URI provided:', gcsUri)
    return {
      error: 'Invalid GCS URI format. It must start with gs://',
    }
  }

  try {
    const { bucketName, fileName } = await decomposeUri(gcsUri)

    if (!bucketName || !fileName) {
      console.error('Could not determine bucket name or file name from URI:', gcsUri)
      return {
        error: 'Invalid GCS URI, could not extract bucket or file name.',
      }
    }

    const [fileBuffer] = await storage.bucket(bucketName).file(fileName).download()
    const base64Data = fileBuffer.toString('base64')

    return {
      data: base64Data,
    }
  } catch (error: any) {
    console.error('Error during GCS file download:', error)

    const errorMessage = error.message || 'Error while downloading the media'
    return {
      error: errorMessage,
    }
  }
}

// ... 文件中剩余的其他函数保持不变 ...
export async function downloadTempVideo(gcsUri: string): Promise<string> {
  const storage = new Storage()

  const { bucketName, fileName } = await decomposeUri(gcsUri)

  const tempFileName = `video_${Date.now()}_${path.basename(fileName)}`
  const tempFilePath = path.join(os.tmpdir(), tempFileName)

  await storage.bucket(bucketName).file(fileName).download({
    destination: tempFilePath,
  })

  return tempFilePath
}

export async function fetchJsonFromStorage(gcsUri: string) {
  const storage = new Storage({ projectId })

  try {
    const { bucketName, fileName } = await decomposeUri(gcsUri)

    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)

    const [contents] = await file.download()

    const jsonData = JSON.parse(contents.toString())
    return jsonData
  } catch (error) {
    console.error('Error fetching JSON from storage:', error)
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error. Downloaded content might not be valid JSON.')
    }
    throw error
  }
}

export async function uploadBase64Image(
  base64Image: string,
  bucketName: string,
  objectName: string,
  contentType: string = 'image/png'
): Promise<{ success?: boolean; message?: string; error?: string; fileUrl?: string }> {
  const storage = new Storage({ projectId })

  if (!base64Image) return { error: 'Invalid base64 data.' }

  const imageBuffer = Buffer.from(base64Image, 'base64')
  const options = {
    destination: objectName,
    metadata: {
      contentType: contentType,
    },
  }

  try {
    await storage.bucket(bucketName).file(objectName).save(imageBuffer, options)

    const fileUrl = `gs://${bucketName}/${objectName}`

    return {
      success: true,
      message: `File uploaded to: ${fileUrl}`,
      fileUrl: fileUrl,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      error: 'Error uploading file to Google Cloud Storage.',
    }
  }
}

export async function getVideoThumbnailBase64(
  videoSourceGcsUri: string,
  ratio: string
): Promise<{ thumbnailBase64Data?: string; mimeType?: string; error?: string }> {
  const outputMimeType = 'image/png'
  const tempThumbnailFileName = `thumbnail_${Date.now()}.png`
  const tempThumbnailPath = path.join(os.tmpdir(), tempThumbnailFileName)

  let localVideoPath: string | null = null

  try {
    localVideoPath = await downloadTempVideo(videoSourceGcsUri)

    if (!localVideoPath) throw Error('Failed to download video')

    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(localVideoPath!).seekInput('00:00:01').frames(1)

      const size = ratio === '16:9' ? '320x180' : '180x320'
      command = command.size(size)
      command = command.outputFormat('image2')

      command
        .output(tempThumbnailPath)
        .on('end', () => {
          resolve()
        })
        .on('error', (err: { message: any }) => {
          console.error('FFmpeg Error:', err.message)
          reject(new Error(`FFmpeg failed to extract thumbnail: ${err.message}`))
        })
        .run()
    })

    const thumbnailBuffer = await fs.readFile(tempThumbnailPath)
    const thumbnailBase64Data = thumbnailBuffer.toString('base64')

    return {
      thumbnailBase64Data,
      mimeType: outputMimeType,
    }
  } catch (error: any) {
    console.error('Error in getVideoThumbnailBase64:', error)
    return { error: error.message || 'An unexpected error occurred while generating thumbnail.' }
  } finally {
    if (localVideoPath)
      await fs
        .unlink(localVideoPath)
        .catch((err: any) => console.error(`Failed to delete temp video file: ${localVideoPath}`, err))

    await fs.unlink(tempThumbnailPath).catch((err: { code: string }) => {
      if (err.code !== 'ENOENT') console.error(`Failed to delete temp thumbnail file: ${tempThumbnailPath}`, err)
    })
  }
}

export async function deleteMedia(gcsURI: string): Promise<boolean | { error: string }> {
  const storage = new Storage({ projectId })

  if (!gcsURI || !gcsURI.startsWith('gs://')) return { error: 'Invalid GCS URI. It must start with "gs://".' }

  const { bucketName, fileName: objectName } = await decomposeUri(gcsURI)

  if (!bucketName || !objectName) return { error: 'Invalid GCS URI' }

  try {
    await storage.bucket(bucketName).file(objectName).delete()

    return true
  } catch (error: any) {
    console.error(`Error deleting file ${gcsURI} from GCS:`, error)

    if (error.code === 404)
      return {
        error: `File ${gcsURI} not found in Google Cloud Storage.`,
      }

    return {
      error: `An error occurred while deleting file ${gcsURI} from Google Cloud Storage.`,
    }
  }
}
