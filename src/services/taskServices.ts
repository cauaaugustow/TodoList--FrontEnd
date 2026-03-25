
import axios from "axios";
import type { Task } from "../types/task/task";
import type { TaskCreateRequest } from "../types/task/taskcreaterequest";

const API_URL = import.meta.env.VITE_API_URL;

export const getTarefas = async (idUsuario: number): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${API_URL}/tasks?userId=${idUsuario}`);
    return response.data;
}

export const createTask = async (task: Omit<TaskCreateRequest, "id">, idUsuario: number): Promise<Task> => {
    const response = await axios.post(`${API_URL}/tasks/${idUsuario}`, task);
    return response.data as Task;
}

export const deleteTask = async (idTask: number): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${idTask}`);
}

export const updateTask = async (task: Omit<TaskCreateRequest, "id">, idTask: number): Promise<Task> => {
    console.log("Atualizando tarefa com dados:", task);
    console.log("ID da tarefa a ser atualizada:", idTask);
    const response = await axios.put(`${API_URL}/tasks/${idTask}`, task);
    return response.data as Task;
}
