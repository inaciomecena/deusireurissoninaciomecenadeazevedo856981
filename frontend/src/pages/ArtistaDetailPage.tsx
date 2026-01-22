import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface AlbumCapa {
  id: number;
  url: string;
}

interface Album {
  id: number;
  titulo: string;
  anoLancamento: number;
  capas: AlbumCapa[];
}

interface ArtistaDetalhe {
  id: number;
  nome: string;
  tipo: string;
  albuns: Album[];
}

export default function ArtistaDetailPage() {
  const { id } = useParams();
  const [artista, setArtista] = useState<ArtistaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get(`/artistas/${id}`);
        setArtista(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!artista) return (
    <div className="text-center py-20">
      <h2 className="text-2xl text-gray-400">Artista não encontrado na frequência.</h2>
      <Link to="/artistas" className="text-neon-blue hover:underline mt-4 inline-block">Voltar para o line-up</Link>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 blur-3xl -z-10 rounded-full opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <Link to="/artistas" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-4">
              &larr; Voltar
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter">
              {artista.nome.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm font-mono tracking-widest text-neon-blue uppercase">
                {artista.tipo}
              </span>
              <span className="text-gray-500 text-sm">
                ID: #{artista.id.toString().padStart(4, '0')}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/artistas/${id}/editar`} 
            className="px-6 py-3 bg-neon-purple/10 border border-neon-purple/50 text-neon-purple rounded-lg font-bold uppercase tracking-wider hover:bg-neon-purple hover:text-white transition-all hover:shadow-[0_0_20px_rgba(192,132,252,0.4)]"
          >
            Editar Artista
          </Link>
        </div>
      </div>

      {/* Discography */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-8 bg-neon-blue rounded-full"></span>
          Discografia
          <span className="text-gray-600 text-sm font-normal ml-2">({artista.albuns.length} lançamentos)</span>
        </h2>
        
        {artista.albuns.length === 0 ? (
          <div className="py-16 border border-white/5 rounded-2xl bg-white/5 text-center">
            <p className="text-gray-500 text-lg">Nenhum álbum registrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artista.albuns.map(album => (
              <div key={album.id} className="group cursor-default">
                {/* Vinyl Record Card */}
                <div className="relative aspect-square rounded-full bg-cyber-black border-4 border-gray-800 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out">
                  {/* Vinyl Texture/Grooves */}
                  <div className="absolute inset-0 rounded-full border-[20px] border-black/80 opacity-50 pointer-events-none z-10"></div>
                  <div className="absolute inset-0 rounded-full border-[40px] border-black/40 opacity-30 pointer-events-none z-10"></div>
                  
                  {album.capas.length > 0 ? (
                    <img 
                      src={album.capas[0].url} 
                      alt={`Capa de ${album.titulo}`}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity animate-[spin_10s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 animate-[spin_4s_linear_infinite] [animation-play-state:paused] group-hover:[animation-play-state:running]"></div>
                       <span className="relative z-20 text-xs font-mono uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Sem Capa</span>
                    </div>
                  )}
                  
                  {/* Center Hole */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 bg-cyber-black rounded-full border-2 border-gray-700 flex items-center justify-center z-20 shadow-inner">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Shine Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-full pointer-events-none z-30"></div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors truncate px-2">{album.titulo}</h3>
                  <p className="text-gray-500 font-mono text-sm mt-1">{album.anoLancamento}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
