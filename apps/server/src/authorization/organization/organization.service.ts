import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { OrganizationDao, OrganizationEntityInsert } from '@pro3/database'
import { OrganizationEntity } from '@pro3/database/'

@Injectable()
export class OrganizationsService {
  constructor(private readonly organizationDao: OrganizationDao) {}

  async getById(id: string): Promise<OrganizationEntity[]> {
    return await this.organizationDao.getById(id)
  }

  async getAllOrganizations(): Promise<OrganizationEntity[]> {
    return await this.organizationDao.getAll()
  }

  async getPartOfById(id: string): Promise<Pick<OrganizationEntity, 'id' | 'createdAt'>[]> {
    return await this.organizationDao.getPartOfById(id)
  }

  async addOrganization(organization: OrganizationEntityInsert) {
    return await this.organizationDao.insertOrganization(organization)
  }

  async updateOrganization(id: string, organization: Partial<OrganizationEntity>) {
    const organizationToEdit = await this.organizationDao.updateOrganization(id, organization)

    if (!organizationToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Organization not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return organizationToEdit
  }

  async deleteOrganization(id: string) {
    const deletedOrganization = await this.organizationDao.deleteOrganization(id)

    if (!deletedOrganization) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Organization not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedOrganization
  }

  async deleteOrganizations() {
    const deletedOrganizations = await this.organizationDao.deleteAllOrganizations()

    return deletedOrganizations
  }
}
