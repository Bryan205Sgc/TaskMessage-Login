import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import '../styles/Task.css';

const Task = ({ task, onEdit, onDelete, onCancel }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

      <div className="task-menu" ref={menuRef}>
        <button className="menu-toggle" onClick={toggleMenu}>
          ⋮
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => onEdit(task)}>Editar</button>
            <button onClick={() => onDelete(task._id)}>Eliminar</button>
            <button onClick={() => onCancel(task._id)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
