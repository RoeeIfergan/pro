import React from 'react'
import { Box, Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'
import { useDNDCardBuilderContext } from '../utils/context'

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  isActive: boolean
}

const BreadcrumbsBar: React.FC = () => {
  const {
    editingField,
    editingRow,
    editingOption,
    currentView,
    uiSchema,
    navigateBackToRows,
    navigateBackToRow,
    navigateBackToField
  } = useDNDCardBuilderContext()
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []

    // Root breadcrumb
    breadcrumbs.push({
      label: DND_CARD_BUILDER_LABELS.BREADCRUMB_ROWS,
      onClick: currentView !== 'rows' ? navigateBackToRows : undefined,
      isActive: currentView === 'rows'
    })

    // Row breadcrumb
    if (currentView === 'editRow' && editingRow) {
      const row = uiSchema.rows[editingRow.rowIndex]
      breadcrumbs.push({
        label: row?.title ?? `${editingRow.rowIndex + 1}`,
        onClick: undefined,
        isActive: true
      })
    }

    // Field breadcrumb
    if ((currentView === 'editField' || currentView === 'editOption') && editingField) {
      const row = uiSchema.rows[editingField.rowIndex]
      breadcrumbs.push({
        label: row?.title ?? `${editingField.rowIndex + 1}`,
        onClick: navigateBackToRow,
        isActive: false
      })
      const field = uiSchema.rows[editingField.rowIndex].fields[editingField.fieldIndex]

      const fieldLabel = field.label || field.path || DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL
      breadcrumbs.push({
        label: fieldLabel,
        onClick: currentView === 'editOption' ? navigateBackToField : undefined,
        isActive: currentView === 'editField'
      })
    }

    // Option breadcrumb
    if (currentView === 'editOption' && editingOption) {
      const field = uiSchema.rows[editingOption.rowIndex].fields[editingOption.fieldIndex]
      const option = (field as { options?: { values?: { label: string }[] } }).options?.values?.[
        editingOption.optionIndex
      ]

      const optionLabel = option?.label || `Option ${editingOption.optionIndex + 1}`
      breadcrumbs.push({
        label: optionLabel,
        onClick: undefined,
        isActive: true
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />} sx={{ fontSize: '0.875rem' }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <Link
            key={index}
            color='inherit'
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={breadcrumb.onClick}
          >
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

export default BreadcrumbsBar
