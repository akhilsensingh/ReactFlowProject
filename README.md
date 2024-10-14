# React Flow Agent

This project is a React application that allows users to interact with custom blocks using React Flow. It implements a custom block called Agent with interactive features.
Deployed Link: https://flowagent.netlify.app

## Features

- Custom Agent block with interactive form
- Rich text editor for inputting and formatting steps
- Dynamic tool management within each Agent
- Global state management using Redux
- Persistence of flow state
- Responsive design

## Setup and Running the Application

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- Click the "Add Agent" button to create a new Agent block
- Click on an Agent block to open its edit form in the sidebar
- Use the form to edit the Agent's label, description, steps, and tools
- Click "Update Agent" to save changes
- Use the "Save Flow" button to persist the current flow state

## Project Structure

- `src/App.js`: Main application component
- `src/components/AgentNode.js`: Custom Agent node component
- `src/components/Sidebar.js`: Sidebar component for editing Agent properties
- `src/redux/store.js`: Redux store configuration
- `src/redux/flowSlice.js`: Redux slice for managing flow state

## Technologies Used

- React
- React Flow
- Redux Toolkit
- React Quill
- Tailwind CSS

## Future Enhancements

- Drag and drop functionality for reordering tools
- Export/Import flow as JSON
- Unit tests for key components
