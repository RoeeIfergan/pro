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

export type ScreenRelations = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  steps: Step[]
  transitions: Transition[]
}

export type Step = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  screenId: string
  userGroupIds: string[]
}

export type Transition = {
  id: string
  createdAt: Date
  updatedAt: Date
  screenId: string
  fromStepId: string
  toStepId: string
}

export type Organization = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type User = {
  id: string
  name: string
  organizationId: string
  userGroupIds: string[]
  createdAt: Date
  updatedAt: Date
}

export type UserGroup = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type UserWithGroups = {
  user: User
  userGroups: UserGroup[]
}
