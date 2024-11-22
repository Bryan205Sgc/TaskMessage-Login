import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./components/Column";
import "./App.css";

const App = () => {
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
  }, []);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    console.log(`Tarea arrastrada con id: ${active.id}, Columna destino: ${over.id}`);

    const sourceColumn = Object.keys(columns).find((key) =>
      columns[key].taskIds.includes(active.id)
    );
    const destinationColumn = over.id;

    if (sourceColumn !== destinationColumn) {
      let newProgression = "";
      switch (destinationColumn) {
        case "todo":
          newProgression = "No Iniciada";
          break;
        case "inProgress":
          newProgression = "En progreso";
          break;
        case "done":
          newProgression = "Finalizada";
          break;
        default:
          break;
      }

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
        [active.id]: {
          ...prevTasks[active.id],
          progresion: newProgression,
        },
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
