import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import User from './pages/User';
import Login from './pages/Login';
import Appointment from './pages/Appointment';
import MakeAppointments from './pages/MakeAppointments';
import { AuthProvider } from '../context/authContext';
import './index.css'; 
import './App.css'
const App = () => {
  return (
    <>
      <Sidebar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/makeappointments" element={<MakeAppointments />} />


      </Routes>
      </Sidebar>
      
    </>
  );
};

export default App;