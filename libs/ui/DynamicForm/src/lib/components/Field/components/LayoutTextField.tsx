import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldComponentType, IInputLayoutField, ILayoutField } from '../../../types'
import { getInputType } from '../../../utils/utils'
import { Add, Remove } from '@mui/icons-material'

const LayoutTextField = ({
  field,
  disabled: externalDisabled = false
}: {
  field: ILayoutField
  disabled?: boolean
}) => {
  const { path, label, component, placeholder, min, max, required } = field as IInputLayoutField
  const type = getInputType(component)
  const { control } = useFormContext()

  // Calculate inputProps based on field type
  const getInputProps = (): Record<string, string | number> => {
    const props: Record<string, string | number> = {}

    if (type === 'number') {
      // For number inputs, use min/max directly
      if (min !== undefined) props.min = min
      if (max !== undefined) props.max = max
    } else {
      // For text inputs, use minLength/maxLength
      if (min !== undefined) props.minLength = min
      if (max !== undefined) props.maxLength = max
    }

    return props
  }

  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isNumber = type === 'number'

        const getCurrentNumericValue = (): number => {
          const current = field.value
          if (typeof current === 'number') return current
          if (typeof current === 'string' && current.trim() !== '') {
            const parsed = parseFloat(current)
            return Number.isNaN(parsed) ? 0 : parsed
          }
          return 0
        }

        const clamp = (value: number): number => {
          let result = value
          if (typeof (min as number | string | undefined) !== 'undefined' && min !== '') {
            const minNum = typeof min === 'string' ? parseFloat(min) : min
            if (!Number.isNaN(minNum)) result = Math.max(result, minNum as number)
          }
          if (typeof (max as number | string | undefined) !== 'undefined' && max !== '') {
            const maxNum = typeof max === 'string' ? parseFloat(max) : max
            if (!Number.isNaN(maxNum)) result = Math.min(result, maxNum as number)
          }
          return result
        }

        const handleIncrement = () => {
          const next = clamp(getCurrentNumericValue() + 1)
          field.onChange(next)
        }
        const handleDecrement = () => {
          const next = clamp(getCurrentNumericValue() - 1)
          field.onChange(next)
        }

        return (
          <Box
            sx={{
              mt: 1,
              position: 'relative',
              '& .number-stepper': {
                opacity: 0,
                transform: 'translateX(4px)',
                transition: 'opacity 150ms ease, transform 150ms ease'
              },
              '& .number-stepper.start': {
                transform: 'translateX(-4px)'
              },
              '&:hover .number-stepper': {
                opacity: 1,
                transform: 'translateX(0)'
              },
              // Hide native number spinners
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none',
                  margin: 0
                },
              '& input[type=number]': {
                MozAppearance: 'textfield'
              }
            }}
          >
            <TextField
              {...field}
              value={field.value ?? ''}
              label={label}
              type={type}
              multiline={component === FieldComponentType.textarea}
              rows={component === FieldComponentType.textarea ? 4 : 1}
              fullWidth
              required={required ?? false}
              disabled={externalDisabled}
              error={!!error}
              helperText={error?.message}
              variant='outlined'
              placeholder={placeholder}
              slotProps={{
                inputLabel: {
                  shrink: true
                },
                input: {
                  ...getInputProps(),
                  ...(isNumber
                    ? {
                        startAdornment: (
                          <InputAdornment
                            position='start'
                            className='number-stepper start'
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, mx: 0.125 }}
                          >
                            <IconButton
                              size='small'
                              edge='start'
                              aria-label='decrement'
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDecrement()
                              }}
                              disabled={externalDisabled}
                              sx={{ p: 0.25 }}
                            >
                              <Remove fontSize='inherit' />
                            </IconButton>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            className='number-stepper end'
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, mx: 0.125 }}
                          >
                            <IconButton
                              size='small'
                              edge='end'
                              aria-label='increment'
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleIncrement()
                              }}
                              disabled={externalDisabled}
                              sx={{ p: 0.25 }}
                            >
                              <Add fontSize='inherit' />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    : {})
                }
              }}
              onChange={(e) => {
                const value = e.target.value
                if (isNumber) {
                  if (value === '') {
                    field.onChange(undefined)
                  } else {
                    const numValue = parseFloat(value)
                    field.onChange(Number.isNaN(numValue) ? value : numValue)
                  }
                } else {
                  field.onChange(value)
                }
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default LayoutTextField
