import * as ordersSchema from './order.schema.ts'
import * as screensSchema from './screen.schema.ts'
import * as stepsSchema from './step.schema.ts'
import * as transitionsSchema from './transition.schema.ts'
import * as orderActionsSchema from './orderAction.schema.ts'
import * as relationsSchema from './relations.schema.ts'

export const EntitiesSchema = {
  ...ordersSchema,
  ...screensSchema,
  ...stepsSchema,
  ...transitionsSchema,
  ...orderActionsSchema,
  ...relationsSchema
}
