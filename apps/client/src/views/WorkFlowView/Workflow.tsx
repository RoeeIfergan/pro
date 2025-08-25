import { Box } from '@mui/material'
import { useState, useCallback, useEffect } from 'react'
import dagre from '@dagrejs/dagre'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  Connection,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useScreenById } from '../../hooks/screens'
import OrderNode from './OrderNode'
import UserCard from './UserCard'

const nodeTypes = {
  OrderNode
}

const NODE_WIDTH = 280
const NODE_HEIGHT = 80
const HORIZONTAL_SPACING = 160
const VERTICAL_SPACING = 200

// Helper function to layout the graph using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph()
  g.setGraph({
    rankdir: 'TB', // Top to bottom layout
    nodesep: HORIZONTAL_SPACING, // Horizontal spacing between nodes
    ranksep: VERTICAL_SPACING, // Vertical spacing between ranks
    edgesep: 50, // Minimum edge separation
    marginx: 20, // Horizontal margin
    marginy: 20 // Vertical margin
  })
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  // Add edges to the graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  // Run the layout
  dagre.layout(g)

  // Get the positioned nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2
      }
    }
  })

  return { nodes: layoutedNodes, edges }
}

const Workflow = ({ selectedScreenId }: { selectedScreenId: string | null }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const { data: screen } = useScreenById(selectedScreenId)

  useEffect(() => {
    if (!screen) return

    // Create initial nodes and edges
    const initialNodes = screen.steps.map((step) => ({
      id: step.id,
      type: 'OrderNode',
      position: { x: 0, y: 0 }, // Initial position will be calculated by Dagre
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        id: step.id,
        name: step.name,
        label: step.name
      }
    }))

    const initialEdges = screen.transitions.map((transition) => ({
      id: `${transition.fromStepId}-${transition.toStepId}`,
      source: transition.fromStepId,
      target: transition.toStepId
    }))

    // Apply the layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    )

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [screen])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  return (
    <Box
      sx={{
        width: '100%',
        height: '80vh',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#353535',
        borderRadius: '5px'
      }}
    >
      <UserCard />
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Box>
  )
}

export default Workflow
