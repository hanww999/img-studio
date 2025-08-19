import { ImageI } from './generate-image-utils'
import { VideoI } from './generate-video-utils'

export interface ExportMediaFieldI {
 label: string
 name?: string
 type: string
 prop?: string
 isUpdatable: boolean
 isMandatory?: boolean
 isExportVisible: boolean
 isExploreVisible: boolean
 options?: {
  value: string
  label: string
 }[]
}

export interface ExportMediaFormFieldsI {
 id: ExportMediaFieldI
 gcsURI: ExportMediaFieldI
 creationDate: ExportMediaFieldI
 leveragedModel: ExportMediaFieldI
 author: ExportMediaFieldI
 prompt: ExportMediaFieldI
 format: ExportMediaFieldI
 videoDuration: ExportMediaFieldI
 videoResolution: ExportMediaFieldI
 videoThumbnailGcsUri: ExportMediaFieldI
 aspectRatio: ExportMediaFieldI
 upscaleFactor: ExportMediaFieldI
 width: ExportMediaFieldI
 height: ExportMediaFieldI
 [key: string]: ExportMediaFieldI
}

export const exportStandardFields: ExportMediaFormFieldsI = {
 id: {
  label: '媒体 ID', // [汉化]
  type: 'text-info',
  prop: 'key',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: false,
 },
 gcsURI: {
  label: '媒体 GCS URI', // [汉化]
  type: 'text-info',
  prop: 'gcsUri',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: false,
 },
 creationDate: {
  label: '生成日期', // [汉化]
  type: 'text-info',
  prop: 'date',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: true,
 },
 leveragedModel: {
  label: '所用模型', // [汉化]
  type: 'text-info',
  prop: 'modelVersion',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: true,
 },
 mediaCreationMode: {
  label: '创建模式', // [汉化]
  type: 'text-info',
  prop: 'mode',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: true,
 },
 author: {
  label: '作者', // [汉化]
  type: 'text-info',
  prop: 'author',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: true,
 },
 prompt: {
  label: '提示词', // [汉化]
  type: 'text-info',
  prop: 'prompt',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 format: {
  label: '格式', // [汉化]
  type: 'text-info',
  prop: 'format',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 videoDuration: {
  label: '时长 (秒)', // [汉化]
  type: 'text-info',
  prop: 'duration',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 videoResolution: {
  label: '分辨率', // [汉化]
  type: 'text-info',
  prop: 'resolution',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 videoThumbnailGcsUri: {
  label: '视频缩略图 GCS URI', // [汉化]
  type: 'text-info',
  prop: 'videoThumbnailGcsUri',
  isUpdatable: false,
  isExportVisible: false,
  isExploreVisible: false,
 },
 aspectRatio: {
  label: '宽高比', // [汉化]
  type: 'text-info',
  prop: 'ratio',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 upscaleFactor: {
  label: '放大系数', // [汉化]
  type: 'radio-button',
  prop: 'upscaleFactor',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 width: {
  label: '宽度 (像素)', // [汉化]
  type: 'text-info',
  prop: 'width',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
 height: {
  label: '高度 (像素)', // [汉化]
  type: 'text-info',
  prop: 'height',
  isUpdatable: false,
  isExportVisible: true,
  isExploreVisible: true,
 },
}

export interface ExportMediaFormI {
 mediaToExport: ImageI | VideoI
 upscaleFactor: string
 [key: string]: any
}

export interface FilterMediaFormI {
 [key: string]: any
}

export interface MediaMetadataI {
 id: string
 gcsURI: string
 creationDate: any
 leveragedModel: string
 author: string
 prompt: string
 format: string
 videoDuration?: number
 videoResolution?: string
 videoThumbnailGcsUri?: string
 aspectRatio: string
 upscaleFactor?: string
 width: number
 height: number
 userEmail?: string;
 [key: string]: any
}

export type MediaMetadataWithSignedUrl = MediaMetadataI & { signedUrl: string; videoThumbnailSignedUrl?: string }
