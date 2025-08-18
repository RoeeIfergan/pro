import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ScreenEntity } from '../schemas/screen.schema.ts'

export const screenTypes = ['standard', 'express', 'overnight'] as const

const idSchema = z.string().nonempty()
const nameSchema = z.string()

const createScreenSchema = z.object({
  name: nameSchema
}) satisfies z.ZodType<Partial<ScreenEntity>>

const getScreensSchema = z.object({
  id: idSchema,
  name: nameSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<ScreenEntity>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getScreensSchema>, ScreenEntity>>

export class GetScreenSchemaDTO extends createZodDto(getScreensSchema) {}
export class CreateScreenSchemaDTO extends createZodDto(createScreenSchema) {}

export const getScreenByIdSchema = z.object({ id: idSchema })

export class GetScreenByIdDTO extends createZodDto(getScreenByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
