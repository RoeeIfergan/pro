import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { OrganizationsService } from './organization.service'
import { GetOrganizationByIdDTO, CreateOrganizationSchemaDTO, GetOrganizationSchemaDTO } from '@pro3/schemas'
import { UseZodGuard } from 'nestjs-zod'

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async getAllOrganizations(): Promise<GetOrganizationSchemaDTO[]> {
    return this.organizationsService.getAllOrganizations()
  }

  @Get(':id')
  @UseZodGuard('params', GetOrganizationByIdDTO)
  async getById(@Param('id') organizationId: string): Promise<GetOrganizationSchemaDTO[]> {
    return this.organizationsService.getById(organizationId)
  }

  @Post()
  @UseZodGuard('body', CreateOrganizationSchemaDTO)
  async addOrganization(@Body() organization: CreateOrganizationSchemaDTO): Promise<GetOrganizationSchemaDTO[]> {
    return this.organizationsService.addOrganization(organization)
  }

  @Patch(':id')
  @UseZodGuard('params', GetOrganizationByIdDTO)
  @UseZodGuard('body', CreateOrganizationSchemaDTO)
  async updateOrganization(
    @Param('id') organizationId: string,
    @Body() organization: CreateOrganizationSchemaDTO
  ): Promise<Partial<GetOrganizationSchemaDTO>> {
    return this.organizationsService.updateOrganization(organizationId, organization)
  }

  @Delete(':id')
  @UseZodGuard('params', GetOrganizationByIdDTO)
  async deleteOrganization(@Param('id') organizationId: string): Promise<Partial<GetOrganizationSchemaDTO>> {
    return this.organizationsService.deleteOrganization(organizationId)
  }

  @Delete()
  async deleteAllOrganizations(): Promise<Partial<GetOrganizationSchemaDTO>[]> {
    return this.organizationsService.deleteOrganizations()
  }
}
