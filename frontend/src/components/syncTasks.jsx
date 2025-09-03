import { useEffect, useContext, useRef } from "react";
import { AppContext } from "../contexts/appContext";
import api from "../services/api";

function SyncTasks() {
  const { tasks } = useContext(AppContext);
  const tasksRef = useRef(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tasksRef.current.length === 0) return;

      api.put("/tasks", { tasksToUpdate: tasksRef.current })
        .then(() => console.log("✅ Tasks sincronizadas"))
        .catch(err => console.error("Erro ao sincronizar tasks:", err));
    }, 10000);

    return () => clearInterval(interval);
  }, []); // intervalo criado só uma vez

  return null;
}

export default SyncTasks;
