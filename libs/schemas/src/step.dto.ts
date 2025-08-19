import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { Step } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()
const screenIdSchema = z.string().nonempty()

const createStepSchema = z.object({
  name: nameSchema,
  screenId: screenIdSchema
}) satisfies z.ZodType<Partial<Step>>

const getStepsSchema = z.object({
  id: idSchema,
  name: nameSchema,
  screenId: screenIdSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Step>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getStepsSchema>, Step>>

export class GetStepSchemaDTO extends createZodDto(getStepsSchema) {}
export class CreateStepSchemaDTO extends createZodDto(createStepSchema) {}

export const getStepByIdSchema = z.object({ id: idSchema })

export class GetStepByIdDTO extends createZodDto(getStepByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
