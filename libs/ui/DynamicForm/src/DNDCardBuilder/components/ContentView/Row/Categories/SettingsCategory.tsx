import React from 'react'
import { TextField, Stack } from '@mui/material'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'

interface SettingsCategoryProps {
  rowIndex: number
}

const SettingsCategory: React.FC<SettingsCategoryProps> = ({ rowIndex }) => {
  const { uiSchema, setUiSchema } = useDNDCardBuilderContext()

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
      <TextField
        fullWidth
        variant='outlined'
        label={DND_CARD_BUILDER_LABELS.ROW_TITLE}
        value={row?.title || ''}
        onChange={(e) => updateRow({ title: e.target.value })}
        size='small'
        helperText='כותרת אופציונלית לשורה'
      />
    </Stack>
  )
}

export default SettingsCategory
