import { createContext } from 'react'
import { ICollection } from '../dev/collections'

export const CardContext = createContext<ICollection>({} as ICollection)
