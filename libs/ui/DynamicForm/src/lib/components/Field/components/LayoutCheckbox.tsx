import { Checkbox, FormControlLabel } from '@mui/material'
import { IRestLayoutFields } from '../../../types/types'
import { Controller, useFormContext } from 'react-hook-form'

const LayoutCheckbox = ({ field }: { field: IRestLayoutFields }) => {
  const { path, label } = field
  const { control } = useFormContext()

  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          name={path}
          label={label}
          sx={{ mt: 1 }}
        />
      )}
    />
  )
}

export default LayoutCheckbox
