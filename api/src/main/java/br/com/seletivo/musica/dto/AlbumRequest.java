package br.com.seletivo.musica.dto;

import jakarta.validation.constraints.NotBlank;

public record AlbumRequest(
        @NotBlank String titulo,
        Integer anoLancamento
) {
}

