import {
  FieldComponentType,
  IInputLayoutField,
  JsonCondition,
  SingleCondition,
  ConditionGroup,
  ConditionOperator,
  LogicalOperator,
  IconType,
  DefaultSchema
} from '../types'

import React from 'react'
import { iconMap } from '../constants'

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
const getNestedValue = <Schema = DefaultSchema>(obj: Schema, path: string) => {
  return path.split('.').reduce(
    (current, key) => {
      return (
        current && current[key as keyof Schema] !== undefined
          ? current[key as keyof Schema]
          : undefined
      ) as Schema | undefined
    },
    obj as unknown as Schema | undefined
  )
}

// Evaluate a single condition
const evaluateSingleCondition = <Schema = DefaultSchema>(
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
const isSingleCondition = <Schema = DefaultSchema>(
  condition: SingleCondition<Schema> | ConditionGroup<Schema>
): condition is SingleCondition<Schema> => {
  return 'field' in condition && 'operator' in condition
}

// Helper function to evaluate a single condition or group recursively
const evaluateConditionOrGroup = <Schema = DefaultSchema>(
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
export const evaluateJsonCondition = <Schema = DefaultSchema>(
  condition: JsonCondition<Schema>,
  values: Schema
): boolean => {
  // JsonCondition is always a ConditionGroup now
  return evaluateConditionOrGroup(condition, values)
}

// Universal condition evaluator that handles JSON conditions only
export const evaluateCondition = <Schema = DefaultSchema>(
  condition: JsonCondition<Schema>,
  values: Schema
): boolean => {
  return evaluateJsonCondition(condition, values)
}

// Helper to evaluate hidden condition - returns true if should be hidden
export const evaluateHidden = <Schema = DefaultSchema>(
  hidden: JsonCondition<Schema> | undefined,
  values: Schema
): boolean => {
  if (!hidden) return false
  return evaluateCondition(hidden, values)
}

// Helper to evaluate disabled condition - returns true if should be disabled
export const evaluateDisabled = <Schema = DefaultSchema>(
  disabled: JsonCondition<Schema> | undefined,
  values: Schema
): boolean => {
  if (!disabled) return false
  return evaluateCondition(disabled, values)
}

// Get React component from IconType enum
export const getIconComponent = (iconType: IconType): React.ComponentType => {
  return iconMap[iconType]
}

// export const getTypedField = <Schema = DefaultSchema>(field: ILayoutField<Schema>) => {
//   field
// }
