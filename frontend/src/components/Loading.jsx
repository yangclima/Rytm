function Loading({ message = "Carregando..." }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
                {/* Loading spinner */}
                <div className="relative mb-8">
                    <div className="w-16 h-16 mx-auto">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
                    </div>
                </div>

                {/* App logo/title */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">R</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Rytm
                    </h1>
                </div>

                {/* Loading message */}
                <p className="text-white/60 text-sm">{message}</p>

                {/* Animated dots */}
                <div className="flex items-center justify-center gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: '1s'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Loading;