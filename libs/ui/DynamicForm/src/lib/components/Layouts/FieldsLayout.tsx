import React from 'react'
import { Box } from '@mui/material'
import { Field } from '../Field/Field'
import { ILayoutField, IFieldGroup } from '../../types/types'
import { useFormContext } from 'react-hook-form'
import { evaluateHidden, evaluateDisabled } from '../../utils/utils'

interface FieldsLayoutProps {
  fields: ILayoutField[]
  fieldsPerRow?: number
  gap?: number | string
  disabled?: boolean // Row-level disabled state
}

// Type guard to check if a field is a field group
const isFieldGroup = (field: ILayoutField): field is IFieldGroup => {
  return 'fields' in field && Array.isArray((field as IFieldGroup).fields)
}

export const FieldsLayout = ({
  fields,
  fieldsPerRow = 1, // Default: each field in its own row (deprecated - use field.width instead)
  gap = 2,
  disabled = false // Row-level disabled state
}: FieldsLayoutProps): React.JSX.Element => {
  const { watch } = useFormContext()
  const formValues = watch()
  // Check if any fields have width properties (including field groups)
  const hasFieldWidths = fields.some((field) => field.width !== undefined)

  // Calculate grid template columns
  const gridTemplateColumns = hasFieldWidths
    ? fields.map((field) => `${field.width || 12}fr`).join(' ')
    : `repeat(${fieldsPerRow}, 1fr)`

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns,
        gap,
        alignItems: 'stretch', // Always stretch (equalHeight = true)
        '& > *': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      {fields.map((field, fieldIndex) => {
        // Check field-level hidden and disabled states
        const isFieldHidden = evaluateHidden(field.hidden, formValues)
        const isFieldDisabled = disabled || evaluateDisabled(field.disabled, formValues)

        if (isFieldHidden) {
          return null
        }

        // Handle field groups (nested fields in a column)
        if (isFieldGroup(field)) {
          const isGroupHidden = evaluateHidden(field.hidden, formValues)
          const isGroupDisabled = disabled || evaluateDisabled(field.disabled, formValues)

          if (isGroupHidden) {
            return null
          }

          return (
            <Box
              key={`field-group-${fieldIndex}`}
              sx={{
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: field.gap ?? gap,
                height: '100%'
              }}
            >
              {field.fields.map((nestedField, nestedIndex) => {
                const isNestedHidden = evaluateHidden(nestedField.hidden, formValues)
                const isNestedDisabled =
                  isGroupDisabled || evaluateDisabled(nestedField.disabled, formValues)

                if (isNestedHidden) {
                  return null
                }

                return (
                  <Box key={`nested-${fieldIndex}-${nestedIndex}`}>
                    <Field field={nestedField} disabled={isNestedDisabled} />
                  </Box>
                )
              })}
            </Box>
          )
        }

        // Handle regular fields
        return (
          <Box
            key={`${field.path}-${fieldIndex}`}
            sx={{
              minWidth: 0, // Prevent grid items from overflowing
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ marginBottom: 2, '&:last-child': { marginBottom: 0 } }}>
              <Field field={field} disabled={isFieldDisabled} />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default FieldsLayout
