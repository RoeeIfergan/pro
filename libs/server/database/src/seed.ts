import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { reset, seed } from 'drizzle-seed'

import dotenv from 'dotenv'
dotenv.config({ path: '../../../apps/server/.env' })

import { orderTypes } from '@pro3/types'
import * as EntitiesSchema from './schemas/index.ts'
import { postgresqlConnection } from './database/config/utils.ts'

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
        fromStepId: steps[toStepId].id,
        toStepId: steps[i].id,
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
  const db = drizzle(DATABASE_URL)
  await reset(db, EntitiesSchema)

  const { transitions, ...rest } = EntitiesSchema
  await seed(db, rest, { count: 20 }).refine((f) => ({
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
      count: 50,
      columns: {
        name: f.valuesFromArray({
          values: Array.from({ length: 50 }, (_, i) => `User Group ${i + 1}`),
          isUnique: true
        })
      }
    }
  }))

  // Get all steps to use for orders and relationships
  console.log('Getting steps...')
  const allSteps = await db.select().from(EntitiesSchema.steps).execute()

  // Create 20 orders with random step assignments
  const orderNames = generateLabels(20).map((label) => `Order ${label}`)
  const orderData = orderNames.map((name) => ({
    name,
    type: orderTypes[Math.floor(Math.random() * orderTypes.length)],
    stepId: allSteps[Math.floor(Math.random() * allSteps.length)].id,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

  console.log('Inserting orders...')
  await db.insert(EntitiesSchema.orders).values(orderData).execute()

  console.log('Generating transitions...')
  const transitionsData = await generateTransitions(db)

  console.log('Inserting transitions...')
  await db.insert(transitions).values(transitionsData).execute()

  // Get user groups
  console.log('Creating step-to-usergroup relationships...')
  const userGroups = await db.select().from(EntitiesSchema.userGroups).execute()

  // Create relationships between steps and user groups
  const stepsToUserGroups = []
  // Create a pool of available user groups that we'll remove from as we assign them
  const availableUserGroups = [...userGroups].sort(() => Math.random() - 0.5)

  for (const step of allSteps) {
    // Calculate how many groups to assign (1-3, but limited by available groups)
    const maxPossibleGroups = Math.min(3, availableUserGroups.length)
    if (maxPossibleGroups === 0) {
      console.log('Warning: Ran out of available user groups')
      break
    }
    const numGroups = Math.max(1, Math.min(maxPossibleGroups, Math.floor(Math.random() * 3) + 1))

    // Take groups from the available pool
    const selectedGroups = availableUserGroups.splice(0, numGroups)

    // Log the assignment
    console.log(`Step ${step.name}: Assigning ${numGroups} groups`)

    // Add relationships
    for (const group of selectedGroups) {
      stepsToUserGroups.push({
        stepId: step.id,
        userGroupId: group.id
      })
    }
  }

  // Verify no step has more than 3 groups
  const stepCounts = new Map()
  for (const rel of stepsToUserGroups) {
    const count = (stepCounts.get(rel.stepId) || 0) + 1
    stepCounts.set(rel.stepId, count)
    if (count > 3) {
      console.error(`Error: Step ${rel.stepId} has ${count} groups!`)
    }
  }

  console.log('Inserting step-to-usergroup relationships...')
  await db.insert(EntitiesSchema.stepsToUserGroups).values(stepsToUserGroups).execute()

  // Get all users to assign them to user groups
  console.log('Getting users...')
  const allUsers = await db.select().from(EntitiesSchema.users).execute()

  // Create relationships between users and user groups
  console.log('Creating user-to-usergroup relationships...')
  const usersToUserGroups = []

  // Create a pool of available user groups for each user
  for (const user of allUsers) {
    // Assign 1-2 random user groups to each user
    const numGroups = Math.floor(Math.random() * 2) + 1 // 1 or 2
    const shuffledGroups = [...userGroups].sort(() => Math.random() - 0.5).slice(0, numGroups)

    // Add relationships
    for (const group of shuffledGroups) {
      usersToUserGroups.push({
        userId: user.id,
        userGroupId: group.id
      })
    }
  }

  console.log('Inserting user-to-usergroup relationships...')
  await db.insert(EntitiesSchema.usersToUserGroups).values(usersToUserGroups).execute()

  console.log('Finished')
}
main()
