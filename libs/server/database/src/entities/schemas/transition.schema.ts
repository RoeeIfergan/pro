import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { screens } from './screen.schema.ts'
import { steps } from './step.schema.ts'

export const transitions = pgTable('transitions', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  fromStepId: uuid('from_step_id')
    .references(() => steps.id)
    .notNull(),
  toStepId: uuid('to_step_id')
    .references(() => steps.id)
    .notNull(),
  screenId: uuid('screen_id')
    .references(() => screens.id)
    .notNull(),
  ...WithModificationDates
})

export type TransitionEntity = InferSelectModel<typeof transitions>
export type TransitionEntityInsert = InferInsertModel<typeof transitions>
