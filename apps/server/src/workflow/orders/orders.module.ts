import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { DatabaseModule } from '@pro3/database'

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
