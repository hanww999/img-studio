// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'

import { Control, SubmitHandler, useForm, useWatch } from 'react-hook-form'

import {
 Accordion,
 AccordionDetails,
 AccordionSummary,
 Alert,
 Avatar,
 Box,
 Button,
 IconButton,
 Stack,
 Typography,
} from '@mui/material'
import {
 ArrowDownward as ArrowDownwardIcon,
 Autorenew,
 Close as CloseIcon,
 Lightbulb,
 Mms,
 Send as SendIcon,
 WatchLater as WatchLaterIcon,
} from '@mui/icons-material'

import { CustomizedAccordion, CustomizedAccordionSummary } from '../ux-components/Accordion-SX'
import { CustomizedAvatarButton, CustomizedIconButton, CustomizedSendButton } from '../ux-components/Button-SX'
import FormInputDropdown from '../ux-components/InputDropdown'
import { FormInputText } from '../ux-components/InputText'
import { GeminiSwitch } from '../ux-components/GeminiButton'
import CustomTooltip from '../ux-components/Tooltip'

import GenerateSettings from './GenerateSettings'
import ImageToPromptModal from './ImageToPromptModal'
import { ReferenceBox } from './ReferenceBox'
// [MODIFICATION] Import the new PromptBuilder component
import PromptBuilder from './PromptBuilder'

import theme from '../../theme'
const { palette } = theme

import { useAppContext } from '../../context/app-context'
import { generateImage } from '../../api/imagen/action'
import {
 GenerateImageFormFields,
 GenerateImageFormI,
 ImageGenerationFieldsI,
 ImageI,
 maxReferences,
 ReferenceObjectDefaults,
 ReferenceObjectInit,
 selectFieldsI,
} from '../../api/generate-image-utils'
import { EditImageFormFields } from '../../api/edit-utils'
import {
 GenerateVideoFormFields,
 GenerateVideoFormI,
 InterpolImageDefaults,
 InterpolImageI,
 OperationMetadataI,
 tempVeo3specificSettings,
 VideoGenerationFieldsI,
} from '../../api/generate-video-utils'
import { generateVideo } from '../../api/veo/action'
import { getOrientation, VideoInterpolBox } from './VideoInterpolBox'
import { AudioSwitch } from '../ux-components/AudioButton'

interface GenerateFormProps {
  generationType: 'Image' | 'Video';
  isLoading: boolean;
  onRequestSent: (loading: boolean, count: number) => void;
  errorMsg: string;
  onNewErrorMsg: (newErrorMsg: string) => void;
  generationFields: ImageGenerationFieldsI | VideoGenerationFieldsI;
  randomPrompts: string[];
  onImageGeneration?: (newImages: ImageI[]) => void;
  onVideoPollingStart?: (operationName: string, metadata: OperationMetadataI) => void;
  initialPrompt?: string;
  initialITVimage?: InterpolImageI;
  promptIndication?: string;
}

