'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import { useCallback, useEffect, useState } from 'react'

import { Button, Collapse, IconButton, Stack, Typography } from '@mui/material'

import theme from '../../theme'
import { getSignedURL } from '@/app/api/cloud-storage/action'
import { ExportAlerts } from '@/app/ui/transverse-components/ExportAlerts'
import { fetchDocumentsInBatches, firestoreDeleteBatch } from '@/app/api/firestore/action'
import { MediaMetadataI, MediaMetadataWithSignedUrl } from '@/app/api/export-utils'
import LibraryMediasDisplay from '../../ui/library-components/LibraryMediasDisplay'
import LibraryFiltering from '../../ui/library-components/LibraryFiltering'
import { CustomizedSendButton } from '@/app/ui/ux-components/Button-SX'
import { Autorenew, Close, Delete, TouchApp, WatchLater } from '@mui/icons-material'
const { palette } = theme

const iconSx = {
  fontSize: '1.4rem',
  color: palette.secondary.main,
  position: 'center',
  '&:hover': {
    color: palette.primary.main,
    fontSize: '1.5rem',
  },
}

export default function Page() {
  const [errorMsg, setErrorMsg] = useState('')
  const [isMediasLoading, setIsMediasLoading] = useState(false)
  const [fetchedMediasByPage, setFetchedMediasByPage] = useState<MediaMetadataWithSignedUrl[][]>([])
  const [lastVisibleDocument, setLastVisibleDocument] = useState<any | null>(null)
  const [isMorePageToLoad, setIsMorePageToLoad] = useState(false)
  const [filters, setFilters] = useState<any | null>(null)
  const [openFilters, setOpenFilters] = useState(false)

  // State for deletion flow
  const [deletionStatus, setDelStatus] = useState<'init' | 'selecting' | 'deleting'>('init')
  const [deletionSuccess, setDeletionSuccess] = useState(false)
  const [selectedIdsForDeletion, setSelectedIdsForDeletion] = useState<string[]>([])

  const fetchDataAndSignedUrls = useCallback(
    async (currentFiltersArg: any, explicitFetchCursor: any | null, isReplacingExistingData: boolean) => {
      setIsMediasLoading(true)
      if (isReplacingExistingData) {
        setIsMorePageToLoad(false)
        setFetchedMediasByPage([])
        setLastVisibleDocument(null)
      }

      const selectedFilters = Object.entries(currentFiltersArg ?? {})
        .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== ''))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {} as any)

      try {
        let res
        if (Object.values(selectedFilters).length === 0) res = await fetchDocumentsInBatches(explicitFetchCursor)
        else res = await fetchDocumentsInBatches(explicitFetchCursor, selectedFilters)

        if (res.error) throw Error(res.error.replaceAll('Error: ', ''))

        const documents = res.thisBatchDocuments || []

        if (isReplacingExistingData) {
          const hasOldFormat = documents.some((doc: any) => Object.prototype.hasOwnProperty.call(doc, 'imageID'))

          if (hasOldFormat) {
            setErrorMsg(
                // [汉化]
              "注意：为确保与 ImgStudio 中新的 Veo 功能兼容，必须更新 Firestore 元数据数据库。请让您的系统管理员执行位于应用代码库中 library-update-script.md 文件里提供的说明。"
            )
            setIsMediasLoading(false)
            setFetchedMediasByPage([])
            setLastVisibleDocument(null)
            setIsMorePageToLoad(false)
            return
          }
        }

        if (isReplacingExistingData && documents.length === 0) {
            // [汉化]
          setErrorMsg('抱歉，您的搜索没有返回任何结果')
          setFetchedMediasByPage([])
          setIsMorePageToLoad(false)
          setLastVisibleDocument(null)
          setIsMediasLoading(false)
          return
        }

        setErrorMsg('')

        const documentsWithSignedUrlsPromises = documents.map(
          async (doc: { gcsURI: string; videoThumbnailGcsUri?: string }) => {
            if (!doc.gcsURI) return { ...doc, signedUrl: '' } as MediaMetadataWithSignedUrl
            try {
              const signedUrlResult = await getSignedURL(doc.gcsURI)

              if (signedUrlResult.error) throw Error(String(signedUrlResult.error).replaceAll('Error: ', ''))
              const finalSignedUrl = typeof signedUrlResult === 'string' ? signedUrlResult : signedUrlResult.url

              let finalThumbnailSignedUrl = null
              if (doc.videoThumbnailGcsUri) {
                const thumbnailResult = await getSignedURL(doc.videoThumbnailGcsUri)
                if (thumbnailResult.error) throw Error(String(thumbnailResult.error).replaceAll('Error: ', ''))
                finalThumbnailSignedUrl = typeof thumbnailResult === 'string' ? thumbnailResult : thumbnailResult.url
              }
              return {
                ...doc,
                signedUrl: finalSignedUrl,
                videoThumbnailSignedUrl: finalThumbnailSignedUrl,
              } as MediaMetadataWithSignedUrl
            } catch (error) {
              console.error('Error fetching signed URL for a document:', doc.gcsURI, error)
              return { ...doc, signedUrl: '' } as MediaMetadataWithSignedUrl
            }
          }
        )
        const documentsWithSignedUrls = (await Promise.all(documentsWithSignedUrlsPromises)).filter((doc) => {
          if (!doc || !doc.signedUrl || doc.gcsURIError) return false
          if (doc.format == 'MP4') return doc.videoThumbnailSignedUrl && doc.videoThumbnailSignedUrl !== ''
          return true
        })

        setLastVisibleDocument(res.lastVisibleDocument)
        setIsMorePageToLoad(res.isMorePageToLoad || false)

        setFetchedMediasByPage((prevPages) => {
          if (isReplacingExistingData) return [documentsWithSignedUrls]
          else return prevPages.concat([documentsWithSignedUrls])
        })
      } catch (error: any) {
        console.error(error)
            // [汉化]
        setErrorMsg(`获取媒体时发生错误。请重试。`)

        if (isReplacingExistingData) {
          setFetchedMediasByPage([])
          setLastVisibleDocument(null)
        }
      } finally {
        setIsMediasLoading(false)
      }
    },
    []
  )

  const triggerFetch = useCallback((newFilters: any) => {
    setErrorMsg('')
    setOpenFilters(false)
    setFilters(newFilters)
  }, [])

  useEffect(() => {
    fetchDataAndSignedUrls(filters ?? {}, null, true)
  }, [filters, fetchDataAndSignedUrls])


  const handleLoadMore = useCallback(async () => {
    if (lastVisibleDocument && isMorePageToLoad) {
      await fetchDataAndSignedUrls(filters ?? {}, lastVisibleDocument, false)
    }
  }, [lastVisibleDocument, isMorePageToLoad, filters, fetchDataAndSignedUrls])

  // Deletion handlers
  const handleDeletion = useCallback(async () => {
    if (deletionStatus === 'init') {
      setDelStatus('selecting')
      setSelectedIdsForDeletion([])
      setDeletionSuccess(false)
      setErrorMsg('')
      return
    } else if (deletionStatus === 'selecting') {
      if (selectedIdsForDeletion.length === 0) {
        setDelStatus('init')
        return
      }
      setDelStatus('deleting')
      setErrorMsg('')
      setDeletionSuccess(false)
      try {
        const allFetchedMedias: MediaMetadataI[] = fetchedMediasByPage.flat()
        const result = await firestoreDeleteBatch(selectedIdsForDeletion, allFetchedMedias)

        if (result === true) {
          await fetchDataAndSignedUrls(filters ?? {}, null, true)
          setDeletionSuccess(true)
          setSelectedIdsForDeletion([])
          setDelStatus('init')
        } else if (typeof result === 'object' && 'error' in result) throw new Error(result.error)
            // [汉化]
        else throw new Error('删除操作以未知状态完成。')
      } catch (error: any) {
        console.error('Deletion failed:', error)
            // [汉化]
        setErrorMsg('删除过程中发生错误。请重试。')
        setDeletionSuccess(false)
        setDelStatus('init')
      }
    }
  }, [deletionStatus, selectedIdsForDeletion, fetchedMediasByPage, filters, fetchDataAndSignedUrls])

  const handleMediaDeletionSelect = useCallback(
    (docId: string) => {
      if (deletionStatus !== 'selecting') return

      setSelectedIdsForDeletion((prevSelectedIds) =>
        prevSelectedIds.includes(docId) ? prevSelectedIds.filter((id) => id !== docId) : [...prevSelectedIds, docId]
      )
    },
    [deletionStatus]
  )
  const [displayedAlertProps, setDisplayedAlertProps] = useState<{
    message: string
    style: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
      // [汉化]
    if (deletionSuccess) setDisplayedAlertProps({ message: '媒体已成功删除！', style: 'success' })
    else if (errorMsg !== '') setDisplayedAlertProps({ message: errorMsg, style: 'error' })
  }, [deletionSuccess, errorMsg])

  const alertOnClose = useCallback(() => {
    if (displayedAlertProps?.style === 'success') setDeletionSuccess(false)
    else if (displayedAlertProps?.style === 'error') setErrorMsg('')
  }, [displayedAlertProps, setDeletionSuccess, setErrorMsg])

    // [汉化]
  let delButtonLabel = '批量删除'
  if (deletionStatus === 'selecting') {
    if (selectedIdsForDeletion.length > 0)
      delButtonLabel = `删除 ${selectedIdsForDeletion.length} 个媒体`
    else delButtonLabel = '选择媒体'
  } else if (deletionStatus === 'deleting') delButtonLabel = '正在删除...'

  return (
    <Box p={4} sx={{ maxHeight: '100vh', width: '100%', overflowY: 'scroll' }}>
      <Box sx={{ pb: 5, pt: 1.5 }}>
        <Typography display="inline" variant="h1" color={palette.text.secondary} sx={{ fontSize: '1.8rem' }}>
              {/* [汉化] */}
          {'媒体库/'}
        </Typography>
        <Typography
          display="inline"
          variant="h1"
          color={palette.primary.main}
          sx={{ fontWeight: 500, fontSize: '2rem', pl: 1 }}
        >
              {/* [汉化] */}
          {'我的媒体库'}
        </Typography>
      </Box>
      <Collapse
        in={deletionSuccess || errorMsg !== ''}
        onExited={() => {
          setDisplayedAlertProps(null)
        }}
      >
        {displayedAlertProps && (
          <ExportAlerts
            message={displayedAlertProps.message}
            style={displayedAlertProps.style}
            onClose={alertOnClose}
          />
        )}
      </Collapse>

      <Stack
        direction="row"
        gap={2}
        sx={{
          pt: 2,
          px: 0,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <LibraryFiltering
          isMediasLoading={isMediasLoading}
          setIsMediasLoading={setIsMediasLoading}
          setErrorMsg={setErrorMsg}
          submitFilters={(filters: any) => triggerFetch(filters)}
          openFilters={openFilters}
          setOpenFilters={setOpenFilters}
        />
        <Box
          sx={{
            width: 800,
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            alignSelf: 'flex-start',
          }}
        >
          {deletionStatus === 'selecting' && (
            <IconButton
              onClick={
                selectedIdsForDeletion.length > 0
                  ? () => setSelectedIdsForDeletion([])
                  : () => setDelStatus('init')
              }
                  // [汉化]
              aria-label="重置删除选择"
              disableRipple
              sx={{
                px: 0.5,
              }}
            >
              {selectedIdsForDeletion.length > 0 ? <Autorenew sx={iconSx} /> : <Close sx={iconSx} />}
            </IconButton>
          )}

          <Button
            onClick={handleDeletion}
            variant="contained"
            disabled={isMediasLoading || deletionStatus === 'deleting'}
            endIcon={
              deletionStatus === 'selecting' ? (
                <TouchApp />
              ) : deletionStatus === 'deleting' ? (
                <WatchLater sx={{ animation: deletionStatus === 'deleting' ? 'spin 1s linear infinite' : 'none' }} />
              ) : (
                <Delete />
              )
            }
            sx={CustomizedSendButton}
          >
            {delButtonLabel}
          </Button>
        </Box>
      </Stack>

      <LibraryMediasDisplay
        isMediasLoading={isMediasLoading && deletionStatus !== 'deleting'}
        fetchedMediasByPage={fetchedMediasByPage}
        handleLoadMore={handleLoadMore}
        isMorePageToLoad={isMorePageToLoad && deletionStatus !== 'deleting'}
        isDeleteSelectActive={deletionStatus === 'selecting'}
        selectedDocIdsForDelete={selectedIdsForDeletion}
        onToggleDeleteSelect={handleMediaDeletionSelect}
      />
    </Box>
  )
}
