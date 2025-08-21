import { Inject, Injectable } from '@nestjs/common'

import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as screensSchema from '../../schemas/workflow/screen.schema.ts'
import { screens, ScreenEntity } from '../../schemas/workflow/screen.schema.ts'

@Injectable()
export class ScreenDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof screensSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(screens).execute()
  }

  async getById(id: string) {
    return this.db.select().from(screens).where(eq(screens.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: screens.id,
        createdAt: screens.createdAt
      })
      .from(screens)
      .where(eq(screens.id, id))
      .execute()
  }

  async insertScreen(screen: { name: string }) {
    return this.db.insert(screens).values(screen).returning().execute()
  }

  async updateScreen(screenId: string, screen: Partial<ScreenEntity>) {
    if (!screenId) {
      throw new Error('Screen ID is required for update')
    }

    const updatedScreens = await this.db
      .update(screens)
      .set(screen)
      .where(eq(screens.id, screenId))
      .returning()
      .execute()

    if (updatedScreens.length > 1) {
      throw new Error(`Updated ${updatedScreens.length} screens, expected 1`, {
        cause: { updatedScreens }
      })
    }

    return updatedScreens[0]
  }

  async deleteScreen(screenId: string) {
    if (!screenId) {
      throw new Error('Screen ID is required for deletion')
    }

    const deletedScreens = await this.db
      .delete(screens)
      .where(eq(screens.id, screenId))
      .returning()
      .execute()

    if (deletedScreens.length > 1) {
      throw new Error(`Deleted ${deletedScreens.length} screens, expected 1`, {
        cause: { deletedScreens }
      })
    }

    return deletedScreens[0]
  }

  async deleteAllScreens() {
    return this.db.delete(screens).returning().execute()
  }

  async getAllScreenRelations(screenId: string) {
    return this.db.query.screens.findFirst({
      where: eq(screens.id, screenId),
      with: {
        steps: true,
        transitions: true
      }
    })
  }
}
