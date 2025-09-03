import { createContext, useState } from "react";

const initialTasks = [
    { title: "Task 1", totalTime: 600, remainingTime: 3, isDone: false, id: 1 },
    { title: "Task 2", totalTime: 120, remainingTime: 5, isDone: false, id: 2 },
    { title: "Task 3", totalTime: 150, remainingTime: 8, isDone: false, id: 3}
];

export const AppContext = createContext(null);

function AppContextProvider({ children }) {
    const [tasks, setTasks] = useState(initialTasks);
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
            {children}
        </AppContext>
    );
}

export default AppContextProvider;
