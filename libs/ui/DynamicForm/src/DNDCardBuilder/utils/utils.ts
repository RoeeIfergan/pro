import { IFieldRow } from '../../DynamicForm/types'
import { ICardSchemaMeta } from '../../DynamicForm/types'

export const createId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const withStableIds = (schema: ICardSchemaMeta): ICardSchemaMeta => {
  return {
    ...schema,
    rows: schema.rows.map((row) => ({
      ...(row as Record<string, unknown>),
      _id: (row as Record<string, unknown>)._id ?? createId(),
      fields: (row.fields ?? []).map((f) => ({
        ...(f as Record<string, unknown>),
        _id: (f as Record<string, unknown>)._id ?? createId()
      }))
    })) as unknown as IFieldRow[]
  }
}
