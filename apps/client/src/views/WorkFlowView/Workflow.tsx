import { Box } from '@mui/material'
import { useState, useCallback, useEffect } from 'react'

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
import { layoutDagTree } from './positionElements'
import OrderNode from './OrderNode'
import UserCard from './UserCard'

const nodeTypes = {
  OrderNode
}

const Workflow = ({ selectedScreenId }: { selectedScreenId: string | null }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const { data: screen } = useScreenById(selectedScreenId)

  useEffect(() => {
    if (!screen) return

    const { nodes, edges } = layoutDagTree(
      { steps: screen.steps, transitions: screen.transitions },
      {
        nodeWidth: 220,
        nodeHeight: 60,
        horizontalGap: 80,
        verticalGap: 140,
        direction: 'TB', // top → bottom (y increases downward)
        sweeps: 6 // a few extra ordering passes for tidier trees
      }
    )

    const computedNodes = nodes.map((node) => ({
      id: node.id,
      type: 'OrderNode',
      position: node.position,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        id: node.id,
        name: node.data.label,
        label: node.data.label
      }
    }))
    setNodes(computedNodes)
    setEdges(edges)
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
