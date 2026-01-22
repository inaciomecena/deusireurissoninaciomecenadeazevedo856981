package br.com.seletivo.musica.web;

import br.com.seletivo.musica.dto.ArtistaDetalheDto;
import br.com.seletivo.musica.dto.ArtistaRequest;
import br.com.seletivo.musica.dto.ArtistaResumoDto;
import br.com.seletivo.musica.service.ArtistaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

// Controlador REST para gerenciar Artistas.
// Disponibiliza endpoints para criar, listar, buscar e atualizar artistas.
@RestController
@RequestMapping("/api/v1/artistas")
@Tag(name = "Artistas", description = "Gerenciamento de artistas")
public class ArtistaController {

    private final ArtistaService service;

    public ArtistaController(ArtistaService service) {
        this.service = service;
    }

    // Endpoint para listar artistas com paginação e filtro opcional por nome.
    // Exemplo: GET /artistas?nome=Banda&page=0&size=10
    @GetMapping
    @Operation(summary = "Listar artistas", description = "Retorna uma lista paginada de artistas")
    public Page<ArtistaResumoDto> listar(
            @RequestParam(required = false) String nome,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.listar(nome, pageable);
    }

    // Endpoint para buscar os detalhes de um artista pelo ID.
    // Inclui a lista de álbuns do artista.
    @GetMapping("/{id}")
    @Operation(summary = "Buscar artista por ID", description = "Retorna detalhes do artista e seus álbuns")
    public ResponseEntity<ArtistaDetalheDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Endpoint para cadastrar um novo artista.
    @PostMapping
    @Operation(summary = "Criar artista", description = "Cadastra um novo artista")
    public ResponseEntity<ArtistaDetalheDto> criar(
            @RequestBody @Valid ArtistaRequest request,
            UriComponentsBuilder ucb) {
        ArtistaDetalheDto criado = service.criar(request);
        URI location = ucb.path("/artistas/{id}").buildAndExpand(criado.id()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    // Endpoint para atualizar dados de um artista existente.
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar artista", description = "Atualiza dados de um artista existente")
    public ResponseEntity<ArtistaDetalheDto> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ArtistaRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }
}
