import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useFormContext, Controller } from 'react-hook-form'
import { ILayoutField, IRestLayoutFields } from '../../../types'

const LayoutDatePicker = ({
  field,
  disabled = false
}: {
  field: ILayoutField
  disabled?: boolean
}) => {
  const { path, label } = field as IRestLayoutFields
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
            disabled={disabled}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                variant: 'outlined',
                disabled: disabled,
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
