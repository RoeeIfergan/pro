import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DatabaseModule } from '@pro3/database'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
