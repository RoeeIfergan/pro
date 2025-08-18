import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { WithIdPk } from '../helpers/with-id-pk.ts'
import { WithModificationDates } from '../helpers/with-modification-dates.ts'
import { steps } from './step.schema.ts'
import { orderTypes } from '../order/consts.ts'

export const orders = pgTable('orders', {
  ...WithIdPk,
  name: varchar('name', { length: 256 }).notNull(),
  type: text({ enum: orderTypes }).notNull().default(orderTypes[0]),
  stepId: uuid('step_id')
    .notNull()
    .references(() => steps.id),
  ...WithModificationDates
})
export type OrderEntity = InferSelectModel<typeof orders>
export type OrderEntityInsert = InferInsertModel<typeof orders>
