import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'

import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from './step.schema.ts'
import { orders } from './order.schema.ts'

export const orderActions = pgTable('ordersActions', {
  ...WithIdPk,
  orderId: uuid('order_id').notNull(),
  stepId: uuid('step_id').notNull(),
  ...WithModificationDates
})
export type OrderActionEntity = InferSelectModel<typeof orderActions>
export type OrderActionEntityInsert = InferInsertModel<typeof orderActions>

export const orderActionsRelations = relations(orderActions, ({ one }) => ({
  step: one(steps, {
    fields: [orderActions.stepId],
    references: [steps.id]
  }),
  order: one(orders, {
    fields: [orderActions.orderId],
    references: [orders.id]
  })
}))
