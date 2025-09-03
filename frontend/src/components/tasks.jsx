import { useContext, useState } from "react";
import { AppContext } from "../contexts/appContext/context";
import formatTime from "../utils/formatTime";

function Tasks() {
    const { tasks, setActiveTask, activeTask, deleteTask } = useContext(AppContext);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleDeleteConfirm = async () => {
        if (taskToDelete) {
            try {
                await deleteTask(taskToDelete.id);
                setTaskToDelete(null);
            } catch (error) {
                alert("Erro ao deletar tarefa");
                throw error
            }
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white/90 mb-2">Nenhuma tarefa</h3>
                    <p className="text-sm text-white/60">Crie uma nova tarefa para começar a estudar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm lg:max-w-md">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Suas Tarefas</h2>
                <div className="text-sm text-white/60">
                    {tasks.filter(t => t.isDone).length} de {tasks.length} concluídas
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto custom-scrollbar">
                {tasks.map((task, index) => {
                    const progress = task.totalTime > 0 ? ((task.totalTime - task.remainingTime) / task.totalTime) * 100 : 0;
                    const isActive = index === activeTask;

                    return (
                        <div
                            key={task.id}
                            className={`
                relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-xl transition-all duration-300 group
                ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }
                ${task.isDone ? 'opacity-75' : ''}
              `}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"></div>
                            )}

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToDelete(task);
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                title="Deletar tarefa"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <div
                                className="flex items-start gap-3 cursor-pointer"
                                onClick={() => setActiveTask(index)}
                            >
                                {/* Status Icon */}
                                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5
                  ${task.isDone
                                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                        : 'bg-white/10 border border-white/20 text-white/60'
                                    }
                `}>
                                    {task.isDone ? '✓' : index + 1}
                                </div>

                                {/* Task Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`
                      font-medium leading-tight text-sm sm:text-base
                      ${task.isDone
                                                ? 'text-white/60 line-through'
                                                : isActive
                                                    ? 'text-white'
                                                    : 'text-white/90'
                                            }
                    `}>
                                            {task.title}
                                        </h3>

                                        {/* Time Badge */}
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className={`
                        px-2 py-1 rounded-full
                        ${task.isDone
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-white/10 text-white/80'
                                                }
                      `}>
                                                {formatTime(task.remainingTime)}
                                            </span>
                                            <span className="text-white/40">/</span>
                                            <span className="text-white/60">
                                                {formatTime(task.totalTime)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Preview */}
                                    {task.content && (
                                        <p className="text-xs sm:text-sm text-white/60 mb-3 line-clamp-2">
                                            {task.content}
                                        </p>
                                    )}

                                    {/* Progress Bar */}
                                    <div className="relative">
                                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`
                          h-full rounded-full transition-all duration-500 ease-out
                          ${task.isDone
                                                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                        : 'bg-gradient-to-r from-purple-400 to-pink-400'
                                                    }
                        `}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-white/50 mt-1 text-right">
                                            {Math.round(progress)}% concluído
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Task Glow */}
                            {isActive && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-base sm:text-lg font-bold text-purple-400">
                        {tasks.filter(t => t.isDone).length}
                    </div>
                    <div className="text-xs text-white/60">Concluídas</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-base sm:text-lg font-bold text-pink-400">
                        {formatTime(tasks.reduce((acc, task) => acc + (task.totalTime - task.remainingTime), 0))}
                    </div>
                    <div className="text-xs text-white/60">Estudado</div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Deletar Tarefa</h3>
                        <p className="text-white/70 mb-4">
                            Tem certeza que deseja deletar "{taskToDelete.title}"? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-all duration-200"
                            >
                                Deletar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;