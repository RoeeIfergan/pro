import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as usersSchema from '../../schemas/authorization/user.schema.ts'
import {
  users,
  UserEntityInsert,
  usersToUserGroups
} from '../../schemas/authorization/user.schema.ts'
import { stepsToUserGroups } from '../../schemas/workflow/step.schema.ts'
import { orders } from '../../schemas/workflow/order.schema.ts'
import { eq, inArray } from 'drizzle-orm'
import { UserWithGroups } from '@pro3/types'

@Injectable()
export class UserDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof usersSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(users).execute()
  }

  async getById(id: string) {
    const results = await this.db.query.usersToUserGroups
      .findMany({
        where: eq(usersToUserGroups.userId, id),
        with: {
          group: true,
          user: true
        }
      })
      .execute()

    const groupedUserGroups = results.reduce(
      (acc, userGroup) => {
        acc.userGroups.push(userGroup.group)

        return acc
      },
      { user: results[0].user, userGroups: [] } as UserWithGroups
    )

    return groupedUserGroups || null
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: users.id,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.id, id))
      .execute()
  }

  async insertUser(user: UserEntityInsert) {
    return this.db.insert(users).values(user).returning().execute()
  }

  async updateUser(userId: string, user: Partial<UserEntityInsert>) {
    if (!userId) {
      throw new Error('User ID is required for update')
    }

    const updatedUsers = await this.db
      .update(users)
      .set(user)
      .where(eq(users.id, userId))
      .returning()
      .execute()

    if (updatedUsers.length > 1) {
      throw new Error(`Updated ${updatedUsers.length} users, expected 1`, {
        cause: { updatedUsers }
      })
    }

    return updatedUsers[0]
  }

  async deleteUser(userId: string) {
    if (!userId) {
      throw new Error('User ID is required for deletion')
    }

    const deletedUsers = await this.db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()
      .execute()

    if (deletedUsers.length > 1) {
      throw new Error(`Deleted ${deletedUsers.length} users, expected 1`, {
        cause: { deletedUsers }
      })
    }

    return deletedUsers[0]
  }

  async deleteAllUsers() {
    return this.db.delete(users).returning().execute()
  }

  async getUserOrders(userId: string) {
    // First get the user's group IDs
    const userGroupIds = await this.db
      .select({ userGroupId: usersToUserGroups.userGroupId })
      .from(usersToUserGroups)
      .where(eq(usersToUserGroups.userId, userId))
      .execute()

    if (!userGroupIds.length) return []

    // Get step IDs that contain any of the user's groups
    const stepIds = await this.db
      .select({ stepId: stepsToUserGroups.stepId })
      .from(stepsToUserGroups)
      .where(
        inArray(
          stepsToUserGroups.userGroupId,
          userGroupIds.map((g) => g.userGroupId)
        )
      )
      .execute()

    if (!stepIds.length) return []

    // Get orders from those steps
    return this.db
      .select({
        id: orders.id,
        name: orders.name,
        type: orders.type,
        stepId: orders.stepId,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt
      })
      .from(orders)
      .where(
        inArray(
          orders.stepId,
          stepIds.map((s) => s.stepId)
        )
      )
      .execute()
  }
}
