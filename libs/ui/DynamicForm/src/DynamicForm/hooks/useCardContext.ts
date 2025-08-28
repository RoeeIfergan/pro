import { useContext } from 'react'
import { CardContext } from '../constants/context'

export const useCardContext = () => {
  return useContext(CardContext)
}
