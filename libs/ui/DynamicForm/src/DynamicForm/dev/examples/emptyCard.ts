import z from 'zod'

import { ICardSchemaMeta, ICollection } from '../../types'

export const uiSchema: ICardSchemaMeta = {
  rows: []
}

export const emptyCard: ICollection = {
  name: 'New Card',
  schema: z.object({}),
  defaultValues: {},
  uiSchema,
  context: {}
}
