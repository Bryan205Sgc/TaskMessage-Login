import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Organization from '../components/Organization';
const PrivateRoutes = () => {
    return(
        <Routes>
            <Route path='/organization' element={ <Organization />} />

            <Route path='*' element={<Navigate to='/organization' replace />} />
            <Route />
        </Routes>
    );
};

export default PrivateRoutes;