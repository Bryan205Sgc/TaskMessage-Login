import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import '../styles/Task.css';

const Task = ({ task, employees, onEdit, onDelete, onCancel, onAssign }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const toggleMenu = (event) => {
    event.preventDefault(); // Evitar menú contextual predeterminado
    setMenuOpen(!menuOpen);
  };

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task._id, selectedEmployee);
      setSelectedEmployee(''); // Reiniciar la selección
      setMenuOpen(false); // Cerrar el menú
    }
  };

  return (
    <div
      ref={drag}
      className="article-wrapper"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="container-project">
        <h4 className="task-title">{task.nombre}</h4>
        <p className="task-description">{task.descripcion}</p>
      </div>
      <div className="project-info">
        <span className="project-type">{task.progresion}</span>
      </div>
      <div className="task-menu">
        <button className="menu-toggle" onClick={toggleMenu}>
          ⋮
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => onEdit(task)}>Editar</button>
            <button onClick={() => onDelete(task._id)}>Eliminar</button>
            <button onClick={() => onCancel(task._id)}>Cancelar</button>
            <div className="assign-section">
              <label htmlFor={`assign-${task._id}`}>Asignar a:</label>
              <select
                id={`assign-${task._id}`}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Selecciona un empleado</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.nombre}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                disabled={!selectedEmployee}
                className="assign-button"
              >
                Asignar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;

