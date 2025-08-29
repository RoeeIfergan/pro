import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { StepDao, UserDao, UserGroupDao } from '@pro3/database'
import { UserEntity } from '@pro3/database/'
import { CreateUserSchemaDTO } from '@pro3/schemas'
import { TFullUser, TUser } from '@pro3/types'

@Injectable()
export class UsersService {
  constructor(
    private readonly userDao: UserDao,
    private readonly userGroupDao: UserGroupDao,
    private readonly stepDAO: StepDao
  ) {}

  async getById(id: string): Promise<TFullUser> {
    return await this.userDao.getById(id)
  }

  async getAllUsers(): Promise<TUser[]> {
    const usersInfo = await this.userDao.getAll()

    const computedUsers = usersInfo.reduce(
      (acc, userInfo) => {
        const userId = userInfo.users.id
        const userGroupId = userInfo.users_to_user_groups?.userGroupId

        if (!userGroupId) return acc

        if (!acc[userId]) {
          acc[userId] = {
            ...userInfo.users,
            userGroupIds: [userGroupId]
          }
        } else {
          acc[userId].userGroupIds.push(userGroupId)
        }

        return acc
      },
      {} as Record<string, TUser>
    )

    return Object.values(computedUsers)
  }

  async getPartOfById(id: string): Promise<Pick<UserEntity, 'id' | 'createdAt'>[]> {
    return await this.userDao.getPartOfById(id)
  }

  async addUser(user: CreateUserSchemaDTO): Promise<TUser> {
    const { userGroupIds, ...restOfUser } = user
    const [insertedUser] = await this.userDao.insertUser(restOfUser)

    if (!insertedUser) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to insert user'
        },
        HttpStatus.BAD_REQUEST
      )
    }

    await this.userDao.addUserGroupsToUser(insertedUser.id, userGroupIds)

    return { ...insertedUser, userGroupIds }
  }

  async updateUser(id: string, user: Partial<UserEntity>) {
    const userToEdit = await this.userDao.updateUser(id, user)

    if (!userToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return userToEdit
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userDao.deleteUser(id)

    if (!deletedUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedUser
  }

  async deleteUsers() {
    const deletedUsers = await this.userDao.deleteAllUsers()

    return deletedUsers
  }

  async getUserOrders(userId: string) {
    const usersUserGroupIds = await this.userDao.getUserGroupIdsByUserId(userId)

    if (!usersUserGroupIds.length) return []

    const userSteps = await this.userGroupDao.getStepIdsByUserGroups(usersUserGroupIds, ['stepId'])

    if (!userSteps.length) return []

    const userStepsIds = userSteps.map((step) => step.stepId)

    return await this.stepDAO.getOrdersByStepIds(userStepsIds)
  }
}
