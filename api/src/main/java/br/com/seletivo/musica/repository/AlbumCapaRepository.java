package br.com.seletivo.musica.repository;

import br.com.seletivo.musica.domain.Album;
import br.com.seletivo.musica.domain.AlbumCapa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlbumCapaRepository extends JpaRepository<AlbumCapa, Long> {

    List<AlbumCapa> findByAlbum(Album album);
}

