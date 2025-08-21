import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { Transition } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()
const screenIdSchema = z.string().nonempty()
const stepIdSchema = z.string().nonempty()

const createTransitionSchema = z.object({
  name: nameSchema,
  screenId: screenIdSchema,
  fromStepId: stepIdSchema,
  toStepId: stepIdSchema
}) satisfies z.ZodType<Partial<Transition>>

const getTransitionsSchema = z.object({
  id: idSchema,
  name: nameSchema,
  screenId: screenIdSchema,
  fromStepId: stepIdSchema,
  toStepId: stepIdSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Transition>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getTransitionsSchema>, Transition>>

export class GetTransitionSchemaDTO extends createZodDto(getTransitionsSchema) {}
export class CreateTransitionSchemaDTO extends createZodDto(createTransitionSchema) {}

export const getTransitionByIdSchema = z.object({ id: idSchema })

export class GetTransitionByIdDTO extends createZodDto(getTransitionByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
