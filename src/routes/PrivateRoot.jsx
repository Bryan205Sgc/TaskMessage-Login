import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
    return(
        <Routes>
            <Route path='*' element={<Navigate to='/organization' replace />} />
            <Route />
        </Routes>
    );
};

export default PrivateRoutes;