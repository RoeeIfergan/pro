import React from 'react'
import { Stack } from '@mui/material'
import { ConditionGroup } from '../../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'
import ConditionsManager from '../../ConditionsManager/ConditionsManager'

interface AdvancedCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const AdvancedCategory: React.FC<AdvancedCategoryProps> = ({ rowIndex, fieldIndex }) => {
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
      <ConditionsManager
        label={DND_CARD_BUILDER_LABELS.FIELD_HIDDEN}
        value={(field as { hidden?: ConditionGroup }).hidden}
        onChange={(conditionGroup) => updateField({ hidden: conditionGroup })}
        availableFields={fieldPathOptions}
        helperText='השדה יוסתר כאשר התנאים המוגדרים מתקיימים'
      />

      <ConditionsManager
        label={DND_CARD_BUILDER_LABELS.FIELD_DISABLED}
        value={(field as { disabled?: ConditionGroup }).disabled}
        onChange={(conditionGroup) => updateField({ disabled: conditionGroup })}
        availableFields={fieldPathOptions}
        helperText='השדה יהיה מנוטרל כאשר התנאים המוגדרים מתקיימים'
      />
    </Stack>
  )
}

export default AdvancedCategory
