import React, { useState, useEffect } from 'react';
import Column from './Column';
import CreateTaskModal from './CreateTaskModal';
import CancelledTasksModal from './CancelledTasksModal';
import BackgroundSelector from './BackgroundSelector';
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
  const [background, setBackground] = useState({
    color: '',
    url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/ufo9ylxhpfylpxis4oyu.jpg',
    isLight: false,
  });

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
      case 'No iniciado':
        updateTaskFn = updateTaskToToDo;
        break;
      case 'En proceso':
        updateTaskFn = updateTaskToInProgress;
        break;
      case 'Finalizado':
        updateTaskFn = updateTaskToFinished;
        break;
      case 'Cancelado':
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
    <div
      key={background.url || background.gradient || background.color} // Clave única para forzar redibujo
      className="task-board-container"
      style={{
        background: background.url
          ? `url(${background.url})`
          : background.gradient
          ? background.gradient
          : background.color || 'transparent',
        backgroundSize: 'cover', // Asegurar que el fondo cubre el contenedor
        backgroundRepeat: 'no-repeat', // Evitar repeticiones
        backgroundPosition: 'center', // Centrar la imagen
        height: '100vh', // Asegurar altura completa de la pantalla
        overflow: 'hidden', // Evitar desbordamientos
      }}
    >
      <BackgroundSelector
        onBackgroundChange={setBackground}
        selectedBackground={background}
      />

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
          title="No iniciado"
          tasks={tasksByStatus('No iniciado')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'No iniciado')}
        />
        <Column
          title="En proceso"
          tasks={tasksByStatus('En proceso')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'En proceso')}
        />
        <Column
          title="Finalizado"
          tasks={tasksByStatus('Finalizado')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'Finalizado')}
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
        tasks={tasksByStatus('Cancelado')}
        onRestore={(taskId) => handleUpdateTask(taskId, 'No iniciado')}
      />
    </div>
  );
};

export default TaskBoard;
