import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { screens } from './screen.schema.ts'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { userGroups } from '../authorization/userGroup.schema.ts'

export const steps = pgTable(
  'steps',
  {
    ...WithIdPk,
    name: varchar('name', { length: 256 }).notNull(),
    screenId: uuid('screen_id')
      .references(() => screens.id)
      .notNull(),
    ...WithModificationDates
  },
  (step) => [unique().on(step.id, step.screenId)]
)

export const stepsToUserGroups = pgTable('steps_to_user_groups', {
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),
  userGroupId: uuid('user_group_id')
    .notNull()
    .references(() => userGroups.id)
})

export type StepEntity = InferSelectModel<typeof steps>
export type StepEntityInsert = InferInsertModel<typeof steps>
