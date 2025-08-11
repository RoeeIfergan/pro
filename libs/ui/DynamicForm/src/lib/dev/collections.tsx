import { cardSchema } from './testSchema'
import { uiSchema } from './uiSchema'
import { multiSelectFields } from './examples/multiSelectFields'
import { layoutExamples } from './examples/layoutExamples'
import { QueryClient } from '@tanstack/react-query'
import { ICardSchemaMeta } from '../types/types'
import { z } from 'zod'

export type ICollection<T extends unknown = unknown> = {
  name: string
  schema: z.ZodType<T, unknown>
  defaultValues: T
  uiSchema: ICardSchemaMeta<T>
}

export const getCollections = (queryClient: QueryClient): ICollection[] => {
  return [
    {
      name: 'Complete Schema (Main)',
      schema: cardSchema({ queryClient }),
      defaultValues: cardSchema({ queryClient }).parse({}),
      uiSchema: uiSchema
    },
    multiSelectFields,
    layoutExamples
  ]
}
