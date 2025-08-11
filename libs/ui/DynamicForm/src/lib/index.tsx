import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from './components/Card'
import { ICollection } from './dev/collections'

export const DynamicForm = ({ collection }: { collection: ICollection }) => {
  console.log('💪💪 schema', collection.schema)
  console.log('💪💪 uiSchema', collection.uiSchema)

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(collection.schema),
    defaultValues: collection.defaultValues
  })

  return (
    <FormProvider {...methods}>
      <Card collection={collection} />
    </FormProvider>
  )
}

export default DynamicForm
