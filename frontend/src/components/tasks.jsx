import { useContext } from "react";

import { AppContext } from "../contexts/appContext";
import formatTime from "../utils/formatTime";

function Tasks(){
    const { tasks, setTasks, activeTask, setActiveTask } = useContext(AppContext)

    return <div>{
        tasks.map((task, index) => (
            <div key={task.id} onClick={() => setActiveTask(index)} title={task.content}>
                <div>{task.isDone ? "✅" : "❌"}</div>
                <h3>{task.title}</h3>
                <h4>{formatTime(task.totalTime) + "/" + formatTime(task.remainingTime)}</h4>
            </div>
        ))
    }</div>
}

export default Tasks;