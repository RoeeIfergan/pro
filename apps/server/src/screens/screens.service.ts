import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ScreenDao, ScreenEntity } from '@pro3/database'

@Injectable()
export class ScreensService {
  constructor(private readonly screenDao: ScreenDao) {}

  async getById(id: string): Promise<ScreenEntity[]> {
    return await this.screenDao.getById(id)
  }

  async getAllScreens(): Promise<ScreenEntity[]> {
    return await this.screenDao.getAll()
  }

  async getAllScreenRelations(id: string) {
    return await this.screenDao.getAllScreenRelations(id)
  }

  async getPartOfById(id: string): Promise<Pick<ScreenEntity, 'id' | 'createdAt'>[]> {
    return await this.screenDao.getPartOfById(id)
  }

  async addScreen(screenName: string) {
    return await this.screenDao.insertScreen({
      name: screenName
    })
  }

  async updateScreen(id: string, screen: Partial<ScreenEntity>) {
    const screenToEdit = await this.screenDao.updateScreen(id, screen)

    if (!screenToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Screen not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return screenToEdit
  }

  async deleteScreen(id: string) {
    const deletedScreen = await this.screenDao.deleteScreen(id)

    if (!deletedScreen) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Screen not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedScreen
  }

  async deleteScreens() {
    const deletedScreens = await this.screenDao.deleteAllScreens()

    return deletedScreens
  }
}
