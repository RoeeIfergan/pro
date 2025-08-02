import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { ISelect } from '../types'

const CardSelect = ({ label, fieldName, options }: ISelect) => {
  const { register } = useFormContext()

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>

      <Select label={label} {...register(fieldName)}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CardSelect
