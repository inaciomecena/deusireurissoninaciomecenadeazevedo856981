import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../services/api';

export default function ArtistaFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: '',
      tipo: 'SOLO',
      albuns: [] as { titulo: string, anoLancamento: number, files?: FileList }[]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'albuns'
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/artistas/${id}`).then(res => {
        reset({ nome: res.data.nome, tipo: res.data.tipo, albuns: [] });
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: any) => {
    try {
      let artistaId = id;
      
      if (isEdit) {
        await api.put(`/artistas/${id}`, { nome: data.nome, tipo: data.tipo });
      } else {
        const res = await api.post('/artistas', { nome: data.nome, tipo: data.tipo });
        artistaId = res.data.id;
      }

      for (const album of data.albuns) {
        const albumRes = await api.post(`/artistas/${artistaId}/albuns`, {
          titulo: album.titulo,
          anoLancamento: album.anoLancamento
        });

        if (album.files && album.files.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < album.files.length; i++) {
            formData.append('files', album.files[i]);
          }
          await api.post(`/albuns/${albumRes.data.id}/capas`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      navigate(isEdit ? `/artistas/${id}` : '/artistas');
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert('Erro ao salvar. Verifique o console.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {isEdit ? 'Editar Artista' : 'Novo Artista'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEdit ? 'Atualize as informações do artista' : 'Adicione um novo talento ao catálogo'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/artistas')}
          className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2"
        >
          &larr; Voltar para lista
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-cyber-dark/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-neon-blue mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
            Informações Básicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">Nome do Artista/Banda</label>
              <input 
                {...register('nome', { required: true })} 
                className="w-full bg-cyber-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
                placeholder="Ex: Daft Punk"
              />
            </div>
            
            <div className="group">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-white transition-colors">Tipo de Formação</label>
              <div className="relative">
                <select 
                  {...register('tipo')} 
                  className="w-full bg-cyber-black/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(192,132,252,0.3)] transition-all"
                >
                  <option value="SOLO">Solo</option>
                  <option value="BANDA">Banda</option>
                  <option value="DUPLA">Dupla</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Albums Section */}
        <div className="bg-cyber-dark/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="text-xl font-bold text-neon-purple mb-0 flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></span>
              Discografia
            </h2>
            <button 
              type="button" 
              onClick={() => append({ titulo: '', anoLancamento: new Date().getFullYear() })} 
              className="px-4 py-2 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-lg hover:bg-neon-purple hover:text-white transition-all text-sm font-bold uppercase tracking-wide"
            >
              + Adicionar Álbum
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {fields.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-500">Nenhum álbum adicionado ainda.</p>
                <p className="text-gray-600 text-sm">Comece a construir o legado.</p>
              </div>
            )}
            
            {fields.map((field, index) => (
              <div key={field.id} className="group relative bg-cyber-black/40 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all hover:shadow-lg">
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                  title="Remover álbum"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-1 flex justify-center pt-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500 border border-white/5">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="md:col-span-5 space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Título do Álbum</label>
                      <input 
                        {...register(`albuns.${index}.titulo` as const, { required: true })}
                        className="w-full bg-cyber-black border border-white/10 rounded px-3 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors"
                        placeholder="Nome do álbum"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Ano de Lançamento</label>
                      <input 
                        type="number"
                        {...register(`albuns.${index}.anoLancamento` as const, { required: true })}
                        className="w-full bg-cyber-black border border-white/10 rounded px-3 py-2 text-white focus:border-neon-purple focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-1">Capa do Álbum</label>
                    <div className="relative border-2 border-dashed border-white/10 rounded-lg p-4 hover:border-neon-blue/50 transition-colors bg-white/5 text-center group-hover:bg-white/10 cursor-pointer">
                      <input 
                        type="file"
                        accept="image/*"
                        {...register(`albuns.${index}.files` as const)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-500 mb-2 group-hover:text-neon-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-400">Clique ou arraste a capa aqui</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:-translate-y-1 transition-all active:translate-y-0"
          >
            Salvar Artista
          </button>
        </div>
      </form>
    </div>
  );
}
