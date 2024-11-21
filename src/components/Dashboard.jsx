import React, { useState, useEffect } from 'react';
import Column from './Column';

function Dashboard() {
  const [columns, setColumns] = useState({
    "No Iniciada": [],
    "En progreso": [],
    "Finalizado": [],
    "Cancelado": [],
  });

  useEffect(() => {
    console.log("useEffect ejecutado");

    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/task/');
        const data = await response.json();

        console.log("Datos obtenidos del backend:", data);

        const groupedColumns = {
          "No Iniciada": [],
          "En progreso": [],
          "Finalizado": [],
          "Cancelado": [],
        };

        const tasksWithIds = data.tasks.map((task) => ({
          ...task,
          id: task.id || task._id, // Garantizar que id exista
        }));

        tasksWithIds.forEach((task) => {
          groupedColumns[task.progresion]?.push(task);
        });

        console.log("groupedColumns después de procesar las tareas:", groupedColumns); // Verificar contenido
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
      "Cancelado": "updateStatusCancelled",
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
          // Recargar tareas o actualizar el estado
          const updatedResponse = await fetch('http://localhost:4000/api/v1/task/');
          const updatedData = await updatedResponse.json();

          const groupedColumns = {
            "No Iniciada": [],
            "En progreso": [],
            "Finalizado": [],
            "Cancelado": []
          };

          updatedData.tasks.forEach((task) => {
            groupedColumns[task.progresion]?.push(task);
          });

          setColumns(groupedColumns);
          console.log("Columns actualizado:", groupedColumns);
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
      {console.log("Estado actual de columns:", columns)}
      {Object.entries(columns).map(([columnId, tasks]) => {
        console.log(`Column ID: ${columnId}`, tasks);
        return (
          <Column
            key={`column-${columnId}`}
            columnId={columnId}
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
