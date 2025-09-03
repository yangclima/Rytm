import { useEffect, useContext, useState } from "react";
import { AppContext } from "../contexts/appContext";
import formatTime from "../utils/formatTime.js";

function Clock() {
  const { tasks, setTasks, activeTask, setActiveTask } = useContext(AppContext);
  const task = tasks[activeTask];

  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running && task.remainingTime > 0) {
      interval = setInterval(() => {
        setTasks(prev => {
          const updated = [...prev];
          updated[activeTask] = {
            ...updated[activeTask],
            remainingTime: updated[activeTask].remainingTime - 1
          };
          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, activeTask, setTasks, task.remainingTime]);

  // Quando zerar o tempo, marca como concluída
  useEffect(() => {
    if (task.remainingTime === 0 && running) {
      setRunning(false);
      setTasks(prev => {
        const updated = [...prev];
        updated[activeTask] = {
          ...updated[activeTask],
          isDone: true
        };
        return updated;
      });
    }
  }, [task.remainingTime, running, activeTask, setTasks]);

  const handlePlay = () => {
    if (task.remainingTime > 0) {
      setRunning(r => !r);
    }
  };

  const handleSkip = () => {
    setTasks(prev => {
      const updated = [...prev];
      updated[activeTask] = { ...updated[activeTask], isDone: true, remainingTime: 0 };
      return updated;
    });

    const next = activeTask + 1;
    setActiveTask(next);
    setRunning(false);
  };

  const handle5More = () => {
    setTasks(prev => {
      const updated = [...prev];
      const current = updated[activeTask];
      const extra = current.remainingTime + 5 * 60;

      updated[activeTask] = {
        ...current,
        remainingTime: Math.min(extra, current.totalTime),
        isDone: false
      };

      return updated;
    });
  };

  const handleReplay = () => {
    setTasks(prev => {
      const updated = [...prev];
      updated[activeTask] = {
        ...updated[activeTask],
        remainingTime: updated[activeTask].totalTime,
        isDone: false
      };
      return updated;
    });
    setRunning(true);
  };

  return (
    <>
      <div>{task.title}</div>
      <div>{formatTime(task.remainingTime)}</div>
      <div>
        <button onClick={handle5More}>+5</button>
        <button onClick={handlePlay}>{running ? "⏸️" : "▶️"}</button>
        <button onClick={handleSkip}>⏭️</button>
        <button onClick={handleReplay}>🔁</button>
      </div>
    </>
  );
}

export default Clock;
