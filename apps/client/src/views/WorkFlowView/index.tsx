import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material'
import { useState } from 'react'

import '@xyflow/react/dist/style.css'
import { useScreens } from '../../hooks/screens'
import Workflow from './Workflow'

const WorkFlowView = () => {
  const [selectedScreenId, setSelectedScreenId] = useState(null)
  const { data: screens } = useScreens()

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedScreenId(event.target.value as string)
  }

  return (
    <Box p={3}>
      <Stack direction='column' spacing={2} width='300px'>
        <Typography variant='h4' p={2}>
          Card View
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Screen..</InputLabel>
          <Select value={selectedScreenId} label='Age' onChange={handleChange}>
            {screens?.map((screen) => (
              <MenuItem value={screen.id}>{screen.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Workflow selectedScreenId={selectedScreenId} />
    </Box>
  )
}

export default WorkFlowView
