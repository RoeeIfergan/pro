import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as usersSchema from '../../schemas/authorization/user.schema.ts'
import { users, UserEntityInsert } from '../../schemas/authorization/user.schema.ts'
import { eq } from 'drizzle-orm'

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
    return this.db.select().from(users).where(eq(users.id, id)).execute()
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
}
