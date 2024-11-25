import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../components/Login'

const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};
export default PublicRoutes;