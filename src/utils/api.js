import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/v1/task';
const EMPLOYEE_URL = 'http://localhost:4000/api/v1/employee';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchTasks = () => axios.get(BASE_URL);

export const updateTaskToInProgress = (id) =>
  axios.put(`${BASE_URL}/updateStatusInProgress`, { id });

export const updateTaskToToDo = (id) =>
  axios.put(`${BASE_URL}/updateStatusToDo`, { id });

export const updateTaskToCancelled = (id) =>
  axios.put(`${BASE_URL}/updateStatusCancelled`, { id });

export const updateTaskToFinished = (id) =>
  axios.put(`${BASE_URL}/updateStatusFinished`, { id });

export const deleteTask = (id) =>
  axios.delete(`${BASE_URL}/delete/${id}`);

export const updateTask = (id, data) =>
  axios.put(`${BASE_URL}/update/${id}`, data);

export const createTask = (taskData) =>
  axios.post(`${BASE_URL}/add`, taskData);

export const assignTask = (taskId, employeeId) =>
  axios.post(`${BASE_URL}/assign-task`, { taskId, employeeId });

export const fetchEmployees = () =>
  axios.get(`${EMPLOYEE_URL}/all`);

export const registerEmployee = (employeeData) =>
  axios.post(`${EMPLOYEE_URL}/register`, employeeData);

