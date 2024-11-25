import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode';



import PrivateRoutes from './PrivateRoot';

import Login from '../components/Login';
import TaskBoard from '../components/TaskBoard';

export default function Root() {
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserRole(decoded.rol);  // Asigna el rol desde el token
      } catch (error) {
        console.error("Token inválido o expirado", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<TaskBoard />} />

        {
          userRole === 'Administrador App'
            ? <Route path='/' element={<PrivateRoutes />} />
            : <Route path='/' element={<Navigate to='/login' replace />} />
        }

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
