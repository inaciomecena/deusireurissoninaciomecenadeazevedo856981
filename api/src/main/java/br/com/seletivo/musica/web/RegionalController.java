package br.com.seletivo.musica.web;

import br.com.seletivo.musica.domain.Regional;
import br.com.seletivo.musica.service.RegionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/regionais")
@Tag(name = "Regionais", description = "Endpoints para sincronização e consulta de regionais")
public class RegionalController {

    private final RegionalService regionalService;

    public RegionalController(RegionalService regionalService) {
        this.regionalService = regionalService;
    }

    @PostMapping("/sincronizar")
    @Operation(summary = "Sincronizar Regionais", description = "Busca dados da API externa e sincroniza com a base local")
    public ResponseEntity<Void> sincronizar() {
        regionalService.sincronizar();
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "Listar Regionais Ativas", description = "Retorna lista de regionais ativas na base local")
    public ResponseEntity<List<Regional>> listar() {
        return ResponseEntity.ok(regionalService.findAllAtivos());
    }
}
