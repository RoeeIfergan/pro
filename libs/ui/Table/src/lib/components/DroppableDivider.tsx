import React from 'react'
import { Box } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'

export interface DroppableDividerProps {
  id: string
}

export const DroppableDivider: React.FC<DroppableDividerProps> = ({ id }) => {
  const { isOver, setNodeRef } = useDroppable({ id })

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 10,
        height: '100%',
        userSelect: 'none',
        touchAction: 'none',
        backgroundColor: isOver ? 'action.hover' : 'transparent'
      }}
    />
  )
}
