import React from 'react'
import { Stack } from '@mui/material'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'
import ConditionsManager from '../../ConditionsManager/ConditionsManager'
import { ConditionGroup } from '../../../../../DynamicForm/types'

interface AdvancedCategoryProps {
  rowIndex: number
}

const AdvancedCategory: React.FC<AdvancedCategoryProps> = ({ rowIndex }) => {
  const { uiSchema, setUiSchema, fieldPathOptions } = useDNDCardBuilderContext()

  const row = uiSchema.rows[rowIndex]

  const updateRow = (updates: Record<string, unknown>) => {
    if (!row) return

    setUiSchema((prev) => ({
      ...prev,
      rows: prev.rows.map((rowItem, index) =>
        index === rowIndex ? { ...rowItem, ...updates } : rowItem
      )
    }))
  }

  if (!row) {
    return null
  }

  return (
    <Stack spacing={3}>
      <ConditionsManager
        label={DND_CARD_BUILDER_LABELS.ROW_HIDDEN}
        value={(row as { hidden?: ConditionGroup })?.hidden}
        onChange={(conditionGroup) => updateRow({ hidden: conditionGroup })}
        availableFields={fieldPathOptions}
        helperText='השורה תוסתר כאשר התנאים המוגדרים מתקיימים'
      />

      <ConditionsManager
        label={DND_CARD_BUILDER_LABELS.ROW_DISABLED}
        value={(row as { disabled?: ConditionGroup })?.disabled}
        onChange={(conditionGroup) => updateRow({ disabled: conditionGroup })}
        availableFields={fieldPathOptions}
        helperText='השורה תהיה מנוטרלת כאשר התנאים המוגדרים מתקיימים'
      />
    </Stack>
  )
}

export default AdvancedCategory
