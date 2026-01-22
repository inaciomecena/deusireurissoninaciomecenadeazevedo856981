package br.com.seletivo.musica.repository;

import br.com.seletivo.musica.domain.Regional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegionalRepository extends JpaRepository<Regional, Long> {

    List<Regional> findByAtivoTrue();

    Optional<Regional> findFirstByCodigoExternoAndAtivoTrue(Integer codigoExterno);
}

