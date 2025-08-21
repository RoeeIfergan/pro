import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderAction } from '@pro3/types'

const idSchema = z.string().nonempty()
const orderIdSchema = z.string().nonempty()
const stepIdSchema = z.string().nonempty()

const createOrderActionSchema = z.object({
  orderId: orderIdSchema,
  stepId: stepIdSchema
}) satisfies z.ZodType<Partial<OrderAction>>

const getOrderActionsSchema = z.object({
  id: idSchema,
  orderId: orderIdSchema,
  stepId: stepIdSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<OrderAction>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getOrderActionsSchema>, OrderActionEntity>>

export class GetOrderActionSchemaDTO extends createZodDto(getOrderActionsSchema) {}
export class CreateOrderActionSchemaDTO extends createZodDto(createOrderActionSchema) {}

export const getOrderActionByIdSchema = z.object({ id: idSchema })

export class GetOrderActionByIdDTO extends createZodDto(getOrderActionByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
