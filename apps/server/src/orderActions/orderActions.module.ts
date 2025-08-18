import { Module } from '@nestjs/common'
import { DatabaseModule } from '@pro3/database'

import { OrderActionsService } from './orderActions.service'
import { OrderActionsController } from './orderActions.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [OrderActionsController],
  providers: [OrderActionsService]
})
export class OrderActionsModule {}
