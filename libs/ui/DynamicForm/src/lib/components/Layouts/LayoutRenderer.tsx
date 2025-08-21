import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Collapse, keyframes, useTheme } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { IFieldRow } from '../../types'
import { FieldsLayout } from './FieldsLayout'
import { useFormContext } from 'react-hook-form'
import { evaluateCondition } from '../../utils/utils'
import type { EditingState } from '../../../DNDCardBuilder/components/DNDCardBuilder'

interface LayoutRendererProps {
  rows: IFieldRow[]
  gap?: number | string
  editingState?: EditingState
}

// Define the keyframes animation for moving dashes
const dashMove = keyframes`
  0% {
    background-position: 0 0, 0 0, 100% 0, 0 100%;
  }
  100% {
    background-position: 0 16px, -16px 0, 100% -16px, 16px 100%;
  }
`

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ rows, gap = 3, editingState }) => {
  const { watch } = useFormContext()
  const formValues = watch()
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  // Scroll to highlighted element when editing state changes
  useEffect(() => {
    if (!editingState) return

    let elementToScrollTo: HTMLElement | null = null

    if (editingState.editingField) {
      // Scroll to specific field
      const { field } = editingState.editingField
      elementToScrollTo = document.querySelector(`[data-field-id="${field._id}"]`)
    } else if (editingState.editingRow) {
      // Scroll to row
      const { rowIndex } = editingState.editingRow
      elementToScrollTo = document.querySelector(`[data-row-index="${rowIndex}"]`)
    }

    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }
  }, [editingState])

  // Helper function to determine if a row should be highlighted
  const isRowHighlighted = (rowIndex: number) => {
    // Don't highlight row if we're editing a field (field highlighting takes precedence)
    if (editingState?.editingField) return false
    // Only highlight row if we're editing at row level
    if (!editingState?.editingRow) return false
    const editingRowIndex = editingState.editingRow.rowIndex
    return rowIndex === editingRowIndex
  }

  // Helper function to get row highlighting styles
  const getRowHighlightStyles = (rowIndex: number) => {
    const isHighlighted = isRowHighlighted(rowIndex)
    return {
      position: 'relative',
      ...(isHighlighted && {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-4px',
          left: '-4px',
          right: '-4px',
          bottom: '-4px',
          borderRadius: '8px',
          pointerEvents: 'none',
          zIndex: 1,
          // Create the animated dashed border using linear gradients
          background: `
            repeating-linear-gradient(
              0deg,
              ${primaryColor},
              ${primaryColor} 8px,
              transparent 8px,
              transparent 16px
            ),
            repeating-linear-gradient(
              90deg,
              ${primaryColor},
              ${primaryColor} 8px,
              transparent 8px,
              transparent 16px
            ),
            repeating-linear-gradient(
              180deg,
              ${primaryColor},
              ${primaryColor} 8px,
              transparent 8px,
              transparent 16px
            ),
            repeating-linear-gradient(
              270deg,
              ${primaryColor},
              ${primaryColor} 8px,
              transparent 8px,
              transparent 16px
            )
          `,
          backgroundSize: '2px 100%, 100% 2px, 2px 100%, 100% 2px',
          backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
          backgroundRepeat: 'no-repeat',
          animation: `${dashMove} 1s linear infinite`
        }
      })
    }
  }

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>(() => {
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Box display='flex' flexDirection='column' sx={{ flex: 1, overflow: 'auto', p: 2, gap }}>
        {rows.map((row, rowIndex) => {
          const isHidden = evaluateCondition(row.hidden, formValues)
          const isDisabled = evaluateCondition(row.disabled, formValues)

          if (isHidden) {
            return null
          }

          if (row.fields && row.fields.length > 0) {
            const isCollapsible = row.collapsible
            const isExpanded = isCollapsible ? (expandedRows[rowIndex] ?? true) : true

            if (isCollapsible) {
              return (
                <Box
                  key={`row-${rowIndex}`}
                  data-row-index={rowIndex}
                  sx={{
                    mb: 1,
                    ...getRowHighlightStyles(rowIndex)
                  }}
                >
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
                    {row.title && (
                      <Typography variant='subtitle2' sx={{ fontWeight: 'medium' }}>
                        {row.title}
                      </Typography>
                    )}
                  </Box>

                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ pt: 2 }}>
                      <FieldsLayout
                        fields={row.fields}
                        fieldsPerRow={row.fieldsPerRow}
                        gap={row.gap ?? gap}
                        disabled={isDisabled}
                        editingState={editingState}
                        rowIndex={rowIndex}
                      />
                    </Box>
                  </Collapse>
                </Box>
              )
            } else {
              return (
                <Box
                  key={`row-fields-${rowIndex}`}
                  data-row-index={rowIndex}
                  sx={{
                    ...getRowHighlightStyles(rowIndex),
                    mb: 1
                  }}
                >
                  <FieldsLayout
                    fields={row.fields}
                    fieldsPerRow={row.fieldsPerRow}
                    gap={row.gap ?? gap}
                    disabled={isDisabled}
                    editingState={editingState}
                    rowIndex={rowIndex}
                  />
                </Box>
              )
            }
          } else {
            // Handle empty rows - still render them so they can be scrolled to
            return (
              <Box
                key={`empty-row-${rowIndex}`}
                data-row-index={rowIndex}
                sx={{
                  mb: 1,
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: 'text.secondary',
                  ...getRowHighlightStyles(rowIndex)
                }}
              >
                <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
                  {row.title || 'שורה ריקה'} - אין שדות בשורה זו
                </Typography>
              </Box>
            )
          }
        })}
      </Box>
    </Box>
  )
}

export default LayoutRenderer
