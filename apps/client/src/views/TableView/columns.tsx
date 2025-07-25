import React, { HTMLProps } from 'react'
import ExpandLessIcons from '@mui/icons-material/ExpandLess'
import ExpandMoreIcons from '@mui/icons-material/ExpandMore'
// import { reverseColumns } from './Table/utils'
import { Box, Chip, Typography } from '@mui/material'

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type='checkbox'
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

const setExpandedSubRows = (rows, value) => {
  if (!rows || rows.length === 0) return

  rows.forEach((row) => {
    row.toggleExpanded(value)
    setExpandedSubRows(row.subRows, value)
  })
}

const getToggleExpandedHandler = (row) => (event) => {
  const value = !row.getIsExpanded()

  row.toggleExpanded(value)

  if (!value) {
    setExpandedSubRows(row.subRows, value)
  }
}
const getSelectColumn = (content) => ({
  id: 'select',
  size: 80,
  header: (props) => {
    const { table } = props

    return (
      <Box style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
        <IndeterminateCheckbox
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
        <IndeterminateCheckbox
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
              {row.getIsExpanded() ? <ExpandMoreIcons /> : <ExpandLessIcons />}
            </Box>
          </Box>
        ) : null}
      </Box>
    )
  }
})

const getCollapseByType = (content) => ({
  id: 'type',
  size: 20,
  header: <div />,
  cell: ({ row }) => {
    return row.getCanExpand() ? (
      <Typography
        {...{
          onClick: row.getToggleExpandedHandler()
        }}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
          cursor: 'pointer'
        }}
      >
        <Typography fontSize={10} style={{ alignContent: 'center' }}>
          {content}
        </Typography>
        {row.getIsExpanded() ? <ExpandMoreIcons /> : <ExpandLessIcons />}
        {/* {row.depth === 0 ? 'ציח' : row.depth === 1 ? 'יעד' : 'דרישה'}{row.getIsExpanded() ? <ExpandMoreIcons /> : <ExpandLessIcons />} */}
      </Typography>
    ) : (
      '🔵'
    )
  }
})

const createDefaultColumn = (accessorKey, header, size = 120) => ({
  accessorKey,
  header,
  size,
  cell: ({ row, getValue }) => {
    const content = getValue() + ''

    return <div style={{ height: '42px' }}> {content} </div>
  }
})
// : ColumnDef<TData>[]
const createColumns = () => [
  getSelectColumn('(ציח)'),
  createDefaultColumn('id', 'מזהה'),
  createDefaultColumn('id_2', '2 מזהה'),
  createDefaultColumn('id_3', '3 מזהה'),
  createDefaultColumn('id_4', '4 מזהה'),
  createDefaultColumn('id_5', '5 מזהה'),
  createDefaultColumn('id_6', '6 מזהה'),
  createDefaultColumn('id_7', '7 מזהה'),
  createDefaultColumn('id_8', '8 מזהה'),
  // createDefaultColumn('id', '9 מזהה'),
  // createDefaultColumn('id', '10 מזהה'),
  // createDefaultColumn('id', '11 מזהה'),
  // createDefaultColumn('id', '12 מזהה'),
  // createDefaultColumn('id', '13 מזהה'),
  // createDefaultColumn('id', '14 מזהה'),
  // createDefaultColumn('id', '15 מזהה'),
  // createDefaultColumn('id', '16 מזהה'),
  createDefaultColumn('name', 'שם'),
  {
    id: 'CollectionTarget',
    header: () => false,
    columns: [
      getSelectColumn('(יעד)'),
      createDefaultColumn('name', 'שם'),
      createDefaultColumn('origin_1', 'מקור', 200),
      createDefaultColumn('origin_2', 'מקור', 200),
      createDefaultColumn('origin_3', 'מקור', 200),
      createDefaultColumn('origin_4', 'מקור', 200),
      createDefaultColumn('origin_5', 'מקור', 200),
      createDefaultColumn('origin_6', 'מקור', 200),
      createDefaultColumn('origin_7', 'מקור', 200),
      createDefaultColumn('country_8', 'מדינה', 80),
      createDefaultColumn('country', 'מדינה', 80),
      createDefaultColumn('country_1', 'מדינה', 80),
      createDefaultColumn('country_2', 'מדינה', 80),
      createDefaultColumn('country_3', 'מדינה', 80),
      {
        id: 'Demand',
        header: () => false,
        columns: [
          getSelectColumn('(דרישה)'),
          createDefaultColumn('name', 'שם'),
          createDefaultColumn('country', 'מדינה'),
          createDefaultColumn('color', 'צבע'),
          createDefaultColumn('startDate', 'תחילת רלוונטיות'),
          createDefaultColumn('endDate', 'סוף רלוונטיות')
        ]
      }
    ]
  }
]

export const getColumns = (viewableEntities) => {
  let selectedColumns = createColumns()

  if (!viewableEntities.includes('pirs')) {
    selectedColumns = selectedColumns.find(
      (column) => column.id === 'CollectionTarget'
    ).columns
  }

  if (!viewableEntities.includes('demands')) {
    selectedColumns = selectedColumns.map((selectedColumn) => {
      if (selectedColumn.id === 'CollectionTarget') {
        selectedColumn.columns = selectedColumn.columns.filter(
          (column) => column.id !== 'Demand'
        )
      }

      return selectedColumn
    })
  }

  return selectedColumns
}
