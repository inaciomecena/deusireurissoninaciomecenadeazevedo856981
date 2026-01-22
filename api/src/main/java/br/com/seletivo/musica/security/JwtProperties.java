package br.com.seletivo.musica.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String secret;
    private int expirationMinutes;
    private int refreshExpirationMinutes;

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public int getExpirationMinutes() {
        return expirationMinutes;
    }

    public void setExpirationMinutes(int expirationMinutes) {
        this.expirationMinutes = expirationMinutes;
    }

    public int getRefreshExpirationMinutes() {
        return refreshExpirationMinutes;
    }

    public void setRefreshExpirationMinutes(int refreshExpirationMinutes) {
        this.refreshExpirationMinutes = refreshExpirationMinutes;
    }
}

