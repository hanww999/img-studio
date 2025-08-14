// app/(studio)/generate-video/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Box, Stack } from '@mui/material'
import { useAppContext } from '../../context/app-context'
import GenerateForm from '../../ui/generate-components/GenerateForm'
import VeoOutputVideosDisplay from '../../ui/transverse-components/VeoOutputVideosDisplay'
import { GenerateVideoFormFields, OperationMetadataI } from '../../api/generate-video-utils'
import { veoPromptExamples } from '../../../generate-prompts.json'

export default function GenerateVideoPage() {
  const { appContext, setAppContext } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [operationName, setOperationName] = useState<string>('')
  const [operationMetadata, setOperationMetadata] = useState<OperationMetadataI | null>(null)

  // Consume the imageToVideo from context and then clear it
  useEffect(() => {
    if (appContext?.imageToVideo) {
      // The value is consumed by passing it to the form's initial state below.
      // Now, clear it from the context to prevent reuse.
      setAppContext(prev => ({ ...prev, imageToVideo: '' }))
    }
  }, [appContext, setAppContext])

  const handleRequestSent = (loading: boolean) => {
    setIsLoading(loading)
    if (loading) {
      setErrorMsg('')
      setOperationName('')
      setOperationMetadata(null)
    }
  }

  const handleVideoPollingStart = (opName: string, metadata: OperationMetadataI) => {
    setOperationName(opName)
    setOperationMetadata(metadata)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="column" spacing={4}>
        <GenerateForm
          generationType="Video"
          isLoading={isLoading}
          onRequestSent={handleRequestSent}
          errorMsg={errorMsg}
          onNewErrorMsg={setErrorMsg}
          generationFields={GenerateVideoFormFields}
          randomPrompts={veoPromptExamples}
          onVideoPollingStart={handleVideoPollingStart}
          initialITVimageGcsUri={appContext?.imageToVideo}
        />
        <VeoOutputVideosDisplay
          operationName={operationName}
          operationMetadata={operationMetadata}
          onNewErrorMsg={setErrorMsg}
          onLoading={setIsLoading}
        />
      </Stack>
    </Box>
  )
}
