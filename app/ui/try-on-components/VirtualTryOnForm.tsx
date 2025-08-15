// app/ui/try-on-components/VirtualTryOnForm.tsx

'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Box, Stack, Button, Alert, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { Send as SendIcon, WatchLater as WatchLaterIcon, Autorenew, ArrowDownward as ArrowDownwardIcon, Close as CloseIcon } from '@mui/icons-material';

import { useAppContext } from '../../context/app-context';
import { ImageI } from '../../api/generate-image-utils';
import { VirtualTryOnFormI, virtualTryOnFields } from '../../api/virtual-try-on-utils';
import { generateVtoImage } from '../../api/virtual-try-on/action';

import ImageDropzone from './ImageDropzone';
import FormInputChipGroup from '../ux-components/InputChipGroup';
import FormInputDropdown from '../ux-components/InputDropdown';
import { FormInputNumberSmall } from '../ux-components/FormInputNumberSmall';
import { CustomizedSendButton } from '../ux-components/Button-SX';
import { CustomizedAccordion, CustomizedAccordionSummary } from '../ux-components/Accordion-SX';
import theme from '../../theme';
const { palette } = theme;

interface VirtualTryOnFormProps {
  isLoading: boolean;
  errorMsg: string;
  generationFields: typeof virtualTryOnFields;
  onRequestSent: (loading: boolean) => void;
  onNewErrorMsg: (newError: string) => void;
  onImageGeneration: (newImage: ImageI) => void;
}

export default function VirtualTryOnForm({
  isLoading, errorMsg, generationFields, onRequestSent, onNewErrorMsg, onImageGeneration
}: VirtualTryOnFormProps) {
  const { appContext } = useAppContext();
  const { handleSubmit, control, setValue, reset } = useForm<VirtualTryOnFormI>({
    defaultValues: generationFields.defaultValues,
  });

  const onReset = () => {
    reset(generationFields.defaultValues);
    onNewErrorMsg('');
  };

  const onSubmit: SubmitHandler<VirtualTryOnFormI> = async (formData) => {
    if (!appContext) {
      onNewErrorMsg("Application context is not available. Please try refreshing the page.");
      return;
    }
    if (!formData.humanImage.base64Image) {
      onNewErrorMsg('Please upload a human model image.');
      return;
    }
    if (!formData.garmentImages[0].base64Image) {
      onNewErrorMsg('Please upload a garment image.');
      return;
    }

    onRequestSent(true);
    try {
      const result = await generateVtoImage(formData, appContext);
      if ('error' in result) {
        throw new Error(result.error);
      }
      onImageGeneration(result as ImageI);
    } catch (error: any) {
      onNewErrorMsg(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {errorMsg && (
          <Alert severity="error" action={<IconButton size="small" onClick={() => onNewErrorMsg('')}><CloseIcon fontSize="inherit" /></IconButton>}>
            {errorMsg}
          </Alert>
        )}

        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <ImageDropzone name="humanImage" label="Human Model Image" control={control} setValue={setValue} onNewErrorMsg={onNewErrorMsg} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ImageDropzone name={`garmentImages.0`} label="Garment Image" control={control} setValue={setValue} onNewErrorMsg={onNewErrorMsg} />
          </Box>
        </Stack>

        <Accordion defaultExpanded sx={CustomizedAccordion}>
          <AccordionSummary expandIcon={<ArrowDownwardIcon sx={{ color: palette.primary.main }} />} sx={CustomizedAccordionSummary}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Advanced Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <FormInputChipGroup
                name="sampleCount"
                control={control}
                setValue={setValue}
                {...generationFields.fields.sampleCount}
                width="100%"
                required={false}
              />
              {/* [修改] 同时提供 label 和 field 属性 */}
              <FormInputDropdown
                name="personGeneration"
                control={control}
                label={generationFields.fields.personGeneration.label}
                field={generationFields.fields.personGeneration}
                styleSize="small"
                width="100%"
                required={false}
              />
              <FormInputDropdown
                name="outputFormat"
                control={control}
                label={generationFields.fields.outputFormat.label}
                field={generationFields.fields.outputFormat}
                styleSize="small"
                width="100%"
                required={false}
              />
              <FormInputNumberSmall
                name="seedNumber"
                control={control}
                label={generationFields.fields.seedNumber.label}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="text" onClick={onReset} disabled={isLoading} startIcon={<Autorenew />}>
            Reset
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading} endIcon={isLoading ? <WatchLaterIcon /> : <SendIcon />} sx={CustomizedSendButton}>
            Generate
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
