import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from './step.schema.ts'
import { transitions } from './transition.schema.ts'

export const screens = pgTable('screens', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  ...WithModificationDates
})

export const screenRelations = relations(screens, ({ many }) => ({
  steps: many(steps),
  transitions: many(transitions)
}))

export type ScreenEntity = InferSelectModel<typeof screens>
export type ScreenEntityInsert = InferInsertModel<typeof screens>
