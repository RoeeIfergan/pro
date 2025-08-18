import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UseZodGuard } from 'nestjs-zod'
import { ScreensService } from './screens.service'
import { CreateScreenSchemaDTO, GetScreenByIdDTO, GetScreenSchemaDTO } from '@pro3/database'

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  async getAllScreens(): Promise<GetScreenSchemaDTO[]> {
    return this.screensService.getAllScreens()
  }

  @Get('/AllRelations/:id')
  async getAllScreenRelations(@Param('id') screenId: string) {
    return this.screensService.getAllScreenRelations(screenId)
  }

  @Get(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  async getById(@Param('id') screenId: string): Promise<GetScreenSchemaDTO[]> {
    return this.screensService.getById(screenId)
  }

  @Post()
  @UseZodGuard('body', CreateScreenSchemaDTO)
  async addScreen(@Body() screen: CreateScreenSchemaDTO): Promise<GetScreenSchemaDTO[]> {
    return this.screensService.addScreen(screen.name)
  }

  @Patch(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  @UseZodGuard('body', CreateScreenSchemaDTO)
  async updateScreen(
    @Param('id') screenId: string,
    @Body() screen: CreateScreenSchemaDTO
  ): Promise<Partial<GetScreenSchemaDTO>> {
    return this.screensService.updateScreen(screenId, screen)
  }

  @Delete(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  async deleteScreen(@Param('id') screenId: string): Promise<Partial<GetScreenSchemaDTO>> {
    return this.screensService.deleteScreen(screenId)
  }

  @Delete()
  async deleteAllScreens(): Promise<Partial<GetScreenSchemaDTO>[]> {
    return this.screensService.deleteScreens()
  }
}
