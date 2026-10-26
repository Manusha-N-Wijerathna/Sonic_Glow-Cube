import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import Home from './pages/Home.jsx';
import Section1 from './pages/Section1.jsx';
import Predefined from './pages/Predefined';
import UserText from './pages/UserText';
import PatternSelector from './pages/PatternSelector';
import About from './pages/About';
import Text from "./pages/Textbox";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/section1" element={<Section1 />} />
        <Route path="/cube" element={<Section1 />} />
        <Route path="/about" element={<About />} />
        <Route path="/predefined" element={<Predefined />} />
        <Route path="/usertext" element={<UserText />} />
        <Route path="/patternselector" element={<PatternSelector />} />
        <Route path="/text" element={<Text />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


export default App;