import {
  FormControl,
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

const ButtonsGroup = ({ field, disabled = false }: { field: ILayoutField; disabled?: boolean }) => {
  const { path, label, options, multiple = false } = field as ISelectLayoutField
  const { control } = useFormContext()

  return (
    <Controller
      name={path}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => (
        <FormControl
          component='fieldset'
          error={!!error}
          sx={{
            mt: 1,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              height: '100%',
              minHeight: 0,
              maxHeight: '56px'
            }}
          >
            <ToggleButtonGroup
              {...field}
              exclusive={!multiple}
              disabled={disabled}
              value={multiple ? (field.value ?? []) : (field.value ?? '')}
              onChange={(_, newValue) => {
                if (multiple) {
                  // For multiple selection, newValue is an array
                  field.onChange(newValue ?? [])
                } else {
                  // For single selection, only update if newValue is not null
                  if (newValue !== null) {
                    field.onChange(newValue)
                  }
                }
              }}
              aria-label={label}
              sx={{
                width: '100%',
                display: 'flex',
                height: '100%',
                flex: 1,
                minHeight: 0,
                maxHeight: '56px',
                overflowY: 'auto',
                alignItems: 'stretch',
                overflow: 'visible',

                '& .MuiToggleButton-root': {
                  flex: 1,
                  height: '100%',
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:not(.Mui-selected):hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'divider',
                    color: 'text.primary'
                  },
                  '&:not(:first-of-type)': {
                    borderLeft: '1px solid',
                    borderLeftColor: 'divider'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderColor: 'primary.main'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'primary.main',
                    borderColor: 'primary.main'
                  },
                  '&.Mui-selected.Mui-focusVisible': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'primary.dark'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'text.disabled',
                    borderColor: 'divider'
                  },
                  '&.Mui-selected.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'text.disabled',
                    borderColor: 'divider'
                  }
                }
              }}
            >
              {options?.values?.map((option) => {
                const IconComponent = option.icon ? getIconComponent(option.icon) : null
                const hasIcon = !!IconComponent

                let buttonContent
                let showTooltip = false

                if (option.isIconOnly && hasIcon) {
                  buttonContent = <IconComponent />
                  showTooltip = true
                } else if (hasIcon) {
                  buttonContent = (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconComponent />
                      {option.label}
                    </Box>
                  )
                } else {
                  buttonContent = option.label
                }

                return (
                  <ToggleButton
                    key={String(option.value)}
                    value={option.value}
                    sx={{
                      position: 'relative',
                      flex: 1,
                      whiteSpace: 'nowrap'
                    }}
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
