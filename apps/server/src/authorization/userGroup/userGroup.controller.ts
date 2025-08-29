import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserGroupsService } from './userGroup.service'
import { GetUserGroupByIdDTO, ModifyUserGroupSchemaDTO, UserGroupSchemaDTO } from '@pro3/schemas'
import { UseZodGuard } from 'nestjs-zod'
import { TUserGroup } from '@pro3/types'

@Controller('userGroups')
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  @Get()
  async getAllUserGroups(): Promise<TUserGroup[]> {
    return this.userGroupsService.getAllUserGroups()
  }

  @Get(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  async getById(@Param('id') userGroupId: string): Promise<UserGroupSchemaDTO[]> {
    return this.userGroupsService.getById(userGroupId)
  }

  @Post()
  @UseZodGuard('body', ModifyUserGroupSchemaDTO)
  async addUserGroup(@Body() userGroup: ModifyUserGroupSchemaDTO): Promise<UserGroupSchemaDTO[]> {
    return this.userGroupsService.addUserGroup(userGroup)
  }

  @Patch(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  @UseZodGuard('body', ModifyUserGroupSchemaDTO)
  async updateUserGroup(
    @Param('id') userGroupId: string,
    @Body() userGroup: ModifyUserGroupSchemaDTO
  ): Promise<Partial<UserGroupSchemaDTO>> {
    return this.userGroupsService.updateUserGroup(userGroupId, userGroup)
  }

  @Delete(':id')
  @UseZodGuard('params', GetUserGroupByIdDTO)
  async deleteUserGroup(@Param('id') userGroupId: string): Promise<Partial<UserGroupSchemaDTO>> {
    return this.userGroupsService.deleteUserGroup(userGroupId)
  }

  @Delete()
  async deleteAllUserGroups(): Promise<Partial<UserGroupSchemaDTO>[]> {
    return this.userGroupsService.deleteUserGroups()
  }
}
