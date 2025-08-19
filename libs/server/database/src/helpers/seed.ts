import { drizzle } from 'drizzle-orm/node-postgres'
import { reset, seed } from 'drizzle-seed'

import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import { orderTypes } from '@pro3/types'
import { EntitiesSchema } from '../entities/schemas/index.ts'
import { postgresqlConnection } from '../database/config/utils.ts'

const DATABASE_URL = postgresqlConnection()
console.log('DB Connection:', DATABASE_URL)

async function main() {
  const db = drizzle(DATABASE_URL)
  await reset(db, EntitiesSchema)
  await seed(db, EntitiesSchema, { count: 1000 }).refine((f) => ({
    orders: {
      columns: {
        type: f.valuesFromArray({ values: [...orderTypes] })
      }
    }
  }))
}
main()
