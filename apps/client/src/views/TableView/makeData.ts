import { TData } from '@pro3/Table'
import { Override } from 'notistack'

// export type PIR = tdata

export type PIR = Override<
  TData,
  {
    id: string
    name: string
    subRows?: CollectionTarget[]
  }
>

export type CollectionTarget = Override<
  TData,
  {
    id: string
    name: string
    origin: string
    country: string
    subRows?: Demand[]
  }
>

export type Demand = TData & {
  id: string
  name: string
  color: string
  country: string
  startDate: string
  endDate: string
}

let randomNum = 0
const createDemand = (index: number): Demand => {
  randomNum += 1

  return {
    id: `demand-${index}-${randomNum}`,
    name: `דרישה-${index}`,
    color: Math.random() > 0.5 ? 'כן' : '-',
    country: getRandomCountry(index),
    startDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString(),
    subRows: []
  }
}

const countries = ['israel', 'usa', 'japan', 'denmark', 'mexico']
const getRandomCountry = (index: number) => countries[index % countries.length]
const createCollectionTarget = (index: number, demands: Demand[]): CollectionTarget => {
  randomNum += 1

  return {
    id: `collectionTarget-${index}-${randomNum}`,
    name: `שם יעד-${index}`,
    origin: `מקור-${index}`,
    country: getRandomCountry(index),
    subRows: demands
  }
}

const createPIR = (index: number, collectionTargets: CollectionTarget[]): PIR => {
  randomNum += 1

  return {
    id: `PIRasdasdaadsasdasdasdasdas-${index}-${randomNum}`,
    name: `שם ציח-${index}`,
    subRows: collectionTargets
  }
}

const createArray = (index: number) => Array(index).fill(null)

const getAmount = (amount: number, enableRandom: boolean) =>
  enableRandom ? Math.ceil(amount * Math.random() + 2) : amount

const createDemands = (
  demandsAmount: number,
  enableRandom: boolean,
  viewableEntities: string[]
) => {
  if (!viewableEntities.includes('demands')) {
    return []
  }

  return createArray(getAmount(demandsAmount, enableRandom)).map((demand, demandIndex) =>
    createDemand(demandIndex)
  )
}

export const makeData = (
  PIRAmount: number,
  CollectionTargetAmount: number,
  demandsAmount: number,
  enableRandom: boolean,
  viewableEntities: string[]
): PIR[] | CollectionTarget[] | Demand[] => {
  let data: PIR[] | CollectionTarget[] | Demand[]
  if (viewableEntities.includes('pirs')) {
    data = createArray(getAmount(PIRAmount, enableRandom)).map((PIR, pirIndex) =>
      createPIR(
        pirIndex,
        createArray(getAmount(CollectionTargetAmount, enableRandom)).map(
          (collectionTarget, collectionTargetIndex) =>
            createCollectionTarget(
              collectionTargetIndex,
              createDemands(demandsAmount, enableRandom, viewableEntities)
            )
        )
      )
    )
  } else {
    data = createArray(getAmount(CollectionTargetAmount, enableRandom)).map(
      (collectionTarget, collectionTargetIndex) => {
        return createCollectionTarget(
          collectionTargetIndex,
          createDemands(demandsAmount, enableRandom, viewableEntities)
        )
      }
    )
  }

  return data
}
