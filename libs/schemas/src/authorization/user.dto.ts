import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { User } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()
const organizationId = z.string().nonempty()
const createUserSchema = z.object({
  name: nameSchema,
  organizationId: organizationId
}) satisfies z.ZodType<Partial<User>>

const getUsersSchema = z.object({
  id: idSchema,
  name: nameSchema,
  organizationId: organizationId,
  userGroupIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<User>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getUsersSchema>, User>>

export class GetUserSchemaDTO extends createZodDto(getUsersSchema) {}
export class CreateUserSchemaDTO extends createZodDto(createUserSchema) {}

export const getUserByIdSchema = z.object({ id: idSchema })

export class GetUserByIdDTO extends createZodDto(getUserByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
