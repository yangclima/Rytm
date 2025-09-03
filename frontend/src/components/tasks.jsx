import { useContext } from "react";

import { AppContext } from "../contexts/appContext";
import formatTime from "../utils/formatTime";

function Tasks() {
    const { tasks, setActiveTask } = useContext(AppContext)

    return (
        <div className={"flex items-center justify-center h-screen"}>
            <div>{
                tasks.map((task, index) => (
                    <div
                        key={task.id}
                        onClick={() => setActiveTask(index)}
                        title={task.content}
                        className={"bg-amber-500"}
                    >
                        <div>{task.isDone ? "✅" : "❌"}</div>
                        <h3>{task.title}</h3>
                        <h4>{formatTime(task.totalTime) + "/" + formatTime(task.remainingTime)}</h4>
                    </div>
                ))
            }</div>
        </div>
    )
}

export default Tasks;