import { createContext, useContext } from 'react'
import { useCardBuilderContextValues } from '../hooks/useCardBuilderContextValues '

export type DNDCardBuilderContextType = ReturnType<typeof useCardBuilderContextValues>

export const DNDCardBuilderContext = createContext<DNDCardBuilderContextType>(
  {} as unknown as DNDCardBuilderContextType
)

export const useDNDCardBuilderContext = () => {
  return useContext(DNDCardBuilderContext)
}
