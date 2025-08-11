import React from 'react'
import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  FormHelperText,
  Box,
  Tooltip
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ISelectLayoutField } from '../../../types/types'
import { getIconComponent } from '../../../utils/utils'

const ButtonsGroup = ({ field }: { field: ISelectLayoutField }) => {
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
              {options?.values?.map((option) => {
                const IconComponent = option.icon ? getIconComponent(option.icon) : null
                const hasIcon = !!IconComponent

                // Simplified button display logic
                let buttonContent
                let showTooltip = false

                if (option.isIconOnly && hasIcon) {
                  // Icon only mode - show icon with label as tooltip
                  buttonContent = <IconComponent />
                  showTooltip = true
                } else if (hasIcon) {
                  // Show both icon and text (default when icon exists and not isIconOnly)
                  buttonContent = (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconComponent />
                      {option.label}
                    </Box>
                  )
                } else {
                  // Text only mode (no icon)
                  buttonContent = option.label
                }

                return showTooltip ? (
                  <Tooltip key={option.value} title={option.label} placement='top'>
                    <ToggleButton value={option.value}>{buttonContent}</ToggleButton>
                  </Tooltip>
                ) : (
                  <ToggleButton key={option.value} value={option.value}>
                    {buttonContent}
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
          </Box>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

export default ButtonsGroup
