import { OrderDao } from './workflow/order.dao.ts'

import { ScreenDao } from './workflow/screen.dao.ts'

import { StepDao } from './workflow/step.dao.ts'

import { TransitionDao } from './workflow/transition.dao.ts'

import { OrderActionDao } from './workflow/orderAction.dao.ts'

import { UserDao } from './authorization/user.dao.ts'
import { OrganizationDao } from './authorization/organization.dao.ts'
import { UserGroupDao } from './authorization/userGroup.dao.ts'

export const DAOs = [
  OrderDao,
  ScreenDao,
  StepDao,
  TransitionDao,
  OrderActionDao,
  UserDao,
  OrganizationDao,
  UserGroupDao
]

export {
  OrderDao,
  ScreenDao,
  StepDao,
  TransitionDao,
  OrderActionDao,
  UserDao,
  OrganizationDao,
  UserGroupDao
}
