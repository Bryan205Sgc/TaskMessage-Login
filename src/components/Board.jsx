import React, { useState, useEffect } from 'react';
import Column from './Column';
import './Board.css';

function Board() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('/api/v1/tasks')
            .then((response) => response.json())
            .then((data) => {
                console.log('Tareas obtenidas del backend:', data.tasks);
                setTasks(data.tasks || []); // Asegura que las tareas sean un array
            })
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    const handleTaskDrop = (taskId, column) => {
        console.log(`Tarea ${taskId} movida a la columna ${column}`);

        const endpointMap = {
            "No Iniciada": "/api/v1/tasks/updateStatusToDo",
            "En progreso": "/api/v1/tasks/updateStatusInProgress",
            "Cancelado": "/api/v1/tasks/updateStatusCancelled",
            "Finalizado": "/api/v1/tasks/updateStatusFinished",
        };

        const endpoint = endpointMap[column];

        fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: taskId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Tarea actualizada:', data);

                // Actualizar el estado local para reflejar el cambio
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, progresion: column } : task
                    )
                );
            })
            .catch((error) => console.error('Error updating task:', error));
    };

    const columns = {
        "No Iniciada": tasks.filter((task) => task.progresion === "No iniciado"),
        "En progreso": tasks.filter((task) => task.progresion === "En proceso"),
        "Cancelado": tasks.filter((task) => task.progresion === "Cancelado"),
        "Finalizado": tasks.filter((task) => task.progresion === "Finalizado"),
    };

    return (
        <div className="board">
            {Object.entries(columns).map(([columnTitle, columnTasks]) => (
                <Column
                    key={columnTitle}
                    title={columnTitle}
                    tasks={columnTasks}
                    onTaskDrop={handleTaskDrop}
                />
            ))}
        </div>
    );
}

export default Board;
