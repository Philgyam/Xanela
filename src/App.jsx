import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import ChatInterface from './ChatPage'; // Adjust the import path if needed
import Homepage from './HomePage'; // Adjust the import path if needed

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;