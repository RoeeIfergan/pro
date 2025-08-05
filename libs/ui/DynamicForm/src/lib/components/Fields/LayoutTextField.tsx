import React from 'react'
import { TextField } from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldComponentType, IInputLayoutField } from '../../types/types'
import { getInputType } from '../../utils/utils'

const LayoutTextField: React.FC<IInputLayoutField> = (layoutField) => {
  const { path, label, component, placeholder } = layoutField
  const type = getInputType(component)
  const { control } = useFormContext()

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
          error={!!error}
          helperText={error?.message}
          variant='outlined'
          sx={{ mt: 1 }}
          placeholder={placeholder}
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
