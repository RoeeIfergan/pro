import { Module } from '@nestjs/common'
import { DatabaseModule } from '@pro3/database'

import { TransitionsService } from './transitions.service'
import { TransitionsController } from './transitions.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [TransitionsController],
  providers: [TransitionsService]
})
export class TransitionsModule {}
