import { Module } from '@nestjs/common'
import { OrganizationsController } from './organization.controller'
import { OrganizationsService } from './organization.service'
import { DatabaseModule } from '@pro3/database'

@Module({
  imports: [DatabaseModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})
export class OrganizationsModule {}
