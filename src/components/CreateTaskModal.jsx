import React, { useState } from 'react';
import '../styles/CreateTaskModal.css';

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFinalizacion, setFechaFinalizacion] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const handleCreate = () => {
    if (!nombre || !descripcion || !departmentId) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const newTask = {
      nombre,
      descripcion,
      fechaFinalizacion,
      DepartmentId: departmentId,
    };

    // Llama a la función de creación pasada como prop
    onCreate(newTask);

    // Limpia los campos y cierra el modal
    setNombre('');
    setDescripcion('');
    setFechaFinalizacion('');
    setDepartmentId('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Crear Nueva Tarea</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="date"
          value={fechaFinalizacion}
          onChange={(e) => setFechaFinalizacion(e.target.value)}
        />
        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Seleccionar Departamento</option>
          <option value="67350ce0af555b55505d6bf4">Departamento 1</option>
          <option value="67350d03af8bf18868e03f02">Departamento 2</option>
          {/* Agrega más departamentos según sea necesario */}
        </select>
        <div className="modal-actions">
          <button onClick={handleCreate}>Crear</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
