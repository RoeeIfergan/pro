import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserGroupsService } from './userGroup.service'
import { GetUserGroupByIdDTO, CreateUserGroupSchemaDTO, GetUserGroupSchemaDTO } from '@pro3/schemas'
import { UseZodGuard } from 'nestjs-zod'

@Controller('userGroups')
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  @Get()
  async getAllUserGroups(): Promise<GetUserGroupSchemaDTO[]> {
    return this.userGroupsService.getAllUserGroups()
  }

  @Get(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  async getById(@Param('id') userGroupId: string): Promise<GetUserGroupSchemaDTO[]> {
    return this.userGroupsService.getById(userGroupId)
  }

  @Post()
  @UseZodGuard('body', CreateUserGroupSchemaDTO)
  async addUserGroup(@Body() userGroup: CreateUserGroupSchemaDTO): Promise<GetUserGroupSchemaDTO[]> {
    return this.userGroupsService.addUserGroup(userGroup)
  }

  @Patch(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  @UseZodGuard('body', CreateUserGroupSchemaDTO)
  async updateUserGroup(
    @Param('id') userGroupId: string,
    @Body() userGroup: CreateUserGroupSchemaDTO
  ): Promise<Partial<GetUserGroupSchemaDTO>> {
    return this.userGroupsService.updateUserGroup(userGroupId, userGroup)
  }

  @Delete(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  async deleteUserGroup(@Param('id') userGroupId: string): Promise<Partial<GetUserGroupSchemaDTO>> {
    return this.userGroupsService.deleteUserGroup(userGroupId)
  }

  @Delete()
  async deleteAllUserGroups(): Promise<Partial<GetUserGroupSchemaDTO>[]> {
    return this.userGroupsService.deleteUserGroups()
  }
}
