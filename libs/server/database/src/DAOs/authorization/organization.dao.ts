import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DatabaseConfig } from '../../database/config/database.config.ts'
import { PG_CONNECTION } from '../../database/drizzle/pg-connection.ts'

import * as organizationsSchema from '../../schemas/authorization/organization.schema.ts'
import {
  organizations,
  OrganizationEntityInsert
} from '../../schemas/authorization/organization.schema.ts'
import { eq } from 'drizzle-orm'

@Injectable()
export class OrganizationDao {
  constructor(
    @Inject(PG_CONNECTION) protected readonly db: NodePgDatabase<typeof organizationsSchema>,
    protected readonly dbConfig: DatabaseConfig
  ) {}

  async getAll() {
    return this.db.select().from(organizations).execute()
  }

  async getById(id: string) {
    return this.db.select().from(organizations).where(eq(organizations.id, id)).execute()
  }

  async getPartOfById(id: string) {
    return this.db
      .select({
        id: organizations.id,
        createdAt: organizations.createdAt
      })
      .from(organizations)
      .where(eq(organizations.id, id))
      .execute()
  }

  async insertOrganization(organization: OrganizationEntityInsert) {
    return this.db.insert(organizations).values(organization).returning().execute()
  }

  async updateOrganization(
    organizationId: string,
    organization: Partial<OrganizationEntityInsert>
  ) {
    if (!organizationId) {
      throw new Error('Organization ID is required for update')
    }

    const updatedOrganizations = await this.db
      .update(organizations)
      .set(organization)
      .where(eq(organizations.id, organizationId))
      .returning()
      .execute()

    if (updatedOrganizations.length > 1) {
      throw new Error(`Updated ${updatedOrganizations.length} organizations, expected 1`, {
        cause: { updatedOrganizations }
      })
    }

    return updatedOrganizations[0]
  }

  async deleteOrganization(organizationId: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required for deletion')
    }

    const deletedOrganizations = await this.db
      .delete(organizations)
      .where(eq(organizations.id, organizationId))
      .returning()
      .execute()

    if (deletedOrganizations.length > 1) {
      throw new Error(`Deleted ${deletedOrganizations.length} organizations, expected 1`, {
        cause: { deletedOrganizations }
      })
    }

    return deletedOrganizations[0]
  }

  async deleteAllOrganizations() {
    return this.db.delete(organizations).returning().execute()
  }
}
