import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-neon-pink selection:text-white overflow-x-hidden relative">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-slow" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <nav className="border-b border-white/5 bg-cyber-dark/30 backdrop-blur-xl sticky top-0 z-40 supports-[backdrop-filter]:bg-cyber-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <div className="mr-3 p-2 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-lg group-hover:shadow-[0_0_20px_rgba(192,132,252,0.5)] transition-all duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                 </svg>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tighter group-hover:text-neon-blue transition-colors duration-300">
                SOUNDWAVE
              </span>
            </div>
            <div className="flex items-center gap-4">
               <button
                 onClick={() => navigate('/artistas')}
                 className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors"
               >
                 Artistas
               </button>
               <button
                onClick={logout}
                className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all hover:border-neon-pink/50 hover:text-neon-pink hover:shadow-[0_0_15px_rgba(244,114,182,0.3)] backdrop-blur-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
