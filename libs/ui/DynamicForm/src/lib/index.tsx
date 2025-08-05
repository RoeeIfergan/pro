import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'
import { Card } from './components/Card'
import { ICardSchemaMeta } from './types/types'

export const DynamicForm = ({
  schema,
  uiSchema
}: {
  schema: ZodType<any, any, any>
  uiSchema: ICardSchemaMeta
}) => {
  const methods = useForm({
    resolver: zodResolver(schema)
    // defaultValues: schema.parse({})
  })

  return (
    <FormProvider {...methods}>
      <Card schema={schema} uiSchema={uiSchema} />
    </FormProvider>
  )
}

export default DynamicForm
