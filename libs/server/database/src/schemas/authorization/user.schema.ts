import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { organizations } from './organization.schema.ts'
import { userGroups } from './userGroup.schema.ts'

export const users = pgTable('users', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  ...WithModificationDates
})

export const usersToUserGroups = pgTable('users_to_user_groups', {
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  userGroupId: uuid('user_group_id')
    .notNull()
    .references(() => userGroups.id)
})

export type UserEntity = InferSelectModel<typeof users>
export type UserEntityInsert = InferInsertModel<typeof users>
