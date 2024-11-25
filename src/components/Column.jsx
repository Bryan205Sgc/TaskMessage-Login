import React from 'react';
import { useDrop } from 'react-dnd';
import Task from './Task';
import '../styles/Column.css';

const Column = ({ title, tasks, onDrop, onEdit, onDelete, onCancel }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onDrop(item, title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`column ${isOver ? 'column-hover' : ''}`}
    >
      <h3>{title}</h3>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default Column;
