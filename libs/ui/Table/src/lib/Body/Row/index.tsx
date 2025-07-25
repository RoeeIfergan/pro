import { flexRender } from '@tanstack/react-table'

import useRowCells from './useRowCells'
import { Box, styled, TableCell, TableRow } from '@mui/material'
import { ReactTableRow } from './types'
import { Virtualizer } from '@tanstack/react-virtual'
import Headers from '../../Headers'
import RowIndent from '../RowIndent'
export type RowProps = {
  row: ReactTableRow
  isLastRow: boolean
  virtualizer: Virtualizer<undefined, Element>
  virtualRowIndex: number
}

const StyledTableRow = styled(TableRow)(() => ({
  display: 'flex',
  flexDirection: 'row'
}))

const StyledTableCell = styled(TableCell)(({ theme, isLastRow }) => ({
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

  console.log(row, row.original.id)
  const depth = row.depth
  return (
    <Box
      style={{
        width: '100%',
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
            <StyledTableCell
              key={`${cell.id}${cell.row.original.id}`}
              component={Box}
              isLastRow={isLastRow}
            >
              <ScrollContainer width={cell.column.getSize()}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </ScrollContainer>
            </StyledTableCell>
          ))}
        </StyledTableRow>
        {hasSubRow ? <Headers depth={row.depth + 1} /> : null}
      </Box>
    </Box>
  )
}

export default Row
