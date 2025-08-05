import React from 'react'
import { Box } from '@mui/material'
import { IFieldRow, ILayoutColumn } from '../../types/types'
import { FieldsLayout } from './FieldsLayout'
import { useFormContext } from 'react-hook-form'

interface LayoutRendererProps {
  rows: IFieldRow[]
  gap?: number | string
}

const useColumnWidth = () => {
  return (width?: number): number => {
    if (typeof width === 'number') {
      return Math.max(1, Math.min(12, width))
    }
    return 12
  }
}

const ColumnsRenderer: React.FC<{
  columns: ILayoutColumn[]
  gap?: number | string
}> = ({ columns, gap = 2 }) => {
  const getColumnWidth = useColumnWidth()

  const gridColumns = columns
    .map((column) => {
      const width = getColumnWidth(column.width)
      return `${width}fr`
    })
    .join(' ')

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: typeof gap === 'number' ? `${gap * 8}px` : gap,
        alignItems: 'stretch', // Always stretch (equalHeight = true)
        width: '100%'
      }}
    >
      {columns.map((column, columnIndex) => (
        <Box
          key={`column-${columnIndex}`}
          sx={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <LayoutRenderer rows={column.rows} gap={column.gap ?? gap} />
        </Box>
      ))}
    </div>
  )
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ rows, gap = 2 }) => {
  const { watch } = useFormContext()
  const formValues = watch()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
      {rows.map((row, rowIndex) => {
        // Check if row should be displayed based on condition
        const shouldDisplay = !row.condition || row.condition(formValues)

        if (!shouldDisplay) {
          return null
        }

        // Row has columns - render nested structure
        if (row.columns && row.columns.length > 0) {
          return (
            <ColumnsRenderer
              key={`row-columns-${rowIndex}`}
              columns={row.columns}
              gap={row.gap ?? gap}
            />
          )
        }

        // Row has fields - render traditional field layout
        if (row.fields && row.fields.length > 0) {
          return (
            <FieldsLayout
              key={`row-fields-${rowIndex}`}
              fields={row.fields}
              fieldsPerRow={row.fieldsPerRow}
              gap={row.gap ?? gap}
            />
          )
        }

        // Empty row - render nothing
        return null
      })}
    </Box>
  )
}

export default LayoutRenderer
