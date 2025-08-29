import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { screens } from './screen.schema.ts'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { userGroups } from '../authorization/userGroup.schema.ts'

export const steps = pgTable(
  'steps',
  {
    ...WithIdPk,
    name: varchar('name', { length: 256 }).notNull(),
    screenId: uuid('screen_id').notNull(),
    ...WithModificationDates
  }
  // ,
  // (step) => [unique().on(step.id, step.screenId)
  // ]
)
export type StepEntity = InferSelectModel<typeof steps>
export type StepEntityInsert = InferInsertModel<typeof steps>

export const stepsToUserGroups = pgTable(
  'steps_to_user_groups',
  {
    stepId: uuid('step_id').notNull(),
    userGroupId: uuid('user_group_id').notNull()
  },
  (table) => [
    primaryKey({ columns: [table.stepId, table.userGroupId] })
    // unique().on(table.stepId, table.userGroupId)
  ]
)
export type StepsToUserGroupsEntity = InferSelectModel<typeof stepsToUserGroups>

export const stepsRelations = relations(steps, ({ one, many }) => ({
  screen: one(screens, {
    fields: [steps.screenId],
    references: [screens.id]
  }),
  userGroups: many(stepsToUserGroups)
}))

export const stepsToUserGroupsRelations = relations(stepsToUserGroups, ({ one }) => ({
  userGroup: one(userGroups, {
    fields: [stepsToUserGroups.userGroupId],
    references: [userGroups.id]
  }),
  step: one(steps, {
    fields: [stepsToUserGroups.stepId],
    references: [steps.id]
  })
}))
