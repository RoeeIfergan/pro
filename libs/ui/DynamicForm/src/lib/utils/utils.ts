import {
  FieldComponentType,
  IInputLayoutField,
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

const isSingleCondition = <Schema = DefaultSchema>(
  condition: SingleCondition<Schema> | ConditionGroup<Schema>
): condition is SingleCondition<Schema> => {
  return 'field' in condition
}

export const evaluateCondition = <Schema = DefaultSchema>(
  condition: SingleCondition<Schema> | ConditionGroup<Schema> | undefined,
  values: Schema
): boolean => {
  if (!condition) {
    return false
  }

  if (isSingleCondition(condition)) {
    return evaluateSingleCondition(condition, values)
  }

  const group = condition
  const results = group.conditions.map((subCondition) => evaluateCondition(subCondition, values))
  const operator = group.operator ?? LogicalOperator.AND

  if (operator === LogicalOperator.AND) {
    return results.every((result) => result)
  } else if (operator === LogicalOperator.OR) {
    return results.some((result) => result)
  }

  return false
}

export const getIconComponent = (iconType: IconType): React.ComponentType => {
  return iconMap[iconType]
}
