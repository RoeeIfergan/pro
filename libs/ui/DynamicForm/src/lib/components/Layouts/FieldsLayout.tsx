import React from 'react'
import { Box } from '@mui/material'
import { Field } from '../Field/Field'
import { ILayoutField } from '../../types'
import { useFormContext } from 'react-hook-form'
import { evaluateHidden, evaluateDisabled } from '../../utils/utils'

interface FieldsLayoutProps {
  fields: ILayoutField[]
  fieldsPerRow?: number
  gap?: number | string
  disabled?: boolean // Row-level disabled state
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
  fields,
  fieldsPerRow = 1, // Default: each field in its own row (deprecated - use field.width instead)
  gap = 2,
  disabled = false // Row-level disabled state
}: FieldsLayoutProps): React.JSX.Element => {
  const { watch } = useFormContext()
  const formValues = watch()

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

  // Calculate grid template columns based on field widths or fieldsPerRow
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
        minHeight: 0
      }}
    >
      {orderedItems.map((item) => {
        if (item.type === 'field') {
          const field = item.data as ILayoutField
          const isFieldHidden = evaluateHidden(field.hidden, formValues)
          const isFieldDisabled = disabled || evaluateDisabled(field.disabled, formValues)

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
                sx={{
                  marginBottom: 2,
                  '&:last-child': { marginBottom: 0 },
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: 0
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
            (field) => !evaluateHidden(field.hidden, formValues)
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
                const isFieldHidden = evaluateHidden(field.hidden, formValues)
                const isFieldDisabled = disabled || evaluateDisabled(field.disabled, formValues)

                if (isFieldHidden) {
                  return null
                }

                return (
                  <Box
                    key={`${field.path}-${fieldIndex}`}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      minHeight: 0
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
