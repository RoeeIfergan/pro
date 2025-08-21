import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Stack,
  IconButton,
  Box,
  Typography,
  Divider,
  Collapse,
  Chip
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import { IconType } from '../../../lib/types'
import type { IOption, IOptionBadge } from '../../../lib/types'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'

export interface OptionEditorProps {
  option: IOption
  index: number
  onUpdate: (index: number, option: IOption) => void
  onDelete: (index: number) => void
}

const OptionEditor: React.FC<OptionEditorProps> = ({ option, index, onUpdate, onDelete }) => {
  const [localOption, setLocalOption] = useState<IOption>(option)
  const [expanded, setExpanded] = useState<boolean>(false)

  // Update local state when option prop changes
  useEffect(() => {
    setLocalOption(option)
  }, [option])

  // Handle changes and propagate to parent
  const handleChange = (updatedOption: IOption) => {
    setLocalOption(updatedOption)
    onUpdate(index, updatedOption)
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

  return (
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header with basic info and controls */}
          <Stack direction='row' alignItems='center' spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                {DND_CARD_BUILDER_LABELS.OPTION_NUMBER(index)}
              </Typography>
              <Stack direction='row' alignItems='center' spacing={1} sx={{ mt: 0.5 }}>
                <Chip
                  label={String(localOption.value)}
                  size='small'
                  color='primary'
                  variant='outlined'
                />
                <Typography variant='body2'>{localOption.label}</Typography>
                {localOption.icon && (
                  <Chip
                    label={localOption.icon}
                    size='small'
                    color='secondary'
                    variant='outlined'
                  />
                )}
                {localOption.badge && (
                  <Chip
                    label={localOption.badge.text}
                    size='small'
                    color={localOption.badge.color || 'default'}
                  />
                )}
              </Stack>
            </Box>

            <IconButton size='small' onClick={() => setExpanded(!expanded)} sx={{ ml: 1 }}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>

            <IconButton size='small' color='error' onClick={() => onDelete(index)} sx={{ ml: 1 }}>
              <DeleteIcon />
            </IconButton>
          </Stack>

          {/* Expanded content */}
          <Collapse in={expanded}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Divider />

              {/* Basic Properties */}
              <Stack direction='row' spacing={2}>
                <TextField
                  label={DND_CARD_BUILDER_LABELS.OPTION_VALUE}
                  value={String(localOption.value)}
                  onChange={(e) => handleValueChange(e.target.value)}
                  helperText={DND_CARD_BUILDER_LABELS.VALUE_TYPE(getValueType(localOption.value))}
                  fullWidth
                />

                <TextField
                  label={DND_CARD_BUILDER_LABELS.OPTION_LABEL}
                  value={localOption.label}
                  onChange={(e) => handleChange({ ...localOption, label: e.target.value })}
                  fullWidth
                />
              </Stack>

              {/* Icon Properties */}
              <Stack direction='row' spacing={2} alignItems='center'>
                <FormControl sx={{ minWidth: 150 }}>
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
                      checked={localOption.isIconOnly || false}
                      onChange={(e) => handleIconOnlyChange(e.target.checked)}
                      disabled={!localOption.icon}
                    />
                  }
                  label={DND_CARD_BUILDER_LABELS.ICON_ONLY_TOGGLE}
                />
              </Stack>

              {/* Badge Properties */}
              <Box>
                <Typography variant='subtitle2' sx={{ mb: 1 }}>
                  {DND_CARD_BUILDER_LABELS.BADGE_OPTIONAL}
                </Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
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
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default OptionEditor
