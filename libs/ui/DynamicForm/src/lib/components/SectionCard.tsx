import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Collapse,
  IconButton,
  Typography,
  Divider,
  Chip
} from '@mui/material'

import { ExpandMore, ExpandLess, Visibility } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { formatFieldLabel } from '../utils/utils'
import { LayoutRenderer } from './Layouts/LayoutRenderer'
import { ILayoutSection, IFieldRow } from '../types/types'
import { useFormContext } from 'react-hook-form'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  }
}))

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  '& .MuiCardHeader-title': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.primary.main
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5)
  }
}))

// Interface definitions

interface SectionCardProps {
  section: ILayoutSection
}

// Helper function to recursively count fields in nested structure
const countFields = (rows: IFieldRow[]): number => {
  return rows.reduce((acc, row) => {
    // Count fields in this row
    const fieldsCount = row.fields?.length || 0

    // Count fields in nested columns
    const columnsCount =
      row.columns?.reduce((colAcc, column) => {
        return colAcc + countFields(column.rows)
      }, 0) || 0

    return acc + fieldsCount + columnsCount
  }, 0)
}

// Helper function to recursively collect all fields from nested structure
const getAllFields = (rows: IFieldRow[]) => {
  const fields: any[] = []

  rows.forEach((row) => {
    // Add fields from this row
    if (row.fields) {
      fields.push(...row.fields)
    }

    // Add fields from nested columns
    if (row.columns) {
      row.columns.forEach((column) => {
        fields.push(...getAllFields(column.rows))
      })
    }
  })

  return fields
}

// Main SectionCard component
export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const { watch } = useFormContext()
  const formValues = watch()

  const [expanded, setExpanded] = useState(
    section.defaultExpanded !== undefined ? section.defaultExpanded : true
  )

  // Check if section should be displayed based on condition
  const shouldDisplay = !section.condition || section.condition(formValues)

  if (!shouldDisplay) {
    return null
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  // Determine if section is collapsible
  const isCollapsible = section.collapsible || section.component === 'collapse'

  // Get field count for display using recursive helper
  const fieldCount = countFields(section.rows)

  const renderContent = () => (
    <CardContent sx={{ pt: 1 }}>
      {section.description && (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {section.description}
        </Typography>
      )}

      <LayoutRenderer rows={section.rows} gap={2} />
    </CardContent>
  )

  const renderHeaderAction = () => {
    if (!isCollapsible) return null

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
          size='small'
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
    )
  }

  // Handle different component types
  switch (section.component) {
    case 'box':
      return (
        <StyledCard>
          <StyledCardHeader
            title={section.title}
            action={renderHeaderAction()}
          />
          {isCollapsible ? (
            <Collapse in={expanded} timeout='auto' unmountOnExit>
              {renderContent()}
            </Collapse>
          ) : (
            renderContent()
          )}
        </StyledCard>
      )

    case 'collapse':
      return (
        <StyledCard>
          <StyledCardHeader title={section.title} action={renderHeaderAction()} />
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            {renderContent()}
          </Collapse>
        </StyledCard>
      )

    case 'display':
      return (
        <StyledCard sx={{ backgroundColor: 'grey.50' }}>
          <StyledCardHeader
            title={section.title}
            action={
              <Chip icon={<Visibility />} label='Read Only' size='small' variant='outlined' />
            }
          />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              {section.description || 'This section is for display purposes only.'}
            </Typography>
            {fieldCount > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {getAllFields(section.rows).map((field, fieldIndex) => (
                    <Box key={`display-${field.path}-${fieldIndex}`}>
                      <Typography variant='body2'>
                        <strong>{field.label || formatFieldLabel(field.path)}:</strong>{' '}
                        {formValues[field.path] || 'Not set'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      )

    default:
      return (
        <StyledCard>
          <CardContent>
            <Typography color='error'>Unknown section component: {section.component}</Typography>
          </CardContent>
        </StyledCard>
      )
  }
}

export default SectionCard
