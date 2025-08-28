import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Chip,
  Stack,
  Collapse,
  Switch,
  FormControlLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  ConditionGroup,
  SingleCondition,
  LogicalOperator,
  DefaultSchema,
  Paths
} from '../../../../DynamicForm/types'
import { ConditionOperator } from '../../../../DynamicForm/types/enums'
import SingleConditionEditor from './SingleConditionEditor'

interface ConditionsManagerProps<Schema = DefaultSchema> {
  label: string
  value?: ConditionGroup<Schema>
  onChange: (conditionGroup?: ConditionGroup<Schema>) => void
  availableFields: string[]
  helperText?: string
}

const ConditionsManager = <Schema extends DefaultSchema = DefaultSchema>({
  label,
  value,
  onChange,
  availableFields,
  helperText
}: ConditionsManagerProps<Schema>) => {
  const [isExpanded, setIsExpanded] = useState(!!value?.conditions?.length)
  const [isEnabled, setIsEnabled] = useState(!!value)

  const handleSwitchChange = (checked: boolean) => {
    setIsEnabled(checked)

    if (!checked) {
      // Switch is OFF - remove all conditions
      onChange(undefined)
      setIsExpanded(false)
    } else {
      // Switch is ON - create empty boilerplate condition
      const newCondition: SingleCondition<Schema> = {
        field: availableFields[0] as Paths<Schema>,
        isContext: false,
        operator: ConditionOperator.EQUALS,
        value: ''
      }

      const newConditionGroup: ConditionGroup<Schema> = {
        operator: LogicalOperator.AND,
        conditions: [newCondition]
      }

      onChange(newConditionGroup)
      setIsExpanded(true)
    }
  }

  const handleOperatorChange = (operator: LogicalOperator) => {
    const updated: ConditionGroup<Schema> = {
      ...value,
      operator,
      conditions: value?.conditions || []
    }
    onChange(updated)
  }

  const handleAddCondition = () => {
    const newCondition: SingleCondition<Schema> = {
      field: availableFields[0] as Paths<Schema>,
      isContext: false,
      operator: ConditionOperator.EQUALS,
      value: ''
    }

    const updated: ConditionGroup<Schema> = {
      operator: value?.operator || LogicalOperator.AND,
      conditions: [...(value?.conditions || []), newCondition]
    }
    onChange(updated)
    setIsExpanded(true)
  }

  const handleRemoveCondition = (index: number) => {
    if (!value?.conditions) return

    const updatedConditions = value.conditions.filter((_, i) => i !== index)

    if (updatedConditions.length === 0) {
      onChange(undefined)
      setIsExpanded(false)
    } else {
      const updated: ConditionGroup<Schema> = {
        ...value,
        conditions: updatedConditions
      }
      onChange(updated)
    }
  }

  const handleConditionChange = (index: number, condition: SingleCondition<Schema>) => {
    if (!value?.conditions) return

    const updatedConditions = [...value.conditions]
    updatedConditions[index] = condition

    const updated: ConditionGroup<Schema> = {
      ...value,
      conditions: updatedConditions
    }
    onChange(updated)
  }

  const conditionsCount = value?.conditions?.length || 0
  const hasConditions = conditionsCount > 0

  return (
    <Box>
      {/* Switch to enable/disable conditions */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={(e) => handleSwitchChange(e.target.checked)}
              size='small'
            />
          }
          label={
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
          }
        />
      </Box>

      {/* Show condition editing UI only when enabled */}
      {isEnabled && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasConditions && (
              <Chip
                size='small'
                label={`${conditionsCount} תנאי${conditionsCount > 1 ? 'ם' : ''}`}
                color='primary'
                variant='outlined'
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddCondition}
              variant='outlined'
            >
              הוסף תנאי
            </Button>

            {hasConditions && (
              <IconButton
                size='small'
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s'
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      {isEnabled && (
        <>
          {helperText && (
            <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
              {helperText}
            </Typography>
          )}

          <Collapse in={isExpanded && hasConditions}>
            <Paper variant='outlined' sx={{ p: 2 }}>
              {/* Logical Operator Selection */}
              {conditionsCount > 1 && (
                <Box sx={{ mb: 2 }}>
                  <FormControl size='small' sx={{ minWidth: 120 }}>
                    <InputLabel>אופרטור לוגי</InputLabel>
                    <Select
                      value={value?.operator || LogicalOperator.AND}
                      label='אופרטור לוגי'
                      onChange={(e) => handleOperatorChange(e.target.value as LogicalOperator)}
                    >
                      <MenuItem value={LogicalOperator.AND}>AND (וגם)</MenuItem>
                      <MenuItem value={LogicalOperator.OR}>OR (או)</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {value?.operator === LogicalOperator.OR
                      ? 'השדה יוסתר/יונטרל אם אחד או יותר מהתנאים מתקיימים'
                      : 'השדה יוסתר/יונטרל רק אם כל התנאים מתקיימים'}
                  </Typography>
                </Box>
              )}

              {/* Conditions List */}
              <Stack spacing={2}>
                {value?.conditions?.map((condition, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <SingleConditionEditor
                          condition={condition as SingleCondition<Schema>}
                          onChange={(updatedCondition) =>
                            handleConditionChange(index, updatedCondition)
                          }
                          availableFields={availableFields}
                          index={index}
                        />
                      </Box>

                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleRemoveCondition(index)}
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Box>

                    {index < conditionsCount - 1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography
                          variant='caption'
                          sx={{
                            mx: 2,
                            px: 1,
                            py: 0.5,
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            fontWeight: 600
                          }}
                        >
                          {value?.operator === LogicalOperator.OR ? 'OR' : 'AND'}
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Collapse>

          {!hasConditions && (
            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 2 }}>
              לא הוגדרו תנאים. השדה יהיה תמיד זמין.
            </Typography>
          )}
        </>
      )}
    </Box>
  )
}

export default ConditionsManager
