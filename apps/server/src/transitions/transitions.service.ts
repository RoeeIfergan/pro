import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { TransitionDao, TransitionEntity } from '@pro3/database'
import { CreateTransitionSchemaDTO } from '@pro3/schemas'

@Injectable()
export class TransitionsService {
  constructor(private readonly transitionDao: TransitionDao) {}

  async getById(id: string): Promise<TransitionEntity[]> {
    return await this.transitionDao.getById(id)
  }

  async getAllTransitions(): Promise<TransitionEntity[]> {
    return await this.transitionDao.getAll()
  }

  // async getAllTransitionRelations(id: string) {
  //   return await this.transitionDao.getAllTransitionRelations(id)
  // }

  async getPartOfById(id: string): Promise<Pick<TransitionEntity, 'id' | 'createdAt'>[]> {
    return await this.transitionDao.getPartOfById(id)
  }

  async addTransition(transition: CreateTransitionSchemaDTO) {
    return await this.transitionDao.insertTransition(transition)
  }

  async updateTransition(id: string, transition: Partial<TransitionEntity>) {
    const transitionToEdit = await this.transitionDao.updateTransition(id, transition)

    if (!transitionToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Transition not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return transitionToEdit
  }

  async deleteTransition(id: string) {
    const deletedTransition = await this.transitionDao.deleteTransition(id)

    if (!deletedTransition) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Transition not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedTransition
  }

  async deleteTransitions() {
    const deletedTransitions = await this.transitionDao.deleteAllTransitions()

    return deletedTransitions
  }
}
