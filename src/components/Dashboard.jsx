import React, { useState, useEffect } from 'react';
import Column from './Column';

function Dashboard() {
  const [columns, setColumns] = useState({
    "No Iniciada": [],
    "En progreso": [],
    "Finalizado": [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/task/');
        const data = await response.json();

        const groupedColumns = {
          "No Iniciada": [],
          "En progreso": [],
          "Finalizado": [],
        };

        const tasksWithIds = data.tasks.map((task) => ({
          ...task,
          id: task.id || task._id, // Garantizar que id exista
        }));

        tasksWithIds.forEach((task) => {
          groupedColumns[task.progresion]?.push(task);
        });

        setColumns(groupedColumns);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskDrop = async (taskId, targetColumnId) => {
    console.log(`handleTaskDrop llamado con taskId: ${taskId} y targetColumnId: ${targetColumnId}`);

    const endpointMap = {
      "No Iniciada": "updateStatusToDo",
      "En progreso": "updateStatusInProgress",
      "Finalizado": "updateStatusFinished",
    };

    const endpoint = endpointMap[targetColumnId];

    if (endpoint) {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/task/${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: taskId }),
        });

        const result = await response.json();
        console.log('Respuesta del backend:', result);

        if (response.ok) {
          const updatedResponse = await fetch('http://localhost:4000/api/v1/task/');
          const updatedData = await updatedResponse.json();

          const groupedColumns = {
            "No Iniciada": [],
            "En progreso": [],
            "Finalizado": [],
          };

          updatedData.tasks.forEach((task) => {
            groupedColumns[task.progresion]?.push(task);
          });

          setColumns(groupedColumns);
        } else {
          console.error('Error al actualizar la tarea:', result.message);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    }
  };

  return (
    <div className="dashboard">
      {Object.entries(columns).map(([columnId, tasks]) => {
        console.log(`Column ID: ${columnId}`, tasks); // Verifica que columnId no sea undefined
        return (
          <Column
            key={columnId}
            columnId={columnId} // Pasar correctamente columnId
            title={columnId}
            tasks={tasks}
            onTaskDrop={handleTaskDrop}
          />
        );
      })}
    </div>
  );
}

export default Dashboard;
