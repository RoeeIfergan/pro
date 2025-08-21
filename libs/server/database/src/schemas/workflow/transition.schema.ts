import { foreignKey, pgTable, uuid } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { screens } from './screen.schema.ts'
import { steps } from './step.schema.ts'

export const transitions = pgTable(
  'transitions',
  {
    ...WithIdPk,
    fromStepId: uuid('from_step_id').notNull(),
    toStepId: uuid('to_step_id').notNull(),
    screenId: uuid('screen_id')
      .references(() => screens.id)
      .notNull(),
    ...WithModificationDates
  },
  (t) => ({
    // Enforce fromStep matches the same screen
    fkFromStepSameScreen: foreignKey({
      name: 'fk_transitions_from_step_same_screen',
      columns: [t.fromStepId, t.screenId],
      foreignColumns: [steps.id, steps.screenId]
    }),
    // Enforce toStep matches the same screen
    fkToStepSameScreen: foreignKey({
      name: 'fk_transitions_to_step_same_screen',
      columns: [t.toStepId, t.screenId],
      foreignColumns: [steps.id, steps.screenId]
    })
  })
)

export type TransitionEntity = InferSelectModel<typeof transitions>
export type TransitionEntityInsert = InferInsertModel<typeof transitions>
