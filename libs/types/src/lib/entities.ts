import { OrderType } from './utils.ts'

export type Order = {
  id: string
  name: string
  type: OrderType
  createdAt: Date
  updatedAt: Date
  stepId: string
}

export type OrderAction = {
  stepId: string
  id: string
  createdAt: Date
  updatedAt: Date
  orderId: string
}

export type Screen = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type Step = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  screenId: string
}

export type Transition = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  screenId: string
  fromStepId: string
  toStepId: string
}
