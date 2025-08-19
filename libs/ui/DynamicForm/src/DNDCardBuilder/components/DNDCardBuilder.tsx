import { Dispatch, SetStateAction } from 'react'
import DNDCardBuilderProvider from './DNDCardBuilderProvider'
import { ICardSchemaMetaWithIds } from '../types'
import Rows from './Rows'
import { Container } from 'react-modal-promise'

interface DNDCardBuilderProps {
  uiSchema: ICardSchemaMetaWithIds
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMetaWithIds>>
}

const DNDCardBuilder = (props: DNDCardBuilderProps) => {
  return (
    <>
      <DNDCardBuilderProvider {...props}>
        <Rows />
      </DNDCardBuilderProvider>

      <Container />
    </>
  )
}

export default DNDCardBuilder
