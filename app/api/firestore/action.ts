'use server'

import { Timestamp } from '@google-cloud/firestore'
import { ExportMediaFormI, MediaMetadataI, ExportMediaFormFieldsI } from '../export-utils'
import { deleteMedia } from '../cloud-storage/action'
import { getUserEmail } from '../auth-utils'; // <-- 核心修改：导入用户身份辅助函数

const { Firestore, FieldValue } = require('@google-cloud/firestore')
const firestore = new Firestore()
firestore.settings({ ignoreUndefinedProperties: true })

export async function addNewFirestoreEntry(
  entryID: string,
  data: ExportMediaFormI,
  ExportImageFormFields: ExportMediaFormFieldsI,
  userEmail: string, // <-- 核心修改：接收 userEmail 参数
) {
  const document = firestore.collection('metadata').doc(entryID)

  let cleanData: MediaMetadataI = {} as MediaMetadataI
  data = { ...data.mediaToExport, ...data }
  let combinedFilters: string[] = []

  if (ExportImageFormFields) {
    Object.entries(ExportImageFormFields).forEach(([name, field]) => {
      const sourceProp = field.prop || name
      const valueFromData = data[sourceProp as keyof ExportMediaFormI]
      let transformedValue = valueFromData

      if (Array.isArray(valueFromData) && valueFromData.every((item) => typeof item === 'string')) {
        transformedValue = valueFromData.length > 0 ? Object.fromEntries(valueFromData.map((str) => [str, true])) : null
        valueFromData.forEach((item) => combinedFilters.push(`${name}_${item}`))
      }

      cleanData[name as keyof MediaMetadataI] = transformedValue ?? null
    })
  }

  const dataToSet = {
    ...cleanData,
    userEmail: userEmail, // <-- 核心修改：将 userEmail 添加到要保存的数据中
    timestamp: FieldValue.serverTimestamp(),
    combinedFilters: combinedFilters,
  }

  try {
    const res = await document.set(dataToSet, { ignoreUndefinedProperties: true })
    return res._writeTime._seconds
  } catch (error) {
    console.error(error)
    return {
      error: 'Error while setting new metadata entry to database.',
    }
  }
}

export async function fetchDocumentsInBatches(lastVisibleDocument?: any, filters?: any) {
  const userEmail = getUserEmail(); // <-- 核心修改：在函数开始时获取当前用户 email
  const batchSize = 24

  const collection = firestore.collection('metadata')
  let thisBatchDocuments: MediaMetadataI[] = []

  // <-- 核心修改：所有查询都必须首先基于 userEmail 进行过滤 -->
  let query = collection.where('userEmail', '==', userEmail);

  if (filters) {
    const filterEntries = Object.entries(filters).filter(([, values]) => Array.isArray(values) && values.length > 0)
    if (filterEntries.length > 0) {
      const combinedFilterEntries = filterEntries.flatMap(([filterKey, filterValues]) =>
        (filterValues as string[]).map((filterValue) => `${filterKey}_${filterValue}`)
      )
      if (combinedFilterEntries.length > 0)
        query = query.where('combinedFilters', 'array-contains-any', combinedFilterEntries)
    }
  }

  query = query.orderBy('timestamp', 'desc').limit(batchSize)

  try {
    if (lastVisibleDocument) {
      query = query.startAfter(
        new Timestamp(
          Math.floor(lastVisibleDocument.timestamp / 1000),
          (lastVisibleDocument.timestamp % 1000) * 1000000
        )
      )
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      return { thisBatchDocuments: null, lastVisibleDocument: null, isMorePageToLoad: false }
    }

    thisBatchDocuments = snapshot.docs.map((doc: { data: () => any }) => {
      const data = doc.data()
      delete data.timestamp
      delete data.combinedFilters
      return data as MediaMetadataI
    })

    const newLastVisibleDocument = {
      id: snapshot.docs[snapshot.docs.length - 1].id,
      timestamp:
        snapshot.docs[snapshot.docs.length - 1].data().timestamp._seconds * 1000 +
        snapshot.docs[snapshot.docs.length - 1].data().timestamp._nanoseconds / 1000000,
    }

    // <-- 核心修改：检查下一页的查询也必须包含 userEmail 过滤 -->
    let nextPageQuery = collection.where('userEmail', '==', userEmail);
    if (filters) {
      const filterEntries = Object.entries(filters).filter(([, values]) => Array.isArray(values) && values.length > 0)
      if (filterEntries.length > 0) {
        const combinedFilterEntries = filterEntries.flatMap(([filterKey, filterValues]) =>
          (filterValues as string[]).map((filterValue) => `${filterKey}_${filterValue}`)
        )
        if (combinedFilterEntries.length > 0)
          nextPageQuery = nextPageQuery.where('combinedFilters', 'array-contains-any', combinedFilterEntries)
      }
    }

    nextPageQuery = nextPageQuery
      .orderBy('timestamp', 'desc')
      .limit(1)
      .startAfter(
        new Timestamp(
          Math.floor(newLastVisibleDocument.timestamp / 1000),
          (newLastVisibleDocument.timestamp % 1000) * 1000000
        )
      )
    const nextPageSnapshot = await nextPageQuery.get()
    const isMorePageToLoad = !nextPageSnapshot.empty

    return {
      thisBatchDocuments: thisBatchDocuments,
      lastVisibleDocument: newLastVisibleDocument,
      isMorePageToLoad: isMorePageToLoad,
    }
  } catch (error) {
    console.error(error)
    return {
      error: 'Error while fetching metadata',
    }
  }
}

export async function firestoreDeleteBatch(
  idsToDelete: string[],
  currentMedias: MediaMetadataI[]
): Promise<boolean | { error: string }> {
  const userEmail = getUserEmail(); // <-- 核心修改：获取当前用户 email 以进行权限验证
  const collection = firestore.collection('metadata')
  const batch = firestore.batch()

  const gcsDeletionPromises: Promise<void>[] = []

  if (!idsToDelete || idsToDelete.length === 0) {
    console.log('No IDs provided for deletion. Exiting.')
    return true
  }

  for (const id of idsToDelete) {
    const mediaItem = currentMedias.find((media) => media.id === id)

    // <-- 核心安全修改：开始 -->
    // 在删除前，验证该媒体的所有者是否为当前登录用户
    if (mediaItem && mediaItem.userEmail !== userEmail) {
      console.warn(`Security Alert: User '${userEmail}' attempted to delete media '${id}' owned by '${mediaItem.userEmail}'. Operation blocked.`);
      // 跳过此项，不将其加入删除批处理
      continue;
    }
    // <-- 核心安全修改：结束 -->

    if (mediaItem && mediaItem.gcsURI)
      gcsDeletionPromises.push(
        deleteMedia(mediaItem.gcsURI)
          .then(() => {
            console.log(`Successfully deleted GCS file: ${mediaItem.gcsURI} for document ID: ${id}`)
          })
          .catch((error: any) => {
            console.error(`Failed to delete GCS file ${mediaItem.gcsURI} for document ID: ${id}. Error:`, error)
          })
      )

    const docRef = collection.doc(id)
    batch.delete(docRef)
  }

  if (gcsDeletionPromises.length > 0) await Promise.all(gcsDeletionPromises)

  try {
    await batch.commit()
    return true
  } catch (error) {
    console.error('Firestore batch commit failed:', error)
    return { error: `Firestore batch deletion failed. ` }
  }
}
