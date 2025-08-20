import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Row, flexRender } from '@tanstack/react-table'

export interface GroupedRowProps<TData> {
  row: Row<TData>
  virtualRowSize: number
  colSpan: number
  virtualRowIndex?: number
  measureElement?: (el: Element | null) => void
}

export function GroupedRow<TData>({
  row,
  virtualRowSize,
  colSpan,
  virtualRowIndex,
  measureElement
}: GroupedRowProps<TData>) {
  const groupedCell = row.getVisibleCells().find((cell) => cell.getIsGrouped())
  const groupValue = groupedCell
    ? flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())
    : 'Group'
  const groupCount = row.subRows.length

  return (
    <TableRow
      data-index={virtualRowIndex}
      ref={measureElement}
      hover
      sx={{
        backgroundColor: 'primary.light',
        '&:hover': { backgroundColor: 'primary.main' },
        height: virtualRowSize,
        cursor: 'pointer'
      }}
      onClick={row.getToggleExpandedHandler()}
    >
      <TableCell
        colSpan={colSpan}
        sx={{
          fontWeight: 'bold',
          padding: '12px 16px',
          borderBottom: '2px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size='small' sx={{ color: 'primary.contrastText' }}>
            {row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Typography
            variant='subtitle1'
            component='span'
            sx={{ color: 'primary.contrastText', fontWeight: 600 }}
          >
            {groupValue}
          </Typography>
          <Typography
            variant='body2'
            component='span'
            sx={{ color: 'primary.contrastText', opacity: 0.8 }}
          >
            ({groupCount} {groupCount === 1 ? 'item' : 'items'})
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  )
}
