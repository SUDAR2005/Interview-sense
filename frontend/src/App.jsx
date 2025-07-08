import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Placements from './pages/Preparation';
import Chatbot from './components/Chatbot';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <>
      <div className="nav-box">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/preparation/*" element={<Placements />} />
        </Routes>

        <Chatbot/>
      </div>
    </>
  );
}

export default App;
