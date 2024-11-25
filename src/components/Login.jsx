import '../styles/login.css';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [pass, setPassword] = useState("");
    const Navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault(); 
        loginAction(email, pass);
    };

    const loginAction = (email, pass) => {

        if(!email || !pass) {
            alert('El campo de Email Y Password es necesario')  
        }else{
            axios.post("http://localhost:4000/api/v1/employee/login", {email, pass})
                .then(response => { 
                    const token = response.data.token;
                    localStorage.setItem('authToken', token);
                    Navigate('/home');
                    
                }).catch(e =>{
                    if(e.responses){
                        const status = e.response.status;
                        if( status === 404){
                            alert('Este usuario no xiste')
                        }else if(status === 401){
                            alert('Contraseña incorrecta')
                        }
                    }
                })
        }

        
    };

    return (
        <section className="login-container">
            <h2>Iniciar Sesión</h2>
            <div className='columForm'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña </label>
                        <input
                            type="password"
                            id="password"
                            value={pass}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </section>
    );
};

export default Login;
