import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../database/config/database.config.ts'
import { PG_CONNECTION } from '../database/drizzle/pg-connection.ts'

import * as stepsSchema from './schemas/step.schema.ts'
import { steps, StepEntity, StepEntityInsert } from './schemas/step.schema.ts'
import { eq } from 'drizzle-orm'

@Injectable()
export class StepDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof stepsSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(steps).execute()
  }

  async getById(id: string) {
    return this.db.select().from(steps).where(eq(steps.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: steps.id,
        createdAt: steps.createdAt
      })
      .from(steps)
      .where(eq(steps.id, id))
      .execute()
  }

  async insertStep(step: StepEntityInsert) {
    return this.db.insert(steps).values(step).returning().execute()
  }

  async updateStep(stepId: string, step: Partial<StepEntity>) {
    if (!stepId) {
      throw new Error('Step ID is required for update')
    }

    const updatedSteps = await this.db
      .update(steps)
      .set(step)
      .where(eq(steps.id, stepId))
      .returning()
      .execute()

    if (updatedSteps.length > 1) {
      throw new Error(`Updated ${updatedSteps.length} steps, expected 1`, {
        cause: { updatedSteps }
      })
    }

    return updatedSteps[0]
  }

  async deleteStep(stepId: string) {
    if (!stepId) {
      throw new Error('Step ID is required for deletion')
    }

    const deletedSteps = await this.db
      .delete(steps)
      .where(eq(steps.id, stepId))
      .returning()
      .execute()

    if (deletedSteps.length > 1) {
      throw new Error(`Deleted ${deletedSteps.length} steps, expected 1`, {
        cause: { deletedSteps }
      })
    }

    return deletedSteps[0]
  }

  async deleteAllSteps() {
    return this.db.delete(steps).returning().execute()
  }
}
