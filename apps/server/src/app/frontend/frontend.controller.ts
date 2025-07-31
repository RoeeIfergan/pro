import { Get, Controller, Render, UseInterceptors } from '@nestjs/common'
import { FrontendService } from './frontend.service'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller(['/', '/frontend/*'])
@UseInterceptors(CacheInterceptor)
export class FrontendController {
  constructor(private readonly frontendService: FrontendService) {}

  @Get()
  @Render('index.html.ejs')
  async root() {
    const manifest = await this.frontendService.getManifest()

    const data = {
      environment: process.env.NODE_ENV,
      manifest,
      viteServerPort: process.env.VITE_SERVER_PORT,
      CDN_URL: process.env.CDN_URL
    }

    return data
  }
}
