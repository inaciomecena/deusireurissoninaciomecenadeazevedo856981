package br.com.seletivo.musica.web;

import br.com.seletivo.musica.security.JwtService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@Validated
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // Endpoint de login.
    // Recebe username e password, valida e retorna tokens JWT (access + refresh) e dados do usuário.
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        try {
            // Autentica via Spring Security (verifica senha hash)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Gera Token de Acesso (curta duração, ex: 5 min)
            String accessToken = jwtService.generateAccessToken(userDetails.getUsername(), Map.of());
            // Gera Token de Refresh (longa duração, ex: 24h) para obter novos access tokens sem logar de novo
            String refreshToken = jwtService.generateRefreshToken(userDetails.getUsername());
            
            // Extrai roles do usuário para enviar ao front
            String roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));
            
            UserDto userDto = new UserDto(userDetails.getUsername(), roles);
            
            return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken, userDto));
        } catch (AuthenticationException ex) {
            // Falha na autenticação (senha errada ou usuário não encontrado)
            return ResponseEntity.status(401).build();
        }
    }

    // Endpoint para renovar o Access Token usando um Refresh Token válido.
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        // Valida se o refresh token é autêntico e não expirou
        if (!jwtService.isTokenValid(request.refreshToken())) {
            return ResponseEntity.status(401).build();
        }
        String username = jwtService.extractSubject(request.refreshToken());
        
        // Gera novo par de tokens
        String accessToken = jwtService.generateAccessToken(username, Map.of());
        String refreshToken = jwtService.generateRefreshToken(username);
        
        // No refresh, não precisamos retornar o user completo se o front não usa,
        // mas para consistência podemos retornar null ou recarregar o user.
        // O front ignora o campo user no refresh.
        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken, null));
    }

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {
    }

    public record RefreshRequest(
            @NotBlank String refreshToken
    ) {
    }

    public record TokenResponse(
            String accessToken,
            String refreshToken,
            UserDto user
    ) {
    }
    
    public record UserDto(
            String username,
            String roles
    ) {
    }
}
