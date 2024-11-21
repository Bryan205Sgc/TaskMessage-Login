import React from 'react';
import Task from './Task';

function TaskList({ columnId, columnName, tasks, onDrop }) {
  const handleDrop = (taskId) => {
    onDrop(taskId, columnName);
  };

  return (
    <div className="task-list">
      <h2>{columnName}</h2>
      <div
        className="tasks"
        onDrop={(e) => handleDrop(e.dataTransfer.getData('taskId'))}
        onDragOver={(e) => e.preventDefault()}
      >
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
