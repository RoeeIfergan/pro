import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { SectionCard } from './SectionCard'
import { ICardSchemaMeta, ILayoutSection } from '../types/types'
import { CardContext } from './CardContext'

interface ICardProps {
  schema: z.ZodType<any>
  uiSchema: ICardSchemaMeta
}

export const Card: React.FC<ICardProps> = ({ schema, uiSchema }) => {
  const { handleSubmit, watch } = useFormContext()

  const formData = watch()

  console.log('💪💪 formData', formData)

  const onSubmit = (data: any) => {
    console.log('💪💪 data', data)
  }
  const onError = (errors: any) => {
    console.log('💪💪 errors', errors)
  }

  return (
    <CardContext.Provider value={{ schema, uiSchema }}>
      <Box
        component='form'
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

          <Button variant='contained' type='submit' sx={{ px: 4, py: 1 }} color='primary'>
            Send
          </Button>
        </Box>

        {uiSchema.layout.map((section, index) => (
          <SectionCard key={`${section.group}-${index}`} section={section as ILayoutSection} />
        ))}
      </Box>
    </CardContext.Provider>
  )
}
