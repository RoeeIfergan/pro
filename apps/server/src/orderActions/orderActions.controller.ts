import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UseZodGuard } from 'nestjs-zod'
import { OrderActionsService } from './orderActions.service'
import {
  CreateOrderActionSchemaDTO,
  GetOrderActionByIdDTO,
  GetOrderActionSchemaDTO
} from '@pro3/database'

@Controller('orderActions')
export class OrderActionsController {
  constructor(private readonly screensService: OrderActionsService) {}

  @Get()
  async getAllOrderActions(): Promise<GetOrderActionSchemaDTO[]> {
    return this.screensService.getAllOrderActions()
  }

  // @Get('/AllRelations/:id')
  // async getAllOrderActionRelations(@Param('id') screenId: string) {
  //   return this.screensService.getAllOrderActionRelations(screenId)
  // }

  @Get(':id')
  @UseZodGuard('params', GetOrderActionByIdDTO)
  async getById(@Param('id') screenId: string): Promise<GetOrderActionSchemaDTO[]> {
    return this.screensService.getById(screenId)
  }

  @Post()
  @UseZodGuard('body', CreateOrderActionSchemaDTO)
  async addOrderAction(
    @Body() screen: CreateOrderActionSchemaDTO
  ): Promise<GetOrderActionSchemaDTO[]> {
    return this.screensService.addOrderAction(screen)
  }

  @Patch(':id')
  @UseZodGuard('params', GetOrderActionByIdDTO)
  @UseZodGuard('body', CreateOrderActionSchemaDTO)
  async updateOrderAction(
    @Param('id') screenId: string,
    @Body() screen: CreateOrderActionSchemaDTO
  ): Promise<Partial<GetOrderActionSchemaDTO>> {
    return this.screensService.updateOrderAction(screenId, screen)
  }

  @Delete(':id')
  @UseZodGuard('params', GetOrderActionByIdDTO)
  async deleteOrderAction(
    @Param('id') screenId: string
  ): Promise<Partial<GetOrderActionSchemaDTO>> {
    return this.screensService.deleteOrderAction(screenId)
  }

  @Delete()
  async deleteAllOrderActions(): Promise<Partial<GetOrderActionSchemaDTO>[]> {
    return this.screensService.deleteOrderActions()
  }
}
