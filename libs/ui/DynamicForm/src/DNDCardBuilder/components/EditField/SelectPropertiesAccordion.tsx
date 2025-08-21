import React from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { UnknownRecord } from '../../../lib/types'
import type { IOption } from '../../../lib/types'
import { ILayoutFieldWithIds } from '../../types'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import OptionsManager from './OptionsManager'

export interface SelectPropertiesAccordionProps {
  localField: ILayoutFieldWithIds<UnknownRecord>
  onFieldChange: (
    updater: (
      prev: ILayoutFieldWithIds<UnknownRecord> | null
    ) => ILayoutFieldWithIds<UnknownRecord> | null
  ) => void
}

const SelectPropertiesAccordion: React.FC<SelectPropertiesAccordionProps> = ({
  localField,
  onFieldChange
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant='h6'>{DND_CARD_BUILDER_LABELS.SELECT_PROPERTIES_SECTION}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          {/* Basic Properties */}
          <Stack direction='row' spacing={2} alignItems='center'>
            <TextField
              label={DND_CARD_BUILDER_LABELS.PLACEHOLDER}
              value={(localField as { placeholder?: string }).placeholder ?? ''}
              onChange={(e) =>
                onFieldChange((prev) =>
                  prev
                    ? ({
                        ...prev,
                        placeholder: e.target.value
                      } as ILayoutFieldWithIds<UnknownRecord>)
                    : prev
                )
              }
              placeholder={DND_CARD_BUILDER_LABELS.SELECT_PLACEHOLDER}
              fullWidth
              helperText={DND_CARD_BUILDER_LABELS.SELECT_PLACEHOLDER_HELPER}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={(localField as { multiple?: boolean }).multiple || false}
                  onChange={(e) =>
                    onFieldChange((prev) =>
                      prev
                        ? ({
                            ...prev,
                            multiple: e.target.checked
                          } as ILayoutFieldWithIds<UnknownRecord>)
                        : prev
                    )
                  }
                />
              }
              label={DND_CARD_BUILDER_LABELS.ALLOW_MULTIPLE}
            />
          </Stack>

          {/* Options Manager */}
          <OptionsManager
            options={(localField as { options?: { values?: IOption[] } }).options?.values || []}
            onChange={(newOptions) => {
              onFieldChange((prev) =>
                prev
                  ? ({
                      ...prev,
                      options: {
                        ...(prev as { options?: { values?: IOption[] } }).options,
                        values: newOptions
                      }
                    } as ILayoutFieldWithIds<UnknownRecord>)
                  : prev
              )
            }}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

export default SelectPropertiesAccordion
