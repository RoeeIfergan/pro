import React from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Stack,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { FieldComponentType, UnknownRecord } from '../../../lib/types'
import { ILayoutFieldWithIds } from '../../types'
import { DNDCardBuilderContextType } from '../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import BreadcrumbsBar from '../BreadcrumbsBar'
import WidthPicker from './WidthPicker'
import SelectPropertiesAccordion from './SelectPropertiesAccordion'

export interface EditFieldViewProps {
  rowIndex: number
  fieldIndex: number
  context: DNDCardBuilderContextType
  onBack: () => void
}

const EditFieldView: React.FC<EditFieldViewProps> = ({ rowIndex, fieldIndex, context, onBack }) => {
  const { fieldPathOptions, setUiSchema, uiSchema, navigateBackToRows, navigateBackToRow } = context

  const field = uiSchema.layout?.[rowIndex]?.fields?.[fieldIndex]

  const updateField = (updates: Record<string, unknown>) => {
    if (!field) return

    console.log('updates', updates)

    setUiSchema((prev) => ({
      ...prev,
      layout: prev.layout.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields.map((fieldItem) =>
                fieldItem._id === field._id ? { ...fieldItem, ...updates } : fieldItem
              )
            }
          : row
      )
    }))
  }

  if (!field) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Header with back button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          backgroundColor: 'primary.dark',
          gap: 1
        }}
      >
        <IconButton onClick={onBack} sx={{ mr: 1, color: 'primary.contrastText' }}>
          <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
          {DND_CARD_BUILDER_LABELS.EDIT_FIELD_TITLE}
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <BreadcrumbsBar
        currentView='editField'
        editingField={{ field, rowIndex }}
        uiSchema={uiSchema}
        navigateBackToRows={navigateBackToRows}
        navigateBackToRow={navigateBackToRow}
      />

      {/* Scrollable form content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Stack spacing={3}>
          <TextField
            label={DND_CARD_BUILDER_LABELS.FIELD_NAME}
            value={field.label || ''}
            onChange={(e) => updateField({ label: e.target.value })}
            placeholder={DND_CARD_BUILDER_LABELS.FIELD_NAME_PLACEHOLDER}
            fullWidth
          />

          <Autocomplete
            freeSolo
            options={fieldPathOptions}
            value={String(field.path ?? '')}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                updateField({ path: newValue })
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={DND_CARD_BUILDER_LABELS.FIELD_PATH}
                onBlur={(e) => updateField({ path: e.target.value })}
                fullWidth
              />
            )}
          />

          <FormControl fullWidth>
            <InputLabel>{DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}</InputLabel>
            <Select
              value={field.component}
              label={DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}
              onChange={(e) => updateField({ component: e.target.value as FieldComponentType })}
            >
              {Object.values(FieldComponentType).map((ct) => (
                <MenuItem key={ct} value={ct}>
                  {ct}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h6'>
                {DND_CARD_BUILDER_LABELS.LAYOUT_BEHAVIOR_SECTION}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Stack direction='row' spacing={2}>
                  <WidthPicker
                    value={field.width}
                    onChange={(width) => updateField({ width })}
                    label={DND_CARD_BUILDER_LABELS.FIELD_WIDTH}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.required || false}
                        onChange={(e) => updateField({ required: e.target.checked })}
                      />
                    }
                    label={DND_CARD_BUILDER_LABELS.FIELD_REQUIRED}
                  />
                </Stack>

                <Stack direction='row' spacing={2}>
                  <TextField
                    label={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY}
                    value={field.groupKey ?? ''}
                    onChange={(e) => updateField({ groupKey: e.target.value || undefined })}
                    placeholder={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY_PLACEHOLDER}
                    fullWidth
                    helperText={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY_HELPER}
                  />

                  <TextField
                    label={DND_CARD_BUILDER_LABELS.FIELD_GROUP_ORDER}
                    type='number'
                    value={field.groupOrder ?? ''}
                    onChange={(e) =>
                      updateField({
                        groupOrder: e.target.value ? Number(e.target.value) : undefined
                      })
                    }
                    placeholder={DND_CARD_BUILDER_LABELS.FIELD_GROUP_ORDER_PLACEHOLDER}
                    fullWidth
                    helperText={DND_CARD_BUILDER_LABELS.FIELD_GROUP_ORDER_HELPER}
                  />
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Input-specific properties */}
          {[
            FieldComponentType.inputText,
            FieldComponentType.inputNumber,
            FieldComponentType.inputEmail,
            FieldComponentType.inputPassword,
            FieldComponentType.inputUrl,
            FieldComponentType.textarea
          ].includes(field.component) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6'>
                  {DND_CARD_BUILDER_LABELS.INPUT_PROPERTIES_SECTION}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    label={DND_CARD_BUILDER_LABELS.PLACEHOLDER}
                    value={(field as { placeholder?: string }).placeholder ?? ''}
                    onChange={(e) => updateField({ placeholder: e.target.value })}
                    placeholder={DND_CARD_BUILDER_LABELS.PLACEHOLDER_INPUT_PLACEHOLDER}
                    fullWidth
                    helperText={DND_CARD_BUILDER_LABELS.PLACEHOLDER_HELPER}
                  />

                  <Stack direction='row' spacing={2}>
                    <TextField
                      label={
                        field.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MINIMUM_VALUE
                          : DND_CARD_BUILDER_LABELS.MINIMUM_LENGTH
                      }
                      type={field.component === FieldComponentType.inputNumber ? 'number' : 'text'}
                      value={(field as { min?: number | string }).min ?? ''}
                      onChange={(e) =>
                        updateField({
                          min:
                            field.component === FieldComponentType.inputNumber
                              ? e.target.value
                                ? Number(e.target.value)
                                : undefined
                              : e.target.value || undefined
                        })
                      }
                      fullWidth
                      helperText={
                        field.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MIN_VALUE_HELPER
                          : DND_CARD_BUILDER_LABELS.MIN_LENGTH_HELPER
                      }
                    />

                    <TextField
                      label={
                        field.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MAXIMUM_VALUE
                          : DND_CARD_BUILDER_LABELS.MAXIMUM_LENGTH
                      }
                      type={field.component === FieldComponentType.inputNumber ? 'number' : 'text'}
                      value={(field as { max?: number | string }).max ?? ''}
                      onChange={(e) =>
                        updateField({
                          max:
                            field.component === FieldComponentType.inputNumber
                              ? e.target.value
                                ? Number(e.target.value)
                                : undefined
                              : e.target.value || undefined
                        })
                      }
                      fullWidth
                      helperText={
                        field.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MAX_VALUE_HELPER
                          : DND_CARD_BUILDER_LABELS.MAX_LENGTH_HELPER
                      }
                    />
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Select-specific properties */}
          {[
            FieldComponentType.select,
            FieldComponentType.buttonsGroup,
            FieldComponentType.chipsSelect
          ].includes(field.component) && (
            <SelectPropertiesAccordion
              localField={field as ILayoutFieldWithIds<UnknownRecord>}
              onFieldChange={(updater) => {
                const updated = updater(field as ILayoutFieldWithIds<UnknownRecord>)
                if (updated) {
                  updateField(updated)
                }
              }}
            />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default EditFieldView
