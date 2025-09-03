import { createContext, useState, useEffect } from "react";
import api from "../services/api.js";
import SyncTasks from "../components/syncTasks.jsx";

export const AppContext = createContext(null);

function AppContextProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    
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

    return (
        <AppContext value={{ tasks, setTasks, activeTask, setActiveTask }}>
            <SyncTasks></SyncTasks>
            {children}
        </AppContext>
    );
}

export default AppContextProvider;
