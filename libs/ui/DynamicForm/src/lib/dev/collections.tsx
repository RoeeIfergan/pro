import { multiSelectFields } from './examples/multiSelectFields'
import { layoutExamples } from './examples/layoutExamples'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ICardSchemaMeta, IOption, LazyLoaderType } from '../types'
import { z } from 'zod'
import { lazyLoaderMap } from '../constants'
import { useCallback } from 'react'
import { baseCard } from './examples/baseCard'

export type ICollection<T extends Record<string, unknown> = Record<string, unknown>> = {
  name: string
  schema: z.ZodType<T>
  defaultValues: T
  uiSchema: ICardSchemaMeta<T>
}

const getCollections = async ({
  loadDepartments
}: {
  loadDepartments: () => Promise<IOption[]>
}): Promise<ICollection[]> => {
  return Promise.all([baseCard({ loadDepartments }), multiSelectFields(), layoutExamples()])
}

export const useCollectionQuery = () => {
  const queryClient = useQueryClient()
  const loadDepartments = useCallback(
    () => lazyLoaderMap[LazyLoaderType.LOAD_DEPARTMENTS](queryClient),
    [queryClient]
  )

  return useQuery({
    queryKey: ['collections'],
    queryFn: () => getCollections({ loadDepartments })
  })
}
