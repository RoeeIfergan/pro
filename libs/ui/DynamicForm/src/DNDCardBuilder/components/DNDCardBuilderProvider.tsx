import { DNDCardBuilderContext } from '../utils/context'
import { useCardBuilderContextValues } from '../hooks/useCardBuilderContextValues '
import { ICardSchemaMeta } from '../../DynamicForm/types'

const DNDCardBuilderProvider = ({
  children,
  setUiSchema,
  uiSchema
}: {
  children: React.ReactNode
  setUiSchema: React.Dispatch<React.SetStateAction<ICardSchemaMeta>>
  uiSchema: ICardSchemaMeta
}) => {
  const value = useCardBuilderContextValues({ uiSchema, setUiSchema })

  return <DNDCardBuilderContext.Provider value={value}>{children}</DNDCardBuilderContext.Provider>
}

export default DNDCardBuilderProvider
