import { useState, useEffect } from "react";
import api, { deleteTask as apiDeleteTask } from "../../services/api.js";
import SyncTasks from "../../components/syncTasks.jsx";

import { AppContext } from "./context.js";

export default function AppContextProvider({ children }) {
    const [tasks, _setTasks] = useState([]);

    const setTasks = (updater) => {
        _setTasks((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;

            return [...next].sort((a, b) => a.id - b.id);
        });
    };
    useEffect(() => {
        api.get("/tasks")
            .then(res => {
                setTasks(res.data.sort((a, b) => a.id - b.id))
            })
            .catch(err => {
                console.error("Erro ao carregar tasks:", err);
            })
    }, [])

    const [activeTask, _setActiveTask] = useState(0);

    const setActiveTask = (newActiveTask) => {
        const numberOfTasks = tasks.length
        if (newActiveTask < numberOfTasks) {
            _setActiveTask(newActiveTask);
        } else {
            _setActiveTask(0);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await apiDeleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));

            // Adjust active task if necessary
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex <= activeTask && activeTask > 0) {
                _setActiveTask(activeTask - 1);
            } else if (tasks.length <= 1) {
                _setActiveTask(0);
            }
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            throw error;
        }
    };

    return (
        <AppContext value={{ tasks, setTasks, activeTask, setActiveTask, deleteTask }} className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <SyncTasks />
            {children}
        </AppContext>
    );
}