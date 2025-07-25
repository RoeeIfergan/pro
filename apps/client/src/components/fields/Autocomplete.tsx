import { useField } from 'formik'
import AutocompleteUI from './UI/AutocompleteUI'

const Autocomplete = ({
  name,
  options,
  isLoading,
  getOptionValue,
  getOptionLabel,
  label,
  helperText = '',
  ...props
}) => {
  const [, meta, helpers] = useField(name)

  const { error } = meta
  const { setValue } = helpers

  return (
    <AutocompleteUI
      name={name}
      onChange={(e, value) => {
        const processedValue = Array.isArray(value)
          ? value.map(getOptionValue)
          : (value = getOptionValue(value))

        setValue(processedValue || '')
      }}
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      error={error}
      label={label}
      options={options}
      isLoading={isLoading}
      helperText={helperText}
      {...props}
    />
  )
}

export default Autocomplete
