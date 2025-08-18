import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UseZodGuard } from 'nestjs-zod'
import { TransitionsService } from './transitions.service'
import {
  CreateTransitionSchemaDTO,
  GetTransitionByIdDTO,
  GetTransitionSchemaDTO
} from '@pro3/database'

@Controller('transitions')
export class TransitionsController {
  constructor(private readonly screensService: TransitionsService) {}

  @Get()
  async getAllTransitions(): Promise<GetTransitionSchemaDTO[]> {
    return this.screensService.getAllTransitions()
  }

  // @Get('/AllRelations/:id')
  // async getAllTransitionRelations(@Param('id') screenId: string) {
  //   return this.screensService.getAllTransitionRelations(screenId)
  // }

  @Get(':id')
  @UseZodGuard('params', GetTransitionByIdDTO)
  async getById(@Param('id') screenId: string): Promise<GetTransitionSchemaDTO[]> {
    return this.screensService.getById(screenId)
  }

  @Post()
  @UseZodGuard('body', CreateTransitionSchemaDTO)
  async addTransition(
    @Body() screen: CreateTransitionSchemaDTO
  ): Promise<GetTransitionSchemaDTO[]> {
    return this.screensService.addTransition(screen)
  }

  @Patch(':id')
  @UseZodGuard('params', GetTransitionByIdDTO)
  @UseZodGuard('body', CreateTransitionSchemaDTO)
  async updateTransition(
    @Param('id') screenId: string,
    @Body() screen: CreateTransitionSchemaDTO
  ): Promise<Partial<GetTransitionSchemaDTO>> {
    return this.screensService.updateTransition(screenId, screen)
  }

  @Delete(':id')
  @UseZodGuard('params', GetTransitionByIdDTO)
  async deleteTransition(@Param('id') screenId: string): Promise<Partial<GetTransitionSchemaDTO>> {
    return this.screensService.deleteTransition(screenId)
  }

  @Delete()
  async deleteAllTransitions(): Promise<Partial<GetTransitionSchemaDTO>[]> {
    return this.screensService.deleteTransitions()
  }
}
