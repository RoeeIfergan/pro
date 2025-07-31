import { Test, TestingModule } from '@nestjs/testing'
import { CacheModule } from '@nestjs/cache-manager'

import { FrontendService } from './frontend.service'
import { FrontendController } from './frontend.controller'

describe('FrontendController', () => {
  let controller: FrontendController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [FrontendController],
      providers: [FrontendService]
    }).compile()

    controller = module.get<FrontendController>(FrontendController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
