import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as jwt_decode from 'jwt-decode';

import PrivateRoutes from './PrivateRoot';
import Login from '../components/Login';
import TaskBoard from '../components/HomePage';
import RegisterEmployee from '../components/RegisterEmployee'; // Importa el componente de registro

export default function Root() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserRole(decoded.rol); // Asigna el rol desde el token
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
      <DndProvider backend={HTML5Backend}>
        <Routes>
          {/* Ruta de inicio de sesión */}
          <Route path='/login' element={<Login />} />
          
          {/* Ruta para el formulario de registro */}
          <Route path='/register-employee' element={<RegisterEmployee />} />
          
          {/* Ruta para el tablero principal */}
          <Route path='/home' element={<TaskBoard />} />

          {/* Rutas protegidas dependiendo del rol */}
          {
            userRole === 'Administrador App'
              ? <Route path='/' element={<PrivateRoutes />} />
              : <Route path='/' element={<Navigate to='/login' replace />} />
          }

          {/* Redirección para rutas no definidas */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </DndProvider>
    </BrowserRouter>
  );
}
