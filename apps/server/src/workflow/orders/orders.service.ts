import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { OrderDao, OrderEntityInsert, TransitionDao } from '@pro3/database'
import { OrderEntity } from '@pro3/database/'
import lodash from 'lodash'
const { groupBy: _groupBy } = lodash

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderDao: OrderDao,
    private readonly transitionDAO: TransitionDao
  ) {}

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

  async approveOrders(orderIds: string[], directStep?: string): Promise<OrderEntity[]> {
    if (directStep) {
      const transitionsToDirectStep = await this.transitionDAO.getToFromStepId(directStep)

      const isValid = orderIds.every((orderId) => {
        transitionsToDirectStep.some((transition) => transition.fromStepId === orderId)
      })

      if (!isValid) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Invalid directStep'
          },
          HttpStatus.FORBIDDEN
        )
      }
    }
    const orders = await this.orderDao.getByIds(orderIds)
    const groupsOrdersBySteps = _groupBy(orders, 'stepId')

    await Promise.all(
      Object.values(groupsOrdersBySteps).map(async (groupsOrdersByStep) => {
        const transitionsFromSteps = await this.transitionDAO.getByFromStepIds([
          groupsOrdersByStep[0].stepId
        ])

        const defaultTransitions = transitionsFromSteps.filter(
          (transition) => !transition.isCustomRoute
        )
        if (defaultTransitions.length > 1 || defaultTransitions.length === 0) {
          //TODO: Code is correct, seed is incorrect. Transitions are wrong (they are backwards)
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: `Found ${defaultTransitions.length} default transtions`
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          )
        }
        const defaultTransition = defaultTransitions[0]

        await this.orderDao.approveOrders(orderIds, defaultTransition.toStepId)
      })
    )
  }
}
