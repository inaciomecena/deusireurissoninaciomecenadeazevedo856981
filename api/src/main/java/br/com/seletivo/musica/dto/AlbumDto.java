package br.com.seletivo.musica.dto;

import java.util.List;

public record AlbumDto(
        Long id,
        String titulo,
        Integer anoLancamento,
        List<AlbumCapaDto> capas
) {
}

