import {
  FieldComponentType,
  IInputLayoutField,
  JsonCondition,
  SingleCondition,
  ConditionGroup,
  ConditionOperator,
  LogicalOperator,
  IconType
} from '../types/types'
import {
  Home,
  Settings,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Search,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Check,
  Close,
  Info,
  Warning,
  Error,
  CheckCircle
} from '@mui/icons-material'
import React from 'react'
import { z } from 'zod'

export const getInputType = (component: IInputLayoutField['component']): string => {
  switch (component) {
    case FieldComponentType.inputText:
      return 'text'
    case FieldComponentType.inputNumber:
      return 'number'
    case FieldComponentType.inputEmail:
      return 'email'
    case FieldComponentType.inputPassword:
      return 'password'
    case FieldComponentType.inputUrl:
      return 'url'
    default:
      return 'text'
  }
}

// Helper function to get nested value from object using dot notation
const getNestedValue = <Schema = Record<string, unknown>>(obj: Schema, path: string) => {
  return path.split('.').reduce((current, key) => {
    return (
      current && current[key as keyof Schema] !== undefined
        ? current[key as keyof Schema]
        : undefined
    ) as Schema | undefined
  }, obj as unknown as Schema | undefined)
}

// Evaluate a single condition
const evaluateSingleCondition = <Schema = Record<string, unknown>>(
  condition: SingleCondition<Schema>,
  values: Schema
): boolean => {
  const fieldValue = getNestedValue(values, condition.field as string)
  const { operator, value } = condition

  switch (operator) {
    case ConditionOperator.EQUALS:
      return fieldValue === value
    case ConditionOperator.NOT_EQUALS:
      return fieldValue !== value
    case ConditionOperator.GREATER_THAN:
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue > value
    case ConditionOperator.LESS_THAN:
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue < value
    case ConditionOperator.GREATER_OR_EQUAL:
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue >= value
    case ConditionOperator.LESS_OR_EQUAL:
      return typeof fieldValue === 'number' && typeof value === 'number' && fieldValue <= value
    case ConditionOperator.CONTAINS:
      return (
        typeof fieldValue === 'string' && typeof value === 'string' && fieldValue.includes(value)
      )
    case ConditionOperator.NOT_CONTAINS:
      return (
        typeof fieldValue === 'string' && typeof value === 'string' && !fieldValue.includes(value)
      )
    case ConditionOperator.IS_EMPTY:
      return (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) ? fieldValue.length === 0 : false)
      )
    case ConditionOperator.IS_NOT_EMPTY:
      return (
        fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== '' &&
        (Array.isArray(fieldValue) ? fieldValue.length > 0 : true)
      )
    case ConditionOperator.IS_TRUE:
      return fieldValue === true
    case ConditionOperator.IS_FALSE:
      return fieldValue === false
    default:
      return false
  }
}

// Type guard to check if condition is a single condition
const isSingleCondition = <Schema = Record<string, unknown>>(
  condition: SingleCondition<Schema> | ConditionGroup<Schema>
): condition is SingleCondition<Schema> => {
  return 'field' in condition && 'operator' in condition
}

// Helper function to evaluate a single condition or group recursively
const evaluateConditionOrGroup = <Schema = Record<string, unknown>>(
  condition: SingleCondition<Schema> | ConditionGroup<Schema>,
  values: Schema
): boolean => {
  if (isSingleCondition(condition)) {
    return evaluateSingleCondition(condition, values)
  }

  // Handle condition group
  const group = condition as ConditionGroup<Schema>
  const results = group.conditions.map((subCondition) =>
    evaluateConditionOrGroup(subCondition, values)
  )

  if (group.operator === LogicalOperator.AND) {
    return results.every((result) => result)
  } else if (group.operator === LogicalOperator.OR) {
    return results.some((result) => result)
  }

  return false
}

// Evaluate JSON conditions (now always a group)
export const evaluateJsonCondition = <Schema = Record<string, any>>(
  condition: JsonCondition<Schema>,
  values: Schema
): boolean => {
  // JsonCondition is always a ConditionGroup now
  return evaluateConditionOrGroup(condition, values)
}

// Universal condition evaluator that handles JSON conditions only
export const evaluateCondition = <Schema = Record<string, any>>(
  condition: JsonCondition<Schema>,
  values: Schema
): boolean => {
  return evaluateJsonCondition(condition, values)
}

// Helper to evaluate hidden condition - returns true if should be hidden
export const evaluateHidden = <Schema = Record<string, any>>(
  hidden: JsonCondition<Schema> | undefined,
  values: Schema
): boolean => {
  if (!hidden) return false
  return evaluateCondition(hidden, values)
}

// Helper to evaluate disabled condition - returns true if should be disabled
export const evaluateDisabled = <Schema = Record<string, any>>(
  disabled: JsonCondition<Schema> | undefined,
  values: Schema
): boolean => {
  if (!disabled) return false
  return evaluateCondition(disabled, values)
}

// Icon mapper for converting IconType enum to React components
const iconMap: Record<IconType, React.ComponentType> = {
  [IconType.HOME]: Home,
  [IconType.SETTINGS]: Settings,
  [IconType.PERSON]: Person,
  [IconType.EMAIL]: Email,
  [IconType.PHONE]: Phone,
  [IconType.LOCATION]: LocationOn,
  [IconType.CALENDAR]: CalendarToday,
  [IconType.SEARCH]: Search,
  [IconType.ADD]: Add,
  [IconType.EDIT]: Edit,
  [IconType.DELETE]: Delete,
  [IconType.SAVE]: Save,
  [IconType.CANCEL]: Cancel,
  [IconType.CHECK]: Check,
  [IconType.CLOSE]: Close,
  [IconType.INFO]: Info,
  [IconType.WARNING]: Warning,
  [IconType.ERROR]: Error,
  [IconType.SUCCESS]: CheckCircle
}

// Get React component from IconType enum
export const getIconComponent = (iconType: IconType): React.ComponentType => {
  return iconMap[iconType]
}
