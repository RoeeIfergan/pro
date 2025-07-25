import { Box, styled } from '@mui/material'
import CardTextField from './Inputs/CardTextField'
import { TcardJSONNode } from './types'
import CardCollapse from './Containers/CardCollapse'
import CardSelect from './Inputs/CardSelect'
import CardDisplay from './Containers/CardDisplay'

const FieldContainer = styled(Box)(
  () => `
    width: 200px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  `
)

type TRenderCardComponent = { cardJSONNode: TcardJSONNode | null }

const RenderCardComponent = ({ cardJSONNode }: TRenderCardComponent) => {
  if (!cardJSONNode) return

  switch (cardJSONNode.componentType) {
    case 'textField':
      return (
        <FieldContainer>
          <CardTextField {...cardJSONNode} type='text' />
        </FieldContainer>
      )
    case 'numberInput':
      return (
        <FieldContainer>
          <CardTextField {...cardJSONNode} type='number' />
        </FieldContainer>
      )
    case 'select':
      return (
        <FieldContainer>
          <CardSelect {...cardJSONNode} />
        </FieldContainer>
      )
    case 'collapse':
      return (
        <FieldContainer>
          <CardCollapse {...cardJSONNode} cardJSONNodeChildren={cardJSONNode.children} />
        </FieldContainer>
      )
    case 'display':
      return (
        <FieldContainer>
          <CardDisplay {...cardJSONNode} cardJSONNodeChildren={cardJSONNode.children} />
        </FieldContainer>
      )
    case 'box':
    default:
      return (
        <FieldContainer>
          {cardJSONNode.children.map((child, id) => (
            <RenderCardComponent key={id} cardJSONNode={child} />
          ))}
        </FieldContainer>
      )
  }
}

export default RenderCardComponent
