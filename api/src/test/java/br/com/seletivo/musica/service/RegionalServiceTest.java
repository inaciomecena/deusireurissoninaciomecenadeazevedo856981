package br.com.seletivo.musica.service;

import br.com.seletivo.musica.domain.Regional;
import br.com.seletivo.musica.repository.RegionalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegionalServiceTest {

    @Mock
    private RegionalRepository regionalRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RegionalService regionalService;

    @Test
    void findAllAtivos_DeveRetornarLista_QuandoExistiremRegionais() {
        // Arrange
        Regional regional = new Regional();
        regional.setNome("Regional 1");
        regional.setAtivo(true);
        when(regionalRepository.findByAtivoTrue()).thenReturn(List.of(regional));

        // Act
        List<Regional> result = regionalService.findAllAtivos();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Regional 1", result.get(0).getNome());
        verify(regionalRepository, times(1)).findByAtivoTrue();
    }
}
