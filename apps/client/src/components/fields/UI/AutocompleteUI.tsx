import { Autocomplete as MUIAutocomplete, CircularProgress, TextField } from '@mui/material'

const AutocompleteUI = ({
  options,
  isLoading,
  label,
  error,
  getOptionValue,
  getOptionLabel,
  helperText = '',
  ...props
}) => {
  return (
    <MUIAutocomplete
      options={options}
      isOptionEqualToValue={(v1, v2) => getOptionValue(v1) === getOptionValue(v2)}
      getOptionLabel={getOptionLabel}
      sx={{ width: 300 }}
      label={label}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error || helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      {...props}
    />
  )
}

export default AutocompleteUI
