import { Box, Typography } from '@mui/material'
import DynamicForm, { TcardJSONNode } from '@pro3/DynamicForm'

const cardJSON: TcardJSONNode = {
  componentType: 'box',
  children: [
    { componentType: 'textField', fieldName: 'name', label: '..' },
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
      children: [{ componentType: 'textField', fieldName: 'name', label: 'air name' }]
    }
  ]
}

const DynamicFormView = () => {
  return (
    <Box p={3}>
      <Typography variant='h4' p={2}>
        Card View
      </Typography>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '500px',
            backgroundColor: '#353535',
            borderRadius: '5px'
          }}
        >
          <DynamicForm cardJSON={cardJSON} />
        </Box>
      </Box>
    </Box>
  )
}

export default DynamicFormView
