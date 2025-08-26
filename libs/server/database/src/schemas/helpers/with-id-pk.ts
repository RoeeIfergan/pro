import { sql } from 'drizzle-orm'
import { uuid } from 'drizzle-orm/pg-core'

export const idSchemaType = uuid

export const WithIdPk = {
  id: idSchemaType('id')
    .primaryKey()
    // NOTICE: No need to add uuid-ossp since PostgreSQL now has gen_random_uuid
    .default(sql.raw(`gen_random_uuid()`))
}
