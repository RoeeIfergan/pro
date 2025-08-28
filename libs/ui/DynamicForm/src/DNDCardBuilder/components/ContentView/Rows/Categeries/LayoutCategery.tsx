import { Box, FormControl, FormLabel, Slider, Typography } from '@mui/material'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { GapKey } from '../../../../../DynamicForm/types'

const LayoutCategery = () => {
  const { uiSchema, setUiSchema } = useDNDCardBuilderContext()

  const handleGlobalGapChange = (_: Event, newValue: number | number[]) => {
    const gap = newValue as GapKey

    setUiSchema((prev) => ({
      ...prev,
      gap
    }))
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <FormLabel component='legend'>
          <Typography variant='h6' sx={{ mb: 2 }}>
            רווח בין שורות
          </Typography>
        </FormLabel>
        <Box sx={{ px: 2, mt: 2 }}>
          <Slider
            value={uiSchema.gap || 1}
            onChange={handleGlobalGapChange}
            min={1}
            max={20}
            step={1}
            marks
            valueLabelDisplay='on'
            valueLabelFormat={(value) => `${value}`}
            sx={{ mb: 3 }}
          />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>
          רווח נוכחי: {uiSchema.gap || 1} (משפיע על המרווח בין כל השורות בטופס)
        </Typography>
      </FormControl>
    </Box>
  )
}

export default LayoutCategery
