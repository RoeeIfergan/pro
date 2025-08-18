import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { DatabaseConfig } from '../config/database.config.ts'
import { PG_CONNECTION } from './pg-connection.ts'
import { EntitiesSchema } from '../../entities/schemas/index.ts'

/**
 * Module responsible to create the connection pool to the database.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: DatabaseConfig.validateConfiguration
    })
  ],
  providers: [
    DatabaseConfig,
    {
      provide: PG_CONNECTION,
      inject: [DatabaseConfig],
      useFactory: async (dbConfig: DatabaseConfig) => {
        // https://orm.drizzle.team/docs/get-started-postgresql#node-postgres
        const pool = new Pool({
          connectionString: dbConfig.postgresqlConnection
        })
        return drizzle(pool, { schema: EntitiesSchema })
      }
    }
  ],
  exports: [PG_CONNECTION]
})
export class DrizzleModule {}
