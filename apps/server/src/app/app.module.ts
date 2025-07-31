import { Module } from '@nestjs/common'
import { FrontendModule } from './frontend/frontend.module'
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown'
import { ConfigModule } from '@nestjs/config'
import { configuration } from './config/configuration'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    CacheModule.register(),
    FrontendModule,
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration] })
  ]
  // controllers: [AppController],
  // providers: [AppService]
})
export class AppModule {}
