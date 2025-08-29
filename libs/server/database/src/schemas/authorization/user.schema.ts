import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { organizations } from './organization.schema.ts'
import { userGroups } from './userGroup.schema.ts'

export const users = pgTable('users', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  organizationId: uuid('organization_id').notNull(),
  ...WithModificationDates
})
export type UserEntity = InferSelectModel<typeof users>
export type UserEntityInsert = InferInsertModel<typeof users>

export const usersToUserGroups = pgTable(
  'users_to_user_groups',
  {
    userId: uuid('user_id').notNull(),
    userGroupId: uuid('user_group_id').notNull()
  },
  (table) => [primaryKey({ columns: [table.userId, table.userGroupId] })]
)

export const userRelations = relations(users, ({ one, many }) => ({
  userWithUserGroup: many(usersToUserGroups),
  organizationId: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id]
  })
}))

export const usersToGroupsRelations = relations(usersToUserGroups, ({ one }) => ({
  userGroup: one(userGroups, {
    fields: [usersToUserGroups.userGroupId],
    references: [userGroups.id]
  }),
  user: one(users, {
    fields: [usersToUserGroups.userId],
    references: [users.id]
  })
}))
