import React from 'react';
import '../styles/CancelledTasksModal.css';

const CancelledTasksModal = ({ isOpen, onClose, tasks, onRestore }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tareas Canceladas</h2>
        {tasks.length === 0 ? (
          <p>No hay tareas canceladas.</p>
        ) : (
          <ul className="cancelled-tasks-list">
            {tasks.map((task) => (
              <li key={task._id} className="cancelled-task">
                <h3>{task.nombre}</h3>
                <p>{task.descripcion}</p>
                <button
                  className="restore-btn"
                  onClick={() => onRestore(task._id)}
                >
                  Restaurar
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="close-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CancelledTasksModal;
