package com.example.expedfacil.controller.dto.usuario;

import com.example.expedfacil.infrastructure.entitys.enums.CargoUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioUpdateRequest(
        @NotBlank String nome,
        @NotNull CargoUsuario cargo,
        String senha
) {
}
