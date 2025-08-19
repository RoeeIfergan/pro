import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useFormContext, Controller } from 'react-hook-form'
import { Box, Typography } from '@mui/material'
import { IInputDateRangeLayoutField, ILayoutField } from '../../../types'
import _get from 'lodash/get'

export interface DateRangeValue {
  startDate: Date | null
  endDate: Date | null
}

const LayoutDateRangePicker = ({ field }: { field: ILayoutField }) => {
  const {
    path,
    label,
    startDateLabel,
    endDateLabel,
    startDatePlaceholder,
    endDatePlaceholder,
    startDatePath,
    endDatePath
  } = field as IInputDateRangeLayoutField
  const { control, watch } = useFormContext()

  const currentValue = watch(path) as DateRangeValue | null

  const handleStartDateChange = (
    newStartDate: Date | null,
    onChange: (value: DateRangeValue) => void
  ) => {
    const currentRange = currentValue || { startDate: null, endDate: null }
    const newRange = { ...currentRange, startDate: newStartDate }

    if (newStartDate && currentRange.endDate && newStartDate > currentRange.endDate) {
      newRange.endDate = null
    }

    onChange(newRange)
  }

  const handleEndDateChange = (
    newEndDate: Date | null,
    onChange: (value: DateRangeValue) => void
  ) => {
    const currentRange = currentValue || { startDate: null, endDate: null }
    const newRange = { ...currentRange, endDate: newEndDate }
    onChange(newRange)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={path}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Box sx={{ width: '100%' }}>
            {label ? (
              <Typography
                variant='body2'
                sx={{
                  mb: 1,
                  color: error ? 'error.main' : 'text.secondary',
                  fontWeight: 500
                }}
              >
                {label}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'flex-start' }
              }}
            >
              <DatePicker
                label={startDateLabel}
                value={field.value?.startDate || null}
                onChange={(newValue) => handleStartDateChange(newValue, field.onChange)}
                slotProps={{
                  textField: {
                    placeholder: startDatePlaceholder,
                    fullWidth: true,
                    error: !!error,
                    helperText: _get(error, startDatePath)?.message,
                    variant: 'outlined',
                    sx: {
                      flex: 1,
                      '& .MuiInputBase-root': {
                        backgroundColor: 'background.paper'
                      }
                    }
                  }
                }}
              />

              <DatePicker
                label={endDateLabel}
                value={field.value?.endDate || null}
                onChange={(newValue) => handleEndDateChange(newValue, field.onChange)}
                minDate={field.value?.startDate || undefined}
                slotProps={{
                  textField: {
                    placeholder: endDatePlaceholder,
                    fullWidth: true,
                    error: !!error,
                    helperText: _get(error, endDatePath)?.message,
                    variant: 'outlined',
                    sx: {
                      flex: 1,
                      '& .MuiInputBase-root': {
                        backgroundColor: 'background.paper'
                      }
                    }
                  }
                }}
              />
            </Box>

            {error && (
              <Typography variant='caption' color='error' sx={{ mt: 0.5, display: 'block' }}>
                {error?.message}
              </Typography>
            )}
          </Box>
        )}
      />
    </LocalizationProvider>
  )
}

export default LayoutDateRangePicker
