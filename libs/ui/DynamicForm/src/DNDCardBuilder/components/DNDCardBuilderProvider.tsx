import { DNDCardBuilderContext } from '../utils/context'
import { ICardSchemaMetaWithIds } from '../types'
import { useCardBuilderContextValues } from '../hooks/useCardBuilderContextValues '

const DNDCardBuilderProvider = ({
  children,
  setUiSchema,
  uiSchema
}: {
  children: React.ReactNode
  setUiSchema: React.Dispatch<React.SetStateAction<ICardSchemaMetaWithIds>>
  uiSchema: ICardSchemaMetaWithIds
}) => {
  const value = useCardBuilderContextValues({ uiSchema, setUiSchema })

  return <DNDCardBuilderContext.Provider value={value}>{children}</DNDCardBuilderContext.Provider>
}

export default DNDCardBuilderProvider
