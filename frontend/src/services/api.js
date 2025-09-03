import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3030"
})

export const deleteTask = async (taskId) => {
    return await api.delete("/tasks", { data: { taskId } });
};

export default api;