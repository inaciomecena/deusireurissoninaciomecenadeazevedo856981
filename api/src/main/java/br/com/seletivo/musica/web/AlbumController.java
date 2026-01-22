package br.com.seletivo.musica.web;

import br.com.seletivo.musica.dto.AlbumDto;
import br.com.seletivo.musica.dto.AlbumRequest;
import br.com.seletivo.musica.service.AlbumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

// Controlador REST para gerenciar Álbuns.
// Permite listar, criar, atualizar álbuns e fazer upload de capas.
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Álbuns", description = "Gerenciamento de álbuns")
public class AlbumController {

    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    // Listar álbuns, podendo filtrar por artista (ID ou nome).
    // Rota: GET /albuns
    @GetMapping("/albuns")
    @Operation(summary = "Listar álbuns", description = "Lista álbuns com filtros opcionais por artista")
    public Page<AlbumDto> listar(
            @RequestParam(required = false) Long artistaId,
            @RequestParam(required = false) String nomeArtista,
            @PageableDefault(size = 10, sort = "anoLancamento") Pageable pageable) {
        return service.listar(artistaId, nomeArtista, pageable);
    }

    // Buscar álbum por ID.
    @GetMapping("/albuns/{id}")
    @Operation(summary = "Buscar álbum", description = "Retorna detalhes de um álbum")
    public ResponseEntity<AlbumDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Criar álbum associado a um artista.
    // Rota: POST /artistas/{artistaId}/albuns
    @PostMapping("/artistas/{artistaId}/albuns")
    @Operation(summary = "Criar álbum", description = "Cria um álbum para um artista específico")
    public ResponseEntity<AlbumDto> criar(
            @PathVariable Long artistaId,
            @RequestBody @Valid AlbumRequest request,
            UriComponentsBuilder ucb) {
        AlbumDto criado = service.criar(artistaId, request);
        URI location = ucb.path("/albuns/{id}").buildAndExpand(criado.id()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    // Atualizar álbum.
    @PutMapping("/albuns/{id}")
    @Operation(summary = "Atualizar álbum", description = "Atualiza dados de um álbum")
    public ResponseEntity<AlbumDto> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AlbumRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    // Upload de capas para um álbum.
    // Consome Multipart form data.
    @PostMapping(value = "/albuns/{id}/capas", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload de capas", description = "Envia imagens de capa para o álbum")
    public ResponseEntity<AlbumDto> uploadCapas(
            @PathVariable Long id,
            @RequestPart("files") List<MultipartFile> files) {
        return ResponseEntity.ok(service.uploadCapas(id, files));
    }
}
