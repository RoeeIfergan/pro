import React from 'react'
import { Box } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { LayoutRenderer } from './Layouts/LayoutRenderer'
import { ICollection } from '../dev/collections'
import { CardHeader } from './CardHeader'

export const Card: React.FC<{ collection: ICollection }> = ({ collection }) => {
  const { handleSubmit } = useFormContext()

  const onSubmit: Parameters<typeof handleSubmit>[0] = (data) => {
    console.log('💪💪 data', data)
  }
  const onError: Parameters<typeof handleSubmit>[1] = (errors) => {
    console.log('💪💪 errors', errors)
  }

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(onSubmit, onError)}
      sx={{ width: 500, mx: 'auto', backgroundColor: '#353535' }}
    >
      <CardHeader
        onSend={() => console.log('send')}
        onDelete={() => console.log('delete')}
        onHelp={() => console.log('help')}
      />

      <LayoutRenderer rows={collection.uiSchema.layout} gap={2} />
    </Box>
  )
}
