import { Injectable } from '@nestjs/common'
import {
  postgresqlConnection as externalPostgresqlConnection,
  validateConfiguration as externalValidateConfiguration
} from './utils.ts'

@Injectable()
export class DatabaseConfig {
  get postgresqlConnection(): string {
    return DatabaseConfig.postgresqlConnection()
  }

  get schemaName(): string {
    return DatabaseConfig.schemaName
  }

  static get schemaName(): string {
    const config = DatabaseConfig.validateConfiguration()
    return config.DB_SCHEMA_NAME
  }

  static postgresqlConnection = externalPostgresqlConnection
  static validateConfiguration = externalValidateConfiguration
}
