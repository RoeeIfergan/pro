import React from 'react'
import { Stack, FormControlLabel, Switch, Typography } from '@mui/material'
import {
  FieldComponentType,
  IInputDateRangeLayoutField,
  DateRangeValidations
} from '../../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'
import DateRangeValidationPanel from '../../EditField/DateRangeValidationPanel'

interface ValidationCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const ValidationCategory: React.FC<ValidationCategoryProps> = ({ rowIndex, fieldIndex }) => {
  const { setUiSchema, uiSchema } = useDNDCardBuilderContext()

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

  return (
    <Stack spacing={3}>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean((field as { required?: boolean }).required)}
            onChange={(e) => updateField({ required: e.target.checked })}
          />
        }
        label={DND_CARD_BUILDER_LABELS.FIELD_REQUIRED}
      />

      {isDateRange && (
        <DateRangeValidationPanel
          validations={(field as IInputDateRangeLayoutField).dateRangeValidations}
          onChange={(validations: DateRangeValidations) =>
            updateField({ dateRangeValidations: validations })
          }
        />
      )}

      {!isDateRange && (
        <Typography variant='body2' color='text.secondary'>
          מאפייני ולידציה נוספים יתווספו בעתיד
        </Typography>
      )}
    </Stack>
  )
}

export default ValidationCategory
