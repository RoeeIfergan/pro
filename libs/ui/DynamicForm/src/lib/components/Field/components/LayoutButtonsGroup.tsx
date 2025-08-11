import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  FormHelperText,
  Box,
  Tooltip,
  Chip
} from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { ILayoutField, ISelectLayoutField } from '../../../types'
import { getIconComponent } from '../../../utils/utils'

const ButtonsGroup = ({ field }: { field: ILayoutField }) => {
  const { path, label, options } = field as ISelectLayoutField
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

                return (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    sx={{ position: 'relative', flex: 1 }}
                  >
                    {showTooltip ? (
                      <Tooltip title={option.label} placement='top'>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                          {buttonContent}
                        </Box>
                      </Tooltip>
                    ) : (
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        {buttonContent}
                      </Box>
                    )}
                    {option.badge ? (
                      <Chip
                        label={option.badge.text}
                        color={option.badge.color ?? 'default'}
                        size='small'
                        sx={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          height: 20,
                          borderRadius: 0,
                          pointerEvents: 'none',
                          transform: 'rotate(-15deg)',
                          transformOrigin: 'top right',
                          '& .MuiChip-label': { px: 0.75, lineHeight: '20px' }
                        }}
                      />
                    ) : null}
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
