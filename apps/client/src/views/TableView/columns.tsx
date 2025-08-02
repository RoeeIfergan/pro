import {
  AccessorKeyColumnDef,
  ColumnDef,
  createColumnHelper,
  DisplayColumnDef,
  GroupColumnDef
} from '@tanstack/react-table'
import { CollectionTarget, Demand, PIR } from './makeData'
import { Box, Checkbox, CheckboxProps, Chip } from '@mui/material'
import { TableRowData, TData } from '@pro3/Table'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

type entity = PIR | CollectionTarget | Demand
type entityKeys = keyof (PIR & CollectionTarget & Demand)

const columnHelper = createColumnHelper<TData | entity>()

// const pir: PIR = {
//   id: 'ads',
//   name: 'pir',
//   subRows: [
//     {
//       id: 'asd',
//       name: 'asd',
//       origin: 'asd',
//       country: 'asd',
//       subRows: [
//         {
//           id: 'asd',
//           name: 'asd',
//           color: 'asd',
//           country: 'asd',
//           startDate: 'asd',
//           endDate: 'asd'
//         }
//       ]
//     }
//   ]
// }
const StyledCheckbox = ({
  checked,
  indeterminate,
  ...rest
}: { checked: boolean; indeterminate: boolean } & CheckboxProps) => (
  <Checkbox indeterminate={indeterminate} value={checked} {...rest} />
)

const setExpandedSubRows = (rows: TableRowData[], value: boolean) => {
  if (!rows || rows.length === 0) return

  rows.forEach((row) => {
    row.toggleExpanded(value)
    setExpandedSubRows(row.subRows, value)
  })
}

const getToggleExpandedHandler = (row: TableRowData) => () => {
  const value = !row.getIsExpanded()

  row.toggleExpanded(value)

  if (!value) {
    setExpandedSubRows(row.subRows, value)
  }
}
const getSelectColumn = (content: JSX.Element | string): DisplayColumnDef<TData, unknown> =>
  columnHelper.display({
    id: 'select',
    size: 80,
    header: (props) => {
      const { table } = props

      return (
        <Box style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
          <StyledCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
          <Chip
            size='small'
            color='secondary'
            label={content}
            style={{ height: '20px', fontSize: '13px' }}
          />
        </Box>
      )
    },
    cell: ({ row }) => {
      return (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <StyledCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
          {content && row.subRows.length && row.getCanExpand() ? (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                style={{ height: '24px', cursor: 'pointer' }}
                onClick={getToggleExpandedHandler(row)}
              >
                {row.getIsExpanded() ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Box>
            </Box>
          ) : null}
        </Box>
      )
    }
  })

// const getCollapseByType = (content) => ({
//   id: 'type',
//   size: 20,
//   header: <div />,
//   cell: ({ row }) => {
//     return row.getCanExpand() ? (
//       <Typography
//         {...{
//           onClick: row.getToggleExpandedHandler()
//         }}
//         style={{
//           verticalAlign: 'middle',
//           display: 'inline-flex',
//           cursor: 'pointer'
//         }}
//       >
//         <Typography fontSize={10} style={{ alignContent: 'center' }}>
//           {content}
//         </Typography>
//         {row.getIsExpanded() ? <ExpandMoreIcons /> : <ExpandLessIcons />}
//         {/* {row.depth === 0 ? 'ציח' : row.depth === 1 ? 'יעד' : 'דרישה'}{row.getIsExpanded() ? <ExpandMoreIcons /> : <ExpandLessIcons />} */}
//       </Typography>
//     ) : (
//       '🔵'
//     )
//   }
// })
const createDefaultColumn = (accessorKey: entityKeys, header: string, size = 120) =>
  columnHelper.accessor(accessorKey, {
    header,
    size,
    cell: ({ getValue }) => {
      const content = getValue() + ''

      return <div style={{ height: '42px' }}> {content} </div>
    }
  })
// : ColumnDef<TData>[]

const collectionTargetColumns = columnHelper.group({
  id: 'CollectionTarget',
  header: () => false,
  columns: [
    getSelectColumn('(יעד)'),
    createDefaultColumn('name', 'שם'),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מקור', 200),
    createDefaultColumn('name', 'מדינה', 80),
    createDefaultColumn('name', 'מדינה', 80),
    createDefaultColumn('name', 'מדינה', 80),
    createDefaultColumn('name', 'מדינה', 80),
    createDefaultColumn('name', 'מדינה', 80),
    columnHelper.group({
      id: 'Demand',
      header: () => false,
      columns: [
        getSelectColumn('(דרישה)'),
        createDefaultColumn('name', 'שם'),
        createDefaultColumn('name', 'מדינה'),
        createDefaultColumn('name', 'צבע'),
        createDefaultColumn('name', 'תחילת רלוונטיות'),
        createDefaultColumn('name', 'סוף רלוונטיות')
      ]
    })
  ]
})

export type column =
  | DisplayColumnDef<entity, unknown>
  | AccessorKeyColumnDef<entity, string>
  | GroupColumnDef<entity, unknown>

const createColumns: ColumnDef<TData>[] = [
  getSelectColumn('(ציח)'),
  //createDefaultColumn('id', '16 מזהה'),
  collectionTargetColumns
]

// const isGroupColumn = (column): grou
export const createComputedColumns = (viewableEntities: string[]): ColumnDef<TData>[] => {
  let selectedColumns = createColumns

  if (!viewableEntities.includes('pirs')) {
    const column = selectedColumns.find((column) => 'columns' in column)

    if (column && 'columns' in column && column.columns) {
      const a = column.columns
      selectedColumns = a
    }
  }

  if (!viewableEntities.includes('demands')) {
    selectedColumns = selectedColumns.map((selectedColumn) => {
      if ('columns' in selectedColumn && selectedColumn.columns) {
        selectedColumn.columns = selectedColumn.columns.filter((column) => 'columns' in column)
      }

      return selectedColumn
    })
  }

  return selectedColumns
}
