import React from 'react'
import { TextField, Autocomplete, Stack, Typography } from '@mui/material'
import { FieldComponentType, IInputDateRangeLayoutField } from '../../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'

interface InputCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const InputCategory: React.FC<InputCategoryProps> = ({ rowIndex, fieldIndex }) => {
  const { fieldPathOptions, setUiSchema, uiSchema } = useDNDCardBuilderContext()

  const field = uiSchema.rows?.[rowIndex]?.fields?.[fieldIndex]

  const updateField = (updates: Record<string, unknown>) => {
    if (!field) return

    setUiSchema((prev) => ({
      ...prev,
      rows: prev.rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields?.map((fieldItem) =>
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

  const isDateRange = field.component === FieldComponentType.inputDateRange
  const dateRangeField = field as IInputDateRangeLayoutField

  if (isDateRange) {
    return (
      <Stack spacing={3}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          הגדרות שדה טווח תאריכים
        </Typography>

        <TextField
          label='תווית תאריך התחלה'
          value={dateRangeField.startDateLabel ?? ''}
          onChange={(e) => updateField({ startDateLabel: e.target.value })}
          fullWidth
        />

        <TextField
          label='placeholder תאריך התחלה'
          value={dateRangeField.startDatePlaceholder ?? ''}
          onChange={(e) => updateField({ startDatePlaceholder: e.target.value })}
          fullWidth
        />

        <Autocomplete
          freeSolo
          options={fieldPathOptions}
          value={String(dateRangeField.startDatePath ?? '')}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string') {
              updateField({ startDatePath: newValue })
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='נתיב תאריך התחלה'
              onBlur={(e) => updateField({ startDatePath: e.target.value })}
              fullWidth
            />
          )}
        />

        <TextField
          label='תווית תאריך הסיום'
          value={dateRangeField.endDateLabel ?? ''}
          onChange={(e) => updateField({ endDateLabel: e.target.value })}
          fullWidth
        />

        <TextField
          label='placeholder תאריך סיום'
          value={dateRangeField.endDatePlaceholder ?? ''}
          onChange={(e) => updateField({ endDatePlaceholder: e.target.value })}
          fullWidth
        />

        <Autocomplete
          freeSolo
          options={fieldPathOptions}
          value={String(dateRangeField.endDatePath ?? '')}
          onChange={(_, newValue) => {
            if (typeof newValue === 'string') {
              updateField({ endDatePath: newValue })
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='נתיב תאריך הסיום'
              onBlur={(e) => updateField({ endDatePath: e.target.value })}
              fullWidth
            />
          )}
        />
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <TextField
        label={DND_CARD_BUILDER_LABELS.PLACEHOLDER}
        value={(field as { placeholder?: string }).placeholder ?? ''}
        onChange={(e) => updateField({ placeholder: e.target.value })}
        fullWidth
      />

      <TextField
        label='תיאור'
        value={(field as { description?: string }).description ?? ''}
        onChange={(e) => updateField({ description: e.target.value })}
        multiline
        rows={3}
        fullWidth
      />
    </Stack>
  )
}

export default InputCategory
