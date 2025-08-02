import { flexRender } from '@tanstack/react-table'

import useRowCells from './useRowCells'
import { Box, styled, TableCell, TableRow, TableRowProps } from '@mui/material'
import Headers from '../../Headers'
import RowIndent from '../RowIndent'
import { TableRowData, Virtualizer } from '../../../types'

export type RowProps = {
  row: TableRowData
  isLastRow: boolean
  virtualizer: Virtualizer
  virtualRowIndex: number
}

const StyledTableRow = styled(TableRow)<TableRowProps>(() => ({
  display: 'flex',
  flexDirection: 'row'
}))

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop: string) => prop !== 'isLastRow'
})<{ isLastRow: boolean }>(({ isLastRow }) => ({
  display: 'flex',
  ...(isLastRow && {
    border: 'none'
  })
}))

const ScrollContainer = styled(Box)(
  ({ width }) => `
  width: ${width}';
  height: 200px;
  overflow-y: scroll;

  /* Hide scrollbar - cross browser */
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;       /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;                /* Chrome, Safari */
  }
`
)

const Row = ({ row, isLastRow, virtualizer, virtualRowIndex }: RowProps): JSX.Element | null => {
  const rowCells = useRowCells(row)

  const hasSubRow = row.getIsExpanded() && row.subRows.length

  // console.log(row, row.original.id)
  const depth = row.depth
  return (
    <Box
      style={{
        // width: '100%',
        display: 'flex',
        ...(depth > 0 && { borderRight: '1px solid #4b4b4b' }),
        flexDirection: 'row',
        position: 'relative'
      }}
      ref={virtualizer.measureElement}
      data-index={virtualRowIndex}
    >
      <RowIndent depth={depth} />
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: `${20 * depth}px`
        }}
      >
        <StyledTableRow component={Box}>
          {rowCells.map((cell) => (
            <StyledTableCell key={`${cell.id}${cell.row.id}`} component={Box} isLastRow={isLastRow}>
              <ScrollContainer width={cell.column.getSize()}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </ScrollContainer>
            </StyledTableCell>
          ))}
        </StyledTableRow>
        {hasSubRow ? <Headers depth={depth + 1} /> : null}
      </Box>
    </Box>
  )
}

export default Row
