import { useState, useEffect } from 'react'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  CircularProgress,
  Chip,
  Box,
  Typography
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ILayoutField, ISelectLayoutField, IOption } from '../../../types'
import { lazyLoaderMap } from '../../../constants/mappers'
import { useQueryClient } from '@tanstack/react-query'

const LayoutChipsSelect = ({
  field,
  disabled = false
}: {
  field: ILayoutField
  disabled?: boolean
}) => {
  const { path, label, options, multiple = true } = field as ISelectLayoutField
  const { control } = useFormContext()
  const [loadedOptions, setLoadedOptions] = useState<IOption[]>(options?.values || [])
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (options?.lazyValues && !options.values) {
      setLoading(true)
      const loaderFunction = lazyLoaderMap[options.lazyValues]
      if (loaderFunction) {
        loaderFunction(queryClient)
          .then((data) => {
            setLoadedOptions(data)
          })
          .catch((error) => {
            console.error('Error loading options:', error)
            setLoadedOptions([])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        console.error(`Lazy loader not found for key: ${options.lazyValues}`)
        setLoading(false)
      }
    }
  }, [options, queryClient])

  const currentOptions = loadedOptions

  return (
    <Controller
      name={path}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => {
        const handleChipToggle = (optionValue: IOption['value']) => {
          if (disabled) return

          if (multiple) {
            const currentValue = (field.value || []) as Array<IOption['value']>
            const isSelected = currentValue.includes(optionValue)

            if (isSelected) {
              // Remove from array
              const newValue = currentValue.filter((item) => item !== optionValue)
              field.onChange(newValue)
            } else {
              // Add to array
              field.onChange([...currentValue, optionValue])
            }
          } else {
            // Single select mode
            const isSelected = field.value === optionValue
            field.onChange(isSelected ? '' : optionValue)
          }
        }

        const isChipSelected = (optionValue: IOption['value']) => {
          if (multiple) {
            const currentValue = (field.value || []) as Array<IOption['value']>
            return currentValue.includes(optionValue)
          } else {
            return field.value === optionValue
          }
        }

        return (
          <FormControl fullWidth error={!!error} sx={{ mt: 1 }}>
            {label ? (
              <FormLabel component='legend' sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                {label}
              </FormLabel>
            ) : null}

            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant='body2'>טוען...</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  minHeight: '40px',
                  alignItems: 'flex-start'
                }}
              >
                {currentOptions.map((option) => {
                  const isSelected = isChipSelected(option.value)
                  return (
                    <Chip
                      key={String(option.value)}
                      label={option.label}
                      clickable={!disabled}
                      disabled={disabled}
                      onClick={() => handleChipToggle(option.value)}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      sx={{
                        transition: 'all 0.2s ease',
                        ...(disabled
                          ? {
                              opacity: 0.6,
                              cursor: 'not-allowed',
                              '&:hover': {
                                transform: 'none',
                                boxShadow: 'none'
                              }
                            }
                          : isSelected
                            ? {
                                '&:hover': {
                                  transform: 'none',
                                  boxShadow: 'none',
                                  backgroundColor: 'primary.main',
                                  color: 'primary.contrastText'
                                }
                              }
                            : {
                                '&:hover': {
                                  transform: 'translateY(-1px)',
                                  boxShadow: (theme) => theme.shadows[2]
                                }
                              })
                      }}
                    />
                  )
                })}
              </Box>
            )}

            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}

export default LayoutChipsSelect
