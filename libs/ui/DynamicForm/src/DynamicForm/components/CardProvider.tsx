import { CardContextType } from '../types'
import { CardContext } from '../constants/context'

export const CardProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & CardContextType) => {
  return <CardContext.Provider value={props}>{children}</CardContext.Provider>
}
