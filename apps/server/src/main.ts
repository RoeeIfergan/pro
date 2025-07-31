import { Logger, RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { patchNestJsSwagger } from 'nestjs-zod'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown'
import { NestExpressApplication } from '@nestjs/platform-express'
import path from 'path'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/frontend/*', method: RequestMethod.GET }
    ]
  })

  app.setBaseViewsDir(path.join(__dirname, 'views'))

  app.useStaticAssets(path.join(__dirname, '../cdn/public'), {
    prefix: '/public/'
  })
  app.useStaticAssets(path.join(__dirname, '../cdn/public/assets'), {
    prefix: '/assets/'
  })

  setupGracefulShutdown({ app })

  patchNestJsSwagger()

  const swaggerConfig = new DocumentBuilder().setTitle('Deliveries').build()

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentFactory)

  const port = process.env.SERVER_PORT || 3000
  await app.listen(port)

  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
