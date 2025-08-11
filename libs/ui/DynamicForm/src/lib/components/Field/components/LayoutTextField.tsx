import { TextField } from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldComponentType, IInputLayoutField, ILayoutField } from '../../../types'
import { getInputType } from '../../../utils/utils'

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
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          value={field.value || ''}
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
          sx={{ mt: 1 }}
          placeholder={placeholder}
          slotProps={{
            inputLabel: {
              shrink: true
            },
            input: {
              ...getInputProps()
            }
          }}
          onChange={(e) => {
            const value = e.target.value
            if (type === 'number') {
              if (value === '') {
                field.onChange(undefined)
              } else {
                const numValue = parseFloat(value)
                field.onChange(isNaN(numValue) ? value : numValue)
              }
            } else {
              field.onChange(value)
            }
          }}
        />
      )}
    />
  )
}

export default LayoutTextField
