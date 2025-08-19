import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { Screen } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()

const createScreenSchema = z.object({
  name: nameSchema
}) satisfies z.ZodType<Partial<Screen>>

export const ScreensSchema = z.object({
  id: idSchema,
  name: nameSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<Screen>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof ScreensSchema>, ScreenEntity>>

export class ScreenDTO extends createZodDto(ScreensSchema) {}
export class CreateScreenDTO extends createZodDto(createScreenSchema) {}

export const updateScreenSchema = createScreenSchema.partial()
export class UpdateScreenDTO extends createZodDto(createScreenSchema) {}

export const getScreenByIdSchema = z.object({ id: idSchema })

export class GetScreenByIdDTO extends createZodDto(getScreenByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
