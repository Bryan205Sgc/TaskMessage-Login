import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee } from '../utils/api';
import '../styles/login.css';

const RegisterEmployee = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    pass: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerEmployee(formData);
      setMessage(`Empleado registrado exitosamente: ${response.data.employee.nombre}`);
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <section className="login-container">
      <h2>Registrar Nuevo Empleado</h2>
      <div className='columForm'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="codigo">Código:</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="pass">Contraseña:</label>
            <input
              type="password"
              id="pass"
              name="pass"
              value={formData.pass}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Registrar</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </section>
  );
};

export default RegisterEmployee;
