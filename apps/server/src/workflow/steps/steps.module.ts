import { Module } from '@nestjs/common'
import { DatabaseModule } from '@pro3/database'
import { StepsController } from './steps.controller'
import { StepsService } from './steps.service'

@Module({
  imports: [DatabaseModule],
  controllers: [StepsController],
  providers: [StepsService]
})
export class StepsModule {}
