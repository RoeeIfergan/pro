import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import { postgresqlConnection } from './src/database/config/utils'

const DATABASE_URL = postgresqlConnection()
console.log('DB Connection:', DATABASE_URL)

export default defineConfig({
  schema: './src/entities/schemas',
  out: './src/migrationFiles',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  },
  verbose: true,
  strict: true
})
