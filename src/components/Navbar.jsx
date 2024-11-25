import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { jwtDecode } from 'jwt-decode'

import '../styles/navbar.css'
 

const NavBar = () => {
    const [userRol, setUserRol] = useState();


    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if(token){
            try{
                const data = jwtDecode(token);
                const rol = data.rol;
                setUserRol(rol);

                console.log(rol);
                
                
            }catch(e){
                console.log('error al decodificar el token: ', e.message);
            }
        }else{
            console.log('No se encontró un token en el almacenamiento local');
        }
    })


    return (
        <div className="divBar">
            <ul>
                {
                    userRol === 'Administrador Org' && (
                        <li> <a href=""> aña</a></li>
                    )
                }
            </ul>
            
            
        </div>
    );
};

export default NavBar;