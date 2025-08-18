import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { GetOrderByIdDTO, CreateOrderSchemaDTO, GetOrderSchemaDTO } from '@pro3/database'
import { UseZodGuard } from 'nestjs-zod'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(): Promise<GetOrderSchemaDTO[]> {
    return this.ordersService.getAllOrders()
  }

  @Get(':id')
  @UseZodGuard('params', GetOrderByIdDTO)
  async getById(@Param('id') orderId: string): Promise<GetOrderSchemaDTO[]> {
    return this.ordersService.getById(orderId)
  }

  @Post()
  @UseZodGuard('body', CreateOrderSchemaDTO)
  async addOrder(@Body() order: CreateOrderSchemaDTO): Promise<GetOrderSchemaDTO[]> {
    return this.ordersService.addOrder(order)
  }

  @Patch(':id')
  @UseZodGuard('params', GetOrderByIdDTO)
  @UseZodGuard('body', CreateOrderSchemaDTO)
  async updateOrder(
    @Param('id') orderId: string,
    @Body() order: CreateOrderSchemaDTO
  ): Promise<Partial<GetOrderSchemaDTO>> {
    return this.ordersService.updateOrder(orderId, order)
  }

  @Delete(':id')
  @UseZodGuard('params', GetOrderByIdDTO)
  async deleteOrder(@Param('id') orderId: string): Promise<Partial<GetOrderSchemaDTO>> {
    return this.ordersService.deleteOrder(orderId)
  }

  @Delete()
  async deleteAllOrders(): Promise<Partial<GetOrderSchemaDTO>[]> {
    return this.ordersService.deleteOrders()
  }
}
