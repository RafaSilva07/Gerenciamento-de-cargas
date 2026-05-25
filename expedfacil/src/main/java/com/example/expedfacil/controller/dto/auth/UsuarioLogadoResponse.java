package com.example.expedfacil.controller.dto.auth;

import com.example.expedfacil.infrastructure.entitys.enums.CargoUsuario;
import com.example.expedfacil.infrastructure.entitys.enums.RoleUsuario;

public record UsuarioLogadoResponse(
        Long id,
        Integer matricula,
        String nome,
        CargoUsuario cargo,
        RoleUsuario role
) {
}
