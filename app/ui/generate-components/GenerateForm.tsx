// 文件路径: app/ui/generate-components/GenerateForm.tsx (最终完整版)

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
 Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button,
 Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography,
} from '@mui/material';
import {
 ArrowDownward as ArrowDownwardIcon, Autorenew,
 Build as BuildIcon, Close as CloseIcon, Lightbulb, Mms,
 Movie as MovieIcon,
 Send as SendIcon, WatchLater as WatchLaterIcon,
} from '@mui/icons-material';
import FormInputChipGroup from '../ux-components/InputChipGroup';
import FormInputDropdown from '../ux-components/InputDropdown';
import { FormInputText } from '../ux-components/InputText';
import { GeminiSwitch } from '../ux-components/GeminiButton';
import CustomTooltip from '../ux-components/Tooltip';
import GenerateSettings from './GenerateSettings';
import ImageToPromptModal from './ImageToPromptModal';
import VideoToPromptModal from './VideoToPromptModal';
import { ReferenceBox } from './ReferenceBox';
import PromptBuilder from './PromptBuilder';
import ImagenPromptBuilder from './ImagenPromptBuilder';
import { useAppContext } from '../../context/app-context';
import { generateImage } from '../../api/imagen/action';
import {
 chipGroupFieldsI, GenerateImageFormFields, GenerateImageFormI, ImageGenerationFieldsI,
 ImageI, maxReferences, ReferenceObjectDefaults, ReferenceObjectInit, selectFieldsI,
 imagenUltraSpecificSettings,
} from '../../api/generate-image-utils';
import { EditImageFormFields } from '../../api/edit-utils';
import {
 GenerateVideoFormFields, GenerateVideoFormI, InterpolImageDefaults, InterpolImageI,
 OperationMetadataI, tempVeo3specificSettings, VideoGenerationFieldsI, videoGenerationUtils,
} from '../../api/generate-video-utils';
import { generateVideo } from '../../api/veo/action';
import { getOrientation, VideoInterpolBox } from './VideoInterpolBox';
import { AudioSwitch } from '../ux-components/AudioButton';

