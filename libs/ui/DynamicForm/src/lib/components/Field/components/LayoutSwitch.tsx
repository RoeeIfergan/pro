import { Switch, FormControlLabel } from '@mui/material'
import { ILayoutField, IRestLayoutFields } from '../../../types'
import { Controller, useFormContext } from 'react-hook-form'

const LayoutSwitch = ({ field }: { field: ILayoutField }) => {
  const { path, label } = field as IRestLayoutFields
  const { control } = useFormContext()

  return (
    <Controller
      name={path}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
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

export default LayoutSwitch
