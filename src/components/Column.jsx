import React from 'react';
import Task from './Task';
import { useDroppable } from '@dnd-kit/core';

const Column = ({ columnId, title, tasks, onTaskDrop }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,  // Asegúrate de pasar el id correcto de la columna
  });

  const handleDrop = (event) => {
    const taskId = event.dataTransfer.getData('taskId');
    onTaskDrop(taskId, columnId);  // Pasar taskId y columnId al handler en Dashboard
  };

  return (
    <div ref={setNodeRef} className="column" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <h2>{title}</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default Column;
