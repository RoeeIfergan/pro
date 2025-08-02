import { Box } from '@mui/material'

const RowIndent = ({ depth }: { depth: number }) => {
  return (
    <Box
      style={{
        height: '100%',
        width: `${20 * depth}px`,
        backgroundColor: '#686868',
        position: 'absolute',
        top: 0,
        right: 0
      }}
    />
  )
}

export default RowIndent
