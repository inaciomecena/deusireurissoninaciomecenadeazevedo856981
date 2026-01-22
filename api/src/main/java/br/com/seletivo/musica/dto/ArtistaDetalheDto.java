package br.com.seletivo.musica.dto;

import java.util.List;

public record ArtistaDetalheDto(
        Long id,
        String nome,
        String tipo,
        List<AlbumDto> albuns
) {
}

