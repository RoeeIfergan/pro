import { relations } from 'drizzle-orm'
import { users, usersToUserGroups } from './user.schema.ts'
import { userGroups } from './userGroup.schema.ts'

export const usersRelations = relations(users, ({ many }) => ({
  userGroups: many(usersToUserGroups)
}))

export const usersToUserGroupsRelations = relations(usersToUserGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToUserGroups.userId],
    references: [users.id]
  }),
  userGroup: one(userGroups, {
    fields: [usersToUserGroups.userGroupId],
    references: [userGroups.id]
  })
}))

export const userGroupsRelations = relations(userGroups, ({ many }) => ({
  users: many(usersToUserGroups)
}))
