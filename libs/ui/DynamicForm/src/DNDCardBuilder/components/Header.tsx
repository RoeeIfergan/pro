import React, { useMemo } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDNDCardBuilderContext } from '../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

const Header: React.FC = () => {
  const { currentView, navigateBackToRow, navigateBackToRows } = useDNDCardBuilderContext()

  const { title, onBack } = useMemo(() => {
    if (currentView === 'editRow') {
      return {
        title: DND_CARD_BUILDER_LABELS.EDIT_ROW_TITLE,
        onBack: navigateBackToRows
      }
    }

    if (currentView === 'editField') {
      return {
        title: DND_CARD_BUILDER_LABELS.EDIT_ROW_TITLE,
        onBack: navigateBackToRow
      }
    }

    return {
      title: DND_CARD_BUILDER_LABELS.EDIT_ROW_TITLE,
      onBack: undefined
    }
  }, [currentView, navigateBackToRow, navigateBackToRows])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 2,
        px: onBack ? 1 : 4,
        backgroundColor: 'primary.dark',
        gap: 1
      }}
    >
      {onBack && (
        <IconButton onClick={onBack} sx={{ p: 0.5, color: 'primary.contrastText' }}>
          <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      )}
      <Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
        {title}
      </Typography>
    </Box>
  )
}

export default Header
