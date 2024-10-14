import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import AgentNode from './components/AgentNode';
import Sidebar from './components/Sidebar';
import { addAgent, updateAgent, setNodes, setEdges, loadFlow, deleteAgent } from './redux/flowSlice';

const nodeTypes = {
  agent: AgentNode,
};

const App = () => {
  const dispatch = useDispatch();
  const agents = useSelector((state) => state.flow.agents);
  const [nodes, setNodesState, onNodesChange] = useNodesState([]);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedFlow = localStorage.getItem('reactFlowState');
    if (savedFlow) {
      const parsedFlow = JSON.parse(savedFlow);
      dispatch(loadFlow(parsedFlow));
      setNodesState(parsedFlow.nodes || []);
      setEdgesState(parsedFlow.edges || []);
    }
  }, [dispatch, setNodesState, setEdgesState]);

  const onConnect = useCallback(
    (params) => setEdgesState((eds) => addEdge(params, eds)),
    [setEdgesState]
  );

  const onAddAgent = useCallback(() => {
    const newAgent = {
      id: nanoid(),
      type: 'agent',
      position: { x: 100, y: 100 },
      data: { label: 'New Agent', steps: '', description: '', tools: [] },
    };
    setNodesState((nds) => nds.concat(newAgent));
    dispatch(addAgent(newAgent));
  }, [dispatch, setNodesState]);

  const onNodeClick = useCallback((event, node) => {
    if (node.type === 'agent') {
      const clickY = event.clientY - event.target.getBoundingClientRect().top;
      const nodeHeight = event.target.offsetHeight;
      if (clickY <= nodeHeight * 0.8) {
        setSelectedAgent(agents.find((agent) => agent.id === node.id));
      }
    }
  }, [agents]);

  const onAgentUpdate = useCallback((updatedAgent) => {
    dispatch(updateAgent(updatedAgent));
    setNodesState((nds) =>
      nds.map((node) =>
        node.id === updatedAgent.id
          ? { ...node, data: { ...updatedAgent.data } }
          : node
      )
    );
  }, [dispatch, setNodesState]);

  const onDeleteAgent = useCallback((nodeId) => {
    setNodesState((nds) => nds.filter((node) => node.id !== nodeId));
    dispatch(deleteAgent(nodeId));
  }, [setNodesState, dispatch]);

  const saveFlow = useCallback(() => {
    const flow = {
      agents,
      nodes,
      edges,
    };
    const blob = new Blob([JSON.stringify(flow)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [agents, nodes, edges]);

  const importFlow = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const parsedFlow = JSON.parse(content);
          dispatch(loadFlow(parsedFlow));
          setNodesState(parsedFlow.nodes || []);
          setEdgesState(parsedFlow.edges || []);
        } catch (error) {
          console.error('Error parsing imported file:', error);
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  }, [dispatch, setNodesState, setEdgesState]);

  useEffect(() => {
    dispatch(setNodes(nodes));
    dispatch(setEdges(edges));
  }, [nodes, edges, dispatch]);

  return (
    <div className="flex h-screen">
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onDelete: () => onDeleteAgent(node.id),
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <div className="absolute bottom-4 right-4 space-x-2">
          <button
            onClick={onAddAgent}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Add Agent
          </button>
          <button
            onClick={saveFlow}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Save Flow
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Import Flow
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importFlow}
            style={{ display: 'none' }}
            accept=".json"
          />
        </div>
      </div>
      {selectedAgent && (
        <div className="w-96 h-full overflow-y-auto">
          <Sidebar agent={selectedAgent} onUpdate={onAgentUpdate} onClose={() => setSelectedAgent(null)} />
        </div>
      )}
    </div>
  );
};

export default App;