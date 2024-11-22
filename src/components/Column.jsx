import React from 'react';
import './Column.css';
import Task from './Task';

function Column({ title, tasks, onTaskDrop }) {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        const taskId = e.dataTransfer.getData('taskId');
        console.log(`Tarea soltada: ${taskId} en columna: ${title}`);
        onTaskDrop && onTaskDrop(taskId, title);
    };

    return (
        <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
            <h2>{title}</h2>
            <div className="task-list">
                {tasks.map((task) => (
                    <Task key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}

export default Column;
