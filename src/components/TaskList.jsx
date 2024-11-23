import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4000'); // Configuración del WebSocket

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskForm, setTaskForm] = useState({
    nombre: '',
    descripcion: '',
    progresion: '',
    fechaFinalizacion: '',
    DepartmentId: '',
  });

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Conexión a WebSocket y carga inicial
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/task/');
        if (!response.ok) throw new Error('Error al obtener las tareas');
        const data = await response.json();
        setTasks(data.tasks);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTasks();

    socket.on('task-created', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on('task-updated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on('task-deleted', (deletedTask) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deletedTask._id));
    });

    return () => {
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, []);

  // Crear tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/v1/task/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      });

      if (!response.ok) throw new Error('Error al crear la tarea');
      const newTask = await response.json();
      socket.emit('task-created', newTask);
      setTaskForm({
        nombre: '',
        descripcion: '',
        progresion: '',
        fechaFinalizacion: '',
        DepartmentId: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, progresion: 'En progreso' };

    try {
      const response = await fetch(`http://localhost:4000/api/v1/task/update/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Error al actualizar la tarea');
      const task = await response.json();
      socket.emit('task-updated', task);
    } catch (error) {
      setError(error.message);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/task/delete/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');
      const deletedTask = await response.json();
      socket.emit('task-deleted', deletedTask);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Lista de Tareas</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Nombre"
          value={taskForm.nombre}
          onChange={(e) => setTaskForm({ ...taskForm, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={taskForm.descripcion}
          onChange={(e) => setTaskForm({ ...taskForm, descripcion: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Progresión"
          value={taskForm.progresion}
          onChange={(e) => setTaskForm({ ...taskForm, progresion: e.target.value })}
          required
        />
        <input
          type="date"
          value={taskForm.fechaFinalizacion}
          onChange={(e) => setTaskForm({ ...taskForm, fechaFinalizacion: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department ID"
          value={taskForm.DepartmentId}
          onChange={(e) => setTaskForm({ ...taskForm, DepartmentId: e.target.value })}
          required
        />
        <button type="submit">Crear tarea</button>
      </form>

      {tasks.length === 0 ? (
        <p>No hay tareas disponibles</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <div>
                <h3>{task.nombre}</h3>
                <p>{task.descripcion}</p>
                <small>Progresión: {task.progresion}</small>
                <button onClick={() => handleUpdateTask(task._id)}>Actualizar</button>
                <button onClick={() => handleDeleteTask(task._id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
