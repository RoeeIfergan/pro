import React, { useState, useEffect } from 'react'
import {
  Box,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Stack,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material'
import { WidthKey } from '../../../../DynamicForm/types'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'

export interface WidthPickerProps {
  value?: WidthKey
  onChange: (width: WidthKey | undefined) => void
  label?: string
}

const WidthPicker: React.FC<WidthPickerProps> = ({
  value,
  onChange,
  label = DND_CARD_BUILDER_LABELS.FIELD_WIDTH_DEFAULT
}) => {
  const [isAuto, setIsAuto] = useState<boolean>(!value)
  const [sliderValue, setSliderValue] = useState<number>(value || 12)

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setIsAuto(false)
      setSliderValue(value)
    } else {
      setIsAuto(true)
      setSliderValue(12)
    }
  }, [value])

  const handleAutoToggle = (checked: boolean) => {
    setIsAuto(checked)
    if (checked) {
      onChange(undefined)
    } else {
      const newValue = sliderValue as WidthKey
      onChange(newValue)
    }
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const numValue = Array.isArray(newValue) ? newValue[0] : newValue
    setSliderValue(numValue)
    if (!isAuto) {
      onChange(numValue as WidthKey)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numValue = parseInt(inputValue, 10)

    if (inputValue === '' || (numValue >= 1 && numValue <= 12)) {
      const finalValue = inputValue === '' ? 12 : numValue
      setSliderValue(finalValue)
      if (!isAuto) {
        onChange(finalValue as WidthKey)
      }
    }
  }

  return (
    <FormControl fullWidth>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={isAuto}
              onChange={(e) => handleAutoToggle(e.target.checked)}
              size='small'
            />
          }
          label={DND_CARD_BUILDER_LABELS.AUTO_WIDTH}
        />

        {!isAuto && (
          <>
            <Box>
              <InputLabel shrink sx={{ mb: 1, position: 'static' }}>
                {label}
              </InputLabel>
              <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
                {DND_CARD_BUILDER_LABELS.COLUMNS_WIDTH_FORMAT(sliderValue)}
              </Typography>
            </Box>

            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='body2' sx={{ minWidth: 16 }}>
                1
              </Typography>

              <Slider
                value={sliderValue}
                onChange={handleSliderChange}
                min={1}
                max={12}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 3, label: '3' },
                  { value: 6, label: '6' },
                  { value: 9, label: '9' },
                  { value: 12, label: '12' }
                ]}
                sx={{ flex: 1 }}
                track='normal'
                valueLabelDisplay='auto'
                valueLabelFormat={(value) => `${value}/12`}
              />

              <Typography variant='body2' sx={{ minWidth: 20 }}>
                12
              </Typography>

              <TextField
                type='number'
                value={sliderValue}
                onChange={handleInputChange}
                inputProps={{
                  min: 1,
                  max: 12,
                  step: 1
                }}
                sx={{
                  width: 80,
                  '& .MuiInputBase-input': {
                    textAlign: 'center'
                  }
                }}
                size='small'
                variant='outlined'
              />
            </Stack>
          </>
        )}
      </Stack>
    </FormControl>
  )
}

export default WidthPicker
