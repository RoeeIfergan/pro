import { Box, Typography } from '@mui/material'
import { DragIndicator } from '@mui/icons-material'

export function DragOverlayLabel({ label }: { label: string }) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        boxShadow: 3,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        pointerEvents: 'none'
      }}
    >
      <DragIndicator fontSize='small' />
      <Typography variant='body2'>{label}</Typography>
    </Box>
  )
}
