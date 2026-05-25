package com.example.expedfacil.bussiness;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.expedfacil.infrastructure.entitys.Usuario;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateToken(Usuario usuario) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(String.valueOf(usuario.getMatricula()))
                .issuedAt(now)
                .expiration(expiryDate)
                .claim("role", usuario.getRole().name())
                .claim("nome", usuario.getNome())
                .signWith(getSigningKey())
                .compact();
    }

    public String extractMatricula(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValido(String token, UserDetails userDetails) {
        String matricula = extractMatricula(token);
        return matricula.equals(userDetails.getUsername()) && !isTokenExpirado(token);
    }

    public long getExpirationMs() {
        return jwtExpirationMs;
    }

    private boolean isTokenExpirado(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}
