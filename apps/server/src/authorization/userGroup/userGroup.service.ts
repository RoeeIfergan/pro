import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserGroupDao, UserGroupEntityInsert } from '@pro3/database'
import { UserGroupEntity } from '@pro3/database/'

@Injectable()
export class UserGroupsService {
  constructor(private readonly userGroupDao: UserGroupDao) {}

  async getById(id: string): Promise<UserGroupEntity[]> {
    return await this.userGroupDao.getById(id)
  }

  async getAllUserGroups(): Promise<UserGroupEntity[]> {
    return await this.userGroupDao.getAll()
  }

  async getPartOfById(id: string): Promise<Pick<UserGroupEntity, 'id' | 'createdAt'>[]> {
    return await this.userGroupDao.getPartOfById(id)
  }

  async addUserGroup(userGroup: UserGroupEntityInsert) {
    return await this.userGroupDao.insertUserGroups(userGroup)
  }

  async updateUserGroup(id: string, userGroup: Partial<UserGroupEntity>) {
    const userGroupToEdit = await this.userGroupDao.updateUserGroup(id, userGroup)

    if (!userGroupToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'UserGroup not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return userGroupToEdit
  }

  async deleteUserGroup(id: string) {
    const deletedUserGroup = await this.userGroupDao.deleteUserGroup(id)

    if (!deletedUserGroup) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'UserGroup not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedUserGroup
  }

  async deleteUserGroups() {
    const deletedUserGroups = await this.userGroupDao.deleteAllUserGroups()

    return deletedUserGroups
  }
}
