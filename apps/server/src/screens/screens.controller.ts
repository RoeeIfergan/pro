import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UseZodGuard } from 'nestjs-zod'
import { ScreensService } from './screens.service'
import { CreateScreenDTO, GetScreenByIdDTO, ScreenDTO } from '@pro3/database'

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Get()
  async getAllScreens(): Promise<ScreenDTO[]> {
    return this.screensService.getAllScreens()
  }

  @Get('/AllRelations/:id')
  async getAllScreenRelations(@Param('id') screenId: string) {
    return this.screensService.getAllScreenRelations(screenId)
  }

  @Get(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  async getById(@Param('id') screenId: string): Promise<ScreenDTO[]> {
    return this.screensService.getById(screenId)
  }

  @Post()
  @UseZodGuard('body', CreateScreenDTO)
  async addScreen(@Body() screen: CreateScreenDTO): Promise<ScreenDTO[]> {
    return this.screensService.addScreen(screen.name)
  }

  @Patch(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  @UseZodGuard('body', CreateScreenDTO)
  async updateScreen(
    @Param('id') screenId: string,
    @Body() screen: CreateScreenDTO
  ): Promise<Partial<ScreenDTO>> {
    return this.screensService.updateScreen(screenId, screen)
  }

  @Delete(':id')
  @UseZodGuard('params', GetScreenByIdDTO)
  async deleteScreen(@Param('id') screenId: string): Promise<Partial<ScreenDTO>> {
    return this.screensService.deleteScreen(screenId)
  }

  @Delete()
  async deleteAllScreens(): Promise<Partial<ScreenDTO>[]> {
    return this.screensService.deleteScreens()
  }
}
