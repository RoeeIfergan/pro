import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseConfig } from './config/database.config.ts'
import { DrizzleModule } from './drizzle/drizzle.module.ts'
import { DAOs } from '../DAOs/index.ts'

@Module({
  providers: [...DAOs, DatabaseConfig],
  imports: [
    ConfigModule.forRoot({
      validate: DatabaseConfig.validateConfiguration
    }),
    DrizzleModule
  ],
  exports: DAOs
})
export class DatabaseModule {}
