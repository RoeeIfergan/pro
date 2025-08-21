import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from '../workflow/step.schema.ts'

export const userGroups = pgTable('userGroups', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),
  ...WithModificationDates
})
export type UserGroupEntity = InferSelectModel<typeof userGroups>
export type UserGroupEntityInsert = InferInsertModel<typeof userGroups>
