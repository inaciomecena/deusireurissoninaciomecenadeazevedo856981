package br.com.seletivo.musica.service;

import br.com.seletivo.musica.domain.Regional;
import br.com.seletivo.musica.repository.RegionalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Serviço responsável pela sincronização e consulta de Regionais.
 * Implementa lógica de integração com API externa.
 */
@Service
public class RegionalService {

    private final RegionalRepository regionalRepository;
    private final RestTemplate restTemplate;

    public RegionalService(RegionalRepository regionalRepository) {
        this.regionalRepository = regionalRepository;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Retorna todas as regionais ativas cadastradas no banco local.
     */
    @Transactional(readOnly = true)
    public List<Regional> findAllAtivos() {
        return regionalRepository.findByAtivoTrue();
    }

    /**
     * Realiza a sincronização de dados com a API externa.
     * Algoritmo O(n) utilizando Mapas para evitar loops aninhados (O(n²)).
     *
     * Regras:
     * 1. Se existe na API e não no banco -> Cria.
     * 2. Se existe em ambos mas nome mudou -> Inativa antigo e cria novo (histórico).
     * 3. Se existe no banco e não na API -> Inativa.
     */
    @Transactional
    public void sincronizar() {
        // 1. Buscar dados remotos (API externa)
        // URL hardcoded para o teste, idealmente viria de properties
        RegionalDto[] remotosArray = restTemplate.getForObject("https://integrador-argus-api.geia.vip/v1/regionais", RegionalDto[].class);
        if (remotosArray == null) remotosArray = new RegionalDto[0];

        // Transforma lista remota em Mapa para acesso rápido (O(1)) por ID
        Map<Integer, RegionalDto> remotosMap = Arrays.stream(remotosArray)
                .collect(Collectors.toMap(RegionalDto::getId, Function.identity()));

        // 2. Buscar locais ativos
        List<Regional> locaisAtivos = regionalRepository.findByAtivoTrue();
        // Transforma lista local em Mapa
        Map<Integer, Regional> locaisMap = locaisAtivos.stream()
                .collect(Collectors.toMap(Regional::getCodigoExterno, Function.identity()));

        // 3. Processar: Novos e Alterados (Itera sobre o que veio da API)
        for (RegionalDto remoto : remotosMap.values()) {
            Regional local = locaisMap.get(remoto.getId());

            if (local == null) {
                // Novo no endpoint (não existe localmente) -> Inserir
                criarRegional(remoto);
            } else {
                // Já existe localmente, verificar se houve mudança
                if (!local.getNome().equals(remoto.getNome())) {
                    // Mudou o nome -> Inativar o registro anterior e criar um novo
                    inativarRegional(local);
                    criarRegional(remoto);
                }
                // Remover do mapa local para marcar como "processado"
                // O que sobrar no mapa local significa que não veio na API (foi removido lá)
                locaisMap.remove(remoto.getId());
            }
        }

        // 4. Processar: Removidos (sobraram no mapa local)
        for (Regional local : locaisMap.values()) {
            // Se sobrou aqui, é porque não existe mais na API externa
            inativarRegional(local);
        }
    }

    /**
     * Cria uma nova regional ativa.
     */
    private void criarRegional(RegionalDto dto) {
        Regional novo = new Regional();
        novo.setCodigoExterno(dto.getId());
        novo.setNome(dto.getNome());
        novo.setAtivo(true);
        novo.setDataCriacao(Instant.now());
        regionalRepository.save(novo);
    }

    /**
     * Inativa uma regional existente (soft delete).
     */
    private void inativarRegional(Regional regional) {
        regional.setAtivo(false);
        regional.setDataInativacao(Instant.now());
        regionalRepository.save(regional);
    }

    /**
     * DTO interno para mapear a resposta da API externa.
     */
    public static class RegionalDto {
        private Integer id;
        private String nome;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
    }
}
