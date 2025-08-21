import { ICardSchemaMeta, IFieldRow, ILayoutField } from '../../lib/types'

export type ILayoutFieldWithIds<Schema = Record<string, unknown>> = ILayoutField<Schema> & {
  _id: string
}

export type IFieldRowWithIds<Schema = Record<string, unknown>> = Omit<
  IFieldRow<Schema>,
  'fields'
> & {
  _id: string
  fields: Array<ILayoutFieldWithIds<Schema>>
}

export type ICardSchemaMetaWithIds<Schema = Record<string, unknown>> = Omit<
  ICardSchemaMeta<Schema>,
  'layout'
> & {
  layout: Array<IFieldRowWithIds<Schema>>
}
