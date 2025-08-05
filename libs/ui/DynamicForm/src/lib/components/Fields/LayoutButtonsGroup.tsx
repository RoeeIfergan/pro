import React from 'react'
import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  FormHelperText,
  Box
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ISelectLayoutField } from '../../types/types'

const ButtonsGroup: React.FC<ISelectLayoutField> = (field) => {
  const { path, label, options } = field
  const { control } = useFormContext()

  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component='fieldset' error={!!error} sx={{ mt: 1, width: '100%' }}>
          <FormLabel component='legend' sx={{ mb: 1 }}>
            {label}
          </FormLabel>
          <Box>
            <ToggleButtonGroup
              {...field}
              exclusive
              value={field.value || ''}
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  field.onChange(newValue)
                }
              }}
              aria-label={label}
              sx={{
                width: '100%', // Take full width
                display: 'flex', // Use flexbox
                '& .MuiToggleButton-root': {
                  flex: 1, // Distribute buttons evenly
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:not(:first-of-type)': {
                    borderLeft: '1px solid',
                    borderLeftColor: 'divider'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }
                }
              }}
            >
              {options?.values?.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

export default ButtonsGroup
