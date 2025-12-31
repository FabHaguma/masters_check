import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => setView('table')}
        className={`p-2 rounded-md transition-colors ${
          view === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => setView('card')}
        className={`p-2 rounded-md transition-colors ${
          view === 'card' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;
