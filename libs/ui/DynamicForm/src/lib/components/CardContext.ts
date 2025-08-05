import { createContext } from 'react'
import { ICardSchema } from '../dev/testSchema'
import { z } from 'zod'
import { ICardSchemaMeta } from '../types/types'

export const CardContext = createContext<{
  schema: z.Schema<ICardSchema>
  uiSchema: ICardSchemaMeta
}>({
  schema: {} as z.Schema<ICardSchema>,
  uiSchema: {} as ICardSchemaMeta
})
