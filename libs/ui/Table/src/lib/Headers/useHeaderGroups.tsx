import { useMemo } from 'react'
import { useTableContext } from '../TableProvider'
import { HeaderGroup } from '@tanstack/react-table'
import { TData } from '../../types'

type depth = number
type useHeaderProps = { depth: depth }

//TODO: default props with depth 0?
const useHeaderGroups = ({ depth = 0 }: useHeaderProps): HeaderGroup<TData>[] | undefined => {
  const { table } = useTableContext()

  const tableHeaderGroups = table && table.getHeaderGroups()

  const headerGroups = useMemo(
    () => tableHeaderGroups.filter((headerGroup) => headerGroup.depth === depth),
    [tableHeaderGroups, depth]
  )

  return headerGroups
}

export default useHeaderGroups
