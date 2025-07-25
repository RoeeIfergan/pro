import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  useTheme
} from '@mui/material'

import Body from '..'
import Headers from '../../Headers'
import { ReactTableRow } from './types'
import { useTableContext } from '../../TableProvider'
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

type SubTableProps = {
  row: ReactTableRow
  virtualizer: Virtualizer<undefined, Element>
}

type SubRowTable = {
  depth: number
  subRows?: ReactTableRow[]
}
const SubRowTable = ({ depth, subRows }: SubRowTable) => {
  const { width } = useTableContext()
  const tableContainerRef = useRef()

  const paddingRight = depth > 0 ? 10 : 0

  const virtualizer = useVirtualizer({
    count: subRows?.length,
    horizontal: false,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 42,
    // debug: true,
    overscan: 2
  })

  return (
    <TableCell style={{ padding: 0, border: 'none' }} component={Box}>
      <Box style={{ width: 1, position: 'relative' }}>
        <Box
          style={{
            width: width - paddingRight * 2 * depth,
            paddingRight: paddingRight * 2
          }}
        >
          <TableContainer
            component={Box}
            style={{
              overflow: 'hidden',
              width: '100%'
            }}
          >
            <div
              id='sub-table-div'
              ref={tableContainerRef}
              style={{
                overflow: 'auto',
                width: '100%',
                height: '600px'
              }}
            >
              <Table
                component={Box}
                size='small'
                stickyHeader
                style={{ width: '100%' }}
              >
                <Headers depth={depth} />
                {subRows && <Body virtualizer={virtualizer} depth={depth} />}
              </Table>
            </div>
          </TableContainer>
        </Box>
        <Box
          style={{
            position: 'absolute',
            left: -1 * (paddingRight - 1),
            top: -2 * paddingRight,
            width: paddingRight,
            height: '100%'
          }}
        >
          <div
            style={{
              width: '4',
              height: '100%',
              backgroundImage:
                'linear-gradient(#858585 50%, rgba(255,255,255,0) 0%)',
              backgroundPosition: 'left',
              backgroundSize: '1.5px 15px',
              backgroundRepeat: 'repeat-y'
            }}
          />
        </Box>
      </Box>
    </TableCell>
  )
}

const Footer = ({ depth }) => {
  const { width } = useTableContext()
  const theme = useTheme()
  const paddingRight = depth > 0 ? 10 : 0

  return (
    <TableCell
      style={{ padding: 0, border: 'none' }}
      // component={Box}
    >
      <Box style={{ width: 1, position: 'relative' }}>
        <Box
          style={{
            width: width - paddingRight * 3 * depth - 1,
            marginRight: paddingRight * 2,
            backgroundColor: '#444', //theme.palette.primary.light,
            height: `${5 + 2 * depth}px`,
            borderRadius: '0% 0% 100% 100%' //'2px 2px 10px 10px'
          }}
        >
          {/* תחתית הטבלה */}
        </Box>
      </Box>
    </TableCell>
  )
}
const SubRow = ({
  row,
  virtualRow,
  virtualizer
}: SubTableProps): JSX.Element | null => {
  const subRowsDepth = row.depth + 1

  return (
    <>
      <TableRow
        ref={virtualizer.measureElement}
        data-index={virtualRow.index}
        component={Box}
        id={row.id}
        style={{ width: '100%' }}
      >
        <SubRowTable depth={subRowsDepth} subRows={row.subRows} />
      </TableRow>
      {/* <TableRow   //TODO: Return the footer. should proably move inside SubRowTable
                component={Box}
                id={row.id}
                style={{ width: '100%' }}
            >
                <Footer depth={subRowsDepth} />
            </TableRow> */}
    </>
  )
}

export default SubRow
