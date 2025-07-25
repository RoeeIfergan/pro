import { Box } from '@mui/material'
import { IDisplay, TcardJSONNode } from '../types'
import RenderCardComponent from '../RenderCardComponent'
import { useWatch } from 'react-hook-form'

interface ICardDisplay extends IDisplay {
  cardJSONNodeChildren: TcardJSONNode[]
}

const CardDisplay = ({ ifField, equals, cardJSONNodeChildren }: ICardDisplay) => {
  const field = useWatch({
    name: ifField
  })

  if (field !== equals) return

  return (
    <Box>
      {cardJSONNodeChildren.map((child, id) => (
        <RenderCardComponent key={id} cardJSONNode={child} />
      ))}
    </Box>
  )
}

export default CardDisplay
