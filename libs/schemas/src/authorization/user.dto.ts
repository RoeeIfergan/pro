import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TUser, TUserWithGroups } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()
const organizationId = z.string().nonempty()

const createUserSchema = z.object({
  name: nameSchema,
  organizationId: organizationId,
  userGroupIds: z.array(z.string())
}) satisfies z.ZodType<Partial<TUser>>

const getUsersSchema = z.object({
  id: idSchema,
  name: nameSchema,
  organizationId: organizationId,
  userGroupIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<TUser>

const showUserStepsSchema = z.object({ showSteps: z.boolean().optional() })
// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getUsersSchema>, User>>

export class GetUserSchemaDTO extends createZodDto(getUsersSchema) {}
export type GetUserWithUserGroupsSchemaDTO = TUserWithGroups

export class CreateUserSchemaDTO extends createZodDto(createUserSchema) {}

export const getUserByIdSchema = z.object({ id: idSchema })

export class GetUserByIdDTO extends createZodDto(getUserByIdSchema) {}
export class showUserStepsDTO extends createZodDto(showUserStepsSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
