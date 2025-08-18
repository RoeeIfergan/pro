import { drizzle } from 'drizzle-orm/node-postgres'
import { reset, seed } from 'drizzle-seed'
import { EntitiesSchema } from '../entities/schemas/index.ts'
import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import { postgresqlConnection } from '../database/config/utils.ts'
import { orderTypes } from '../entities/order/consts.ts'

const DATABASE_URL = postgresqlConnection()
console.log('DB Connection:', DATABASE_URL)

async function main() {
  const db = drizzle(DATABASE_URL)
  await reset(db, EntitiesSchema)
  await seed(db, EntitiesSchema, { count: 20 }).refine((f) => ({
    orders: {
      columns: {
        type: f.valuesFromArray({ values: [...orderTypes] })
      }
    }
  }))
}
main()
