import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TOrganization } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()

const createOrganizationSchema = z.object({
  name: nameSchema
}) satisfies z.ZodType<Partial<TOrganization>>

const getOrganizationsSchema = z.object({
  id: idSchema,
  name: nameSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<TOrganization>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getOrganizationsSchema>, Organization>>

export class GetOrganizationSchemaDTO extends createZodDto(getOrganizationsSchema) {}
export class CreateOrganizationSchemaDTO extends createZodDto(createOrganizationSchema) {}

export const getOrganizationByIdSchema = z.object({ id: idSchema })

export class GetOrganizationByIdDTO extends createZodDto(getOrganizationByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
