import { reset, seed } from 'drizzle-seed'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import lodash from 'lodash'
const { uniq: _uniq, uniqBy } = lodash

import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import * as EntitiesSchema from './schemas/index.ts'
import { postgresqlConnection } from './database/config/utils.ts'
import { exit } from 'process'

const DATABASE_URL = postgresqlConnection()
console.log('DB Connection:', DATABASE_URL)

const getGroupedSteps = async (db: NodePgDatabase) => {
  const steps = await db.select().from(EntitiesSchema.steps).execute()

  const groupedSteps = steps.reduce(
    (acc, step) => {
      const screenId = step.screenId.toString()
      if (!acc[screenId]) {
        acc[screenId] = []
      }
      acc[screenId].push(step)
      return acc
    },
    {} as Record<string, typeof steps>
  )

  return groupedSteps
}

const generateTransitions = async (
  db: NodePgDatabase
): Promise<EntitiesSchema.TransitionEntityInsert[]> => {
  const groupedSteps = await getGroupedSteps(db)

  const transitions = []
  for (const screenId in groupedSteps) {
    const steps = groupedSteps[screenId]
    for (let i = 1; i <= steps.length - 2; i++) {
      const getRandomNumber = () =>
        Math.floor(Math.random() * Math.abs((steps.length / (i + 1)) * 10))
      let toStepId = i + getRandomNumber()

      do {
        const randomZero = Math.random() > 0.9 ? 1 : 0
        toStepId = i + getRandomNumber() * randomZero
      } while (toStepId === i || toStepId >= steps.length)

      const transition = {
        fromStepId: steps[i].id,
        toStepId: steps[toStepId].id,
        screenId: screenId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      transitions.push(transition)
    }
  }

  return transitions
}

function generateLabels(count: number) {
  const result = []
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let i = 0

  while (result.length < count) {
    const letter = alphabet[i % 26]
    const suffix = Math.floor(i / 26)
    result.push(suffix === 0 ? letter : letter + suffix)
    i++
  }

  return result
}

async function main() {
  console.log('Starting Seeding')

  const db = drizzle(DATABASE_URL)
  await reset(db, EntitiesSchema)

  const {
    transitions,
    stepsToUserGroups, // exclude
    usersToUserGroups,
    orderActions: _orderActions,
    ...rest
  } = EntitiesSchema
  await seed(db, rest, { count: 5 }).refine((f) => ({
    screens: {
      count: 1
    },
    steps: {
      columns: {
        name: f.valuesFromArray({
          values: generateLabels(30),
          isUnique: true
        })
      }
    },
    userGroups: {
      count: 3,
      columns: {
        name: f.valuesFromArray({
          values: Array.from({ length: 50 }, (_, i) => `User Group ${i + 1}`),
          isUnique: true
        })
      }
    }
  }))
  // Now seed the M2M yourself
  const allSteps = await db.select().from(EntitiesSchema.steps)
  const allGroups = await db.select().from(EntitiesSchema.userGroups)

  const links = []
  for (const step of allSteps) {
    const n = 1 + Math.floor(Math.random() * 2) // 1–3 groups per step
    // pick n distinct groups for this step
    const pool = [...allGroups].sort(() => Math.random() - 0.5).slice(0, n)
    for (const g of pool) {
      links.push({ stepId: step.id, userGroupId: g.id })
    }
  }

  // de-dupe by (stepId,userGroupId)
  const uniqueLinks = Array.from(
    new Map(links.map((p) => [`${p.stepId}:${p.userGroupId}`, p])).values()
  )

  // insert with UPSERT guard
  await db
    .insert(stepsToUserGroups)
    .values(uniqueLinks)
    .onConflictDoNothing({
      target: [stepsToUserGroups.stepId, stepsToUserGroups.userGroupId]
    })
  // Get all steps to use for orders and relationships
  // console.log('Getting steps...')
  // const allSteps = await db.select().from(EntitiesSchema.steps).execute()

  // // Create 20 orders with random step assignments
  // const orderNames = generateLabels(3).map((label) => `Order ${label}`)
  // const orderData = orderNames.map((name) => ({
  //   name,
  //   type: orderTypes[Math.floor(Math.random() * orderTypes.length)],
  //   stepId: allSteps[Math.floor(Math.random() * allSteps.length)].id,
  //   createdAt: new Date(),
  //   updatedAt: new Date()
  // }))

  // console.log('Inserting orders...')
  // await db.insert(EntitiesSchema.orders).values(orderData).execute()

  console.log('Generating transitions...')
  const transitionsData = await generateTransitions(db)

  console.log('Inserting transitions...')
  await db.insert(transitions).values(transitionsData).execute()

  const allUsers = await db.select().from(EntitiesSchema.users)

  const userGroupLinks: Array<{ userId: string; userGroupId: string }> = []

  for (const user of allUsers) {
    // 1–2 groups per user (tweak as you like)
    const n = 1 + Math.floor(Math.random() * 2)
    const chosen = [...allGroups].sort(() => Math.random() - 0.5).slice(0, n)
    for (const g of chosen) userGroupLinks.push({ userId: user.id, userGroupId: g.id })
  }

  const uniqueUserGroupLinks = uniqBy(userGroupLinks, (p) => `${p.userId}:${p.userGroupId}`)

  await db
    .insert(usersToUserGroups)
    .values(uniqueUserGroupLinks)
    .onConflictDoNothing({
      target: [usersToUserGroups.userId, usersToUserGroups.userGroupId]
    })

  // Get user groups
  // console.log('Creating step-to-usergroup relationships...')
  // const userGroups = await db.select().from(EntitiesSchema.userGroups).execute()

  // // Create relationships between steps and user groups
  // const stepsToUserGroups = []
  // // Create a pool of available user groups that we'll remove from as we assign them
  // const availableUserGroups = [...userGroups].sort(() => Math.random() - 0.5)

  // for (const step of allSteps) {
  //   // Calculate how many groups to assign (1-3, but limited by available groups)
  //   const maxPossibleGroups = Math.min(3, availableUserGroups.length)
  //   if (maxPossibleGroups === 0) {
  //     console.log('Warning: Ran out of available user groups')
  //     break
  //   }
  //   const numGroups = Math.max(1, Math.min(maxPossibleGroups, Math.floor(Math.random() * 3) + 1))

  //   // Take groups from the available pool
  //   const selectedGroups = availableUserGroups.splice(0, numGroups)

  //   // Log the assignment
  //   console.log(`Step ${step.name}: Assigning ${numGroups} groups`)

  //   // Add relationships
  //   for (const group of selectedGroups) {
  //     stepsToUserGroups.push({
  //       stepId: step.id,
  //       userGroupId: group.id
  //     })
  //   }
  // }

  // // Verify no step has more than 3 groups
  // const stepCounts = new Map()
  // for (const rel of stepsToUserGroups) {
  //   const count = (stepCounts.get(rel.stepId) || 0) + 1
  //   stepCounts.set(rel.stepId, count)
  //   if (count > 3) {
  //     console.error(`Error: Step ${rel.stepId} has ${count} groups!`)
  //   }
  // }
  // const uniqueStepsToUserGroups = _uniq(stepsToUserGroups)

  // console.log('Inserting step-to-usergroup relationships...')
  // console.log(uniqueStepsToUserGroups)
  // await db.insert(EntitiesSchema.stepsToUserGroups).values(uniqueStepsToUserGroups).execute()

  // // Get all users to assign them to user groups
  // console.log('Getting users...')
  // const allUsers = await db.select().from(EntitiesSchema.users).execute()

  // // Create relationships between users and user groups
  // console.log('Creating user-to-usergroup relationships...')
  // const usersToUserGroups = []

  // // Create a pool of available user groups for each user
  // for (const user of allUsers) {
  //   // Assign 1-2 random user groups to each user
  //   const numGroups = Math.floor(Math.random() * 2) + 1 // 1 or 2
  //   const shuffledGroups = [...userGroups].sort(() => Math.random() - 0.5).slice(0, numGroups)

  //   // Add relationships
  //   for (const group of shuffledGroups) {
  //     usersToUserGroups.push({
  //       userId: user.id,
  //       userGroupId: group.id
  //     })
  //   }
  // }

  // console.log('Inserting user-to-usergroup relationships...')
  // const uniqueUsersToUserGroups = _uniq(usersToUserGroups)
  // console.log(uniqueUsersToUserGroups)
  // await db.insert(usersToUserGroups).values(uniqueUsersToUserGroups).execute()

  console.log('Finished')
  exit()
}
main()
