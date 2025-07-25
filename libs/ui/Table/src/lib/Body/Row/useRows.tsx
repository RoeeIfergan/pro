import { ReactTableRow } from './types'
import { useTableContext } from '../../TableProvider'
import { Virtualizer } from '@tanstack/react-virtual'
import { useMemo } from 'react'

const defaultRows: ReactTableRow[] = []

const useRows = (
  virtualizer: Virtualizer<undefined, Element>
): ReactTableRow[] => {
  const { table } = useTableContext()

  const visibleRows = table?.getRowModel().rows //.filter(r => r.depth === depth)

  const rows = visibleRows || defaultRows

  const virtualItems = virtualizer.getVirtualItems()

  return useMemo(
    () =>
      virtualItems?.reduce((acc, virtualRow) => {
        const row = rows[virtualRow.index]

        acc.push({
          row,
          virtualRow
        })

        return acc
      }, []),
    [rows, virtualItems]
  )
}

export default useRows
