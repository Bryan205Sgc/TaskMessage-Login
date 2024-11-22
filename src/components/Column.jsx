import React from "react";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";

const Column = ({ columnId, title, tasks, onTaskDrop }) => {
  // Configura la columna como área droppable
  const { setNodeRef } = useDroppable({
    id: columnId, // Identificador único para la columna
  });

  const handleDrop = (event) => {
    const taskId = event.dataTransfer.getData("taskId"); // Obtén el ID de la tarea
    onTaskDrop(taskId, columnId); // Llama al manejador en App.js
  };

  return (
    <div
      ref={setNodeRef}
      className="column"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Permite el evento drop
      style={{
        backgroundColor: "#f4f5f7",
        borderRadius: "8px",
        padding: "16px",
        margin: "10px",
        minWidth: "300px",
        maxWidth: "300px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
