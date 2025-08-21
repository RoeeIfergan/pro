import { relations } from 'drizzle-orm'
import { users } from './user.schema.ts'
import { userGroups } from './userGroup.schema.ts'

export const usersToUserGroups = relations(users, ({ many }) => ({
  userGroups: many(userGroups)
}))
