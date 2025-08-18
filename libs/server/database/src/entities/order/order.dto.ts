import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderEntity } from '../schemas/order.schema.ts'
import { orderTypes } from './consts.ts'

const idSchema = z.string().nonempty()
const stepIdSchema = z.string().nonempty()
const nameSchema = z.string()
const typeSchema = z.enum(orderTypes)
const createOrderSchema = z.object({
  name: nameSchema,
  type: typeSchema,
  stepId: stepIdSchema
}) satisfies z.ZodType<Partial<OrderEntity>>

const getOrdersSchema = z.object({
  id: idSchema,
  name: nameSchema,
  type: typeSchema,
  stepId: stepIdSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<OrderEntity>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getOrdersSchema>, OrderEntity>>

export class GetOrderSchemaDTO extends createZodDto(getOrdersSchema) {}
export class CreateOrderSchemaDTO extends createZodDto(createOrderSchema) {}

export const getOrderByIdSchema = z.object({ id: idSchema })

export class GetOrderByIdDTO extends createZodDto(getOrderByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
