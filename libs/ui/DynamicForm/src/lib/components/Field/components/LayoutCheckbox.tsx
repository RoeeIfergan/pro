import { Checkbox, FormControlLabel } from '@mui/material'
import { ILayoutField, IRestLayoutFields } from '../../../types'
import { Controller, useFormContext } from 'react-hook-form'

const LayoutCheckbox = ({ field }: { field: ILayoutField }) => {
  const { path, label } = field as IRestLayoutFields
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
