import React from 'react'
import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { LayoutRenderer } from './Layouts/LayoutRenderer'
import { CardHeader } from './CardHeader'
import { ICollection, EditingState } from '../types'
import { CardProvider } from './CardProvider'

export const Card: React.FC<{
  collection: ICollection
  editingState?: EditingState
}> = ({ collection, editingState }) => {
  const { handleSubmit } = useFormContext()

  const onSubmit: Parameters<typeof handleSubmit>[0] = (data) => {
    console.log('💪💪 data', data)
  }
  const onError: Parameters<typeof handleSubmit>[1] = (errors) => {
    console.log('💪💪 errors', errors)
  }

  return (
    <CardProvider collection={collection} editingState={editingState}>
      <Box
        component='form'
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{
          width: 500,
          mx: 'auto',
          backgroundColor: 'background.default',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardHeader
          onSend={() => console.log('send')}
          onDelete={() => console.log('delete')}
          onHelp={() => console.log('help')}
        />

        <LayoutRenderer />
      </Box>
    </CardProvider>
  )
}
