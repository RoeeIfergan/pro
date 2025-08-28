import { multiSelectFields } from './examples/multiSelectFields'
import { layoutExamples } from './examples/layoutExamples'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ICollection, IOption, LazyLoaderType } from '../types'
import { lazyLoaderMap } from '../constants'
import { useCallback } from 'react'
import { baseCard } from './examples/baseCard'
import { dimaCard } from './examples/dimaCard'
import { emptyCard } from './examples/emptyCard'

const getCollections = async ({
  loadDepartments,
  loadPirates
}: {
  loadDepartments: () => Promise<IOption[]>
  loadPirates: () => Promise<IOption[]>
}): Promise<ICollection[]> => {
  return Promise.all([
    baseCard({ loadDepartments }),
    emptyCard,
    dimaCard({ loadPirates }),
    multiSelectFields(),
    layoutExamples()
  ])
}

export const useCollectionQuery = () => {
  const queryClient = useQueryClient()

  const loadDepartments = useCallback(
    () => lazyLoaderMap[LazyLoaderType.LOAD_DEPARTMENTS](queryClient),
    [queryClient]
  )

  const loadPirates = useCallback(
    () => lazyLoaderMap[LazyLoaderType.LOAD_PIRATES](queryClient),
    [queryClient]
  )

  return useQuery({
    queryKey: ['collections'],
    queryFn: () => getCollections({ loadDepartments, loadPirates })
  })
}
