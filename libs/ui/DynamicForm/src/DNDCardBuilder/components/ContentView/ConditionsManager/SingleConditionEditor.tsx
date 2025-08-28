import { useState } from 'react'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  ButtonGroup,
  Button
} from '@mui/material'
import {
  SingleCondition,
  ConditionOperator,
  ConditionValue,
  DefaultSchema
} from '../../../../DynamicForm/types'

interface SingleConditionEditorProps<Schema = DefaultSchema> {
  condition: SingleCondition<Schema>
  onChange: (condition: SingleCondition<Schema>) => void
  availableFields: string[]
  index: number
}

const conditionOperatorLabels: Record<ConditionOperator, string> = {
  [ConditionOperator.EQUALS]: 'שווה ל',
  [ConditionOperator.NOT_EQUALS]: 'לא שווה ל',
  [ConditionOperator.GREATER_THAN]: 'גדול מ',
  [ConditionOperator.LESS_THAN]: 'קטן מ',
  [ConditionOperator.GREATER_OR_EQUAL]: 'גדול או שווה ל',
  [ConditionOperator.LESS_OR_EQUAL]: 'קטן או שווה ל',
  [ConditionOperator.CONTAINS]: 'מכיל',
  [ConditionOperator.NOT_CONTAINS]: 'לא מכיל',
  [ConditionOperator.IS_EMPTY]: 'ריק',
  [ConditionOperator.IS_NOT_EMPTY]: 'לא ריק',
  [ConditionOperator.IS_TRUE]: 'אמת',
  [ConditionOperator.IS_FALSE]: 'שקר'
}

// Operators that don't need a value input
const VALUE_LESS_OPERATORS = [
  ConditionOperator.IS_EMPTY,
  ConditionOperator.IS_NOT_EMPTY,
  ConditionOperator.IS_TRUE,
  ConditionOperator.IS_FALSE
]

// Operators that work with numeric values
const NUMERIC_OPERATORS = [
  ConditionOperator.GREATER_THAN,
  ConditionOperator.LESS_THAN,
  ConditionOperator.GREATER_OR_EQUAL,
  ConditionOperator.LESS_OR_EQUAL
]

// Operators that only work with boolean values
const BOOLEAN_ONLY_OPERATORS = [ConditionOperator.IS_TRUE, ConditionOperator.IS_FALSE]

type ValueType = 'string' | 'number' | 'boolean'

const getValueType = (value: ConditionValue | undefined): ValueType => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return 'string'
}

