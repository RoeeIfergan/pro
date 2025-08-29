import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from './step.schema.ts'
import { orderTypes } from '@pro3/types'

export const orders = pgTable('orders', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  type: text({ enum: orderTypes }).notNull().default(orderTypes[0]),
  stepId: uuid('step_id').notNull(),
  ...WithModificationDates
})
export type OrderEntity = InferSelectModel<typeof orders>
export type OrderEntityInsert = InferInsertModel<typeof orders>

export const orderRelations = relations(orders, ({ one }) => ({
  step: one(steps, {
    fields: [orders.stepId],
    references: [steps.id]
  })
}))
