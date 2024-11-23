import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import io from "socket.io-client";
import Column from "./components/Column";
import "./App.css";

const socket = io("http://localhost:4000"); // Conexión al WebSocket

const App = () => {
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState({
    todo: { title: "No Iniciada", taskIds: [] },
    inProgress: { title: "En progreso", taskIds: [] },
    done: { title: "Finalizada", taskIds: [] },
  });

  // Cargar tareas desde el servidor y configurar WebSocket
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
              break;
          }
        });

        console.log("Task map:", taskMap);
        console.log("Column map:", columnMap);

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

    // Configuración de WebSocket
    socket.on("task-created", (newTask) => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [newTask._id]: {
          id: newTask._id,
          title: newTask.nombre,
          description: newTask.descripcion,
          progresion: newTask.progresion,
        },
      }));

      setColumns((prevColumns) => {
        const column = newTask.progresion === "No Iniciada" ? "todo" : newTask.progresion === "En progreso" ? "inProgress" : "done";
        return {
          ...prevColumns,
          [column]: {
            ...prevColumns[column],
            taskIds: [...prevColumns[column].taskIds, newTask._id],
          },
        };
      });
    });

    socket.on("task-updated", (updatedTask) => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [updatedTask._id]: {
          ...prevTasks[updatedTask._id],
          progresion: updatedTask.progresion,
        },
      }));

      setColumns((prevColumns) => {
        const sourceColumn = Object.keys(prevColumns).find((key) =>
          prevColumns[key].taskIds.includes(updatedTask._id)
        );
        const destinationColumn =
          updatedTask.progresion === "No Iniciada"
            ? "todo"
            : updatedTask.progresion === "En progreso"
            ? "inProgress"
            : "done";

        if (sourceColumn !== destinationColumn) {
          const sourceTaskIds = prevColumns[sourceColumn].taskIds.filter(
            (id) => id !== updatedTask._id
          );
          const destinationTaskIds = [
            ...prevColumns[destinationColumn].taskIds,
            updatedTask._id,
          ];

          return {
            ...prevColumns,
            [sourceColumn]: { ...prevColumns[sourceColumn], taskIds: sourceTaskIds },
            [destinationColumn]: {
              ...prevColumns[destinationColumn],
              taskIds: destinationTaskIds,
            },
          };
        }

        return prevColumns;
      });
    });

    socket.on("task-deleted", (deletedTask) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        delete updatedTasks[deletedTask._id];
        return updatedTasks;
      });

      setColumns((prevColumns) => {
        const updatedColumns = { ...prevColumns };
        Object.keys(updatedColumns).forEach((key) => {
          updatedColumns[key].taskIds = updatedColumns[key].taskIds.filter(
            (id) => id !== deletedTask._id
          );
        });
        return updatedColumns;
      });
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceColumn = Object.keys(columns).find((key) =>
      columns[key].taskIds.includes(active.id)
    );
    const destinationColumn = over.id;

    if (sourceColumn !== destinationColumn) {
      const newProgression =
        destinationColumn === "todo"
          ? "No Iniciada"
          : destinationColumn === "inProgress"
          ? "En progreso"
          : "Finalizada";

      await fetch(`http://localhost:4000/api/v1/task/${active.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progresion: newProgression }),
      });

      setColumns((prevColumns) => {
        const sourceTaskIds = [...prevColumns[sourceColumn].taskIds];
        const destinationTaskIds = [...prevColumns[destinationColumn].taskIds];

        sourceTaskIds.splice(sourceTaskIds.indexOf(active.id), 1);
        destinationTaskIds.push(active.id);

        return {
          ...prevColumns,
          [sourceColumn]: { ...prevColumns[sourceColumn], taskIds: sourceTaskIds },
          [destinationColumn]: {
            ...prevColumns[destinationColumn],
            taskIds: destinationTaskIds,
          },
        };
      });

      setTasks((prevTasks) => ({
        ...prevTasks,
        [active.id]: { ...prevTasks[active.id], progresion: newProgression },
      }));
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="App">
        <h1>Task Manager</h1>
        <div className="board" style={{ display: "flex", gap: "20px", padding: "20px" }}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              title={column.title}
              tasks={column.taskIds.map((taskId) => tasks[taskId])}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default App;
