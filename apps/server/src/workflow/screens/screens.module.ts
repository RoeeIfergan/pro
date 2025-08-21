import { Module } from '@nestjs/common'
import { DatabaseModule } from '@pro3/database'

import { ScreensController } from './screens.controller'
import { ScreensService } from './screens.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ScreensController],
  providers: [ScreensService]
})
export class ScreensModule {}
