import { useState, useEffect, useMemo } from 'react'
import { FormControl, FormHelperText, TextField, MenuItem, MenuList } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useFormContext, Controller } from 'react-hook-form'
import { ISelectLayoutField, IOption, ILayoutField } from '../../../types'
import { lazyLoaderMap } from '../../../constants/mappers'
import { useQueryClient } from '@tanstack/react-query'
import { keyBy } from 'lodash'

const LayoutSelect = ({ field, disabled = false }: { field: ILayoutField; disabled?: boolean }) => {
  const { path, label, options, multiple, required, placeholder } = field as ISelectLayoutField
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
  const optionsMap = useMemo(() => keyBy(currentOptions, (o) => String(o.value)), [currentOptions])

  const getSelectedOptions = (value: unknown): IOption[] | IOption | null => {
    if (multiple) {
      const arr = (value || []) as Array<IOption['value']>
      const selected = arr.map((v) => optionsMap[String(v)]).filter(Boolean) as IOption[]
      return selected
    }
    const single = value as IOption['value'] | undefined
    if (single === undefined || single === null || single === '' || currentOptions.length === 0) {
      return null
    }
    return optionsMap[String(single)] ?? null
  }

  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl fullWidth error={!!error} sx={{ mt: 1 }} required={required}>
            <Autocomplete
              options={currentOptions}
              multiple={Boolean(multiple)}
              disableCloseOnSelect={Boolean(multiple)}
              loading={loading}
              disabled={disabled}
              slots={{ listbox: MenuList }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(opt, val) => String(opt.value) === String(val.value)}
              value={getSelectedOptions(field.value) as IOption[] | IOption | null}
              slotProps={{
                paper: {
                  sx: (theme) => ({
                    bgcolor: 'background.default',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[1]
                  })
                },
                listbox: {
                  sx: () => ({
                    p: 0,
                    bgcolor: '#121212',
                    '& .MuiAutocomplete-option': {
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&.Mui-focused': { bgcolor: 'action.hover' },
                      '&[aria-selected="true"]': { bgcolor: 'action.selected' },
                      '&[aria-selected="true"].Mui-focused': { bgcolor: 'action.selected' }
                    }
                  })
                }
              }}
              renderOption={(props, option, state) => (
                <MenuItem
                  {...props}
                  component='li'
                  selected={state.selected}
                  // Keep height and spacing like MenuItem in Select
                  sx={{
                    minHeight: 40,
                    '&.Mui-selected': { bgcolor: 'action.selected' },
                    '&.Mui-selected.Mui-focusVisible': { bgcolor: 'action.selected' }
                  }}
                >
                  {option.label}
                </MenuItem>
              )}
              onChange={(_, newValue) => {
                if (multiple) {
                  const values = (newValue as IOption[]).map((o) => o.value)
                  field.onChange(values)
                } else {
                  const val = (newValue as IOption | null)?.value ?? ''
                  field.onChange(val)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={!multiple ? placeholder : undefined}
                  error={!!error}
                  disabled={disabled}
                />
              )}
              noOptionsText='לא נמצאו תוצאות'
              loadingText='טוען...'
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}

export default LayoutSelect
