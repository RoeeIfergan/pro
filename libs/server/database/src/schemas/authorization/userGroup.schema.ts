import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { usersToUserGroups } from './user.schema.ts'
import { stepsToUserGroups } from '../workflow/step.schema.ts'

export const userGroups = pgTable('userGroups', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  ...WithModificationDates
})

export const userGroupsRelations = relations(userGroups, ({ many }) => ({
  userWithUserGroup: many(usersToUserGroups),
  steps: many(stepsToUserGroups)
}))
export type UserGroupEntity = InferSelectModel<typeof userGroups>
export type UserGroupEntityInsert = InferInsertModel<typeof userGroups>
