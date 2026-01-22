package br.com.seletivo.musica.service;

import br.com.seletivo.musica.domain.Album;
import br.com.seletivo.musica.domain.Artista;
import br.com.seletivo.musica.dto.AlbumCapaDto;
import br.com.seletivo.musica.dto.AlbumDto;
import br.com.seletivo.musica.dto.AlbumRequest;
import br.com.seletivo.musica.repository.AlbumRepository;
import br.com.seletivo.musica.repository.ArtistaRepository;
import br.com.seletivo.musica.storage.MinioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável por gerenciar Álbuns.
 * Inclui lógica de cadastro, listagem, upload de capas e notificação via WebSocket.
 */
@Service
@Transactional
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistaRepository artistaRepository;
    private final MinioService minioService;
    // Template para envio de mensagens WebSocket
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public AlbumService(AlbumRepository albumRepository,
                        ArtistaRepository artistaRepository,
                        MinioService minioService,
                        org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate) {
        this.albumRepository = albumRepository;
        this.artistaRepository = artistaRepository;
        this.minioService = minioService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Lista álbuns aplicando filtros opcionais (ID do artista ou nome do artista).
     */
    public Page<AlbumDto> listar(Long artistaId, String nomeArtista, Pageable pageable) {
        Page<Album> page;
        if (artistaId != null) {
            // Se foi passado ID do artista, busca apenas desse artista
            Artista artista = artistaRepository.findById(artistaId).orElseThrow();
            page = albumRepository.findByArtista(artista, pageable);
        } else if (nomeArtista != null && !nomeArtista.isBlank()) {
            // Se foi passado nome do artista, filtra por nome
            page = albumRepository.findByArtista_NomeContainingIgnoreCase(nomeArtista, pageable);
        } else {
            // Caso contrário, retorna todos os álbuns
            page = albumRepository.findAll(pageable);
        }
        // Converte para DTO (incluindo URLs de capas)
        return page.map(this::mapAlbum);
    }

    /**
     * Busca um álbum pelo ID.
     */
    public AlbumDto buscarPorId(Long id) {
        Album album = albumRepository.findById(id).orElseThrow();
        return mapAlbum(album);
    }

    /**
     * Cria um novo álbum para um artista e notifica usuários conectados.
     */
    public AlbumDto criar(Long artistaId, AlbumRequest request) {
        // Busca o artista dono do álbum
        Artista artista = artistaRepository.findById(artistaId).orElseThrow();
        
        Album album = new Album();
        album.setArtista(artista);
        album.setTitulo(request.titulo());
        album.setAnoLancamento(request.anoLancamento());
        
        // Salva o álbum
        album = albumRepository.save(album);
        
        AlbumDto dto = mapAlbum(album);

        // Notificar via WebSocket
        // Envia mensagem para o tópico "/topic/novos-albuns" que o frontend escuta
        try {
            messagingTemplate.convertAndSend("/topic/novos-albuns", "Novo álbum cadastrado: " + album.getTitulo() + " de " + artista.getNome());
        } catch (Exception e) {
            // Log erro mas não falha a transação se o WebSocket falhar
            e.printStackTrace();
        }

        return dto;
    }

    /**
     * Atualiza dados básicos do álbum.
     */
    public AlbumDto atualizar(Long id, AlbumRequest request) {
        Album album = albumRepository.findById(id).orElseThrow();
        album.setTitulo(request.titulo());
        album.setAnoLancamento(request.anoLancamento());
        album = albumRepository.save(album);
        return mapAlbum(album);
    }

    /**
     * Realiza o upload de imagens de capa para o álbum.
     * Salva os arquivos no MinIO e registra os metadados no banco.
     */
    public AlbumDto uploadCapas(Long albumId, List<MultipartFile> arquivos) {
        Album album = albumRepository.findById(albumId).orElseThrow();
        // Chama o serviço de armazenamento (MinIO)
        minioService.uploadCapas(album, arquivos);
        
        // Recarrega o álbum para trazer as capas recém-adicionadas
        Album atualizado = albumRepository.findById(albumId).orElseThrow();
        return mapAlbum(atualizado);
    }

    /**
     * Converte entidade Album para DTO, gerando URLs assinadas.
     */
    private AlbumDto mapAlbum(Album album) {
        var capasDto = album.getCapas().stream()
                .map(capa -> new AlbumCapaDto(
                        capa.getId(),
                        minioService.gerarUrlAssinada(capa, 30), // URL válida por 30 min
                        capa.getContentType()
                ))
                .collect(Collectors.toList());
        return new AlbumDto(album.getId(), album.getTitulo(), album.getAnoLancamento(), capasDto);
    }
}
