import { Module, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { OrdersModule } from '../workflow/orders/orders.module'
import { ScreensModule } from '../workflow/screens/screens.module'
import { StepsModule } from '../workflow/steps/steps.module'
import { TransitionsModule } from '../workflow/transitions/transitions.module'
import { OrderActionsModule } from '../workflow/orderActions/orderActions.module'
import { UsersModule } from '../authorization/users/users.module'
import { UserGroupsModule } from '../authorization/userGroup/userGroup.module'
import { OrganizationsModule } from '../authorization/organization/organization.module'

@UsePipes(ZodValidationPipe)
@Module({
  imports: [
    OrdersModule,
    OrderActionsModule,
    ScreensModule,
    StepsModule,
    TransitionsModule,
    UsersModule,
    UserGroupsModule,
    OrganizationsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
