import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from './step.schema.ts'
import { orders } from './order.schema.ts'

export const orderActions = pgTable('ordersActions', {
  ...WithIdPk,
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),
  ...WithModificationDates
})
export type OrderActionEntity = InferSelectModel<typeof orderActions>
export type OrderActionEntityInsert = InferInsertModel<typeof orderActions>
