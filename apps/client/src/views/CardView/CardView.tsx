import { Box, Typography } from '@mui/material'
import DynamicForm, { TcardJSONNode } from '@pro2/DynamicForm'

const cardJSON: TcardJSONNode = {
  componentType: 'box',
  children: [
    {
      componentType: 'select',
      fieldName: 'type',
      label: 'type',
      options: [
        { value: 'fire', label: 'fire' },
        { value: 'air', label: 'air' },
        { value: 'water', label: 'water' },
        { value: 'earth', label: 'earth' }
      ]
    },
    {
      componentType: 'display',
      ifField: 'type',
      equals: 'fire',
      children: [
        { componentType: 'textField', fieldName: 'name', label: 'fire name' },
        {
          componentType: 'collapse',
          defaultOpened: false,
          children: [
            {
              componentType: 'textField',
              fieldName: 'country',
              label: 'country'
            },
            { componentType: 'numberInput', fieldName: 'age', label: 'age' }
          ]
        },
        { componentType: 'textField', fieldName: 'name', label: 'name' }
      ]
    },
    {
      componentType: 'display',
      ifField: 'type',
      equals: 'air',
      children: [
        { componentType: 'textField', fieldName: 'name', label: 'air name' }
      ]
    }
  ]
}

const CardView = () => {
  return (
    <Box>
      <Typography>Card View</Typography>
      <DynamicForm cardJSON={cardJSON} />
    </Box>
  )
}

export default CardView
