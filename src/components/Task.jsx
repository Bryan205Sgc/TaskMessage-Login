import React from 'react';
import './Task.css';

function Task({ task, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task.id);
        onDragStart && onDragStart(task.id);
    };

    return (
        <div className="task" draggable onDragStart={handleDragStart}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
        </div>
    );
}

export default Task;
