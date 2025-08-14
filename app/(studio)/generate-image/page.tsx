// app/(studio)/generate-image/page.tsx
'use client'
import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import GenerateForm from '../../ui/generate-components/GenerateForm'
import OutputImagesDisplay from '../../ui/transverse-components/ImagenOutputImagesDisplay'
import { GenerateImageFormFields, ImageI } from '../../api/generate-image-utils'
import { imagenPromptExamples } from '../../../generate-prompts.json'

export default function GenerateImagePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [generatedImages, setGeneratedImages] = useState<ImageI[]>([])
  const [requestCount, setRequestCount] = useState(0)

  const handleRequestSent = (loading: boolean, count: number) => {
    setIsLoading(loading)
    if (loading) {
      setErrorMsg('')
      setRequestCount(count)
    }
  }

  const handleNewImages = (newImages: ImageI[]) => {
    setGeneratedImages(newImages)
    setIsLoading(false)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="column" spacing={4}>
        <GenerateForm
          generationType="Image"
          isLoading={isLoading}
          onRequestSent={handleRequestSent}
          errorMsg={errorMsg}
          onNewErrorMsg={setErrorMsg}
          generationFields={GenerateImageFormFields}
          randomPrompts={imagenPromptExamples}
          onImageGeneration={handleNewImages}
        />
        <OutputImagesDisplay
          isLoading={isLoading}
          generatedCount={requestCount}
          generatedImagesInGCS={generatedImages}
          onNewErrorMsg={setErrorMsg}
          isPromptReplayAvailable={true}
        />
      </Stack>
    </Box>
  )
}
