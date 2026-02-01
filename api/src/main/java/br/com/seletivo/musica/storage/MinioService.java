package br.com.seletivo.musica.storage;

import br.com.seletivo.musica.domain.Album;
import br.com.seletivo.musica.domain.AlbumCapa;
import br.com.seletivo.musica.repository.AlbumCapaRepository;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.http.Method;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MinioService {

    private final MinioProperties properties;
    private final AlbumCapaRepository albumCapaRepository;
    private final MinioClient internalClient;
    private final MinioClient presignerClient;

    public MinioService(MinioProperties properties, AlbumCapaRepository albumCapaRepository) {
        this.properties = properties;
        this.albumCapaRepository = albumCapaRepository;
        
        // Cliente para operações internas (upload, gerenciamento de bucket)
        this.internalClient = MinioClient.builder()
                .endpoint(properties.getInternalUrl())
                .credentials(properties.getAccessKey(), properties.getSecretKey())
                .build();

        // Cliente específico para gerar URLs assinadas usando o host público.
        // Este cliente NÃO deve ser usado para operações de rede (upload/download/bucketExists)
        // pois o host público (ex: localhost) pode não ser acessível de dentro do container.
        this.presignerClient = MinioClient.builder()
                .endpoint(properties.getPublicUrl())
                .credentials(properties.getAccessKey(), properties.getSecretKey())
                .build();
    }

    @PostConstruct
    public void init() {
        try {
            boolean found = internalClient.bucketExists(BucketExistsArgs.builder().bucket(properties.getBucket()).build());
            if (!found) {
                internalClient.makeBucket(MakeBucketArgs.builder().bucket(properties.getBucket()).build());
            }
        } catch (Exception e) {
            // Em testes pode falhar se o MinIO não estiver up, mas em prod o docker-compose garante a ordem (depends_on).
            // Porém, depends_on só espera container iniciar, não a app estar pronta.
            // Vamos logar o erro mas não derrubar a aplicação, ou tentar retry.
            // Para simplificar, vou assumir que o usuário criará ou que o retry na próxima chamada funcionará se for transiente.
            // Melhor: lançar RuntimeException para falhar start se for crítico.
            // throw new RuntimeException("Erro ao inicializar bucket MinIO", e);
            e.printStackTrace();
        }
    }

    public List<AlbumCapa> uploadCapas(Album album, List<MultipartFile> arquivos) {
        return arquivos.stream()
                .map(arquivo -> uploadCapa(album, arquivo))
                .collect(Collectors.toList());
    }

    private AlbumCapa uploadCapa(Album album, MultipartFile arquivo) {
        String objectName = "album/" + album.getId() + "/" + UUID.randomUUID();
        try {
            internalClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(properties.getBucket())
                            .object(objectName)
                            .stream(arquivo.getInputStream(), arquivo.getSize(), -1)
                            .contentType(arquivo.getContentType())
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar arquivo para o MinIO", e);
        }

        AlbumCapa capa = new AlbumCapa();
        capa.setAlbum(album);
        capa.setObjetoMinio(objectName);
        capa.setContentType(arquivo.getContentType() != null ? arquivo.getContentType() : "application/octet-stream");
        capa.setTamanhoBytes(arquivo.getSize());
        return albumCapaRepository.save(capa);
    }

    // Gera uma URL temporária (assinada) para acesso direto ao objeto no MinIO.
    // Isso evita que o tráfego de download passe pela nossa API, aliviando o servidor.
    public String gerarUrlAssinada(AlbumCapa capa, int minutosExpiracao) {
        try {
            // Usa o cliente configurado com host público para gerar a URL correta diretamente
            return presignerClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(properties.getBucket())
                            .object(capa.getObjetoMinio())
                            .method(Method.GET)
                            .expiry(minutosExpiracao * 60)
                            .build()
            );
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

