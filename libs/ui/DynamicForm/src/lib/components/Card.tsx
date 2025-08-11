import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { LayoutRenderer } from './Layouts/LayoutRenderer'
import { CardContext } from './CardContext'
import { ICollection } from '../dev/collections'

interface ICardProps {
  collection: ICollection
}

export const Card: React.FC<ICardProps> = ({ collection }) => {
  const { handleSubmit, watch } = useFormContext()

  const formData = watch()

  console.log('💪💪 formData', formData)

  const onSubmit: Parameters<typeof handleSubmit>[0] = (data) => {
    console.log('💪💪 data', data)
  }
  const onError: Parameters<typeof handleSubmit>[1] = (errors) => {
    console.log('💪💪 errors', errors)
  }

  return (
    <CardContext.Provider value={collection}>
      <Box
        component='form'
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        sx={{ maxWidth: 1200, mx: 'auto', p: 2, width: '100%', backgroundColor: '#353535' }}
      >
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>
          Dynamic Card
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Button variant='contained' type='submit' sx={{ px: 4, py: 1 }} color='primary'>
            Save
          </Button>
        </Box>

        <LayoutRenderer rows={collection.uiSchema.layout} gap={2} />
      </Box>
    </CardContext.Provider>
  )
}
