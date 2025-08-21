import { FormProvider, useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from './components/Card'
import { ICollection } from './dev/collections'
import { z } from 'zod'
import { DefaultSchema } from './types'
import { Box } from '@mui/material'
import type { EditingState } from '../DNDCardBuilder/components/DNDCardBuilder'

export { CardHeader } from './components/CardHeader'
export type { EditingState } from '../DNDCardBuilder/components/DNDCardBuilder'

export const DynamicForm = ({
  collection,
  editingState
}: {
  collection?: ICollection
  editingState?: EditingState
}) => {
  if (!collection) return <div>skeleton...</div>

  return (
    <Box
      sx={{
        width: 500,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <DynamicFormContent collection={collection} editingState={editingState} />
    </Box>
  )
}

export const DynamicFormContent = <T extends DefaultSchema>({
  collection,
  editingState
}: {
  collection: ICollection<T>
  editingState?: EditingState
}) => {
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(collection.schema as z.ZodObject<Record<string, z.ZodTypeAny>>),
    defaultValues: collection.defaultValues as FieldValues
  })

  return (
    <FormProvider {...methods}>
      <Card collection={collection} editingState={editingState} />
    </FormProvider>
  )
}

export default DynamicForm
