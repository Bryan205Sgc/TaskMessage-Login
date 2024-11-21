import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function Task({ task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,  // ID único para cada tarea
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`task ${isDragging ? 'dragging' : ''}`}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
}

export default Task;
