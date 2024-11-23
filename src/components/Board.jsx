import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Board = () => {
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState({
    todo: { title: "No Iniciada", taskIds: [] },
    inProgress: { title: "En progreso", taskIds: [] },
    done: { title: "Finalizada", taskIds: [] },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/task");
        const data = await response.json();
        console.log("Tareas obtenidas del backend:", data);

        const taskMap = {};
        const columnMap = { todo: [], inProgress: [], done: [] };

        data.tasks.forEach((task) => {
          const id = task._id;
          taskMap[id] = {
            id,
            title: task.nombre,
            description: task.descripcion,
            progresion: task.progresion,
          };

          switch (task.progresion) {
            case "No Iniciada":
              columnMap.todo.push(id);
              break;
            case "En progreso":
              columnMap.inProgress.push(id);
              break;
            case "Finalizada":
              columnMap.done.push(id);
              break;
            default:
              console.error(`Progresión desconocida para la tarea ${id}`);
          }
        });

        setTasks(taskMap);
        setColumns((prevColumns) => ({
          ...prevColumns,
          todo: { ...prevColumns.todo, taskIds: columnMap.todo },
          inProgress: { ...prevColumns.inProgress, taskIds: columnMap.inProgress },
          done: { ...prevColumns.done, taskIds: columnMap.done },
        }));
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    };

    fetchTasks();

    socket.on("task-updated", (updatedTask) => {
      console.log("Evento WebSocket recibido:", updatedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [updatedTask._id]: {
          ...prevTasks[updatedTask._id],
          ...updatedTask,
        },
      }));
    });

    return () => {
      socket.off("task-updated");
    };
  }, []);

  const handleTaskDrop = async (taskId, column) => {
    console.log(`handleTaskDrop llamado. Tarea: ${taskId}, Columna destino: ${column}`);

    const endpointMap = {
      todo: "/api/v1/tasks/updateStatusToDo",
      inProgress: "/api/v1/tasks/updateStatusInProgress",
      done: "/api/v1/tasks/updateStatusFinished",
    };

    const endpoint = endpointMap[column];
    console.log(`Usando endpoint: ${endpoint}`);

    if (!taskId) {
      console.error("Error: taskId no está definido");
      return;
    }
    if (!endpoint) {
      console.error("Error: endpoint no encontrado para la columna:", column);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const updatedTask = await response.json();
      console.log("Tarea actualizada desde el backend:", updatedTask);

      setTasks((prevTasks) => {
        const updatedTasks = {
          ...prevTasks,
          [taskId]: { ...prevTasks[taskId], progresion: column },
        };
        console.log("Estado actualizado de tareas:", updatedTasks);
        return updatedTasks;
      });

      setColumns((prevColumns) => {
        const sourceColumn = Object.keys(prevColumns).find((key) =>
          prevColumns[key].taskIds.includes(taskId)
        );
        if (!sourceColumn) {
          console.error(`Columna fuente no encontrada para la tarea ${taskId}`);
          return prevColumns;
        }

        const sourceTaskIds = prevColumns[sourceColumn].taskIds.filter(
          (id) => id !== taskId
        );
        const destinationTaskIds = [...prevColumns[column].taskIds, taskId];

        const updatedColumns = {
          ...prevColumns,
          [sourceColumn]: {
            ...prevColumns[sourceColumn],
            taskIds: sourceTaskIds,
          },
          [column]: {
            ...prevColumns[column],
            taskIds: destinationTaskIds,
          },
        };
        console.log("Estado actualizado de columnas:", updatedColumns);
        return updatedColumns;
      });
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        if (!over) return;
        handleTaskDrop(active.id, over.id);
      }}
    >
      <div className="Board">
        <h1>Task Manager</h1>
        <div className="board-container">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              title={column.title}
              tasks={column.taskIds.map((taskId) => tasks[taskId])}
              onTaskDrop={handleTaskDrop}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default Board;
