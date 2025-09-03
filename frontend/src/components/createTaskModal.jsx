import { useState, useContext } from "react";
import { AppContext } from "../contexts/appContext";
import api from "../services/api.js"

function CreateTaskModal({ onClose }) {
    const { setTasks } = useContext(AppContext);
    const [_, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        hours: 0,
        minutes: 25
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const totalTime = ((formData.hours * 60) + formData.minutes) * 60;
        if (totalTime <= 0) return;

        const payload = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            totalTime: totalTime,
            remainingTime: totalTime,
            isDone: false
        };

        setIsSubmitting(true);
        try {
            let createdTask = await api.post('tasks', payload)
            createdTask = createdTask.data
            console.log(createdTask)
            setTasks(prev => [...prev, createdTask]);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Erro ao criar tarefa. Verifique o backend / CORS / URL.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const presetTimes = [
        { label: '25 min', hours: 0, minutes: 25 },
        { label: '45 min', hours: 0, minutes: 45 },
        { label: '1h', hours: 1, minutes: 0 },
        { label: '1h 30min', hours: 1, minutes: 30 },
        { label: '2h', hours: 2, minutes: 0 }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md shadow-2xl my-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Nova Tarefa
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Título da Tarefa *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Ex: Estudar React Hooks"
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 text-sm sm:text-base"
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Descrição (opcional)
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="Descreva o que você vai estudar..."
                            rows={3}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 resize-none text-sm sm:text-base"
                            maxLength={500}
                        />
                    </div>

                    {/* Time Presets */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">
                            Tempo de Estudo
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {presetTimes.map((preset) => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => {
                                        handleInputChange('hours', preset.hours);
                                        handleInputChange('minutes', preset.minutes);
                                    }}
                                    className={`
                    px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                    ${formData.hours === preset.hours && formData.minutes === preset.minutes
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                                        }
                  `}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Time Inputs */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">
                                Horas
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={formData.hours}
                                onChange={(e) => handleInputChange('hours', parseInt(e.target.value) || 0)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-2">
                                Minutos
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={formData.minutes}
                                onChange={(e) => handleInputChange('minutes', parseInt(e.target.value) || 0)}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200 text-sm sm:text-base"
                            />
                        </div>
                    </div>

                    {/* Total Time Display */}
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <span className="text-sm text-white/60">Tempo total: </span>
                        <span className="font-medium text-purple-400">
                            {formData.hours > 0 && `${formData.hours}h `}
                            {formData.minutes > 0 && `${formData.minutes}min`}
                            {formData.hours === 0 && formData.minutes === 0 && '0min'}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.title.trim() || (formData.hours === 0 && formData.minutes === 0)}
                            className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                        >
                            Criar Tarefa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTaskModal;