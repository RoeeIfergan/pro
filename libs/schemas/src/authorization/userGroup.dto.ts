import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { UserGroup } from '@pro3/types'

const idSchema = z.string().nonempty()
const nameSchema = z.string()
const createUserGroupSchema = z.object({
  name: nameSchema
}) satisfies z.ZodType<Partial<UserGroup>>

const userGroupsSchema = z.object({
  id: idSchema,
  name: nameSchema,
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<UserGroup>

// type Equal<A, B> =
//   (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
// type Expect<T extends true> = T

// type _SchemaMatchesTest = Expect<Equal<z.infer<typeof getUserGroupsSchema>, UserGroup>>

export class UserGroupSchemaDTO extends createZodDto(userGroupsSchema) {}

export class ModifyUserGroupSchemaDTO extends createZodDto(createUserGroupSchema) {}

export const getUserGroupByIdSchema = z.object({ id: idSchema })

export class GetUserGroupByIdDTO extends createZodDto(getUserGroupByIdSchema) {}

// const updateDemandSchema = createDemandSchema.partial()

// export class UpdateDemandDto extends createZodDto(updateDemandSchema) {}

// export class DemandQueryDto extends createZodDto(updateDemandSchema) {}
