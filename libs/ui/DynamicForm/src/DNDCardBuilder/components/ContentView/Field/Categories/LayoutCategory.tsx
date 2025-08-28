import React from 'react'
import { Stack } from '@mui/material'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import WidthPicker from '../../EditField/WidthPicker'

interface LayoutCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const LayoutCategory: React.FC<LayoutCategoryProps> = ({ rowIndex, fieldIndex }) => {
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

  return (
    <Stack spacing={3}>
      <WidthPicker value={field.width} onChange={(width) => updateField({ width })} />
    </Stack>
  )
}

export default LayoutCategory
