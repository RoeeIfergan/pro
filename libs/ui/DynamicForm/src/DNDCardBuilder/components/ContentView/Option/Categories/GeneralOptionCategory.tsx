import React, { useState, useEffect } from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Stack,
  Box,
  Typography,
  Divider
} from '@mui/material'
import { IconType } from '../../../../../DynamicForm/types'
import type { IOption, IOptionBadge, ISelectLayoutField } from '../../../../../DynamicForm/types'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'
import { useDNDCardBuilderContext } from '../../../../utils/context'

interface GeneralOptionCategoryProps {
  rowIndex: number
  fieldIndex: number
  optionIndex: number
}

const GeneralOptionCategory: React.FC<GeneralOptionCategoryProps> = ({
  rowIndex,
  fieldIndex,
  optionIndex
}) => {
  const { setUiSchema, uiSchema } = useDNDCardBuilderContext()

  const field = uiSchema.rows?.[rowIndex]?.fields?.[fieldIndex] as ISelectLayoutField
  const option = field?.options?.values?.[optionIndex] as IOption

  const [localOption, setLocalOption] = useState<IOption>(option)

  // Update local state when option prop changes
  useEffect(() => {
    setLocalOption(option)
  }, [option])

  const updateOption = (updatedOption: IOption) => {
    if (!field) return

    setUiSchema((prev) => ({
      ...prev,
      rows: prev.rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields?.map((fieldItem) =>
                fieldItem._id === field._id
                  ? {
                      ...fieldItem,
                      options: {
                        ...((fieldItem as ISelectLayoutField).options || {}),
                        values: ((fieldItem as ISelectLayoutField).options?.values || []).map(
                          (opt, idx) => (idx === optionIndex ? updatedOption : opt)
                        )
                      }
                    }
                  : fieldItem
              )
            }
          : row
      )
    }))
  }

  // Handle changes and propagate to parent
  const handleChange = (updatedOption: IOption) => {
    setLocalOption(updatedOption)
    updateOption(updatedOption)
  }

  const handleValueChange = (value: string) => {
    // Try to parse as number or boolean, fallback to string
    let parsedValue: string | number | boolean = value

    if (value === 'true') parsedValue = true
    else if (value === 'false') parsedValue = false
    else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value)

    handleChange({ ...localOption, value: parsedValue })
  }

  const handleIconChange = (iconType: IconType | '') => {
    const newOption = { ...localOption }

    if (iconType === '') {
      delete newOption.icon
      delete newOption.isIconOnly // Remove isIconOnly if no icon
    } else {
      newOption.icon = iconType
    }

    handleChange(newOption)
  }

  const handleIconOnlyChange = (isIconOnly: boolean) => {
    if (!localOption.icon && isIconOnly) {
      // Don't allow isIconOnly without icon
      return
    }

    const newOption = { ...localOption }
    if (isIconOnly) {
      newOption.isIconOnly = true
    } else {
      delete newOption.isIconOnly
    }

    handleChange(newOption)
  }

  const handleBadgeChange = (badge: IOptionBadge | null) => {
    const newOption = { ...localOption }
    if (badge) {
      newOption.badge = badge
    } else {
      delete newOption.badge
    }

    handleChange(newOption)
  }

  const getValueType = (value: string | number | boolean): string => {
    if (typeof value === 'boolean') return DND_CARD_BUILDER_LABELS.TYPE_BOOLEAN
    if (typeof value === 'number') return DND_CARD_BUILDER_LABELS.TYPE_NUMBER
    return DND_CARD_BUILDER_LABELS.TYPE_STRING
  }

  const badgeColors: Array<IOptionBadge['color']> = [
    'default',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning'
  ]

  if (!localOption) {
    return null
  }

  return (
    <Stack spacing={3}>
      <Typography variant='h6' sx={{ fontWeight: 600 }}>
        {'עריכת אפשרות'}
      </Typography>

      <Divider />

      {/* Basic Properties */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label={DND_CARD_BUILDER_LABELS.OPTION_VALUE}
          value={String(localOption.value)}
          onChange={(e) => handleValueChange(e.target.value)}
          helperText={DND_CARD_BUILDER_LABELS.VALUE_TYPE(getValueType(localOption.value))}
          fullWidth
          size='small'
        />

        <TextField
          label={DND_CARD_BUILDER_LABELS.OPTION_LABEL}
          value={localOption.label}
          onChange={(e) => handleChange({ ...localOption, label: e.target.value })}
          fullWidth
          size='small'
        />
      </Stack>

      <Divider />

      {/* Icon Properties */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600 }}>
          {'הגדרות איקון'}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <FormControl size='small' sx={{ minWidth: 150 }}>
            <InputLabel>{DND_CARD_BUILDER_LABELS.OPTION_ICON}</InputLabel>
            <Select
              value={localOption.icon || ''}
              label={DND_CARD_BUILDER_LABELS.OPTION_ICON}
              onChange={(e) => handleIconChange(e.target.value as IconType | '')}
            >
              <MenuItem value=''>{DND_CARD_BUILDER_LABELS.ICON_NONE}</MenuItem>
              {Object.values(IconType).map((iconType) => (
                <MenuItem key={iconType} value={iconType}>
                  {iconType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                size='small'
                checked={localOption.isIconOnly || false}
                onChange={(e) => handleIconOnlyChange(e.target.checked)}
                disabled={!localOption.icon}
              />
            }
            label={DND_CARD_BUILDER_LABELS.ICON_ONLY_TOGGLE}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem'
              }
            }}
          />
        </Stack>
      </Box>

      <Divider />

      {/* Badge Properties */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600 }}>
          {DND_CARD_BUILDER_LABELS.BADGE_OPTIONAL}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <TextField
            label={DND_CARD_BUILDER_LABELS.BADGE_TEXT}
            value={localOption.badge?.text || ''}
            onChange={(e) => {
              const text = e.target.value
              if (text) {
                handleBadgeChange({
                  text,
                  color: localOption.badge?.color || 'default'
                })
              } else {
                handleBadgeChange(null)
              }
            }}
            size='small'
            sx={{ flex: 1 }}
          />

          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel>{DND_CARD_BUILDER_LABELS.BADGE_COLOR}</InputLabel>
            <Select
              value={localOption.badge?.color || 'default'}
              label={DND_CARD_BUILDER_LABELS.BADGE_COLOR}
              onChange={(e) => {
                if (localOption.badge) {
                  handleBadgeChange({
                    ...localOption.badge,
                    color: e.target.value as IOptionBadge['color']
                  })
                }
              }}
              disabled={!localOption.badge?.text}
            >
              {badgeColors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
    </Stack>
  )
}

export default GeneralOptionCategory
