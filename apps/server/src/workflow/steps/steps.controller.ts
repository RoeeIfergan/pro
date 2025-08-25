import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UseZodGuard } from 'nestjs-zod'
import { StepsService } from './steps.service'
import { CreateStepSchemaDTO, GetStepByIdDTO, GetStepSchemaDTO } from '@pro3/schemas'

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Get()
  async getAllSteps(): Promise<GetStepSchemaDTO[]> {
    return this.stepsService.getAllSteps()
  }

  @Get(':id')
  @UseZodGuard('params', GetStepByIdDTO)
  async getById(@Param('id') stepId: string): Promise<GetStepSchemaDTO[]> {
    return this.stepsService.getById(stepId)
  }

  @Post()
  @UseZodGuard('body', CreateStepSchemaDTO)
  async addStep(@Body() step: CreateStepSchemaDTO): Promise<GetStepSchemaDTO[]> {
    return this.stepsService.addStep(step)
  }

  @Patch(':id')
  @UseZodGuard('params', GetStepByIdDTO)
  @UseZodGuard('body', CreateStepSchemaDTO)
  async updateStep(
    @Param('id') stepId: string,
    @Body() step: CreateStepSchemaDTO
  ): Promise<Partial<GetStepSchemaDTO>> {
    return this.stepsService.updateStep(stepId, step)
  }

  @Delete(':id')
  @UseZodGuard('params', GetStepByIdDTO)
  async deleteStep(@Param('id') stepId: string): Promise<Partial<GetStepSchemaDTO>> {
    return this.stepsService.deleteStep(stepId)
  }

  @Delete()
  async deleteAllSteps(): Promise<Partial<GetStepSchemaDTO>[]> {
    return this.stepsService.deleteSteps()
  }

  @Get(':id/userGroups')
  @UseZodGuard('params', GetStepByIdDTO)
  async getStepUserGroups(@Param('id') stepId: string) {
    return this.stepsService.getStepUserGroups(stepId)
  }

  @Get(':id/orders')
  @UseZodGuard('params', GetStepByIdDTO)
  async getStepOrders(@Param('id') stepId: string) {
    return this.stepsService.getStepOrders(stepId)
  }
}
