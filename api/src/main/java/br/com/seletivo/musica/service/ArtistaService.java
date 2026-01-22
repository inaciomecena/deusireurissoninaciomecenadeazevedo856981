package br.com.seletivo.musica.service;

import br.com.seletivo.musica.domain.Album;
import br.com.seletivo.musica.domain.Artista;
import br.com.seletivo.musica.dto.AlbumCapaDto;
import br.com.seletivo.musica.dto.AlbumDto;
import br.com.seletivo.musica.dto.ArtistaDetalheDto;
import br.com.seletivo.musica.dto.ArtistaRequest;
import br.com.seletivo.musica.dto.ArtistaResumoDto;
import br.com.seletivo.musica.repository.AlbumRepository;
import br.com.seletivo.musica.repository.ArtistaRepository;
import br.com.seletivo.musica.storage.MinioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * Serviço responsável pelas regras de negócio relacionadas a Artistas.
 * Utiliza @Service para que o Spring gerencie essa classe como um componente.
 * Utiliza @Transactional para garantir que as operações no banco sejam atômicas.
 */
@Service
@Transactional
public class ArtistaService {

    private final ArtistaRepository artistaRepository;
    private final AlbumRepository albumRepository;
    private final MinioService minioService;

    // Injeção de dependências via construtor (prática recomendada).
    public ArtistaService(ArtistaRepository artistaRepository,
                          AlbumRepository albumRepository,
                          MinioService minioService) {
        this.artistaRepository = artistaRepository;
        this.albumRepository = albumRepository;
        this.minioService = minioService;
    }

    /**
     * Lista artistas com paginação.
     * Se um nome for fornecido, filtra por nome (case insensitive).
     * Caso contrário, retorna todos.
     */
    public Page<ArtistaResumoDto> listar(String nome, Pageable pageable) {
        Page<Artista> page;
        if (nome == null || nome.isBlank()) {
            // Busca todos se não houver filtro
            page = artistaRepository.findAll(pageable);
        } else {
            // Busca contendo o nome ignorando maiúsculas/minúsculas
            page = artistaRepository.findByNomeContainingIgnoreCase(nome, pageable);
        }
        // Converte a entidade Artista para o DTO de resumo
        return page.map(artista -> new ArtistaResumoDto(
                artista.getId(),
                artista.getNome(),
                artista.getTipo(),
                artista.getAlbuns() != null ? artista.getAlbuns().size() : 0
        ));
    }

    /**
     * Busca os detalhes de um artista pelo ID.
     * Inclui a lista de álbuns, gerando URLs temporárias para as capas.
     */
    public ArtistaDetalheDto buscarPorId(Long id) {
        // Busca o artista ou lança exceção se não encontrar
        Artista artista = artistaRepository.findById(id).orElseThrow();
        
        // Busca os álbuns associados ao artista
        var albuns = albumRepository.findByArtista(artista, Pageable.unpaged()).getContent();
        
        // Converte cada álbum para DTO, gerando as URLs assinadas das capas
        var albunsDto = albuns.stream()
                .map(this::mapAlbum)
                .collect(Collectors.toList());
        
        return new ArtistaDetalheDto(
                artista.getId(),
                artista.getNome(),
                artista.getTipo(),
                albunsDto
        );
    }

    /**
     * Cria um novo artista a partir dos dados da requisição.
     */
    public ArtistaDetalheDto criar(ArtistaRequest request) {
        Artista artista = new Artista();
        artista.setNome(request.nome());
        artista.setTipo(request.tipo());
        // Salva no banco de dados
        artista = artistaRepository.save(artista);
        // Retorna o DTO com a lista de álbuns vazia inicialmente
        return new ArtistaDetalheDto(artista.getId(), artista.getNome(), artista.getTipo(), java.util.List.of());
    }

    /**
     * Atualiza os dados de um artista existente.
     */
    public ArtistaDetalheDto atualizar(Long id, ArtistaRequest request) {
        Artista artista = artistaRepository.findById(id).orElseThrow();
        artista.setNome(request.nome());
        artista.setTipo(request.tipo());
        artista = artistaRepository.save(artista);
        // Retorna os dados atualizados chamando o método de busca
        return buscarPorId(artista.getId());
    }

    /**
     * Método auxiliar para converter a entidade Album em AlbumDto.
     * Responsável por gerar as URLs assinadas (presigned URLs) para as imagens no MinIO.
     */
    private AlbumDto mapAlbum(Album album) {
        var capasDto = album.getCapas().stream()
                .map(capa -> new AlbumCapaDto(
                        capa.getId(),
                        // Gera URL válida por 30 minutos
                        minioService.gerarUrlAssinada(capa, 30),
                        capa.getContentType()
                ))
                .collect(Collectors.toList());
        return new AlbumDto(album.getId(), album.getTitulo(), album.getAnoLancamento(), capasDto);
    }
}
