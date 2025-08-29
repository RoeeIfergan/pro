import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'
import * as userGroupsSchema from '../../schemas/authorization/userGroup.schema.ts'
import { userGroups, UserGroupEntityInsert } from '../../schemas/authorization/userGroup.schema.ts'
import { eq, inArray } from 'drizzle-orm'
import { stepsToUserGroups, StepsToUserGroupsEntity } from '../../schemas/index.ts'
import { convertOptions } from '../utils.ts'

@Injectable()
export class UserGroupDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof userGroupsSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(userGroups).execute()
  }

  async getById(id: string) {
    return this.db.select().from(userGroups).where(eq(userGroups.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: userGroups.id,
        createdAt: userGroups.createdAt
      })
      .from(userGroups)
      .where(eq(userGroups.id, id))
      .execute()
  }

  async getStepIdsByUserGroups<T extends Array<keyof StepsToUserGroupsEntity>>(
    userGroupIds: string[],
    fieldNames: T
  ) {
    const computedOptions = convertOptions(stepsToUserGroups, fieldNames)

    const steps = await this.db
      .select(computedOptions)
      .from(stepsToUserGroups)
      .where(inArray(stepsToUserGroups.userGroupId, userGroupIds))
      .execute()

    return steps
  }

  async insertUserGroups(userGroupsToInsert: UserGroupEntityInsert) {
    return this.db.insert(userGroups).values(userGroupsToInsert).returning().execute()
  }

  async updateUserGroup(userGroupId: string, userGroup: Partial<UserGroupEntityInsert>) {
    if (!userGroupId) {
      throw new Error('UserGroup ID is required for update')
    }

    const updatedUserGroups = await this.db
      .update(userGroups)
      .set(userGroup)
      .where(eq(userGroups.id, userGroupId))
      .returning()
      .execute()

    if (updatedUserGroups.length > 1) {
      throw new Error(`Updated ${updatedUserGroups.length} userGroups, expected 1`, {
        cause: { updatedUserGroups }
      })
    }

    return updatedUserGroups[0]
  }

  async deleteUserGroup(userGroupId: string) {
    if (!userGroupId) {
      throw new Error('UserGroup ID is required for deletion')
    }

    const deletedUserGroups = await this.db
      .delete(userGroups)
      .where(eq(userGroups.id, userGroupId))
      .returning()
      .execute()

    if (deletedUserGroups.length > 1) {
      throw new Error(`Deleted ${deletedUserGroups.length} userGroups, expected 1`, {
        cause: { deletedUserGroups }
      })
    }

    return deletedUserGroups[0]
  }

  async deleteAllUserGroups() {
    return this.db.delete(userGroups).returning().execute()
  }
}
