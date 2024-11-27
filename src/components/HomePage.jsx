import React, { useState, useEffect } from 'react';
import Column from './Column';
import CreateTaskModal from './CreateTaskModal';
import CancelledTasksModal from './CancelledTasksModal';
import EditTaskModal from './EditTaskModal';
import BackgroundSelector from './BackgroundSelector';
import {
  fetchTasks,
  createTask,
  updateTaskToToDo,
  updateTaskToInProgress,
  updateTaskToFinished,
  updateTaskToCancelled,
  updateTask,
} from '../utils/api';
import { socket } from '../sockets/socket';
import '../styles/TaskBoard.css';

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isCancelledModalOpen, setCancelledModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [background, setBackground] = useState({
    color: '',
    url: 'https://res.cloudinary.com/dlggyukyk/image/upload/v1732504320/ufo9ylxhpfylpxis4oyu.jpg',
    isLight: false,
  });

  useEffect(() => {
    fetchTasks()
      .then((res) => setTasks(res.data.tasks))
      .catch((err) => console.error('Error al obtener las tareas:', err));

    socket.on('task-updated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

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
    const updateTaskFn = {
      'No iniciado': updateTaskToToDo,
      'En proceso': updateTaskToInProgress,
      'Finalizado': updateTaskToFinished,
      'Cancelado': updateTaskToCancelled,
    }[newStatus];

    if (updateTaskFn) {
      updateTaskFn(taskId)
        .then((res) => {
          const updatedTask = res.data;
          setTasks((prev) =>
            prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
          );
        })
        .catch((err) => console.error('Error al actualizar la tarea:', err));
    }
  };

  const handleEditTask = (taskId, updatedData) => {
    const { nombre, descripcion, fechaFinalizacion, DepartmentId } = updatedData;

    const formattedFechaFinalizacion = new Date(fechaFinalizacion)
      .toISOString()
      .split('T')[0];

    updateTask(taskId, {
      nombre,
      descripcion,
      fechaFinalizacion: formattedFechaFinalizacion,
      DepartmentId,
    })
      .then((res) => {
        const updatedTask = res.data.task;
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
        socket.emit('task-updated', updatedTask);
        setEditModalOpen(false);
      })
      .catch((err) => console.error('Error al editar la tarea:', err));
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  const tasksByStatus = (status) => {
    return tasks.filter((task) => task.progresion === status);
  };

  return (
    <div
      key={background.url || background.gradient || background.color}
      className="task-board-container"
      style={{
        background: background.url
          ? `url(${background.url})`
          : background.gradient
          ? background.gradient
          : background.color || 'transparent',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100vh',
        overflow: 'auto',
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
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onCancel={(taskId) => handleUpdateTask(taskId, 'Cancelado')}
        />
        <Column
          title="En proceso"
          tasks={tasksByStatus('En proceso')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'En proceso')}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onCancel={(taskId) => handleUpdateTask(taskId, 'Cancelado')}
        />
        <Column
          title="Finalizado"
          tasks={tasksByStatus('Finalizado')}
          onDrop={(taskId) => handleUpdateTask(taskId, 'Finalizado')}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onCancel={(taskId) => handleUpdateTask(taskId, 'Cancelado')}
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
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={taskToEdit}
        onSave={handleEditTask}
      />
    </div>
  );
};

export default TaskBoard;

