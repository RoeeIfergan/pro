import React from 'react'
import { Box, Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  isActive: boolean
}

interface BreadcrumbsBarProps {
  currentView: 'rows' | 'editRow' | 'editField'
  editingField?: {
    field: { label?: string; path?: string }
    rowIndex: number
  } | null
  editingRow?: {
    rowIndex: number
  } | null
  uiSchema: {
    layout: Array<{ title?: string }>
  }
  navigateBackToRows: () => void
  navigateBackToRow: () => void
}

const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  currentView,
  editingField,
  editingRow,
  uiSchema,
  navigateBackToRows,
  navigateBackToRow
}) => {
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
      const row = uiSchema.layout[editingRow.rowIndex]
      breadcrumbs.push({
        label: row?.title ?? `${editingRow.rowIndex + 1}`,
        onClick: undefined,
        isActive: true
      })
    }

    // Field breadcrumb
    if (currentView === 'editField' && editingField) {
      const row = uiSchema.layout[editingField.rowIndex]
      breadcrumbs.push({
        label: row?.title ?? `${editingField.rowIndex + 1}`,
        onClick: navigateBackToRow,
        isActive: false
      })

      const fieldLabel =
        editingField.field.label ||
        editingField.field.path ||
        DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL
      breadcrumbs.push({
        label: fieldLabel,
        onClick: undefined,
        isActive: true
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Only show breadcrumbs if there are 2+ levels
  if (breadcrumbs.length <= 1) return null

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5
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
