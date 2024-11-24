import React from 'react';
import { useDrag } from 'react-dnd';
import '../styles/Task.css';

const Task = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
    </div>
  );
};

export default Task;

