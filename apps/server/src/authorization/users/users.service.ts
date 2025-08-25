import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserDao, UserEntityInsert } from '@pro3/database'
import { UserEntity } from '@pro3/database/'

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  async getById(id: string): Promise<UserEntity[]> {
    return await this.userDao.getById(id)
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userDao.getAll()
  }

  async getPartOfById(id: string): Promise<Pick<UserEntity, 'id' | 'createdAt'>[]> {
    return await this.userDao.getPartOfById(id)
  }

  async addUser(user: UserEntityInsert) {
    return await this.userDao.insertUser(user)
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
    return await this.userDao.getUserOrders(userId)
  }
}
