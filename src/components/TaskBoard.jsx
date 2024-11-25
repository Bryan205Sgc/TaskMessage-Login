import React, { useState, useEffect } from 'react';
import Column from './Column';
import CreateTaskModal from './CreateTaskModal';
import CancelledTasksModal from './CancelledTasksModal';
import {
  fetchTasks,
  createTask,
  updateTaskToToDo,
  updateTaskToInProgress,
  updateTaskToFinished,
  updateTaskToCancelled,
} from '../utils/api';
import { socket } from '../sockets/socket';
import '../styles/TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCancelledModalOpen, setCancelledModalOpen] = useState(false);

  useEffect(() => {
    // Fetch initial tasks
    fetchTasks()
      .then((res) => setTasks(res.data.tasks))
      .catch((err) => console.error('Error al obtener las tareas:', err));

    // WebSocket: Escucha los cambios en las tareas
    socket.on('task-updated', (updatedTask) => {
      setTasks((prevTasks) => {
        const taskExists = prevTasks.find((task) => task._id === updatedTask._id);
        if (taskExists) {
          // Actualiza la tarea existente
          return prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          );
        } else {
          // Añade la nueva tarea si no existe
          return [...prevTasks, updatedTask];
        }
      });
    });

    // Limpia el evento al desmontar el componente
    return () => {
      socket.off('task-updated');
    };
  }, []);

  const handleCreateTask = (newTask) => {
    createTask(newTask)
      .then((res) => setTasks((prev) => [...prev, res.data.task]))
      .catch((err) => console.error('Error al crear la tarea:', err));
  };

  const handleUpdateTask = (taskId, newStatus) => {
    let updateTaskFn;

    switch (newStatus) {
      case 'No iniciada':
        updateTaskFn = updateTaskToToDo;
        break;
      case 'En proceso':
        updateTaskFn = updateTaskToInProgress;
        break;
      case 'Finalizada':
        updateTaskFn = updateTaskToFinished;
        break;
      case 'Cancelada':
        updateTaskFn = updateTaskToCancelled;
        break;
      default:
        console.error('Estado desconocido:', newStatus);
        return;
    }

    updateTaskFn(taskId)
      .then((res) => {
        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? res.data : task))
        );
      })
      .catch((err) => console.error('Error al actualizar la tarea:', err));
  };

  const tasksByStatus = (status) => {
    return tasks.filter((task) => task.progresion === status);
  };

  return (
    <div className="task-board-container">
      <button
        className="create-task-btn"
        onClick={() => setCreateModalOpen(true)}
      >
        Crear Tarea
      </button>
      <button
        className="cancelled-tasks-btn"
        onClick={() => setCancelledModalOpen(true)}
      >
        Ver tareas canceladas
      </button>
      <div className="task-board">
        <Column
          title="No iniciada"
          tasks={tasksByStatus('No iniciada')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'No iniciada')}
        />
        <Column
          title="En proceso"
          tasks={tasksByStatus('En proceso')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'En proceso')}
        />
        <Column
          title="Finalizada"
          tasks={tasksByStatus('Finalizada')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'Finalizada')}
        />
      </div>
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />
      <CancelledTasksModal
        isOpen={isCancelledModalOpen}
        onClose={() => setCancelledModalOpen(false)}
        tasks={tasksByStatus('Cancelada')}
        onRestore={(taskId) => handleUpdateTask(taskId, 'No Iniciada')}
      />
    </div>
  );
};

export default TaskBoard;