function isVideoForm(data: GenerateImageFormI | GenerateVideoFormI, type: 'Image' | 'Video'): data is GenerateVideoFormI {
 return type === 'Video';
}

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
 generationType, isLoading, onRequestSent, errorMsg, onNewErrorMsg,
 generationFields, randomPrompts, onImageGeneration, onVideoPollingStart,
 initialPrompt, initialITVimage, promptIndication,
}: GenerateFormProps) {
 const {
  handleSubmit, resetField, control, setValue, watch,
  formState: { touchedFields },
 } = useForm<GenerateVideoFormI | GenerateImageFormI>({
  defaultValues: generationFields.defaultValues,
 });
 const { appContext } = useAppContext();

 const [expanded, setExpanded] = React.useState<string | false>(false);
 const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  setExpanded(isExpanded ? panel : false);
 };

 const [promptBuilderOpen, setPromptBuilderOpen] = useState(false);
 const [imagenPromptBuilderOpen, setImagenPromptBuilderOpen] = useState(false);

 const handleApplyFromVeoBuilder = (prompt: string, negativePrompt: string) => {
  setValue('prompt', prompt, { shouldValidate: true });
  setValue('negativePrompt', negativePrompt);
  setPromptBuilderOpen(false);
 };
 const handleCloseVeoBuilder = () => {
  setPromptBuilderOpen(false);
 };
  
 const handleApplyFromImagenBuilder = (prompt: string, negativePrompt: string) => {
  setValue('prompt', prompt, { shouldValidate: true });
  setValue('negativePrompt', negativePrompt);
  setImagenPromptBuilderOpen(false);
 };
 const handleCloseImagenBuilder = () => {
  setImagenPromptBuilderOpen(false);
 };

 const [isGeminiRewrite, setIsGeminiRewrite] = useState(false);
 const handleGeminiRewrite = (event: React.ChangeEvent<HTMLInputElement>) => {
  setIsGeminiRewrite(event.target.checked);
 };

 const isVideoWithAudio = watch('isVideoWithAudio');
 const handleVideoAudioCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue('isVideoWithAudio', event.target.checked);
 };

 const referenceObjects = watch('referenceObjects');
 const [hasReferences, setHasReferences] = useState(false);
  
 const [modelOptionField, setModelOptionField] = useState<selectFieldsI>(
  generationType === 'Image'
   ? GenerateImageFormFields.modelVersion
   : GenerateVideoFormFields.modelVersion
 );
  
 useEffect(() => {
  if (generationType === 'Image') {
   if (referenceObjects.some((obj) => obj.base64Image !== '')) {
    setHasReferences(true);
    setModelOptionField(EditImageFormFields.modelVersion);
    setValue('modelVersion', EditImageFormFields.modelVersion.default);
   } else {
    setHasReferences(false);
    setModelOptionField(GenerateImageFormFields.modelVersion);
    setValue('modelVersion', GenerateImageFormFields.modelVersion.default);
   }
  }
  if (generationType === 'Video') {
   setModelOptionField(GenerateVideoFormFields.modelVersion);
   setValue('modelVersion', GenerateVideoFormFields.modelVersion.default);
  }
 }, [JSON.stringify(referenceObjects), generationType, setValue]);

 const removeReferenceObject = (objectKey: string) => {
  const removeReference = referenceObjects.find((obj) => obj.objectKey === objectKey);
  if (!removeReference) return;
  let updatedReferenceObjects = referenceObjects.filter((obj) => obj.objectKey !== objectKey);
  if (updatedReferenceObjects.length === 0) setValue('referenceObjects', ReferenceObjectInit);
  else setValue('referenceObjects', updatedReferenceObjects);
 };
 const addNewRefObject = () => {
  if (referenceObjects.length >= maxReferences) return;
  const updatedReferenceObjects = [...referenceObjects, { ...ReferenceObjectDefaults, objectKey: Math.random().toString(36).substring(2, 15) }];
  setValue('referenceObjects', updatedReferenceObjects);
 };

 const interpolImageFirst = watch('interpolImageFirst');
 const interpolImageLast = watch('interpolImageLast');
 const optionalVeoPrompt = (interpolImageFirst && interpolImageFirst.base64Image !== '') || (interpolImageFirst && interpolImageFirst.base64Image !== '' && interpolImageLast && interpolImageLast.base64Image !== '');

 const [orientation, setOrientation] = useState('horizontal');
 const selectedRatio = watch('aspectRatio');
 const firstImageRatio = watch('interpolImageFirst.ratio');
 const lastImageRatio = watch('interpolImageLast.ratio');

 useEffect(() => {
  if (touchedFields.aspectRatio) return;
  const imageRatioString = firstImageRatio || lastImageRatio;
  if (imageRatioString) {
   const imageOrientation = getOrientation(imageRatioString);
   const suggestedRatio = imageOrientation === 'horizontal' ? '16:9' : '9:16';
   setValue('aspectRatio', suggestedRatio);
  }
 }, [firstImageRatio, lastImageRatio, touchedFields.aspectRatio, setValue]);

 useEffect(() => {
  if (selectedRatio) setOrientation(getOrientation(selectedRatio));
 }, [selectedRatio]);

 const currentModel = watch('modelVersion');
 const isAudioAvailable = currentModel.includes('veo-3.0');
 const isOnlyITVavailable = currentModel.includes('veo-3.0') && !currentModel.includes('fast') && process.env.NEXT_PUBLIC_VEO_ITV_ENABLED === 'true';
 const isAdvancedFeaturesAvailable = currentModel.includes('veo-2.0') && process.env.NEXT_PUBLIC_VEO_ADVANCED_ENABLED === 'true';

 useEffect(() => {
  if (currentModel === 'imagen-4.0-ultra-generate-001') {
   setValue('sampleCount', '1');
  }
 }, [currentModel, setValue]);

 useEffect(() => {
  if (!isAdvancedFeaturesAvailable) {
   setValue('cameraPreset', '');
   setValue('interpolImageLast', { ...InterpolImageDefaults, purpose: 'last' });
   if (!isOnlyITVavailable) setValue('interpolImageFirst', { ...InterpolImageDefaults, purpose: 'first' });
  }
  if (currentModel.includes('veo-2.0')) {
   setValue('resolution', '720p');
  } else if (currentModel.includes('veo-3.0')) {
   setValue('resolution', '1080p');
  }
 }, [currentModel, isAdvancedFeaturesAvailable, isOnlyITVavailable, setValue]);

 interface ModelOption { value: string; label: string; indication?: string; type?: string }
 function manageModelNotFoundError(errorMessage: string, modelOptions: ModelOption[]): string {
  const modelNotFoundRegex = /Publisher Model `projects\/[^/]+\/locations\/[^/]+\/publishers\/google\/models\/([^`]+)` not found\./;
  const match = errorMessage.match(modelNotFoundRegex);
  if (match && match[1]) {
   const modelValue = match[1];
   const correspondingModel = modelOptions.find((model) => model.value === modelValue);
   const modelLabel = correspondingModel ? correspondingModel.label : modelValue;
   return `您无权访问模型 '${modelLabel}'，请暂时在顶部下拉菜单中选择其他模型，并联系您的 IT 管理员申请访问 '${modelLabel}' 的权限。`;
  }
  return errorMessage;
 }

 const [imageToPromptOpen, setImageToPromptOpen] = useState(false);
 const [videoToPromptOpen, setVideoToPromptOpen] = useState(false);
 const getRandomPrompt = () => randomPrompts[Math.floor(Math.random() * randomPrompts.length)];

 useEffect(() => { if (initialPrompt) setValue('prompt', initialPrompt) }, [initialPrompt, setValue]);
 useEffect(() => { if (initialITVimage) setValue('interpolImageFirst', initialITVimage) }, [initialITVimage, setValue]);

 const onReset = () => {
  generationFields.resetableFields.forEach((field) => resetField(field as keyof GenerateImageFormI | keyof GenerateVideoFormI));
  if (generationType === 'Video') {
   setValue('interpolImageFirst', generationFields.defaultValues.interpolImageFirst);
   setValue('interpolImageLast', generationFields.defaultValues.interpolImageLast);
  }
  setOrientation('horizontal');
  onNewErrorMsg('');
 };

 const onImageSubmit: SubmitHandler<GenerateImageFormI> = async (formData) => {
  onRequestSent(true, parseInt(formData.sampleCount));
  try {
   const areAllRefValid = formData['referenceObjects'].every((ref) => ref.base64Image !== '' && ref.description !== '' && ref.refId !== null && ref.referenceType !== '');
   if (hasReferences && !areAllRefValid) throw Error('提供的参考信息不完整，缺少图片类型或描述。');
   if (hasReferences && areAllRefValid) setIsGeminiRewrite(false);
   const newGeneratedImages = await generateImage(formData, areAllRefValid, isGeminiRewrite, appContext);
   if (newGeneratedImages !== undefined && typeof newGeneratedImages === 'object' && 'error' in newGeneratedImages) {
    let errorMsg = newGeneratedImages['error'].replaceAll('Error: ', '');
    errorMsg = manageModelNotFoundError(errorMsg, generationFields.model.options as ModelOption[]);
    throw Error(errorMsg);
   } else {
    newGeneratedImages.forEach((image) => { if ('warning' in image) onNewErrorMsg(image['warning'] as string) });
    onImageGeneration && onImageGeneration(newGeneratedImages);
   }
  } catch (error: any) { onNewErrorMsg(error.toString()) }
 };

 const onVideoSubmit: SubmitHandler<GenerateVideoFormI> = async (formData) => {
  onRequestSent(true, parseInt(formData.sampleCount));
  try {
   if (formData.interpolImageLast && formData.interpolImageLast.base64Image !== '' && formData.cameraPreset !== '') throw Error(`您不能同时选择最后一帧和镜头预设。请一次只使用其中一个功能。`);
   const result = await generateVideo(formData, appContext);
   if ('error' in result) {
    let errorMsg = result.error.replace('Error: ', '');
    errorMsg = manageModelNotFoundError(errorMsg, generationFields.model.options as ModelOption[]);
    throw new Error(errorMsg);
   } else if ('operationName' in result && 'prompt' in result) onVideoPollingStart && onVideoPollingStart(result.operationName, { formData: formData, prompt: result.prompt });
   else throw new Error('启动视频生成失败：服务器响应无效。');
  } catch (error: any) { onNewErrorMsg(error.toString().replace('Error: ', '')) }
 };

 const onSubmit: SubmitHandler<GenerateImageFormI | GenerateVideoFormI> = async (formData) => {
  if (isVideoForm(formData, generationType)) {
   await onVideoSubmit(formData);
  } else {
   await onImageSubmit(formData);
  }
 };

 return (
  <>
   <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column' }}>
     <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center" sx={{ mb: 3 }}>
      <Typography variant="h4" color="text.primary" sx={{ fontWeight: 600 }}>
       使用
      </Typography>
      <FormInputDropdown name="modelVersion" label="" control={control} field={modelOptionField} styleSize="big" width="" required={false} />
     </Stack>

     {errorMsg !== '' && (
      <Alert severity="error" action={<IconButton aria-label="close" color="inherit" size="small" onClick={() => onRequestSent(false, 0)}><CloseIcon fontSize="inherit" /></IconButton>} sx={{ mb: 2 }}>
       {errorMsg}
      </Alert>
     )}

      <Box sx={{ position: 'relative' }}>
      <FormInputText name="prompt" control={control} label={`${optionalVeoPrompt ? '(可选)' : ''} Prompt`} required={!optionalVeoPrompt} rows={7} promptIndication={`${promptIndication}${isAudioAvailable ? ', 音频 (对话/音效/音乐/环境声)' : ''}`} />
        <Stack direction="row" alignItems="center" sx={{ position: 'absolute', bottom: 12, right: 8 }}>
        {generationType === 'Video' && (
          <CustomTooltip title="视频生成提示词" size="small"><IconButton onClick={() => setVideoToPromptOpen(true)}><MovieIcon /></IconButton></CustomTooltip>
        )}
        <CustomTooltip title="图片生成提示词" size="small"><IconButton onClick={() => setImageToPromptOpen(true)}><Mms /></IconButton></CustomTooltip>
        <CustomTooltip title="获取提示词灵感" size="small"><IconButton onClick={() => setValue('prompt', getRandomPrompt())}><Lightbulb /></IconButton></CustomTooltip>
        <CustomTooltip title="重置所有字段" size="small"><IconButton disabled={isLoading} onClick={() => onReset()}><Autorenew /></IconButton></CustomTooltip>
        <GenerateSettings control={control} setValue={setValue} generalSettingsFields={currentModel === 'imagen-4.0-ultra-generate-001' ? { ...generationFields.settings, ...imagenUltraSpecificSettings } : currentModel.includes('veo-3.0') ? tempVeo3specificSettings : generationFields.settings} advancedSettingsFields={generationFields.advancedSettings} warningMessage={currentModel.includes('veo-3.0') ? '注意: Veo 3 目前的设置选项比 Veo 2 少！' : ''} />
        {isAudioAvailable && (<CustomTooltip title="为视频添加音频" size="small"><AudioSwitch checked={isVideoWithAudio} onChange={handleVideoAudioCheck} /></CustomTooltip>)}
        {currentModel.includes('imagen') && !hasReferences && (<CustomTooltip title="使用 Gemini 优化提示词" size="small"><GeminiSwitch checked={isGeminiRewrite} onChange={handleGeminiRewrite} /></CustomTooltip>)}
        </Stack>
      </Box>
      
     <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
      {generationType === 'Image' && process.env.NEXT_PUBLIC_EDIT_ENABLED === 'true' && (
       <Accordion disableGutters expanded={expanded === 'references'} onChange={handleChange('references')}>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}><Typography fontWeight={500} color="text.primary">主体与风格参考</Typography></AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 1, height: 'auto' }}><Stack direction="column" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" spacing={1} sx={{ pt: 0, pb: 1 }}>{referenceObjects.map((refObj, index) => (<ReferenceBox key={refObj.objectKey + index + '_box'} objectKey={refObj.objectKey} currentReferenceObject={refObj} onNewErrorMsg={onNewErrorMsg} control={control} setValue={setValue} removeReferenceObject={removeReferenceObject} addAdditionalRefObject={() => { }} refPosition={index} refCount={referenceObjects.length} />))}</Stack>{referenceObjects.length < maxReferences && (<Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}><Button variant="contained" onClick={() => addNewRefObject()} disabled={referenceObjects.length >= maxReferences} sx={{ fontSize: '0.8rem', px: 0 }}>{'添加'}</Button></Box>)}</AccordionDetails>
       </Accordion>
      )}

      {generationType === 'Video' && (
       <Accordion disableGutters expanded={expanded === 'interpolation'} onChange={handleChange('interpolation')}>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}><Typography fontWeight={500} color="text.primary">图片转视频</Typography></AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 1, height: 'auto' }}>{isAdvancedFeaturesAvailable && (<><Stack direction="row" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" spacing={0.5} sx={{ pt: 1, pb: 1 }}><VideoInterpolBox label="Base image" sublabel={'(or first frame)'} objectKey="interpolImageFirst" onNewErrorMsg={onNewErrorMsg} setValue={setValue} interpolImage={interpolImageFirst} orientation={orientation} /><VideoInterpolBox label="Last frame" sublabel="(optional)" objectKey="interpolImageLast" onNewErrorMsg={onNewErrorMsg} setValue={setValue} interpolImage={interpolImageLast} orientation={orientation} /></Stack><Box sx={{ py: 2 }}><FormInputChipGroup name="cameraPreset" label={videoGenerationUtils.cameraPreset.label ?? ''} control={control} setValue={setValue} width="450px" field={videoGenerationUtils.cameraPreset as chipGroupFieldsI} required={false} /></Box></>)}{isOnlyITVavailable && (<Stack direction="row" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start" spacing={0.5} sx={{ pt: 1, pb: 1 }}><VideoInterpolBox label="Base image" sublabel={'(input)'} objectKey="interpolImageFirst" onNewErrorMsg={onNewErrorMsg} setValue={setValue} interpolImage={interpolImageFirst} orientation={orientation} /><Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 400, pt: 2, width: '70%' }}>{'注意: Veo 3 目前不支持图片插值和镜头预设，请切换到 Veo 2 使用这些功能！'}</Typography></Stack>)}{!isAdvancedFeaturesAvailable && !isOnlyITVavailable && (<Typography sx={{ p: 2, color: 'text.secondary' }}>当前选定的模型不支持图片转视频功能。请选择 Veo 2 或 Veo 3 查看可用选项。</Typography>)}</AccordionDetails>
       </Accordion>
      )}

      {generationType === 'Image' && (
       <Button variant="outlined" fullWidth startIcon={<BuildIcon />} onClick={() => setImagenPromptBuilderOpen(true)} sx={{ color: 'text.primary', borderColor: 'rgba(255, 255, 255, 0.23)' }}>打开 Imagen 提示词构建器</Button>
      )}
      {generationType === 'Video' && (
       <Button variant="outlined" fullWidth startIcon={<BuildIcon />} onClick={() => setPromptBuilderOpen(true)} sx={{ color: 'text.primary', borderColor: 'rgba(255, 255, 255, 0.23)' }}>打开 Veo 提示词构建器</Button>
      )}
      </Stack>
    </Box>

    <Box sx={{ mt: 'auto', pt: 2, flexShrink: 0 }}>
     <Button type="submit" variant="contained" fullWidth size="large" disabled={isLoading} endIcon={isLoading ? <WatchLaterIcon /> : <SendIcon />} sx={{ py: 1.5, fontSize: '1.1rem' }}>
      生成
     </Button>
    </Box>
   </form>

   <Dialog open={promptBuilderOpen} onClose={handleCloseVeoBuilder} fullWidth={true} maxWidth="xl">
    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>视频 / 提示词构建器<IconButton aria-label="close" onClick={handleCloseVeoBuilder} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
    <DialogContent dividers><PromptBuilder onApply={handleApplyFromVeoBuilder} onClose={handleCloseVeoBuilder} /></DialogContent>
   </Dialog>

   <Dialog open={imagenPromptBuilderOpen} onClose={handleCloseImagenBuilder} fullWidth={true} maxWidth="xl">
    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Imagen / 提示词构建器<IconButton aria-label="close" onClick={handleCloseImagenBuilder} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
    <DialogContent dividers><ImagenPromptBuilder onApply={handleApplyFromImagenBuilder} onClose={handleCloseImagenBuilder} /></DialogContent>
   </Dialog>

   <ImageToPromptModal open={imageToPromptOpen} setNewPrompt={(string) => setValue('prompt', string)} setImageToPromptOpen={setImageToPromptOpen} target={generationType} />
   <VideoToPromptModal open={videoToPromptOpen} setNewPrompt={(string) => setValue('prompt', string)} setVideoToPromptOpen={setVideoToPromptOpen} />
  </>
 );
}
