import { Switch, FormControlLabel } from '@mui/material'
import { ILayoutField, IRestLayoutFields } from '../../../types'
import { Controller, useFormContext } from 'react-hook-form'

const LayoutSwitch = ({ field, disabled = false }: { field: ILayoutField; disabled?: boolean }) => {
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
              disabled={disabled}
            />
          }
          name={path}
          label={label}
          disabled={disabled}
          sx={{ mt: 1 }}
        />
      )}
    />
  )
}

export default LayoutSwitch
