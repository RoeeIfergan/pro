import { Module } from '@nestjs/common'
import { FrontendService } from './frontend.service'
import { FrontendController } from './frontend.controller'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [CacheModule.register()],
  controllers: [FrontendController],
  providers: [FrontendService]
})
export class FrontendModule {}
