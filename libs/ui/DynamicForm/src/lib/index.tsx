import { FormProvider, useForm } from 'react-hook-form'
import { TcardJSONNode } from './types'
import RenderCardComponent from './RenderCardComponent'

type TCard = { cardJSON: TcardJSONNode | null }

export const DynamicForm = ({ cardJSON }: TCard) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <RenderCardComponent cardJSONNode={cardJSON} />
    </FormProvider>
  )
}

export default DynamicForm
