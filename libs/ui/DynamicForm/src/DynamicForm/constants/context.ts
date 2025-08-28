import { createContext } from 'react'
import { CardContextType } from '../types'

export const CardContext = createContext<CardContextType>({} as CardContextType)
