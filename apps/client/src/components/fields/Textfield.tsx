import { useField } from 'formik'
import MUITextField from '@mui/material/TextField'
const TextField = ({
  name,
  label = '',
  defaultValue = '',
  helperText = '',
  ...props
}) => {
  const [field, meta] = useField(name)

  const { error } = meta

  return (
    <MUITextField
      name={name}
      error={!!error}
      value={meta.value}
      onChange={field.onChange}
      label={label}
      defaultValue={defaultValue}
      helperText={error || helperText}
      {...props}
    />
  )
}

export default TextField
