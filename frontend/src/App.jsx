import Clock from "./components/clock";
import Tasks from "./components/tasks";
import CreateTaskModal from "./components/createTaskModal";
import { AppContextProvider } from "./contexts/appContext.jsx";
import { useState } from "react";

function AppContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="p-6 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rytm
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            + Nova Tarefa
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-0">
          {/* Timer Section */}
          <div className="flex-1 flex items-center justify-center">
            <Clock />
          </div>

          {/* Tasks Section */}
          <div className="flex-1 flex items-start justify-center">
            <Tasks />
          </div>
        </div>
      </main>

      {/* Modal */}
      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;