import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Sidebar = ({ agent, onUpdate, onClose }) => {
  const [label, setLabel] = useState(agent.data.label);
  const [description, setDescription] = useState(agent.data.description);
  const [steps, setSteps] = useState(agent.data.steps);
  const [tools, setTools] = useState(agent.data.tools);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...agent,
      data: { ...agent.data, label, description, steps, tools },
    });
    onClose();
  };

  const addTool = () => {
    setTools([...tools, { name: '', parameters: [], description: '', url: '' }]);
  };

  const updateTool = (index, field, value) => {
    const updatedTools = [...tools];
    updatedTools[index][field] = value;
    setTools(updatedTools);
  };

  const addParameter = (toolIndex) => {
    const updatedTools = [...tools];
    updatedTools[toolIndex].parameters.push({ name: '', type: 'String', description: '' });
    setTools(updatedTools);
  };

  const updateParameter = (toolIndex, paramIndex, field, value) => {
    const updatedTools = [...tools];
    updatedTools[toolIndex].parameters[paramIndex][field] = value;
    setTools(updatedTools);
  };

  const removeParameter = (toolIndex, paramIndex) => {
    const updatedTools = [...tools];
    updatedTools[toolIndex].parameters.splice(paramIndex, 1);
    setTools(updatedTools);
  };

  const removeTool = (index) => {
    const updatedTools = tools.filter((_, toolIndex) => toolIndex !== index);
    setTools(updatedTools);
  };

  return (
    <div className="w-96 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 float-right text-xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Steps</label>
          <ReactQuill
            value={steps}
            onChange={setSteps}
            modules={modules}
            formats={formats}
            className="bg-white border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Tools</label>
          {tools.map((tool, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-md">
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateTool(index, 'name', e.target.value)}
                placeholder="Tool Name"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <textarea
                value={tool.description}
                onChange={(e) => updateTool(index, 'description', e.target.value)}
                placeholder="Tool Description"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={tool.url}
                onChange={(e) => updateTool(index, 'url', e.target.value)}
                placeholder="Tool URL"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 focus:ring-blue-500 focus:border-blue-500"
              />
              <div>
                <h4 className="font-bold text-gray-700 mb-2">Parameters</h4>
                {tool.parameters.map((param, paramIndex) => (
                  <div key={paramIndex} className="mb-4">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParameter(index, paramIndex, 'name', e.target.value)}
                      placeholder="Parameter Name"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={param.type}
                      onChange={(e) => updateParameter(index, paramIndex, 'type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="String">String</option>
                      <option value="Number">Number</option>
                      <option value="Boolean">Boolean</option>
                      <option value="Enum">Enum</option>
                    </select>
                    <textarea
                      value={param.description}
                      onChange={(e) => updateParameter(index, paramIndex, 'description', e.target.value)}
                      placeholder="Parameter Description"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeParameter(index, paramIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 rounded-md shadow-sm mt-1"
                    >
                      Remove Parameter
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addParameter(index)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm mt-2"
                >
                  Add Parameter
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mt-4 shadow-sm"
              >
                Remove Tool
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTool}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm"
          >
            Add Tool
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm w-full"
        >
          Update Agent
        </button>
      </form>
    </div>
  );
};

export default Sidebar;