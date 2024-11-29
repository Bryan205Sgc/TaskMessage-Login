import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "../styles/Task.css";

const Task = ({ task, employees, onEdit, onDelete, onCancel, onAssign }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: task,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Cargar datos del usuario desde localStorage
  const userRole = localStorage.getItem("userRole") || "";
  const userId = localStorage.getItem("userId") || "";

  // Manejar la apertura/cierre del menú
  const toggleMenu = (event) => {
    event.preventDefault(); // Evitar el menú contextual predeterminado
    setMenuOpen((prev) => !prev); // Alternar estado del menú
  };

  // Manejar la asignación de tareas
  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task._id, selectedEmployee); // Llamar función de asignación
      setSelectedEmployee(""); // Reiniciar la selección
      setMenuOpen(false); // Cerrar el menú
    }
  };

  console.log("Empleados recibidos en Task.jsx:", employees);
  console.log("Rol del usuario:", userRole);
  console.log("ID del usuario:", userId);

  const filteredEmployees =  
    Array.isArray(employees) && userRole === "Empleado"
      ? employees.filter((employee) => employee._id === userId)
      : Array.isArray(employees)
      ? employees
      : [];

  if (filteredEmployees.length === 0) {
    console.log("No hay empleados disponibles para esta tarea.");
  }
  console.log("Empleados filtrados:", filteredEmployees);
  
  console.log("Empleados en el dropdown:", filteredEmployees);
  return (
    <div
      ref={drag}
      className="article-wrapper"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Información de la tarea */}
      <div className="container-project">
        <h4 className="task-title">{task.nombre}</h4>
        <p className="task-description">{task.descripcion}</p>
        {task.assignedTo && (
          <p className="assigned-to">
            Asignado a: {employees.find((e) => e._id === task.assignedTo)?.nombre || "Desconocido"}
          </p>
        )}
      </div>
      <div className="project-info">
        <span className="project-type">{task.progresion}</span>
      </div>

      {/* Menú de opciones */}
      <div className="task-menu">
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menú de opciones"
        >
          ⋮
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            {/* Opciones para administradores */}
            {["Administrador App", "Administrador Org", "Administrador Dept"].includes(
              userRole
            ) && (
              <>
                <button onClick={() => onEdit(task)}>Editar</button>
                <button onClick={() => onDelete(task._id)}>Eliminar</button>
                <button onClick={() => onCancel(task._id)}>Cancelar</button>
              </>
            )}

            {/* Asignación de tareas */}
            <div className="assign-section">
              <label htmlFor={`assign-${task._id}`}>Asignar a:</label>
              <select
                id={`assign-${task._id}`}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                {filteredEmployees.length > 0 ? (
                  <>
                    <option value="">Selecciona un empleado</option>
                    {filteredEmployees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.nombre}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No hay empleados disponibles</option>
                )}
              </select>

              <button
                onClick={handleAssign}
                disabled={!selectedEmployee}
                className="assign-button"
              >
                Asignar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
