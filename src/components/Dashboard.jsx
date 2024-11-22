import React, { useState } from "react";
import "./App.css"; // Estilos globales

const Column = ({ id, column, onDragStart, onDrop }) => {
  return (
    <div
      className="column"
      id={id}
      onDragOver={(e) => e.preventDefault()} // Permitir soltar
      onDrop={(e) => onDrop(e, id)} // Lógica para soltar tareas
    >
      <h2>{column.name}</h2>
      <div className="task-list">
        {column.tasks.map((task) => (
          <div
            className="task"
            key={task._id}
            draggable
            onDragStart={(e) => onDragStart(e, task._id)} // Inicio del arrastre
          >
            <strong>{task.nombre}</strong>
            <p>{task.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [columns, setColumns] = useState({
    todo: {
      name: "No Iniciada",
      tasks: [
        { _id: "1", nombre: "Tarea 1", descripcion: "Descripción de tarea 1" },
        { _id: "2", nombre: "Tarea 2", descripcion: "Descripción de tarea 2" },
      ],
    },
    inProgress: {
      name: "En Progreso",
      tasks: [
        { _id: "3", nombre: "Tarea 3", descripcion: "Descripción de tarea 3" },
      ],
    },
    done: {
      name: "Finalizada",
      tasks: [],
    },
  });

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId); // Transferir el ID de la tarea
  };

  const onDrop = (e, columnId) => {
    const taskId = e.dataTransfer.getData("taskId");

    // Identificar la columna de origen
    const sourceColumnId = Object.keys(columns).find((key) =>
      columns[key].tasks.some((task) => task._id === taskId)
    );

    // Obtener la tarea a mover
    const taskToMove = columns[sourceColumnId].tasks.find(
      (task) => task._id === taskId
    );

    // Filtrar la tarea de la columna de origen
    const newSourceTasks = columns[sourceColumnId].tasks.filter(
      (task) => task._id !== taskId
    );

    // Agregar la tarea a la columna de destino
    const newDestTasks = [...columns[columnId].tasks, taskToMove];

    // Actualizar el estado de las columnas
    setColumns({
      ...columns,
      [sourceColumnId]: { ...columns[sourceColumnId], tasks: newSourceTasks },
      [columnId]: { ...columns[columnId], tasks: newDestTasks },
    });
  };

  return (
    <div>
      {Object.entries(columns).map(([id, column]) => (
        <Column
          key={id}
          id={id}
          column={column}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
    </div>


  );
};

export default Dashboard;
