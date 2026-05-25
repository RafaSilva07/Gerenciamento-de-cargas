package com.example.expedfacil.controller.dto.auth;

public record LoginResponse(
        String token,
        String tipo,
        long expiraEm,
        UsuarioLogadoResponse usuario
) {
}
