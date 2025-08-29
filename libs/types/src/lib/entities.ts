import { OrderType } from './utils.ts'

export type TOrder = {
  id: string
  name: string
  type: OrderType
  createdAt: Date
  updatedAt: Date
  stepId: string
}

export type TOrderAction = {
  stepId: string
  id: string
  createdAt: Date
  updatedAt: Date
  orderId: string
}

export type TScreen = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type TScreenRelations = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  steps: TStep[]
  transitions: TTransition[]
}

export type TStep = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  screenId: string
  // userGroupIds: string[]
}

export type TTransition = {
  id: string
  createdAt: Date
  updatedAt: Date
  screenId: string
  fromStepId: string
  toStepId: string
}

export type TOrganization = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type TUser = {
  id: string
  name: string
  organizationId: string
  userGroupIds: string[]
  createdAt: Date
  updatedAt: Date
}

export type TFullUser = {
  userGroups: TUserGroup[]
  stepsIds: string[]
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  organizationId: string
}

export type TUserGroup = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type TUserWithGroups = {
  user: TUser
  steps: TStep[]
  userGroups: TUserGroup[]
}
