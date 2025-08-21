import { Module } from '@nestjs/common'
import { UserGroupsController } from './userGroup.controller'
import { UserGroupsService } from './userGroup.service'
import { DatabaseModule } from '@pro3/database'

@Module({
  imports: [DatabaseModule],
  controllers: [UserGroupsController],
  providers: [UserGroupsService]
})
export class UserGroupsModule {}
