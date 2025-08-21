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
    orders: {
      columns: {
        type: f.valuesFromArray({ values: [...orderTypes] })
      }
    }
  }))

  console.log('Generating transitions...')
  const transitionsData = await generateTransitions(db)

  console.log('Inserting transitions...')
  await db.insert(transitions).values(transitionsData).execute()

  console.log('Finished')
}
main()
