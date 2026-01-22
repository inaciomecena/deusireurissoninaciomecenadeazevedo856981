package br.com.seletivo.musica.dto;

public record ArtistaResumoDto(
        Long id,
        String nome,
        String tipo,
        long quantidadeAlbuns
) {
}

