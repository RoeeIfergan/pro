import { Module, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { OrdersModule } from '../orders/orders.module'
import { ScreensModule } from '../screens/screens.module'
import { StepsModule } from '../steps/steps.module'
import { TransitionsModule } from '../transitions/transitions.module'
import { OrderActionsModule } from '../orderActions/orderActions.module'

@UsePipes(ZodValidationPipe)
@Module({
  imports: [OrdersModule, ScreensModule, StepsModule, TransitionsModule, OrderActionsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
