import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

const Column = ({ columnId, title, tasks, onTaskDrop }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const handleDrop = (event) => {
    const taskId = event.dataTransfer.getData('taskId');
    onTaskDrop(taskId, columnId);  // Llama al manejador en App.js
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