const SingleConditionEditor = <Schema extends DefaultSchema = DefaultSchema>({
  condition,
  onChange,
  availableFields,
  index
}: SingleConditionEditorProps<Schema>) => {
  const [valueType, setValueType] = useState<ValueType>(() => getValueType(condition.value))

  const handleFieldChange = (field: string) => {
    if ('isContext' in condition && condition.isContext) {
      // Context condition
      onChange({
        field: field,
        isContext: true,
        operator: condition.operator,
        value: condition.value
      } as SingleCondition<Schema>)
    } else {
      // Schema field condition
      onChange({
        field: field as SingleCondition<Schema>['field'],
        isContext: false,
        operator: condition.operator,
        value: condition.value
      } as SingleCondition<Schema>)
    }
  }

  const handleIsContextChange = (isContext: boolean) => {
    if (isContext) {
      // Converting to context condition
      onChange({
        field: String(condition.field),
        isContext: true,
        operator: condition.operator,
        value: condition.value
      } as SingleCondition<Schema>)
    } else {
      // Converting to schema field condition
      onChange({
        field: String(condition.field) as SingleCondition<Schema>['field'],
        isContext: false,
        operator: condition.operator,
        value: condition.value
      } as SingleCondition<Schema>)
    }
  }

  const handleOperatorChange = (operator: ConditionOperator) => {
    const updatedCondition = {
      ...condition,
      operator
    }

    // Reset value for operators that don't need a value
    if (VALUE_LESS_OPERATORS.includes(operator)) {
      updatedCondition.value = undefined
      setValueType('string') // Reset to default
    }
    // For boolean-only operators, convert existing value to boolean or set default
    else if (BOOLEAN_ONLY_OPERATORS.includes(operator)) {
      if (condition.value === undefined || condition.value === null) {
        updatedCondition.value = false
      } else {
        // Convert existing value to boolean more intelligently
        const currentValue = condition.value
        if (typeof currentValue === 'boolean') {
          updatedCondition.value = currentValue
        } else if (typeof currentValue === 'string') {
          updatedCondition.value = currentValue.toLowerCase() === 'true' || currentValue === '1'
        } else if (typeof currentValue === 'number') {
          updatedCondition.value = currentValue !== 0
        } else {
          updatedCondition.value = false
        }
      }
      setValueType('boolean')
    }
    // For numeric operators, try to convert existing value or set intelligent default
    else if (NUMERIC_OPERATORS.includes(operator)) {
      if (condition.value === undefined || condition.value === null) {
        updatedCondition.value = '' // Let user enter value instead of defaulting to 0
      } else if (typeof condition.value === 'string') {
        const num = parseFloat(condition.value.trim())
        updatedCondition.value = isNaN(num) ? '' : num
      } else if (typeof condition.value === 'boolean') {
        updatedCondition.value = condition.value ? 1 : 0
      } else if (typeof condition.value === 'number') {
        updatedCondition.value = condition.value
      }
      setValueType('number')
    }
    // For other operators (EQUALS, NOT_EQUALS, CONTAINS, NOT_CONTAINS), keep existing value or set default
    else if (!VALUE_LESS_OPERATORS.includes(operator)) {
      if (condition.value === undefined || condition.value === null) {
        updatedCondition.value = ''
      }
      // Keep current value type if reasonable, otherwise default to string
      if (typeof condition.value === 'string' || condition.value === undefined) {
        setValueType('string')
      } else if (typeof condition.value === 'number') {
        setValueType('number')
      } else if (typeof condition.value === 'boolean') {
        setValueType('boolean')
      }
    }

    onChange(updatedCondition)
  }

  const handleValueChange = (value: ConditionValue) => {
    onChange({
      ...condition,
      value
    })
  }

  const handleValueTypeChange = (newType: ValueType) => {
    setValueType(newType)

    // Convert existing value to new type intelligently
    let convertedValue: ConditionValue = ''

    if (newType === 'boolean') {
      const currentValue = condition.value
      if (typeof currentValue === 'boolean') {
        convertedValue = currentValue
      } else if (typeof currentValue === 'string') {
        const lowerValue = currentValue.toLowerCase().trim()
        convertedValue = lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes'
      } else if (typeof currentValue === 'number') {
        convertedValue = currentValue !== 0
      } else {
        convertedValue = false
      }
    } else if (newType === 'number') {
      const currentValue = condition.value
      if (typeof currentValue === 'number') {
        convertedValue = currentValue
      } else if (typeof currentValue === 'string') {
        const num = parseFloat(currentValue.trim())
        convertedValue = isNaN(num) ? '' : num
      } else if (typeof currentValue === 'boolean') {
        convertedValue = currentValue ? 1 : 0
      } else {
        convertedValue = ''
      }
    } else {
      // Convert to string
      if (condition.value === null || condition.value === undefined) {
        convertedValue = ''
      } else {
        convertedValue = String(condition.value)
      }
    }

    handleValueChange(convertedValue)
  }

  const needsValueInput = !VALUE_LESS_OPERATORS.includes(condition.operator)
  const isBooleanOnlyOperator = BOOLEAN_ONLY_OPERATORS.includes(condition.operator)
  const canChooseValueType = needsValueInput && !isBooleanOnlyOperator

  const renderValueInput = () => {
    if (!needsValueInput) {
      return null
    }

    const renderInput = () => {
      switch (valueType) {
        case 'boolean':
          return (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(condition.value)}
                  onChange={(e) => handleValueChange(e.target.checked)}
                />
              }
              label={condition.value ? 'אמת' : 'שקר'}
            />
          )
        case 'number':
          return (
            <TextField
              label='ערך מספרי'
              value={condition.value ?? ''}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  handleValueChange('')
                } else {
                  const numericValue = Number(value)
                  if (!isNaN(numericValue)) {
                    handleValueChange(numericValue)
                  } else {
                    // Keep the string value for partial input (e.g., "3.", "-", etc.)
                    handleValueChange(value)
                  }
                }
              }}
              onBlur={(e) => {
                // On blur, ensure we have a valid number or empty string
                const value = e.target.value
                if (value === '') {
                  handleValueChange('')
                } else {
                  const numericValue = parseFloat(value)
                  handleValueChange(isNaN(numericValue) ? 0 : numericValue)
                }
              }}
              type='number'
              size='small'
              fullWidth
              placeholder='הכנס מספר'
            />
          )
        case 'string':
        default:
          return (
            <TextField
              label='ערך טקסט'
              value={condition.value ?? ''}
              onChange={(e) => handleValueChange(e.target.value)}
              type='text'
              size='small'
              fullWidth
              placeholder='הכנס ערך'
            />
          )
      }
    }

    return (
      <Box>
        {canChooseValueType && (
          <Box sx={{ mb: 1 }}>
            <Typography variant='caption' sx={{ mb: 0.5, display: 'block' }}>
              סוג ערך:
            </Typography>
            <ButtonGroup size='small' variant='outlined'>
              <Button
                variant={valueType === 'string' ? 'contained' : 'outlined'}
                onClick={() => handleValueTypeChange('string')}
              >
                טקסט
              </Button>
              <Button
                variant={valueType === 'number' ? 'contained' : 'outlined'}
                onClick={() => handleValueTypeChange('number')}
              >
                מספר
              </Button>
              <Button
                variant={valueType === 'boolean' ? 'contained' : 'outlined'}
                onClick={() => handleValueTypeChange('boolean')}
              >
                בוליאני
              </Button>
            </ButtonGroup>
          </Box>
        )}
        {renderInput()}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}
    >
      <Typography
        variant='caption'
        color='primary'
        sx={{ fontWeight: 600, mb: 1, display: 'block' }}
      >
        תנאי #{index + 1}
      </Typography>

      {/* isContext Toggle */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={'isContext' in condition && condition.isContext === true}
              onChange={(e) => handleIsContextChange(e.target.checked)}
              size='small'
            />
          }
          label={
            <Typography variant='body2' sx={{ fontWeight: 500 }}>
              {'isContext' in condition && condition.isContext === true
                ? 'שדה מהקונטקסט'
                : 'שדה מהסכמה'}
            </Typography>
          }
        />
        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
          {'isContext' in condition && condition.isContext === true
            ? 'התנאי ייבדק לפי ערכים בקונטקסט (למשל: user.role)'
            : 'התנאי ייבדק לפי ערכים בסכמת הטופס'}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'flex-end'
        }}
      >
        <Box sx={{ flex: { sm: 1 } }}>
          {'isContext' in condition && condition.isContext === true ? (
            // Context field - free text input
            <TextField
              label='שדה קונטקסט'
              value={String(condition.field || '')}
              onChange={(e) => handleFieldChange(e.target.value)}
              size='small'
              fullWidth
              placeholder='user.role, session.userId, etc.'
              helperText='הכנס נתיב לשדה בקונטקסט (למשל: user.role)'
            />
          ) : (
            // Schema field - autocomplete with available fields
            <Autocomplete
              freeSolo
              options={availableFields}
              value={String(condition.field || '')}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  handleFieldChange(newValue)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='שדה מהסכמה'
                  size='small'
                  onBlur={(e) => handleFieldChange(e.target.value)}
                  fullWidth
                  helperText='בחר שדה מהטופס'
                />
              )}
            />
          )}
        </Box>

        <Box sx={{ flex: { sm: 1 } }}>
          <FormControl fullWidth size='small'>
            <InputLabel>אופרטור</InputLabel>
            <Select
              value={condition.operator}
              label='אופרטור'
              onChange={(e) => handleOperatorChange(e.target.value as ConditionOperator)}
            >
              {Object.entries(conditionOperatorLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {needsValueInput && <Box sx={{ flex: { sm: 1 } }}>{renderValueInput()}</Box>}
      </Box>
    </Box>
  )
}

export default SingleConditionEditor
