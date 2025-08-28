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
import _get from 'lodash/get'
import { keyframes, Theme } from '@mui/material'

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

// Helper function to safely convert value to number
const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string') {
    const num = parseFloat(value.trim())
    return isNaN(num) ? null : num
  }
  return null
}

// Helper function to safely convert value to string
const toString = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  return String(value)
}

// Helper function to check if value is considered empty
const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0
  }
  return false
}

// Evaluate a single condition
const evaluateSingleCondition = <Schema = DefaultSchema>(
  condition: SingleCondition<Schema>,
  values: Schema,
  context?: Record<string, unknown>
): boolean => {
  // Determine the data source based on isContext flag
  const dataSource = 'isContext' in condition && condition.isContext ? context : values
  const fieldValue = _get(dataSource, condition.field as string)
  const { operator, value } = condition

  if (condition.isContext) {
    console.log('condition.field', condition.field)
    console.log('context', context)
    console.log('dataSource', dataSource)
    console.log('fieldValue', fieldValue)
  }

  try {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return fieldValue === value
      case ConditionOperator.NOT_EQUALS:
        return fieldValue !== value
      case ConditionOperator.GREATER_THAN: {
        const fieldNum = toNumber(fieldValue)
        const conditionNum = toNumber(value)
        return fieldNum !== null && conditionNum !== null && fieldNum > conditionNum
      }
      case ConditionOperator.LESS_THAN: {
        const fieldNum = toNumber(fieldValue)
        const conditionNum = toNumber(value)
        return fieldNum !== null && conditionNum !== null && fieldNum < conditionNum
      }
      case ConditionOperator.GREATER_OR_EQUAL: {
        const fieldNum = toNumber(fieldValue)
        const conditionNum = toNumber(value)
        return fieldNum !== null && conditionNum !== null && fieldNum >= conditionNum
      }
      case ConditionOperator.LESS_OR_EQUAL: {
        const fieldNum = toNumber(fieldValue)
        const conditionNum = toNumber(value)
        return fieldNum !== null && conditionNum !== null && fieldNum <= conditionNum
      }
      case ConditionOperator.CONTAINS: {
        const fieldStr = toString(fieldValue)
        const conditionStr = toString(value)
        return fieldStr.includes(conditionStr)
      }
      case ConditionOperator.NOT_CONTAINS: {
        const fieldStr = toString(fieldValue)
        const conditionStr = toString(value)
        return !fieldStr.includes(conditionStr)
      }
      case ConditionOperator.IS_EMPTY:
        return isEmpty(fieldValue)
      case ConditionOperator.IS_NOT_EMPTY:
        return !isEmpty(fieldValue)
      case ConditionOperator.IS_TRUE:
        // Handle string 'true', boolean true, and number 1
        return fieldValue === true || fieldValue === 'true' || fieldValue === 1
      case ConditionOperator.IS_FALSE:
        // Handle string 'false', boolean false, and number 0
        return fieldValue === false || fieldValue === 'false' || fieldValue === 0
      default:
        console.warn(`Unknown condition operator: ${operator}`)
        return false
    }
  } catch (error) {
    console.error(`Error evaluating condition:`, { condition, fieldValue, error })
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
  values: Schema,
  context?: Record<string, unknown>
): boolean => {
  if (!condition) {
    return false
  }

  if (isSingleCondition(condition)) {
    return evaluateSingleCondition(condition, values, context)
  }

  const group = condition
  const results = group.conditions.map((subCondition) =>
    evaluateCondition(subCondition, values, context)
  )
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

const dashMove = keyframes`
  0% {
    background-position: 0 0, 0 0, 100% 0, 0 100%;
  }
  100% {
    background-position: 0 16px, -16px 0, 100% -16px, 16px 100%;
  }
`

export const getHighlightStyles = ({
  isHighlighted,
  isHovered,
  primaryColor,
  theme
}: {
  isHighlighted: boolean
  isHovered: boolean
  primaryColor: string
  theme: Theme
}) => {
  let styles: Record<string, unknown> = { position: 'relative' }

  if (isHighlighted) {
    // Editing highlight - animated dashed border
    styles = {
      ...styles,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-4px',
        left: '-4px',
        right: '-4px',
        bottom: '-4px',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: 1,
        // Create the animated dashed border using linear gradients
        background: `
          repeating-linear-gradient(
            0deg,
            ${primaryColor},
            ${primaryColor} 8px,
            transparent 8px,
            transparent 16px
          ),
          repeating-linear-gradient(
            90deg,
            ${primaryColor},
            ${primaryColor} 8px,
            transparent 8px,
            transparent 16px
          ),
          repeating-linear-gradient(
            180deg,
            ${primaryColor},
            ${primaryColor} 8px,
            transparent 8px,
            transparent 16px
          ),
          repeating-linear-gradient(
            270deg,
            ${primaryColor},
            ${primaryColor} 8px,
            transparent 8px,
            transparent 16px
          )
        `,
        backgroundSize: '2px 100%, 100% 2px, 2px 100%, 100% 2px',
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'no-repeat',
        animation: `${dashMove} 1s linear infinite`
      }
    }
  } else if (isHovered) {
    // Hover highlight - solid border with subtle background
    styles = {
      ...styles,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        borderRadius: '6px',
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: theme.palette.action.hover,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.7
      }
    }
  }

  return styles
}
