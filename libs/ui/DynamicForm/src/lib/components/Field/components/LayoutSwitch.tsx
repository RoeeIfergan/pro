import { Switch, FormControlLabel } from '@mui/material'
import { IRestLayoutFields } from '../../../types/types'
import { Controller, useFormContext } from 'react-hook-form'

const LayoutSwitch = ({ field }: { field: IRestLayoutFields }) => {
  const { path, label } = field
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
