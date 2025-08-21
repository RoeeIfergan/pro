import React from 'react'
import { Box, keyframes, useTheme } from '@mui/material'
import { Field } from '../Field/Field'
import { ILayoutField } from '../../types'
import { useFormContext } from 'react-hook-form'
import { evaluateCondition } from '../../utils/utils'
import type { EditingState } from '../../../DNDCardBuilder/components/DNDCardBuilder'

interface FieldsLayoutProps {
  fields: ILayoutField[]
  fieldsPerRow?: number
  gap?: number | string
  disabled?: boolean // Row-level disabled state
  editingState?: EditingState
  rowIndex?: number
}

// Group fields by groupKey, maintaining original order for ungrouped fields
const groupFieldsByKey = (fields: ILayoutField[]) => {
  const groups: { [key: string]: ILayoutField[] } = {}
  const ungroupedFields: ILayoutField[] = []

  fields.forEach((field) => {
    if (field.groupKey) {
      if (!groups[field.groupKey]) {
        groups[field.groupKey] = []
      }
      groups[field.groupKey].push(field)
    } else {
      ungroupedFields.push(field)
    }
  })

  return { groups, ungroupedFields }
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

export const FieldsLayout = ({
  fields,
  fieldsPerRow = 1, // Default: each field in its own row (deprecated - use field.width instead)
  gap = 2,
  disabled = false, // Row-level disabled state
  editingState,
  rowIndex
}: FieldsLayoutProps): React.JSX.Element => {
  const { watch } = useFormContext()
  const formValues = watch()
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  // Helper function to determine if a field should be highlighted
  const isFieldHighlighted = (field: ILayoutField) => {
    if (!editingState?.editingField || rowIndex === undefined) return false
    const editingFieldId = editingState.editingField.field._id
    const editingRowIndex = editingState.editingField.rowIndex
    // Cast field to access _id property (it should exist from withStableIds)
    const fieldId = (field as unknown as { _id: string })._id
    return fieldId === editingFieldId && rowIndex === editingRowIndex
  }

  // Helper function to get field highlighting styles
  const getFieldHighlightStyles = (field: ILayoutField) => {
    const isHighlighted = isFieldHighlighted(field)
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

  const { groups, ungroupedFields } = groupFieldsByKey(fields)

  // Create items with their groupOrder for proper sorting
  const allItems: Array<{
    type: 'field' | 'group'
    data: ILayoutField | ILayoutField[]
    key: string
    groupOrder: number
  }> = []

  // Add ungrouped fields with their groupOrder
  ungroupedFields.forEach((field, index) => {
    allItems.push({
      type: 'field',
      data: field,
      key: `field-${field.path}-${index}`,
      groupOrder: field.groupOrder ?? 999
    })
  })

  // Add grouped fields with the minimum groupOrder from the group
  Object.entries(groups).forEach(([groupKey, groupFields]) => {
    const minGroupOrder = Math.min(...groupFields.map((f) => f.groupOrder ?? 999))
    allItems.push({
      type: 'group',
      data: groupFields,
      key: `group-${groupKey}`,
      groupOrder: minGroupOrder
    })
  })

  // Sort all items by groupOrder
  const orderedItems = allItems.sort((a, b) => a.groupOrder - b.groupOrder)

  const hasFieldWidths = fields.some((field) => field.width !== undefined)
  const gridTemplateColumns = hasFieldWidths
    ? orderedItems
        .map((item) => {
          if (item.type === 'field') {
            const field = item.data as ILayoutField
            return `${field.width || 12}fr`
          } else {
            // For groups, use the width of the first field in the group, or default to 12
            const groupFields = item.data as ILayoutField[]
            const firstFieldWidth = groupFields[0]?.width || 12
            return `${firstFieldWidth}fr`
          }
        })
        .join(' ')
    : `repeat(${fieldsPerRow}, 1fr)`

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns,
        gap,
        alignItems: 'stretch',
        '& > *': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        },
        minHeight: 56
      }}
    >
      {orderedItems.map((item) => {
        if (item.type === 'field') {
          const field = item.data as ILayoutField
          const isFieldHidden = evaluateCondition(field.hidden, formValues)
          const isFieldDisabled = disabled || evaluateCondition(field.disabled, formValues)

          if (isFieldHidden) {
            return null
          }

          return (
            <Box
              key={item.key}
              sx={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0
              }}
            >
              <Box
                data-field-id={(field as unknown as { _id: string })._id}
                sx={{
                  marginBottom: 2,
                  '&:last-child': { marginBottom: 0 },
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: 0,
                  ...getFieldHighlightStyles(field)
                }}
              >
                <Field field={field} disabled={isFieldDisabled} />
              </Box>
            </Box>
          )
        } else {
          // Handle grouped fields
          const groupFields = item.data as ILayoutField[]

          // Check if any field in the group is visible
          const visibleGroupFields = groupFields.filter(
            (field) => !evaluateCondition(field.hidden, formValues)
          )

          if (visibleGroupFields.length === 0) {
            return null
          }

          return (
            <Box
              key={item.key}
              sx={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: gap,
                height: '100%'
              }}
            >
              {groupFields.map((field, fieldIndex) => {
                const isFieldHidden = evaluateCondition(field.hidden, formValues)
                const isFieldDisabled = disabled || evaluateCondition(field.disabled, formValues)

                if (isFieldHidden) {
                  return null
                }

                return (
                  <Box
                    key={`${field.path}-${fieldIndex}`}
                    data-field-id={(field as unknown as { _id: string })._id}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      minHeight: 0,
                      ...getFieldHighlightStyles(field)
                    }}
                  >
                    <Field field={field} disabled={isFieldDisabled} />
                  </Box>
                )
              })}
            </Box>
          )
        }
      })}
    </Box>
  )
}

export default FieldsLayout
