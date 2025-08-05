import { FieldComponentType, IInputLayoutField } from '../types/types'
import { z } from 'zod'

// Helper function to convert camelCase/snake_case to readable labels
export const formatFieldLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim()
}

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

// Helper function to infer input type from Zod schema
export const getInputTypeFromSchema = (schema: any, fieldPath: string): string => {
  try {
    // Navigate to the specific field in the schema
    const fieldSchema = getFieldSchema(schema, fieldPath)

    if (!fieldSchema) return 'text'

    // Unwrap nullable/optional wrappers
    let unwrapped = fieldSchema
    while (
      unwrapped._def?.typeName === 'ZodOptional' ||
      unwrapped._def?.typeName === 'ZodNullable'
    ) {
      unwrapped = unwrapped._def.innerType
    }

    // Check for specific Zod types
    if (unwrapped._def?.typeName === 'ZodString') {
      // Check for string refinements/validations
      const checks = unwrapped._def.checks || []
      for (const check of checks) {
        if (check.kind === 'email') return 'email'
        if (check.kind === 'url') return 'url'
      }
      return 'text'
    }

    if (unwrapped._def?.typeName === 'ZodNumber') {
      return 'number'
    }

    if (unwrapped._def?.typeName === 'ZodBoolean') {
      return 'checkbox'
    }

    if (unwrapped._def?.typeName === 'ZodEnum' || unwrapped._def?.typeName === 'ZodArray') {
      return 'select'
    }

    return 'text'
  } catch (error) {
    console.warn(`Could not infer type for field ${fieldPath}:`, error)
    return 'text'
  }
}

// Helper to navigate nested schema paths
const getFieldSchema = (schema: any, fieldPath: string): any => {
  const pathParts = fieldPath.split('.')
  let currentSchema = schema

  for (const part of pathParts) {
    // Unwrap nullable/optional wrappers
    while (
      currentSchema._def?.typeName === 'ZodOptional' ||
      currentSchema._def?.typeName === 'ZodNullable'
    ) {
      currentSchema = currentSchema._def.innerType
    }

    if (currentSchema._def?.typeName === 'ZodObject') {
      const shape = currentSchema._def.shape()
      if (shape[part]) {
        currentSchema = shape[part]
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return currentSchema
}

// Generic utility for creating defaults from any Zod schema
export const createDefaultsFromSchema = <T>(schema: z.ZodType<T>): T => {
  return schema.parse({})
}

// Generic utility with safe parsing
export const createDefaultsFromSchemaSafe = <T>(schema: z.ZodType<T>): T | null => {
  const result = schema.safeParse({})
  return result.success ? result.data : null
}

// Generic utility with partial overrides
export const createDefaultsWithOverrides = <T>(
  schema: z.ZodType<T>,
  overrides: Partial<T> = {}
): T => {
  const defaults = schema.parse({})
  return { ...defaults, ...overrides }
}
