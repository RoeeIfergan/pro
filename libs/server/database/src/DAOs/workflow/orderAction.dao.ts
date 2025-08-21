import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as orderActionsSchema from '../../schemas/workflow/orderAction.schema.ts'
import { orderActions, OrderActionEntityInsert } from '../../schemas/workflow/orderAction.schema.ts'
import { eq } from 'drizzle-orm'

@Injectable()
export class OrderActionDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof orderActionsSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(orderActions).execute()
  }

  async getById(id: string) {
    return this.db.select().from(orderActions).where(eq(orderActions.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: orderActions.id,
        createdAt: orderActions.createdAt
      })
      .from(orderActions)
      .where(eq(orderActions.id, id))
      .execute()
  }

  async insertOrderAction(orderAction: OrderActionEntityInsert) {
    return this.db.insert(orderActions).values(orderAction).returning().execute()
  }

  async updateOrderAction(orderActionId: string, orderAction: Partial<OrderActionEntityInsert>) {
    if (!orderActionId) {
      throw new Error('OrderAction ID is required for update')
    }

    const updatedOrderActions = await this.db
      .update(orderActions)
      .set(orderAction)
      .where(eq(orderActions.id, orderActionId))
      .returning()
      .execute()

    if (updatedOrderActions.length > 1) {
      throw new Error(`Updated ${updatedOrderActions.length} orderActions, expected 1`, {
        cause: { updatedOrderActions }
      })
    }

    return updatedOrderActions[0]
  }

  async deleteOrderAction(orderActionId: string) {
    if (!orderActionId) {
      throw new Error('OrderAction ID is required for deletion')
    }

    const deletedOrderActions = await this.db
      .delete(orderActions)
      .where(eq(orderActions.id, orderActionId))
      .returning()
      .execute()

    if (deletedOrderActions.length > 1) {
      throw new Error(`Deleted ${deletedOrderActions.length} orderActions, expected 1`, {
        cause: { deletedOrderActions }
      })
    }

    return deletedOrderActions[0]
  }

  async deleteAllOrderActions() {
    return this.db.delete(orderActions).returning().execute()
  }
}
