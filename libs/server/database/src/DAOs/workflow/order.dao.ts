import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as ordersSchema from '../../schemas/workflow/order.schema.ts'
import { orders, OrderEntity, OrderEntityInsert } from '../../schemas/workflow/order.schema.ts'
import { eq } from 'drizzle-orm'

@Injectable()
export class OrderDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof ordersSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(orders).execute()
  }

  async getById(id: string) {
    return this.db.select().from(orders).where(eq(orders.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: orders.id,
        createdAt: orders.createdAt
      })
      .from(orders)
      .where(eq(orders.id, id))
      .execute()
  }

  async insertOrder(order: OrderEntityInsert) {
    return this.db.insert(orders).values(order).returning().execute()
  }

  async updateOrder(orderId: string, order: Partial<OrderEntity>) {
    if (!orderId) {
      throw new Error('Order ID is required for update')
    }

    const updatedOrders = await this.db
      .update(orders)
      .set(order)
      .where(eq(orders.id, orderId))
      .returning()
      .execute()

    if (updatedOrders.length > 1) {
      throw new Error(`Updated ${updatedOrders.length} orders, expected 1`, {
        cause: { updatedOrders }
      })
    }

    return updatedOrders[0]
  }

  async deleteOrder(orderId: string) {
    if (!orderId) {
      throw new Error('Order ID is required for deletion')
    }

    const deletedOrders = await this.db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning()
      .execute()

    if (deletedOrders.length > 1) {
      throw new Error(`Deleted ${deletedOrders.length} orders, expected 1`, {
        cause: { deletedOrders }
      })
    }

    return deletedOrders[0]
  }

  async deleteAllOrders() {
    return this.db.delete(orders).returning().execute()
  }
}
