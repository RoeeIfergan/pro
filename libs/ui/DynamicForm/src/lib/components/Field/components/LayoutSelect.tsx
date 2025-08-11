import { useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
  Chip,
  Box,
  Typography
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ISelectLayoutField, IOption, ILayoutField } from '../../../types'
import { lazyLoaderMap } from '../../../constants/mappers'
import { useQueryClient } from '@tanstack/react-query'

const LayoutSelect = ({ field }: { field: ILayoutField }) => {
  const { path, label, options, multiple, required } = field as ISelectLayoutField
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
  }, [options])

  const currentOptions = loadedOptions

  return (
    <Controller
      name={path}
      control={control}
      rules={{
        required: required ? `${label} הוא שדה חובה` : false
      }}
      render={({ field, fieldState: { error } }) => {
        const handleChipDelete = (valueToRemove: string) => {
          const currentValue = field.value || []
          const newValue = currentValue.filter((item: string) => item !== valueToRemove)
          field.onChange(newValue)
        }

        const renderValueWithField = (selected: string | string[]) => {
          if (!multiple) return selected

          if (!Array.isArray(selected) || selected.length === 0) {
            return ''
          }

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value: string) => {
                const option = currentOptions.find((opt) => opt.value === value)
                return (
                  <Chip
                    key={value}
                    label={option?.label || value}
                    size='small'
                    onDelete={(event) => {
                      event.stopPropagation()
                      handleChipDelete(value)
                    }}
                    onMouseDown={(event) => {
                      event.stopPropagation()
                    }}
                  />
                )
              })}
            </Box>
          )
        }

        return (
          <FormControl fullWidth error={!!error} sx={{ mt: 1 }} required={required}>
            <InputLabel>{label}</InputLabel>
            <Select
              {...field}
              label={label}
              multiple={multiple}
              value={field.value || (multiple ? [] : '')}
              renderValue={multiple ? renderValueWithField : undefined}
            >
              {loading ? (
                <MenuItem disabled sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant='body2'>טוען...</Typography>
                </MenuItem>
              ) : (
                currentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              )}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}

export default LayoutSelect
