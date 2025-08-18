import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateOrderActionSchemaDTO, OrderActionDao, OrderActionEntity } from '@pro3/database'

@Injectable()
export class OrderActionsService {
  constructor(private readonly orderActionDao: OrderActionDao) {}

  async getById(id: string): Promise<OrderActionEntity[]> {
    return await this.orderActionDao.getById(id)
  }

  async getAllOrderActions(): Promise<OrderActionEntity[]> {
    return await this.orderActionDao.getAll()
  }

  // async getAllOrderActionRelations(id: string) {
  //   return await this.orderActionDao.getAllOrderActionRelations(id)
  // }

  async getPartOfById(id: string): Promise<Pick<OrderActionEntity, 'id' | 'createdAt'>[]> {
    return await this.orderActionDao.getPartOfById(id)
  }

  async addOrderAction(orderAction: CreateOrderActionSchemaDTO) {
    return await this.orderActionDao.insertOrderAction(orderAction)
  }

  async updateOrderAction(id: string, orderAction: Partial<OrderActionEntity>) {
    const orderActionToEdit = await this.orderActionDao.updateOrderAction(id, orderAction)

    if (!orderActionToEdit) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'OrderAction not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return orderActionToEdit
  }

  async deleteOrderAction(id: string) {
    const deletedOrderAction = await this.orderActionDao.deleteOrderAction(id)

    if (!deletedOrderAction) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'OrderAction not found'
        },
        HttpStatus.BAD_REQUEST
      )
    }
    return deletedOrderAction
  }

  async deleteOrderActions() {
    const deletedOrderActions = await this.orderActionDao.deleteAllOrderActions()

    return deletedOrderActions
  }
}
