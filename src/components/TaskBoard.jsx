import React, { useEffect, useState } from 'react';
import Column from './Column';
import { COLUMN_TYPES } from '../utils/constants';
import { fetchTasks, updateTaskToInProgress, updateTaskToToDo, updateTaskToFinished } from '../utils/api';
import { socket } from '../sockets/socket';
import '../styles/TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showCancelledTasks, setShowCancelledTasks] = useState(false);

  // Obtener tareas del backend al cargar el componente
  useEffect(() => {
    fetchTasks()
      .then((res) => {
        console.log('Tareas obtenidas del backend:', res.data.tasks);
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        console.error('Error al obtener las tareas:', err);
      });

    // Configurar sockets
    socket.on('task-updated', (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('task-deleted', (deletedTask) => {
      setTasks((prev) => prev.filter((task) => task._id !== deletedTask._id));
    });

    return () => {
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, []);

  // Manejar el cambio de columna
  const handleDrop = (task, newStatus) => {
    console.log(`Moviendo tarea: ${task._id} a estado: ${newStatus}`);

    let updateTaskStatus;

    if (newStatus === COLUMN_TYPES.IN_PROGRESS) {
      updateTaskStatus = updateTaskToInProgress;
    } else if (newStatus === COLUMN_TYPES.TODO) {
      updateTaskStatus = updateTaskToToDo;
    } else if (newStatus === COLUMN_TYPES.DONE) {
      updateTaskStatus = updateTaskToFinished;
    } else {
      console.error('Estado desconocido o no manejado:', newStatus);
      return;
    }

    updateTaskStatus(task._id)
      .then((res) => {
        console.log('Tarea actualizada en el backend:', res.data);
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.data : t))
        );
      })
      .catch((err) => {
        console.error('Error al actualizar el estado de la tarea:', err);
      });
  };

  // Filtrar tareas canceladas
  const cancelledTasks = tasks.filter((task) => task.progresion === COLUMN_TYPES.CANCELLED);

  // Función para abrir/cerrar el modal de tareas canceladas
  const toggleCancelledTasksModal = () => {
    setShowCancelledTasks(!showCancelledTasks);
  };

  return (
    <div className="task-board-container">
      <button onClick={toggleCancelledTasksModal} className="cancelled-tasks-btn">
        Ver tareas canceladas
      </button>

      <div className="task-board">
        {Object.values(COLUMN_TYPES)
          .filter((status) => status !== COLUMN_TYPES.CANCELLED) // Excluye la columna "Cancelada"
          .map((status) => (
            <Column
              key={status}
              title={status}
              tasks={tasks.filter((task) => task.progresion === status)}
              onDrop={handleDrop}
            />
          ))}
      </div>

      {showCancelledTasks && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tareas Canceladas</h3>
            {cancelledTasks.length > 0 ? (
              cancelledTasks.map((task) => (
                <div key={task._id} className="task cancelled-task">
                  <h4>{task.nombre}</h4>
                  <p>{task.descripcion}</p>
                </div>
              ))
            ) : (
              <p>No hay tareas canceladas.</p>
            )}
            <button onClick={toggleCancelledTasksModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
