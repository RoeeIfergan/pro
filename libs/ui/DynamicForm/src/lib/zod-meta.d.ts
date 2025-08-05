import 'zod'
import type { ICardSchemaMeta } from './types/types'

declare module 'zod' {
  namespace z {
    interface GlobalMeta extends ICardSchemaMeta {}
  }
}
