import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../database/config/database.config.ts'
import { PG_CONNECTION } from '../database/drizzle/pg-connection.ts'

import * as transitionsSchema from './schemas/transition.schema.ts'
import { transitions, TransitionEntityInsert } from './schemas/transition.schema.ts'
import { eq } from 'drizzle-orm'

@Injectable()
export class TransitionDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof transitionsSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(transitions).execute()
  }

  async getById(id: string) {
    return this.db.select().from(transitions).where(eq(transitions.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: transitions.id,
        createdAt: transitions.createdAt
      })
      .from(transitions)
      .where(eq(transitions.id, id))
      .execute()
  }

  async insertTransition(transition: TransitionEntityInsert) {
    return this.db.insert(transitions).values(transition).returning().execute()
  }

  async updateTransition(transitionId: string, transition: Partial<TransitionEntityInsert>) {
    if (!transitionId) {
      throw new Error('Transition ID is required for update')
    }

    const updatedTransitions = await this.db
      .update(transitions)
      .set(transition)
      .where(eq(transitions.id, transitionId))
      .returning()
      .execute()

    if (updatedTransitions.length > 1) {
      throw new Error(`Updated ${updatedTransitions.length} transitions, expected 1`, {
        cause: { updatedTransitions }
      })
    }

    return updatedTransitions[0]
  }

  async deleteTransition(transitionId: string) {
    if (!transitionId) {
      throw new Error('Transition ID is required for deletion')
    }

    const deletedTransitions = await this.db
      .delete(transitions)
      .where(eq(transitions.id, transitionId))
      .returning()
      .execute()

    if (deletedTransitions.length > 1) {
      throw new Error(`Deleted ${deletedTransitions.length} transitions, expected 1`, {
        cause: { deletedTransitions }
      })
    }

    return deletedTransitions[0]
  }

  async deleteAllTransitions() {
    return this.db.delete(transitions).returning().execute()
  }
}
