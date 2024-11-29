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

  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  console.log("ID del usuario logueado:", userId);
  console.log("Rol del usuario:", role);
  console.log("Empleados recibidos:", employees);

  const toggleMenu = (event) => {
    event.preventDefault();
    setMenuOpen(!menuOpen);
  };

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task._id, selectedEmployee);
      setSelectedEmployee("");
      setMenuOpen(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e._id === employeeId);
    return employee ? employee.nombre : "Empleado no encontrado";
  };
  

  const filteredEmployees =
    role === "Empleado"
      ? employees.filter((employee) => {
          console.log("Comparando:", String(employee._id), String(userId));
          return String(employee._id) === String(userId); // Convertir a cadenas
        })
      : employees;


  console.log("Empleados filtrados:", filteredEmployees);

  return (
    <div
      ref={drag}
      className="article-wrapper"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="container-project">
        <h4 className="task-title">{task.nombre}</h4>
        <p className="task-description">{task.descripcion}</p>
        {task.Asignado && (
          <p className="task-assigned">Asignado a: {getEmployeeName(task.Asignado)}</p>
        )}
      </div>
      <div className="project-info">
        <span className="project-type">{task.progresion}</span>
      </div>
      <div className="task-menu">
        <button className="menu-toggle" onClick={toggleMenu}>
          ⋮
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            {role !== "Empleado" && (
              <>
                <button onClick={() => onEdit(task)}>Editar</button>
                <button onClick={() => onDelete(task._id)}>Eliminar</button>
                <button onClick={() => onCancel(task._id)}>Cancelar</button>
              </>
            )}
            <div className="assign-section">
              <label htmlFor={`assign-${task._id}`}>Asignar a:</label>
              <select
                id={`assign-${task._id}`}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                {filteredEmployees.length === 0 ? (
                  <option value="">No hay empleados disponibles</option>
                ) : (
                  <>
                    <option value="">Selecciona un empleado</option>
                    {filteredEmployees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.nombre}
                      </option>
                    ))}
                  </>
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
