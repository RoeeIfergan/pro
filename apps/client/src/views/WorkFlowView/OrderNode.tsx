import { Handle, Position, useNodeConnections, useNodesData } from '@xyflow/react'
import { useState } from 'react'

const OrderNode = () => {
  const sourceConnection = useNodeConnections({ handleType: 'source' })
  const targetConnection = useNodeConnections({ handleType: 'target' })
  const sourceNodesData = useNodesData(sourceConnection?.[0]?.source)
  const targetNodesData = useNodesData(targetConnection?.[0]?.source)

  const [lightness, setLightness] = useState('dark')

  //   useEffect(() => {
  //     if (nodesData?.data) {
  //       const color = nodesData.data.value
  //       setLightness(0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b >= 128 ? 'light' : 'dark')
  //     } else {
  //       setLightness('dark')
  //     }
  //   }, [nodesData])

  return (
    <div
      className='lightness-node'
      style={{
        background: lightness === 'light' ? 'white' : 'black',
        color: lightness === 'light' ? 'black' : 'white'
      }}
    >
      <Handle type='target' position={Position.Top} />
      <Handle type='target' position={Position.Bottom} />
      <div>
        This color is
        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{lightness}</p>
      </div>
    </div>
  )
}

export default OrderNode
