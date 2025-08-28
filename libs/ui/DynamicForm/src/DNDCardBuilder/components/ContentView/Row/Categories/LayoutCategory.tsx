import React from 'react'
import {
  Box,
  Stack,
  FormControlLabel,
  Switch,
  Slider,
  FormControl,
  FormLabel,
  Typography
} from '@mui/material'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DND_CARD_BUILDER_LABELS, DEFAULT_GAP } from '../../../../utils/constants'
import { GapKey } from '../../../../../DynamicForm/types'

interface LayoutCategoryProps {
  rowIndex: number
}

const LayoutCategory: React.FC<LayoutCategoryProps> = ({ rowIndex }) => {
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
      <FormControl fullWidth>
        <FormLabel component='legend'>
          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            רווח בין שדות
          </Typography>
        </FormLabel>
        <Box sx={{ px: 2 }}>
          <Slider
            value={row?.gap ?? DEFAULT_GAP}
            onChange={(_: Event, newValue: number | number[]) => {
              const gapValue = newValue as number
              // Only store if different from default, otherwise clear to use system default
              updateRow({ gap: gapValue === DEFAULT_GAP ? undefined : (gapValue as GapKey) })
            }}
            min={1}
            max={20}
            step={1}
            marks
            valueLabelDisplay='on'
            valueLabelFormat={(value) => `${value}`}
          />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 1 }}>
          רווח נוכחי: {row?.gap ?? DEFAULT_GAP} (משפיע על המרווח בין השדות בשורה זו)
        </Typography>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={Boolean(row?.collapsible)}
            onChange={(e) => updateRow({ collapsible: e.target.checked })}
          />
        }
        label={DND_CARD_BUILDER_LABELS.ROW_COLLAPSIBLE}
      />

      {row?.collapsible && (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(row?.defaultExpanded)}
              onChange={(e) => updateRow({ defaultExpanded: e.target.checked })}
            />
          }
          label={DND_CARD_BUILDER_LABELS.ROW_DEFAULT_EXPANDED}
        />
      )}
    </Stack>
  )
}

export default LayoutCategory
