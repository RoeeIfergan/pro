import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'

export const organizations = pgTable('organizations', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  ...WithModificationDates
})
export type OrganizationEntity = InferSelectModel<typeof organizations>
export type OrganizationEntityInsert = InferInsertModel<typeof organizations>
