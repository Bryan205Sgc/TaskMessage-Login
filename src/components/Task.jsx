import React from 'react';
import './Task.css';

function Task({ task, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task.id);
        onDragStart && onDragStart(task.id);
    };

    return (
        <article className="article-wrapper" draggable onDragStart={handleDragStart}>
            {/* Contenedor del título y descripción */}
            <div className="rounded-lg container-project">
                <div className="task-content">
                    <h3 className="task-title">{task.title || 'Título no disponible'}</h3>
                    <p className="task-description">{task.description || 'Sin descripción'}</p>
                </div>
            </div>
            <div className="project-info">
                <div className="types">
                    <span
                        style={{
                            backgroundColor: 'rgba(165, 96, 247, 0.43)',
                            color: 'rgb(85, 27, 177)',
                        }}
                        className="project-type"
                    >
                        • {task.progresion}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default Task;
