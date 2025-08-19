import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { screens } from './screen.schema.ts'

export const steps = pgTable('steps', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  screenId: uuid('screen_id')
    .references(() => screens.id)
    .notNull(),
  ...WithModificationDates
})

export type StepEntity = InferSelectModel<typeof steps>
export type StepEntityInsert = InferInsertModel<typeof steps>
