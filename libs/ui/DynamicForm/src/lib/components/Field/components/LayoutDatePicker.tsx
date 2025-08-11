import React from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useFormContext, Controller } from 'react-hook-form'
import { IRestLayoutFields } from '../../../types/types'

const LayoutDatePicker = ({ field }: { field: IRestLayoutFields }) => {
  const { path, label } = field
  const { control } = useFormContext()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={path}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            label={label}
            value={field.value || null}
            onChange={(newValue) => field.onChange(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                variant: 'outlined',
                sx: { mt: 1 }
              }
            }}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default LayoutDatePicker
