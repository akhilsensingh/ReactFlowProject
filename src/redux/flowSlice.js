import { createSlice } from '@reduxjs/toolkit';

const flowSlice = createSlice({
  name: 'flow',
  initialState: {
    agents: [],
    nodes: [],
    edges: [],
  },
  reducers: {
    addAgent: (state, action) => {
      state.agents.push(action.payload);
    },
    updateAgent: (state, action) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
      }
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    loadFlow: (state, action) => {
      return { ...state, ...action.payload };
    },
    deleteAgent: (state, action) => {
      state.agents = state.agents.filter(agent => agent.id !== action.payload);
    },
  },
});

export const { addAgent, updateAgent, setNodes, setEdges, loadFlow, deleteAgent } = flowSlice.actions;
export default flowSlice.reducer;