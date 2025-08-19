import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { OrderDao, OrderEntityInsert } from '@pro3/database'
import { OrderEntity } from '@pro3/database/'

@Injectable()
export class OrdersService {
  constructor(private readonly orderDao: OrderDao) {}

  async getById(id: string): Promise<OrderEntity[]> {
    return await this.orderDao.getById(id)
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    return await this.orderDao.getAll()
  }

  async getPartOfById(id: string): Promise<Pick<OrderEntity, 'id' | 'createdAt'>[]> {
    return await this.orderDao.getPartOfById(id)
  }

  async addOrder(order: OrderEntityInsert) {
    return await this.orderDao.insertOrder(order)
  }

  async updateOrder(id: string, order: Partial<OrderEntity>) {
    const orderToEdit = await this.orderDao.updateOrder(id, order)

    if (!orderToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Order not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return orderToEdit
  }

  async deleteOrder(id: string) {
    const deletedOrder = await this.orderDao.deleteOrder(id)

    if (!deletedOrder) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Order not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedOrder
  }

  async deleteOrders() {
    const deletedOrders = await this.orderDao.deleteAllOrders()

    return deletedOrders
  }
}
