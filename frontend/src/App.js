import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Navbar from './components/Header/Navbar';
import Home from './pages/Home';
import ProtectedPage from './pages/Protected';
import VolunteerPage from './pages/VolunteerPage';
//import CityAdminPage from './pages/CityAdminPage';
//import RegionAdminPage from './pages/RegionAdminPage';
//import SuperUserPage from './pages/SuperUserPage';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />     
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          {/* <Route path="/city-admin" element={<CityAdminPage />} />
          <Route path="/region-admin" element={<RegionAdminPage />} />
          <Route path="/superuser" element={<SuperUserPage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
