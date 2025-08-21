import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FieldComponentType, UnknownRecord } from '../../../lib/types'
import { ILayoutFieldWithIds } from '../../types'
import { create, InstanceProps } from 'react-modal-promise'
import { DNDCardBuilderContextType } from '../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import WidthPicker from './WidthPicker'
import SelectPropertiesAccordion from './SelectPropertiesAccordion'

export interface EditFieldDialogProps extends InstanceProps<void> {
  field: ILayoutFieldWithIds | null
  rowIndex: number
  context: DNDCardBuilderContextType
}

const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onReject,
  onResolve,
  field,
  rowIndex,
  context
}) => {
  const { fieldPathOptions, setUiSchema } = context

  const [localField, setLocalField] = useState<ILayoutFieldWithIds<UnknownRecord> | null>(
    (field as ILayoutFieldWithIds<UnknownRecord>) ?? null
  )

  const handleSave = () => {
    if (!localField) return

    // Validation for numeric fields
    if (localField.component === FieldComponentType.inputNumber) {
      const fieldWithNumericProps = localField as { min?: number; max?: number }
      if (
        fieldWithNumericProps.min !== undefined &&
        fieldWithNumericProps.max !== undefined &&
        fieldWithNumericProps.min > fieldWithNumericProps.max
      ) {
        alert(DND_CARD_BUILDER_LABELS.MIN_MAX_VALIDATION_ERROR)
        return
      }
    }

    setUiSchema((prev) => ({
      ...prev,
      layout: prev.layout.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields.map((fieldItem) =>
                fieldItem._id === field?._id ? { ...fieldItem, ...localField } : fieldItem
              )
            }
          : row
      )
    }))

    onResolve()
    onReject()
  }

  const handleCancel = () => {
    onReject()
  }

  if (!field || !localField) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          background: 'background.paper',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          boxShadow: 'none'
        }
      }}
    >
      <DialogTitle>{DND_CARD_BUILDER_LABELS.EDIT_FIELD_TITLE}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label={DND_CARD_BUILDER_LABELS.FIELD_NAME}
            value={localField.label ?? ''}
            onChange={(e) =>
              setLocalField((prev) =>
                prev
                  ? ({ ...prev, label: e.target.value } as ILayoutFieldWithIds<UnknownRecord>)
                  : prev
              )
            }
            placeholder={DND_CARD_BUILDER_LABELS.FIELD_NAME_PLACEHOLDER}
            fullWidth
            helperText={DND_CARD_BUILDER_LABELS.FIELD_NAME_HELPER}
          />

          <Autocomplete
            freeSolo
            options={fieldPathOptions}
            value={String(localField.path ?? '')}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setLocalField((prev) =>
                  prev ? ({ ...prev, path: newValue } as ILayoutFieldWithIds<UnknownRecord>) : prev
                )
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={DND_CARD_BUILDER_LABELS.FIELD_PATH}
                onBlur={(e) =>
                  setLocalField((prev) =>
                    prev
                      ? ({ ...prev, path: e.target.value } as ILayoutFieldWithIds<UnknownRecord>)
                      : prev
                  )
                }
                fullWidth
              />
            )}
          />

          <FormControl fullWidth>
            <InputLabel>{DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}</InputLabel>
            <Select
              value={localField.component}
              label={DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}
              onChange={(e) =>
                setLocalField((prev) =>
                  prev
                    ? ({
                        ...prev,
                        component: e.target.value as FieldComponentType
                      } as ILayoutFieldWithIds<UnknownRecord>)
                    : prev
                )
              }
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
                    value={localField.width}
                    onChange={(width) =>
                      setLocalField((prev) =>
                        prev ? ({ ...prev, width } as ILayoutFieldWithIds<UnknownRecord>) : prev
                      )
                    }
                    label={DND_CARD_BUILDER_LABELS.FIELD_WIDTH}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={localField.required || false}
                        onChange={(e) =>
                          setLocalField((prev) =>
                            prev
                              ? ({
                                  ...prev,
                                  required: e.target.checked
                                } as ILayoutFieldWithIds<UnknownRecord>)
                              : prev
                          )
                        }
                      />
                    }
                    label={DND_CARD_BUILDER_LABELS.FIELD_REQUIRED}
                  />
                </Stack>

                <Stack direction='row' spacing={2}>
                  <TextField
                    label={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY}
                    value={localField.groupKey ?? ''}
                    onChange={(e) =>
                      setLocalField((prev) =>
                        prev
                          ? ({
                              ...prev,
                              groupKey: e.target.value || undefined
                            } as ILayoutFieldWithIds<UnknownRecord>)
                          : prev
                      )
                    }
                    placeholder={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY_PLACEHOLDER}
                    fullWidth
                    helperText={DND_CARD_BUILDER_LABELS.FIELD_GROUP_KEY_HELPER}
                  />

                  <TextField
                    label={DND_CARD_BUILDER_LABELS.FIELD_GROUP_ORDER}
                    type='number'
                    value={localField.groupOrder ?? ''}
                    onChange={(e) =>
                      setLocalField((prev) =>
                        prev
                          ? ({
                              ...prev,
                              groupOrder: e.target.value ? Number(e.target.value) : undefined
                            } as ILayoutFieldWithIds<UnknownRecord>)
                          : prev
                      )
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
          ].includes(localField.component) && (
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
                    value={(localField as { placeholder?: string }).placeholder ?? ''}
                    onChange={(e) =>
                      setLocalField((prev) =>
                        prev
                          ? ({
                              ...prev,
                              placeholder: e.target.value
                            } as ILayoutFieldWithIds<UnknownRecord>)
                          : prev
                      )
                    }
                    placeholder={DND_CARD_BUILDER_LABELS.PLACEHOLDER_INPUT_PLACEHOLDER}
                    fullWidth
                    helperText={DND_CARD_BUILDER_LABELS.PLACEHOLDER_HELPER}
                  />

                  <Stack direction='row' spacing={2}>
                    <TextField
                      label={
                        localField.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MINIMUM_VALUE
                          : DND_CARD_BUILDER_LABELS.MINIMUM_LENGTH
                      }
                      type={
                        localField.component === FieldComponentType.inputNumber ? 'number' : 'text'
                      }
                      value={(localField as { min?: number | string }).min ?? ''}
                      onChange={(e) =>
                        setLocalField((prev) =>
                          prev
                            ? ({
                                ...prev,
                                min:
                                  localField.component === FieldComponentType.inputNumber
                                    ? e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                    : e.target.value || undefined
                              } as ILayoutFieldWithIds<UnknownRecord>)
                            : prev
                        )
                      }
                      fullWidth
                      helperText={
                        localField.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MIN_VALUE_HELPER
                          : DND_CARD_BUILDER_LABELS.MIN_LENGTH_HELPER
                      }
                    />

                    <TextField
                      label={
                        localField.component === FieldComponentType.inputNumber
                          ? DND_CARD_BUILDER_LABELS.MAXIMUM_VALUE
                          : DND_CARD_BUILDER_LABELS.MAXIMUM_LENGTH
                      }
                      type={
                        localField.component === FieldComponentType.inputNumber ? 'number' : 'text'
                      }
                      value={(localField as { max?: number | string }).max ?? ''}
                      onChange={(e) =>
                        setLocalField((prev) =>
                          prev
                            ? ({
                                ...prev,
                                max:
                                  localField.component === FieldComponentType.inputNumber
                                    ? e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                    : e.target.value || undefined
                              } as ILayoutFieldWithIds<UnknownRecord>)
                            : prev
                        )
                      }
                      fullWidth
                      helperText={
                        localField.component === FieldComponentType.inputNumber
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
          ].includes(localField.component) && (
            <SelectPropertiesAccordion localField={localField} onFieldChange={setLocalField} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{DND_CARD_BUILDER_LABELS.CANCEL}</Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          {DND_CARD_BUILDER_LABELS.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const openEditFieldDialog = create(EditFieldDialog)

export default EditFieldDialog
