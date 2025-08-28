import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, Collapse, keyframes, useTheme } from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { FieldsLayout } from './FieldsLayout'
import { useFormContext } from 'react-hook-form'
import { evaluateCondition, getHighlightStyles } from '../../utils/utils'
import { useCardContext } from '../../hooks/useCardContext'
import { DEFAULT_GAP } from '../../../DNDCardBuilder/utils/constants'

export const LayoutRenderer: React.FC = () => {
  const contextvalue = useCardContext()

  const {
    collection: {
      context,
      uiSchema: { rows, gap = DEFAULT_GAP }
    },
    editingState
  } = contextvalue

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
      const fieldId = rows?.[editingState.editingField.rowIndex]?.fields?.[
        editingState.editingField.fieldIndex
      ]?._id as string

      elementToScrollTo = document.querySelector(`[data-field-id="${fieldId}"]`)
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
    // Highlight row if we're editing at row level
    if (editingState?.editingRow) {
      return rowIndex === editingState.editingRow.rowIndex
    }
    return false
  }

  const isRowHovered = (rowId?: string) => {
    if (editingState?.editingField || editingState?.editingRow) return false

    if (editingState?.hoveredItem) {
      return rowId === editingState.hoveredItem._id
    }

    return false
  }

  const getRowHighlightStyles = ({ rowIndex, rowId }: { rowIndex: number; rowId?: string }) => {
    const isHighlighted = isRowHighlighted(rowIndex)
    const isHovered = isRowHovered(rowId)

    return getHighlightStyles({ isHighlighted, isHovered, primaryColor, theme })
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
          const isHidden = evaluateCondition(row.hidden, formValues, context)
          const isDisabled = evaluateCondition(row.disabled, formValues, context)

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
                    ...getRowHighlightStyles({ rowIndex, rowId: row._id })
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
                      <FieldsLayout disabled={isDisabled} rowIndex={rowIndex} />
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
                    ...getRowHighlightStyles({ rowIndex, rowId: row._id }),
                    mb: 1
                  }}
                >
                  <FieldsLayout
                    fields={row.fields}
                    gap={row.gap}
                    disabled={isDisabled}
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
                  ...getRowHighlightStyles({ rowIndex, rowId: row._id })
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
