import * as dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

const configSchema = z.object({
  db: z.object({ port: z.number() }),
  server: z.object({
    port: z.number()
  }),
  vite: z.object({
    serverPort: z.number()
  })
})

export const configuration = () => {
  dotenv.config({ path: path.join(process.cwd(), 'app', 'server') })
  const env: z.infer<typeof configSchema> = {
    db: {
      port: Number(process.env.DB_PORT)
    },
    server: {
      port: Number(process.env.SERVER_PORT)
    },
    vite: {
      serverPort: Number(process.env.VITE_SERVER_PORT)
    }
  }
  const config = configSchema.safeParse(env)
  if (!config.success) {
    throw new Error(`Failed validation environment. ${config.error.toString()}`)
  }
  return config.data
}
