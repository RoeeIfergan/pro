import React from 'react'
import { Box } from '@mui/material'
import { Field } from '../Field'
import { ILayoutField } from '../../types/types'
import { FieldContainer } from '../FieldContainer'

interface FieldsLayoutProps {
  fields: ILayoutField[]
  fieldsPerRow?: number
  gap?: number | string
}

export const FieldsLayout: React.FC<FieldsLayoutProps> = ({
  fields,
  fieldsPerRow = 1, // Default: each field in its own row
  gap = 2
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${fieldsPerRow}, 1fr)`,
        gap,
        alignItems: 'stretch', // Always stretch (equalHeight = true)
        '& > *': {
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      {fields.map((field, fieldIndex) => (
        <Box
          key={`${field.path}-${fieldIndex}`}
          sx={{
            minWidth: 0, // Prevent grid items from overflowing
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ marginBottom: 2, '&:last-child': { marginBottom: 0 } }}>
            <Field field={field} />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default FieldsLayout