export default function GenerateForm({
 generationType,
 isLoading,
 onRequestSent,
 errorMsg,
 onNewErrorMsg,
 generationFields,
 randomPrompts,
 onImageGeneration,
 onVideoPollingStart,
 initialPrompt,
 initialITVimage,
 promptIndication,
}: GenerateFormProps) {
 const {
  handleSubmit,
  resetField,
  control,
  setValue,
  getValues,
  watch,
  formState: { touchedFields },
 } = useForm<GenerateVideoFormI | GenerateImageFormI>({
  defaultValues: generationFields.defaultValues,
 })
 const { appContext } = useAppContext()

 const [expanded, setExpanded] = React.useState<string | false>(false)
 const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  setExpanded(isExpanded ? panel : false)
 }

 const [isGeminiRewrite, setIsGeminiRewrite] = useState(true)
 const handleGeminiRewrite = (event: React.ChangeEvent<HTMLInputElement>) => {
  setIsGeminiRewrite(event.target.checked)
 }

 const isVideoWithAudio = watch('isVideoWithAudio')
 const handleVideoAudioCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue('isVideoWithAudio', event.target.checked)
 }

 const referenceObjects = watch('referenceObjects')
 const [hasReferences, setHasReferences] = useState(false)
 const [modelOptionField, setModelOptionField] = useState<selectFieldsI>(GenerateImageFormFields.modelVersion)
 useEffect(() => {
  if (generationType === 'Image') {
   if (referenceObjects.some((obj) => obj.base64Image !== '')) {
    setHasReferences(true)
    setModelOptionField(EditImageFormFields.modelVersion)
    setValue('modelVersion', EditImageFormFields.modelVersion.default)
   } else {
    setHasReferences(false)
    setModelOptionField(GenerateImageFormFields.modelVersion)
    setValue('modelVersion', GenerateImageFormFields.modelVersion.default)
   }
  }
  if (generationType === 'Video') {
   setModelOptionField(GenerateVideoFormFields.modelVersion)
   setValue('modelVersion', GenerateVideoFormFields.modelVersion.default)
  }
 }, [JSON.stringify(referenceObjects), generationType])
 const removeReferenceObject = (objectKey: string) => {
  const removeReference = referenceObjects.find((obj) => obj.objectKey === objectKey)
  if (!removeReference) return
  let updatedReferenceObjects = referenceObjects.filter((obj) => obj.objectKey !== objectKey)
  if (updatedReferenceObjects.length === 0) setValue('referenceObjects', ReferenceObjectInit)
  else setValue('referenceObjects', updatedReferenceObjects)
 }
 const addNewRefObject = () => {
  if (referenceObjects.length >= maxReferences) return
  const updatedReferenceObjects = [...referenceObjects, { ...ReferenceObjectDefaults, objectKey: Math.random().toString(36).substring(2, 15) }]
  setValue('referenceObjects', updatedReferenceObjects)
 }

 const interpolImageFirst = watch('interpolImageFirst')
 const interpolImageLast = watch('interpolImageLast')
 const optionalVeoPrompt = (interpolImageFirst && interpolImageFirst.base64Image !== '') || (interpolImageFirst && interpolImageFirst.base64Image !== '' && interpolImageLast && interpolImageLast.base64Image !== '')

 const [orientation, setOrientation] = useState('horizontal')
 const selectedRatio = watch('aspectRatio')
 const firstImageRatio = watch('interpolImageFirst.ratio')
 const lastImageRatio = watch('interpolImageLast.ratio')

 useEffect(() => {
  if (touchedFields.aspectRatio) return
  const imageRatioString = firstImageRatio || lastImageRatio
  if (imageRatioString) {
   const imageOrientation = getOrientation(imageRatioString)
   const suggestedRatio = imageOrientation === 'horizontal' ? '16:9' : '9:16'
   setValue('aspectRatio', suggestedRatio)
  }
 }, [firstImageRatio, lastImageRatio, touchedFields.aspectRatio, setValue])

 useEffect(() => {
  if (selectedRatio) setOrientation(getOrientation(selectedRatio))
 }, [selectedRatio])

 const currentModel = watch('modelVersion')
 const isAudioAvailable = currentModel.includes('veo-3.0')
 const isOnlyITVavailable = currentModel.includes('veo-3.0') && !currentModel.includes('fast') && process.env.NEXT_PUBLIC_VEO_ITV_ENABLED === 'true'
 const isAdvancedFeaturesAvailable = currentModel.includes('veo-2.0') && process.env.NEXT_PUBLIC_VEO_ADVANCED_ENABLED === 'true'
 useEffect(() => {
  if (!isAdvancedFeaturesAvailable) {
   setValue('cameraPreset', '')
   setValue('interpolImageLast', { ...InterpolImageDefaults, purpose: 'last' })
   if (!isOnlyITVavailable) setValue('interpolImageFirst', { ...InterpolImageDefaults, purpose: 'first' })
  }
  if (currentModel.includes('veo-2.0')) setValue('resolution', '720p')
 }, [currentModel, isAdvancedFeaturesAvailable, isOnlyITVavailable, setValue])

 interface ModelOption { value: string; label: string; indication?: string; type?: string }
 function manageModelNotFoundError(errorMessage: string, modelOptions: ModelOption[]): string {
  const modelNotFoundRegex = /Publisher Model `projects\/[^/]+\/locations\/[^/]+\/publishers\/google\/models\/([^`]+)` not found\./
  const match = errorMessage.match(modelNotFoundRegex)
  if (match && match[1]) {
   const modelValue = match[1]
   const correspondingModel = modelOptions.find((model) => model.value === modelValue)
   const modelLabel = correspondingModel ? correspondingModel.label : modelValue
   return `You don't have access to the model '${modelLabel}', please select another one in the top dropdown menu for now, and reach out to your IT Admin to request access to '${modelLabel}'.`
  }
  return errorMessage
 }

 const [imageToPromptOpen, setImageToPromptOpen] = useState(false)
 const getRandomPrompt = () => randomPrompts[Math.floor(Math.random() * randomPrompts.length)]

 useEffect(() => { if (initialPrompt) setValue('prompt', initialPrompt) }, [initialPrompt, setValue])
 useEffect(() => { if (initialITVimage) setValue('interpolImageFirst', initialITVimage) }, [initialITVimage, setValue])

 const onReset = () => {
  generationFields.resetableFields.forEach((field) => resetField(field as keyof GenerateImageFormI | keyof GenerateVideoFormI))
  if (generationType === 'Video') {
   setValue('interpolImageFirst', generationFields.defaultValues.interpolImageFirst)
   setValue('interpolImageLast', generationFields.defaultValues.interpolImageLast)
  }
  setOrientation('horizontal')
  onNewErrorMsg('')
 }

 const onImageSubmit: SubmitHandler<GenerateImageFormI> = async (formData) => {
  onRequestSent(true, parseInt(formData.sampleCount))
  try {
   const areAllRefValid = formData['referenceObjects'].every((ref) => ref.base64Image !== '' && ref.description !== '' && ref.refId !== null && ref.referenceType !== '')
   if (hasReferences && !areAllRefValid) throw Error('Incomplete reference(s) information provided, either image type or description missing.')
   if (hasReferences && areAllRefValid) setIsGeminiRewrite(false)
   const newGeneratedImages = await generateImage(formData, areAllRefValid, isGeminiRewrite, appContext)
   if (newGeneratedImages !== undefined && typeof newGeneratedImages === 'object' && 'error' in newGeneratedImages) {
    let errorMsg = newGeneratedImages['error'].replaceAll('Error: ', '')
    errorMsg = manageModelNotFoundError(errorMsg, generationFields.model.options as ModelOption[])
    throw Error(errorMsg)
   } else {
    newGeneratedImages.forEach((image) => { if ('warning' in image) onNewErrorMsg(image['warning'] as string) })
    onImageGeneration && onImageGeneration(newGeneratedImages)
   }
  } catch (error: any) { onNewErrorMsg(error.toString()) }
 }

 const onVideoSubmit: SubmitHandler<GenerateVideoFormI> = async (formData) => {
  onRequestSent(true, parseInt(formData.sampleCount))
  try {
   if (formData.interpolImageLast && formData.interpolImageLast.base64Image !== '' && formData.cameraPreset !== '') throw Error(`You can't have both a last frame and a camera preset selected. Please leverage only one of the two feature at once.`)
   const result = await generateVideo(formData, appContext)
   if ('error' in result) {
    let errorMsg = result.error.replace('Error: ', '')
    errorMsg = manageModelNotFoundError(errorMsg, generationFields.model.options as ModelOption[])
    throw new Error(errorMsg)
   } else if ('operationName' in result && 'prompt' in result) onVideoPollingStart && onVideoPollingStart(result.operationName, { formData: formData, prompt: result.prompt })
   else throw new Error('Failed to initiate video generation: Invalid response from server.')
  } catch (error: any) { onNewErrorMsg(error.toString().replace('Error: ', '')) }
 }

 const onSubmit: SubmitHandler<GenerateImageFormI | GenerateVideoFormI> = async (formData) => {
  if (generationType === 'Image') await onImageSubmit(formData as GenerateImageFormI)
  else if (generationType === 'Video') await onVideoSubmit(formData as GenerateVideoFormI)
 }

 return (
  <>
   <form onSubmit={handleSubmit(onSubmit)}>
    <Box sx={{ pb: 4 }}>
     <Box sx={{ pb: 5 }}>
      <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
       <Typography variant="h1" color={palette.text.secondary} sx={{ fontSize: '1.8rem' }}>
        {'Generate with'}
       </Typography>
       <FormInputDropdown name="modelVersion" label="" control={control} field={modelOptionField} styleSize="big" width="" required={false} />
      </Stack>
     </Box>
     {errorMsg !== '' && (
      <Alert severity="error" action={<IconButton aria-label="close" color="inherit" size="small" onClick={() => { onRequestSent(false, 0) }} sx={{ pt: 0.2 }}><CloseIcon fontSize="inherit" /></IconButton>} sx={{ height: 'auto', mb: 2, fontSize: 16, fontWeight: 500, pt: 1, color: palette.text.secondary }}>
       {errorMsg}
      </Alert>
     )}
     <FormInputText name="prompt" control={control} label={`${optionalVeoPrompt ? '(Optional)' : ''} Prompt - What would you like to generate?`} required={!optionalVeoPrompt} rows={7} promptIndication={`${promptIndication}${isAudioAvailable ? ', audio (dialogue/ sound effects/ music/ ambiant sounds)' : ''}`} />
     <Stack justifyContent="flex-end" direction="row" gap={0} pb={3}>
      <CustomTooltip title="Image to prompt generator" size="small"><IconButton onClick={() => setImageToPromptOpen(true)} aria-label="Prompt Generator" disableRipple sx={{ px: 0.5 }}><Avatar sx={CustomizedAvatarButton}><Mms sx={CustomizedIconButton} /></Avatar></IconButton></CustomTooltip>
      <CustomTooltip title="Get prompt ideas" size="small"><IconButton onClick={() => setValue('prompt', getRandomPrompt())} aria-label="Random prompt" disableRipple sx={{ px: 0.5 }}><Avatar sx={CustomizedAvatarButton}><Lightbulb sx={CustomizedIconButton} /></Avatar></IconButton></CustomTooltip>
      <CustomTooltip title="Reset all fields" size="small"><IconButton disabled={isLoading} onClick={() => onReset()} aria-label="Reset form" disableRipple sx={{ px: 0.5 }}><Avatar sx={CustomizedAvatarButton}><Autorenew sx={CustomizedIconButton} /></Avatar></IconButton></CustomTooltip>
      <GenerateSettings control={control} setValue={setValue} generalSettingsFields={currentModel.includes('veo-3.0') ? tempVeo3specificSettings : generationFields.settings} advancedSettingsFields={generationFields.advancedSettings} warningMessage={currentModel.includes('veo-3.0') ? 'NB: for now, Veo 3 has fewer setting options than Veo 2!' : ''} />
      {isAudioAvailable && (<CustomTooltip title="Add audio to your video" size="small"><AudioSwitch checked={isVideoWithAudio} onChange={handleVideoAudioCheck} /></CustomTooltip>)}
      {currentModel.includes('imagen') && !hasReferences && (<CustomTooltip title="Have Gemini enhance your prompt" size="small"><GeminiSwitch checked={isGeminiRewrite} onChange={handleGeminiRewrite} /></CustomTooltip>)}
      <Button type="submit" variant="contained" disabled={isLoading} endIcon={isLoading ? <WatchLaterIcon /> : <SendIcon />} sx={CustomizedSendButton}>{'Generate'}</Button>
     </Stack>
     {generationType === 'Image' && process.env.NEXT_PUBLIC_EDIT_ENABLED === 'true' && (
      <Accordion disableGutters expanded={expanded === 'references'} onChange={handleChange('references')} sx={CustomizedAccordion}>
       <AccordionSummary expandIcon={<ArrowDownwardIcon sx={{ color: palette.primary.main }} />} aria-controls="panel1-content" id="panel1-header" sx={CustomizedAccordionSummary}>
        <Typography display="inline" variant="body1" sx={{ fontWeight: 500 }}>{'Subject & Style reference(s)'}</Typography>
       </AccordionSummary>
       <AccordionDetails sx={{ pt: 0, pb: 1, height: 'auto' }}>
        <Stack direction="column" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" spacing={1} sx={{ pt: 0, pb: 1 }}>
         {referenceObjects.map((refObj, index) => (<ReferenceBox key={refObj.objectKey + index + '_box'} objectKey={refObj.objectKey} currentReferenceObject={refObj} onNewErrorMsg={onNewErrorMsg} control={control} setValue={setValue} removeReferenceObject={removeReferenceObject} addAdditionalRefObject={() => {}} refPosition={index} refCount={referenceObjects.length} />))}
        </Stack>
        {referenceObjects.length < maxReferences && (<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}><Button variant="contained" onClick={() => addNewRefObject()} disabled={referenceObjects.length >= maxReferences} sx={{ ...CustomizedSendButton, ...{ fontSize: '0.8rem', px: 0 } }}>{'Add'}</Button></Box>)}
       </AccordionDetails>
      </Accordion>
     )}
      
      {/* [MODIFICATION] This is the original, untouched "Image to video" Accordion */}
     {generationType === 'Video' && (isOnlyITVavailable || isAdvancedFeaturesAvailable) && (
      <Accordion disableGutters expanded={expanded === 'interpolation'} onChange={handleChange('interpolation')} sx={CustomizedAccordion}>
       <AccordionSummary expandIcon={<ArrowDownwardIcon sx={{ color: palette.primary.main }} />} aria-controls="panel1-content" id="panel1-header" sx={CustomizedAccordionSummary}>
        <Typography display="inline" variant="body1" sx={{ fontWeight: 500 }}>{isAdvancedFeaturesAvailable ? 'Image(s) to video & Camera presets' : 'Image to video'}</Typography>
       </AccordionSummary>
       {isAdvancedFeaturesAvailable && (<AccordionDetails sx={{ pt: 0, pb: 1, height: 'auto' }}>{/* ... content ... */}</AccordionDetails>)}
       {isOnlyITVavailable && (<AccordionDetails sx={{ pt: 0, pb: 1, height: 'auto' }}>{/* ... content ... */}</AccordionDetails>)}
      </Accordion>
     )}

      {/* [MODIFICATION] This is the NEW, SEPARATE Accordion for the Prompt Builder */}
      {generationType === 'Video' && (
        <Accordion disableGutters expanded={expanded === 'prompt-builder'} onChange={handleChange('prompt-builder')} sx={CustomizedAccordion}>
          <AccordionSummary expandIcon={<ArrowDownwardIcon sx={{ color: palette.primary.main }} />} aria-controls="panel2-content" id="panel2-header" sx={CustomizedAccordionSummary}>
            <Typography display="inline" variant="body1" sx={{ fontWeight: 500 }}>
              Video / prompt attributes
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, backgroundColor: 'transparent' }}>
            <PromptBuilder />
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
   </form>
   <ImageToPromptModal open={imageToPromptOpen} setNewPrompt={(string) => setValue('prompt', string)} setImageToPromptOpen={setImageToPromptOpen} target={generationType} />
  </>
 )
}
