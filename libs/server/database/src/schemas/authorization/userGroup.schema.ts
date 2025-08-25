import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'

export const userGroups = pgTable('userGroups', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  ...WithModificationDates
})
export type UserGroupEntity = InferSelectModel<typeof userGroups>
export type UserGroupEntityInsert = InferInsertModel<typeof userGroups>
