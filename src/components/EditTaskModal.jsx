import React, { useState, useEffect } from 'react';
import '../styles/EditTaskModal.css';

const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState({
    nombre: '',
    descripcion: '',
    fechaFinalizacion: '',
    DepartmentId: '',
  });

  useEffect(() => {
    if (task) {
      setEditedTask({
        nombre: task.nombre || '',
        descripcion: task.descripcion || '',
        fechaFinalizacion: task.fechaFinalizacion || '',
        DepartmentId: task.Department?._id || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task || !task._id) {
      console.error('No se puede guardar la tarea porque falta el ID.');
      return;
    }
    onSave(task._id, editedTask);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="edit-task-modal">
        <div className="modal-content">
          <h2>Editar Tarea</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre"
                value={editedTask.nombre}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Descripción:
              <textarea
                name="descripcion"
                value={editedTask.descripcion}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Fecha de Finalización:
              <input
                type="date"
                name="fechaFinalizacion"
                value={editedTask.fechaFinalizacion}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Departamento:
              <input
                type="text"
                name="DepartmentId"
                value={editedTask.DepartmentId}
                onChange={handleChange}
                required
              />
            </label>
            <div className="modal-actions">
              <button type="submit">Guardar</button>
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTaskModal;
