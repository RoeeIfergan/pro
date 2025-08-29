import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as schemas from '../../schemas/index.ts'
import {
  users,
  UserEntityInsert,
  usersToUserGroups
} from '../../schemas/authorization/user.schema.ts'
import { stepsToUserGroups } from '../../schemas/workflow/step.schema.ts'
import { orders } from '../../schemas/workflow/order.schema.ts'
import { eq, inArray } from 'drizzle-orm'
import { TUserGroup } from '@pro3/types'

@Injectable()
export class UserDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof schemas>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db
      .select()
      .from(users)
      .leftJoin(usersToUserGroups, eq(users.id, usersToUserGroups.userId))
      .execute()
  }

  async getById(id: string) {
    const [result] = await this.db.query.users
      .findMany({
        where: eq(users.id, id),
        with: {
          userWithUserGroup: {
            with: {
              userGroup: {
                with: {
                  steps: {
                    columns: {
                      stepId: true
                    }
                  }
                }
              }
            }
          }
        }
      })
      .execute()

    const { userWithUserGroup, ...computedUser } = result
    const { flattenedUserGroups, stepsIds } = userWithUserGroup.reduce(
      (acc, userWithUserGroup) => {
        const { userGroup, ..._rest } = userWithUserGroup
        const { steps, ...restOfUserGroup } = userGroup
        const stepsIds = steps.map((step) => step.stepId)
        acc.stepsIds.push(...stepsIds)
        acc.flattenedUserGroups.push(restOfUserGroup)

        return acc
      },
      { flattenedUserGroups: [], stepsIds: [] } as {
        flattenedUserGroups: TUserGroup[]
        stepsIds: string[]
      }
    )

    const user = {
      ...computedUser,
      userGroups: flattenedUserGroups,
      stepsIds: stepsIds
    }

    return user
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

  async addUserGroupsToUser(userId: string, userGroupIds: string[]) {
    return this.db
      .insert(usersToUserGroups)
      .values(userGroupIds.map((userGroupId) => ({ userId, userGroupId })))
      .execute()
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

  async getUserGroupIdsByUserId(userId: string) {
    const userGroupIds = await this.db
      .select({ userGroupId: usersToUserGroups.userGroupId })
      .from(usersToUserGroups)
      .where(eq(usersToUserGroups.userId, userId))
      .execute()

    return userGroupIds.map((userGroup) => userGroup.userGroupId)
  }
  async getUserOrders(userId: string) {
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
      .select()
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
