package br.com.seletivo.musica.repository;

import br.com.seletivo.musica.domain.Album;
import br.com.seletivo.musica.domain.Artista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Page<Album> findByArtista(Artista artista, Pageable pageable);

    Page<Album> findByArtista_NomeContainingIgnoreCase(String nomeArtista, Pageable pageable);
}

