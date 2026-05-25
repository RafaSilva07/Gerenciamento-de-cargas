package com.example.expedfacil.controller.dto.usuario;

import jakarta.validation.constraints.NotBlank;

public record UsuarioSenhaUpdateRequest(
        @NotBlank String senha
) {
}
