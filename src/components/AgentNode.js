import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const AgentNode = ({ data }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <div className="font-bold">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
      
      {/* Cancel [X] icon, visible on hover */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete(); // Ensure the onDelete function is called from data prop
          }}
          className="absolute top-0 right-0 text-red-500 hover:text-red-700 font-bold"
          style={{ fontSize: '16px' }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default AgentNode;
