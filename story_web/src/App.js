import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AddBook from './components/AddBook';
import ReadBook from './components/ReadBook';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/read-book/:title" element={<ReadBook />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
