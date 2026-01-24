package br.com.seletivo.musica.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "minio")
public class MinioProperties {

    private String internalHost;
    private int internalPort;
    private String publicHost;
    private int publicPort;
    private String accessKey;
    private String secretKey;
    private String bucket;

    public String getInternalUrl() {
        return String.format("http://%s:%d", internalHost, internalPort);
    }

    public String getPublicUrl() {
        return String.format("http://%s:%d", publicHost, publicPort);
    }

    public String getInternalHost() {
        return internalHost;
    }

    public void setInternalHost(String internalHost) {
        this.internalHost = internalHost;
    }

    public int getInternalPort() {
        return internalPort;
    }

    public void setInternalPort(int internalPort) {
        this.internalPort = internalPort;
    }

    public String getPublicHost() {
        return publicHost;
    }

    public void setPublicHost(String publicHost) {
        this.publicHost = publicHost;
    }

    public int getPublicPort() {
        return publicPort;
    }

    public void setPublicPort(int publicPort) {
        this.publicPort = publicPort;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getBucket() {
        return bucket;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }
}

