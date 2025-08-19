import { OrderType } from './utils.ts'

export type Order = {
  id: string
  name: string
  type: OrderType
  createdAt: Date
  updatedAt: Date
  stepId: string
}
