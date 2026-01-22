package br.com.seletivo.musica.dto;

import jakarta.validation.constraints.NotBlank;

public record ArtistaRequest(
        @NotBlank String nome,
        String tipo
) {
}

