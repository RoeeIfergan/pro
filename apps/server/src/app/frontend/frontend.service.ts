import { Logger, Injectable } from '@nestjs/common'
import path from 'path'
import util from 'util'
import fs from 'fs'

@Injectable()
export class FrontendService {
  async getManifest() {
    const isProduction = process.env.NODE_ENV === 'production'

    if (!isProduction) return {}

    Logger.log('Parsed Vite Manifest')

    const manifestPath = path.join(path.resolve(), 'dist/apps/client/.vite/manifest.json')
    const readFile = util.promisify(fs.readFile)
    const manifest = (await readFile(manifestPath)).toString()
    const parsedManifest = JSON.parse(manifest)

    return parsedManifest
  }
}
