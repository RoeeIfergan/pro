import { useState, useEffect } from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
  Chip,
  Box
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ISelectLayoutField, IOption } from '../../../types/types'

const LayoutSelect = ({ field }: { field: ISelectLayoutField }) => {
  const { path, label, options, multiple, required } = field
  const { control } = useFormContext()
  const [loadedOptions, setLoadedOptions] = useState<IOption[]>(options?.values || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (options?.asyncValues && !options.values) {
      setLoading(true)
      options
        .asyncValues()
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
        const handleChipDelete = (valueToRemove: any) => {
          const currentValue = field.value || []
          const newValue = currentValue.filter((item: any) => item !== valueToRemove)
          field.onChange(newValue)
        }

        const renderValueWithField = (selected: any) => {
          if (!multiple) return selected

          if (!Array.isArray(selected) || selected.length === 0) {
            return ''
          }

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
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
              disabled={loading}
              renderValue={multiple ? renderValueWithField : undefined}
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
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
