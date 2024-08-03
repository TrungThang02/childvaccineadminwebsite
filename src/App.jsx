import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import User from './pages/User';
import './App.css'
const App = () => {
  return (
   <BrowserRouter>
    <Sidebar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
      </Routes>
      </Sidebar>
   </BrowserRouter>
  );
};

export default App;