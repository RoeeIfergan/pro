import { useDebouncedCallback } from 'use-debounce'

import Row from './Row'
import useRows from './Row/useRows'
import { Box, styled, TableBody, TableCell, TableRow } from '@mui/material'
import { useTableContext } from '../TableProvider'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

const StyledTableBody = styled(TableBody)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  overflow: 'auto'
}))

type bodyProps = {
  width: number
  height: number
}

const OVERSCAN_SIZE = 5
const HEADER_UPDATE_DEBOUNCE = 100
const getFirstVisibleItem = (virtualizer) => {
  const scrollOffset = virtualizer.getScrollOffset()

  return virtualizer.getVirtualItems().find((item) => {
    return item.start + item.size > scrollOffset
  })
}

const useCalcFirstVisibleItem = (virtualizer, rows) => {
  const { setVisibleDepthRow } = useTableContext()

  const debouncedSetVisibleDepthRow = useDebouncedCallback(() => {
    const firstVisibleItem = getFirstVisibleItem(virtualizer)

    const firstVisibleItemIndex = firstVisibleItem?.index
    if (typeof firstVisibleItemIndex !== 'number') return

    const firstVisibleItemDepth = rows[firstVisibleItemIndex]?.depth

    setVisibleDepthRow(firstVisibleItemDepth)
  }, HEADER_UPDATE_DEBOUNCE)

  debouncedSetVisibleDepthRow()
}
const Body = ({ width, height }: bodyProps) => {
  const { table } = useTableContext()
  const tableContainerRef = useRef()
  const currentRows = table.getExpandedRowModel()?.rows
  const virtualizeAmount = currentRows.length || 0

  // const expandedRows = currentRows.filter(r => r.getIsExpanded())

  const virtualizer = useVirtualizer({
    count: virtualizeAmount,
    horizontal: false,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => 42,
    // debug: true,
    overscan: OVERSCAN_SIZE //TODO: Increase
  })

  const computedRows = useRows(virtualizer)

  useCalcFirstVisibleItem(virtualizer, currentRows)

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0

  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  console.log(computedRows)
  return (
    <Box style={{ width, height }}>
      <StyledTableBody component={Box} ref={tableContainerRef}>
        {paddingTop > 0 && (
          <TableRow component={Box}>
            <TableCell component={Box} style={{ height: `${paddingTop}px` }} />
          </TableRow>
        )}
        {computedRows.map(({ row, virtualRow }, rowIndex) => (
          <Row
            row={row}
            key={row.original.id}
            virtualizer={virtualizer}
            virtualRowIndex={virtualRow.index}
            isLastRow={rowIndex === computedRows.length - 1}
          />
        ))}
        {paddingBottom > 0 && (
          <TableRow component={Box}>
            <TableCell
              component={Box}
              style={{ height: `${paddingBottom}px` }}
            />
          </TableRow>
        )}
      </StyledTableBody>
    </Box>
  )
}

export default Body
