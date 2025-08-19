import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCallback, useState } from 'react'
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Node,
  NodeDragEvent
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Node dimensions and spacing
const NODE_WIDTH = 150
const NODE_HEIGHT = 40
const NODE_SPACING = 20

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: NODE_HEIGHT + NODE_SPACING }, data: { label: '2' } }
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]
const Flow = () => {
  const { fitView } = useReactFlow()
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  const onNodeDrag = useCallback(
    (_: NodeDragEvent, node: Node) => {
      // Get all nodes except the one being dragged
      const otherNodes = nodes.filter((n) => n.id !== node.id)

      // Check for overlaps and adjust positions
      otherNodes.forEach((otherNode) => {
        const xDiff = node.position.x - otherNode.position.x
        const yDiff = node.position.y - otherNode.position.y
        const xOverlap = Math.abs(xDiff) < NODE_WIDTH + NODE_SPACING
        const yOverlap = Math.abs(yDiff) < NODE_HEIGHT + NODE_SPACING

        if (xOverlap && yOverlap) {
          // Calculate push direction and distance
          const pushX =
            xDiff > 0 ? NODE_WIDTH + NODE_SPACING - xDiff : -(NODE_WIDTH + NODE_SPACING + xDiff)
          const pushY =
            yDiff > 0 ? NODE_HEIGHT + NODE_SPACING - yDiff : -(NODE_HEIGHT + NODE_SPACING + yDiff)

          // Choose the smaller push distance
          if (Math.abs(pushX) < Math.abs(pushY)) {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === otherNode.id
                  ? { ...n, position: { ...n.position, x: n.position.x - pushX } }
                  : n
              )
            )
          } else {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === otherNode.id
                  ? { ...n, position: { ...n.position, y: n.position.y - pushY } }
                  : n
              )
            )
          }
        }
      })
    },
    [nodes]
  )

  // Find a position for a new node that doesn't overlap with existing nodes
  const findFreePosition = useCallback((existingNodes: typeof nodes) => {
    const isOverlapping = (x: number, y: number) => {
      return existingNodes.some((node) => {
        const xOverlap = Math.abs(node.position.x - x) < NODE_WIDTH + NODE_SPACING
        const yOverlap = Math.abs(node.position.y - y) < NODE_HEIGHT + NODE_SPACING
        return xOverlap && yOverlap
      })
    }

    // Start from the center and spiral outward
    let radius = 0
    let angle = 0
    const radiusStep = NODE_WIDTH + NODE_SPACING
    const angleStep = Math.PI / 4

    while (radius < 2000) {
      // Prevent infinite loop
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      if (!isOverlapping(x, y)) {
        return { x, y }
      }

      angle += angleStep
      if (angle >= Math.PI * 2) {
        angle = 0
        radius += radiusStep
      }
    }

    // Fallback position if no free space found
    return { x: 0, y: 0 }
  }, [])

  const addNode = useCallback(() => {
    const position = findFreePosition(nodes)
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position
    }
    setNodes((nds) => [...nds, newNode])
    // Use setTimeout to ensure the node is added before fitting the view
    setTimeout(() => {
      fitView({ duration: 200 })
    }, 0)
  }, [nodes, fitView, findFreePosition])

  return (
    <Box p={3} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction='row' alignItems='center' spacing={2} p={2}>
        <Typography variant='h4'>Workflows</Typography>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={addNode}>
          Add Node
        </Button>
      </Stack>

      <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          fitView
        />
      </Box>
    </Box>
  )
}

const WorkflowsView = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}

export default WorkflowsView
