console.log('running')

import { reset } from 'drizzle-seed'
import { drizzle } from 'drizzle-orm/node-postgres'

import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import * as EntitiesSchema from './schemas/index.ts'
import { postgresqlConnection } from './database/config/utils.ts'
import { exit } from 'process'

const DATABASE_URL = postgresqlConnection()
console.log('DB Connection:', DATABASE_URL)

async function main() {
  console.log('Clearing DB...')

  const db = drizzle(DATABASE_URL)
  await reset(db, EntitiesSchema)

  console.log('Finished')
  exit()
}
main()
