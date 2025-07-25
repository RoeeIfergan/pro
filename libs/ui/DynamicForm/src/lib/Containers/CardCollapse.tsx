import { Box, Collapse, styled } from '@mui/material'
import { useState } from 'react'
import { ICollapse, TcardJSONNode } from '../types'
import RenderCardComponent from '../RenderCardComponent'

const CollapseClickableContainer = styled(Box)(
  () => `
    height: 10px;
    background: gray;
  `
)
const CollapseContainer = styled(Box)(
  () => `
    border: 1px solid white
  `
)

interface ICardCollapse extends ICollapse {
  cardJSONNodeChildren: TcardJSONNode[]
}

const CardCollapse = ({ defaultOpened, cardJSONNodeChildren }: ICardCollapse) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(defaultOpened)

  const onCollapseClick = () => {
    setIsCollapseOpen((prevValue) => !prevValue)
  }
  return (
    <CollapseContainer>
      <CollapseClickableContainer onClick={onCollapseClick} />
      <Collapse in={isCollapseOpen}>
        {cardJSONNodeChildren.map((child, id) => (
          <RenderCardComponent key={id} cardJSONNode={child} />
        ))}
      </Collapse>
    </CollapseContainer>
  )
}

export default CardCollapse
