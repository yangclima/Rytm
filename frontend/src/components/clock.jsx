import { useEffect, useContext, useState } from "react";
import { AppContext } from "../contexts/appContext/context.js";
import formatTime from "../utils/formatTime.js";

function Clock() {
  const { tasks, setTasks, activeTask, setActiveTask } = useContext(AppContext);
  const task = tasks[activeTask] || { remainingTime: 0, totalTime: 0, title: "", isDone: false };
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

      // Play completion sound
      playCompletionSound();
    }
  }, [task.remainingTime, running, activeTask, setTasks]);

  const playCompletionSound = () => {
    try {
      // Create AudioContext for better sound control
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create a pleasant chime sound using oscillators
      const createChime = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';

        // Create fade in/out envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play a pleasant 3-note ascending chime
      const currentTime = audioContext.currentTime;
      createChime(523.25, currentTime, 0.6);        // C5
      createChime(659.25, currentTime + 0.2, 0.6);  // E5
      createChime(783.99, currentTime + 0.4, 0.8);  // G5

    } catch (error) {
      // Fallback for browsers that don't support AudioContext
      console.log('AudioContext not supported, using system beep');

      // Alternative: simple system beep
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBDqG1f');
      audio.volume = 0.3;
      audio.play().catch(() => console.log('Could not play fallback sound'));

      throw error
    }
  };

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

  const progress = task.totalTime > 0 ? ((task.totalTime - task.remainingTime) / task.totalTime) * 100 : 0;

  return (
    <div className="w-full max-w-sm lg:max-w-md">
      {/* Timer Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        {/* Task Title */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white/90 mb-2 leading-tight px-2">
            {task.title || "Nenhuma tarefa selecionada"}
          </h2>
          <div className="text-sm text-white/60">
            {tasks.length > 0 && `${activeTask + 1} de ${tasks.length} tarefas`}
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative flex items-center justify-center mb-6 sm:mb-8">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 transform -rotate-90" viewBox="0 0 256 256">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="112"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="112"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                {formatTime(task.remainingTime)}
              </div>
              <div className="text-xs sm:text-sm text-white/60">
                {task.totalTime > 0 && `de ${formatTime(task.totalTime)}`}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handle5More}
            disabled={task.remainingTime === 0}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/10"
            title="Adicionar 5 minutos"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          <button
            onClick={handlePlay}
            disabled={task.remainingTime === 0}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl sm:rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            title={running ? "Pausar" : "Iniciar"}
          >
            {running ? (
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/10"
            title="Pular tarefa"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={handleReplay}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/10"
            title="Reiniciar"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Status Indicator */}
        {task.isDone && (
          <div className="mt-4 sm:mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
              <span>✅</span>
              Tarefa concluída!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clock;