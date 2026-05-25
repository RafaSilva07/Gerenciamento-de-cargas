package com.example.expedfacil.controller.dto.usuario;

import com.example.expedfacil.infrastructure.entitys.enums.CargoUsuario;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioCreateRequest(
        @NotNull @Min(1) @Max(9999) Integer matricula,
        @NotBlank String nome,
        @NotNull CargoUsuario cargo,
        @NotBlank String senha
) {
}
