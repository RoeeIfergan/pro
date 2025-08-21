import { ILayoutField } from '../../types'
import { componentMap } from '../../constants/mappers'

export const Field = ({ field, disabled = false }: { field: ILayoutField; disabled?: boolean }) => {
  const Component = componentMap[field.component]

  if (!Component) {
    return null
  }

  return <Component field={field} disabled={disabled} />
}
