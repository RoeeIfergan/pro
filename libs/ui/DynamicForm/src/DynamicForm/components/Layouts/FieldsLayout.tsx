import React from 'react'
import { Box, useTheme } from '@mui/material'
import { Field } from '../Field/Field'
import { ILayoutField } from '../../types'
import { useFormContext } from 'react-hook-form'
import { evaluateCondition, getHighlightStyles } from '../../utils/utils'
import { DEFAULT_GAP } from '../../../DNDCardBuilder/utils/constants'
import { useCardContext } from '../../hooks/useCardContext'

interface FieldsLayoutProps {
  disabled?: boolean // Row-level disabled state
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

export const FieldsLayout = ({
  disabled = false, // Row-level disabled state
  rowIndex
}: FieldsLayoutProps): React.JSX.Element => {
  const { collection, editingState } = useCardContext()

  const fields = collection.uiSchema.rows?.[rowIndex ?? -1]?.fields ?? []
  const gap = collection.uiSchema.rows?.[rowIndex ?? -1]?.gap ?? DEFAULT_GAP

  const { watch } = useFormContext()
  const formValues = watch()
  const theme = useTheme()
  const primaryColor = theme.palette.primary.main

  // Helper function to determine if a field should be highlighted
  const isFieldHighlighted = (field: ILayoutField) => {
    if (!editingState?.editingField || rowIndex === undefined) return false

    const editingFieldId = fields?.[editingState.editingField.fieldIndex]?._id ?? ''

    if (!editingFieldId) return false

    const editingRowIndex = editingState.editingField.rowIndex
    // Cast field to access _id property (it should exist from withStableIds)
    const fieldId = (field as unknown as { _id: string })._id
    return fieldId === editingFieldId && rowIndex === editingRowIndex
  }

  const isFieldHovered = (field: ILayoutField) => {
    return !!(
      editingState?.hoveredItem?._id &&
      editingState?.hoveredItem?._id === (field as unknown as { _id: string })._id
    )
  }

  // Helper function to get field highlighting styles
  const getFieldHighlightStyles = (field: ILayoutField) => {
    const isHighlighted = isFieldHighlighted(field)
    const isHovered = isFieldHovered(field)

    return getHighlightStyles({ isHighlighted, isHovered, primaryColor, theme })
  }

  const { groups, ungroupedFields } = groupFieldsByKey(fields)

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

  // Helper function to convert width (1-12) to flex-basis percentage
  const getFlexBasis = (width: number | undefined): string => {
    const actualWidth = width || 12
    const percentage = (actualWidth / 12) * 100

    if (actualWidth === 12) {
      return `${percentage}%`
    }

    const gapInPx = gap * 8
    const gapPerField = gapInPx / fields.length

    return `calc(${percentage}% - ${gapPerField}px)`
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        // Always use flex-start for precise width control
        // Gap will provide spacing when needed
        justifyContent: 'flex-start',
        gap: gap ? gap : undefined, // Only apply gap if > 0
        '& > *': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        },
        minHeight: 56,
        alignItems: 'center'
      }}
    >
      {orderedItems.map((item) => {
        if (item.type === 'field') {
          const field = item.data as ILayoutField
          const isFieldHidden = evaluateCondition(field.hidden, formValues, collection.context)
          const isFieldDisabled =
            disabled || evaluateCondition(field.disabled, formValues, collection.context)

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
                minHeight: 0,
                flexBasis: field.width ? getFlexBasis(field.width) : 'auto',
                flexShrink: field.width ? 0 : 1,
                flexGrow: field.width ? 0 : 1
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
            (field) => !evaluateCondition(field.hidden, formValues, collection.context)
          )

          if (visibleGroupFields.length === 0) {
            return null
          }

          const firstFieldWidth = groupFields[0]?.width

          return (
            <Box
              key={item.key}
              sx={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: gap,
                height: '100%',
                flexBasis: firstFieldWidth ? getFlexBasis(firstFieldWidth) : 'auto',
                flexShrink: firstFieldWidth ? 0 : 1,
                flexGrow: firstFieldWidth ? 0 : 1
              }}
            >
              {groupFields.map((field, fieldIndex) => {
                const isFieldHidden = evaluateCondition(
                  field.hidden,
                  formValues,
                  collection.context
                )
                const isFieldDisabled =
                  disabled || evaluateCondition(field.disabled, formValues, collection.context)

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
