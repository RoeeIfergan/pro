import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  DateRangeValidations,
  DateRangeValidationConfig,
  DayOfWeek
} from '../../../../DynamicForm/types'

interface DateRangeValidationPanelProps {
  validations?: DateRangeValidations
  onChange: (validations: DateRangeValidations) => void
}

const dayOfWeekOptions: { value: DayOfWeek; label: string }[] = [
  { value: 0, label: 'ראשון' },
  { value: 1, label: 'שני' },
  { value: 2, label: 'שלישי' },
  { value: 3, label: 'רביעי' },
  { value: 4, label: 'חמישי' },
  { value: 5, label: 'שישי' },
  { value: 6, label: 'שבת' }
]

const DateRangeValidationPanel: React.FC<DateRangeValidationPanelProps> = ({
  validations = {},
  onChange
}) => {
  const updateStartDateValidation = (config?: DateRangeValidationConfig) => {
    onChange({
      ...validations,
      startDate: config
    })
  }

  const updateEndDateValidation = (config?: DateRangeValidationConfig) => {
    onChange({
      ...validations,
      endDate: config
    })
  }

  const renderValidationSection = (
    title: string,
    config: DateRangeValidationConfig | undefined,
    onUpdate: (config?: DateRangeValidationConfig) => void,
    isEndDate = false
  ) => {
    const enableMinDaysValidation = config?.minDaysFromToday !== undefined
    const enableDayOfWeekValidation = config?.allowedDaysOfWeek !== undefined

    const handleMinDaysToggle = (enabled: boolean) => {
      if (enabled) {
        onUpdate({
          ...config,
          minDaysFromToday: isEndDate ? 1 : 0
        })
      } else {
        const newConfig = { ...config }
        delete newConfig.minDaysFromToday

        // If no validations are left, remove the config entirely
        if (
          Object.keys(newConfig).length === 0 ||
          (Object.keys(newConfig).length === 1 && newConfig.allowedDaysOfWeek === undefined)
        ) {
          onUpdate(undefined)
        } else {
          onUpdate(newConfig)
        }
      }
    }

    const handleDayOfWeekToggle = (enabled: boolean) => {
      if (enabled) {
        onUpdate({
          ...config,
          allowedDaysOfWeek: [0, 1, 2, 3, 4, 5, 6] // Start with all days
        })
      } else {
        const newConfig = { ...config }
        delete newConfig.allowedDaysOfWeek

        // If no validations are left, remove the config entirely
        if (
          Object.keys(newConfig).length === 0 ||
          (Object.keys(newConfig).length === 1 && newConfig.minDaysFromToday === undefined)
        ) {
          onUpdate(undefined)
        } else {
          onUpdate(newConfig)
        }
      }
    }

    const handleMinDaysChange = (value: string) => {
      const numValue = parseInt(value) || 0
      onUpdate({
        ...config,
        minDaysFromToday: numValue
      })
    }

    const handleDayOfWeekChange = (event: SelectChangeEvent<DayOfWeek[]>) => {
      const value = event.target.value as DayOfWeek[]
      onUpdate({
        ...config,
        allowedDaysOfWeek: value
      })
    }

    return (
      <Accordion key={title}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='subtitle2'>{title}</Typography>
            {(enableMinDaysValidation || enableDayOfWeekValidation) && (
              <Chip
                size='small'
                label={`${(enableMinDaysValidation ? 1 : 0) + (enableDayOfWeekValidation ? 1 : 0)} ולידציות`}
                color='primary'
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Min days validation */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableMinDaysValidation}
                    onChange={(e) => handleMinDaysToggle(e.target.checked)}
                  />
                }
                label={`הגבלת תאריכי עבר ${isEndDate ? '(יחסית לתאריך התחלה)' : ''}`}
              />

              {enableMinDaysValidation && (
                <TextField
                  label={isEndDate ? 'מספר ימים מתאריך התחלה' : 'מספר ימים מהיום'}
                  type='number'
                  value={config?.minDaysFromToday || 0}
                  onChange={(e) => handleMinDaysChange(e.target.value)}
                  inputProps={{ min: 0 }}
                  size='small'
                  sx={{ mt: 1, width: 200 }}
                  helperText={
                    config?.minDaysFromToday === 0
                      ? isEndDate
                        ? 'ניתן לבחור מתאריך התחלה'
                        : 'ניתן לבחור מהיום'
                      : config?.minDaysFromToday === 1
                        ? isEndDate
                          ? 'ניתן לבחור מיום למחרת תאריך התחלה'
                          : 'ניתן לבחור ממחר'
                        : `ניתן לבחור מ-${config?.minDaysFromToday} ימים ${
                            isEndDate ? 'מתאריך התחלה' : 'מהיום'
                          }`
                  }
                />
              )}
            </Box>

            {/* Day of week validation */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableDayOfWeekValidation}
                    onChange={(e) => handleDayOfWeekToggle(e.target.checked)}
                  />
                }
                label='הגבלת ימים בשבוע'
              />

              {enableDayOfWeekValidation && (
                <FormControl sx={{ mt: 1, minWidth: 250 }} size='small'>
                  <InputLabel>ימים מותרים</InputLabel>
                  <Select
                    multiple
                    value={config?.allowedDaysOfWeek || []}
                    onChange={handleDayOfWeekChange}
                    input={<OutlinedInput label='ימים מותרים' />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as DayOfWeek[]).map((value) => (
                          <Chip
                            key={value}
                            label={dayOfWeekOptions.find((opt) => opt.value === value)?.label}
                            size='small'
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {dayOfWeekOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        ולידציות טווח תאריכים
      </Typography>

      {renderValidationSection(
        'תאריך התחלה',
        validations.startDate,
        updateStartDateValidation,
        false
      )}

      {renderValidationSection('תאריך סיום', validations.endDate, updateEndDateValidation, true)}

      {!validations.startDate && !validations.endDate && (
        <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 2 }}>
          לא מוגדרות ולידציות לטווח התאריכים
        </Typography>
      )}
    </Stack>
  )
}

export default DateRangeValidationPanel
