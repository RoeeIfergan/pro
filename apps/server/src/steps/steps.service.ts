import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { StepDao, StepEntity } from '@pro3/database'
import { CreateStepSchemaDTO } from '@pro3/schemas'

@Injectable()
export class StepsService {
  constructor(private readonly stepDao: StepDao) {}

  async getById(id: string): Promise<StepEntity[]> {
    return await this.stepDao.getById(id)
  }

  async getAllSteps(): Promise<StepEntity[]> {
    return await this.stepDao.getAll()
  }

  async getPartOfById(id: string): Promise<Pick<StepEntity, 'id' | 'createdAt'>[]> {
    return await this.stepDao.getPartOfById(id)
  }

  async addStep(step: CreateStepSchemaDTO) {
    return await this.stepDao.insertStep(step)
  }

  async updateStep(id: string, step: Partial<StepEntity>) {
    const stepToEdit = await this.stepDao.updateStep(id, step)

    if (!stepToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Step not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return stepToEdit
  }

  async deleteStep(id: string) {
    const deletedStep = await this.stepDao.deleteStep(id)

    if (!deletedStep) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Step not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedStep
  }

  async deleteSteps() {
    const deletedSteps = await this.stepDao.deleteAllSteps()

    return deletedSteps
  }
}
