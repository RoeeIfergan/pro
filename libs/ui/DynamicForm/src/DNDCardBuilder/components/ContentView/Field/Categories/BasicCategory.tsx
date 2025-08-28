import React from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Stack
} from '@mui/material'
import { FieldComponentType } from '../../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'

interface BasicCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const BasicCategory: React.FC<BasicCategoryProps> = ({ rowIndex, fieldIndex }) => {
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

  return (
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
    </Stack>
  )
}

export default BasicCategory
