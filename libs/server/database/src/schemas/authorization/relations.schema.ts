import { relations } from 'drizzle-orm'
import { users, usersToUserGroups } from './user.schema.ts'
import { userGroups } from './userGroup.schema.ts'

export const usersToUserGroupsRelations = relations(users, ({ many }) => ({
  userGroups: many(usersToUserGroups)
}))

export const userGroupsRelations = relations(userGroups, ({ many }) => ({
  users: many(usersToUserGroups)
}))

export const usersToGroupsRelations = relations(usersToUserGroups, ({ one }) => ({
  group: one(userGroups, {
    fields: [usersToUserGroups.userGroupId],
    references: [userGroups.id]
  }),
  user: one(users, {
    fields: [usersToUserGroups.userId],
    references: [users.id]
  })
}))
