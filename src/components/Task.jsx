import React from 'react';
import './Task.css'; // Asegúrate de que los estilos actualizados estén enlazados

function Task({ task, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task.id); // Ajusta según tu estructura
        onDragStart && onDragStart(task.id);
    };

    return (
        <article className="article-wrapper" draggable onDragStart={handleDragStart}>
            {/* Contenedor del proyecto */}
            <div className="rounded-lg container-project">
                <div className="task-content">
                    <h3 className="task-title">{task.title || 'Título no disponible'}</h3>
                    <p className="task-description">{task.description || 'Sin descripción'}</p>
                </div>
            </div>
            <div className="project-info">
                {/* Etiquetas de Progresión */}
                <div className="types">
                    <span className="project-type">• {task.progresion}</span>
                </div>
            </div>
        </article>
    );
}

export default Task;
