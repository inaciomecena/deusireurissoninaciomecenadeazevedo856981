import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface Artista {
  id: number;
  nome: string;
  tipo: string;
  numeroAlbuns: number;
}

export default function ArtistasListPage() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [page, setPage] = useState(0);
  const [busca, setBusca] = useState('');
  const [sort, setSort] = useState('nome,asc');
  const [loading, setLoading] = useState(false);

  const fetchArtistas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/artistas', {
        params: {
          nome: busca,
          page,
          size: 9, 
          sort
        }
      });
      setArtistas(response.data.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistas();
  }, [page, sort]); 

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
            Line-up
          </h1>
          <p className="text-gray-400">Gerencie seus artistas e bandas favoritos</p>
        </div>
        <Link 
          to="/artistas/novo" 
          className="group relative px-6 py-3 bg-neon-green/10 border border-neon-green/50 text-neon-green rounded-lg font-bold uppercase tracking-wider overflow-hidden transition-all hover:bg-neon-green hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Novo Artista
          </span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-cyber-dark/50 backdrop-blur-md p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome..." 
            className="w-full bg-cyber-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={fetchArtistas} className="px-6 py-2.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-black transition-all font-medium">
            Filtrar
          </button>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            className="px-4 py-2.5 bg-cyber-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-neon-purple transition-all"
          >
            <option value="nome,asc">A-Z</option>
            <option value="nome,desc">Z-A</option>
          </select>
        </div>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artistas.map(artista => (
            <Link to={`/artistas/${artista.id}`} key={artista.id} className="group relative block">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-cyber-dark border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:translate-y-[-5px] transition-all duration-300 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl mb-4 flex items-center justify-center shadow-inner border border-white/5">
                    <span className="text-xl font-bold text-white">{artista.nome.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors truncate">{artista.nome}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                      {artista.tipo || 'ARTISTA'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                      {artista.numeroAlbuns} Álbuns
                    </span>
                    <span className="text-neon-purple group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-12">
        <button 
          disabled={page === 0} 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          className="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          Anterior
        </button>
        <span className="font-mono text-neon-blue px-4">
          PÁGINA {page + 1}
        </span>
        <button 
          onClick={() => setPage(p => p + 1)}
          className="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
