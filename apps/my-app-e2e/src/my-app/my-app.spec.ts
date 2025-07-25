import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@pro2/my-app/src/app/app.module'
import { AppService } from '@pro2/my-app/src/app/app.service'
import { INestApplication } from '@nestjs/common'

describe('GET /api', () => {
  let app: INestApplication
  const appService = { getData: () => ({ message: 'Hello API' }) }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('should return a message', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(appService.getData())
  })

  afterAll(async () => {
    await app.close()
  })
})
