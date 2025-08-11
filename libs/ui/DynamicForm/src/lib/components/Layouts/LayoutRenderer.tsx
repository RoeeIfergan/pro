import React, { useState } from 'react'
import { Box, Typography, IconButton, Collapse } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { IFieldRow } from '../../types/types'
import { FieldsLayout } from './FieldsLayout'
import { useFormContext } from 'react-hook-form'
import { evaluateHidden, evaluateDisabled } from '../../utils/utils'

interface LayoutRendererProps {
  rows: IFieldRow[]
  gap?: number | string
  disabled?: boolean // Section-level disabled state
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  rows,
  gap = 2,
  disabled: sectionDisabled = false
}) => {
  const { watch } = useFormContext()
  const formValues = watch()

  // State for tracking expanded rows
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>(() => {
    // Initialize with default expanded states
    const initialState: Record<number, boolean> = {}
    rows.forEach((row, index) => {
      if (row.collapsible) {
        initialState[index] = row.defaultExpanded ?? true
      }
    })
    return initialState
  })

  const toggleRow = (rowIndex: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
      {rows.map((row, rowIndex) => {
        const isHidden = evaluateHidden(row.hidden, formValues)
        const isDisabled = sectionDisabled || evaluateDisabled(row.disabled, formValues)

        if (isHidden) {
          return null
        }

        // Row has fields - render field layout with width support
        if (row.fields && row.fields.length > 0) {
          const isCollapsible = row.collapsible
          const isExpanded = isCollapsible ? (expandedRows[rowIndex] ?? true) : true

          if (isCollapsible && row.title) {
            // Collapsible row with title
            return (
              <Box key={`row-${rowIndex}`} sx={{ mb: 1 }}>
                {/* Row header with title and expand/collapse button */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleRow(rowIndex)}
                >
                  <IconButton size='small' sx={{ mr: 1, p: 0.5 }}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'medium' }}>
                    {row.title}
                  </Typography>
                </Box>

                {/* Collapsible content */}
                <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                  <Box sx={{ pt: 2 }}>
                    <FieldsLayout
                      fields={row.fields}
                      fieldsPerRow={row.fieldsPerRow}
                      gap={row.gap ?? gap}
                      disabled={isDisabled}
                    />
                  </Box>
                </Collapse>
              </Box>
            )
          } else {
            // Regular row (non-collapsible or collapsible without title)
            return (
              <FieldsLayout
                key={`row-fields-${rowIndex}`}
                fields={row.fields}
                fieldsPerRow={row.fieldsPerRow}
                gap={row.gap ?? gap}
                disabled={isDisabled}
              />
            )
          }
        }

        // Empty row - render nothing
        return null
      })}
    </Box>
  )
}

export default LayoutRenderer
