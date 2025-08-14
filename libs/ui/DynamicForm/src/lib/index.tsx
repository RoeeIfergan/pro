import { FormProvider, useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from './components/Card'
import { ICollection } from './dev/collections'
import { z } from 'zod'
import { DefaultSchema } from './types'
import { Box } from '@mui/material'
export { CardHeader } from './components/CardHeader'

export const DynamicForm = ({ collection }: { collection?: ICollection }) => {
  if (!collection) return <div>skeleton...</div>

  return (
    <Box
      sx={{
        width: 500,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <DynamicFormContent collection={collection} />
    </Box>
  )
}

export const DynamicFormContent = <T extends DefaultSchema>({
  collection
}: {
  collection: ICollection<T>
}) => {
  console.log('💪💪 schema', collection.schema)
  console.log('💪💪 uiSchema', collection.uiSchema)

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(collection.schema as z.ZodObject<Record<string, z.ZodTypeAny>>),
    defaultValues: collection.defaultValues as FieldValues
  })

  return (
    <FormProvider {...methods}>
      <Card collection={collection} />
    </FormProvider>
  )
}

export default DynamicForm
