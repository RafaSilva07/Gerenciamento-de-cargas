package com.example.expedfacil.controller.dto.usuario;

import com.example.expedfacil.infrastructure.entitys.enums.CargoUsuario;
import com.example.expedfacil.infrastructure.entitys.enums.RoleUsuario;

public record UsuarioResponse(
        Long id,
        Integer matricula,
        String nome,
        CargoUsuario cargo,
        RoleUsuario role,
        boolean ativo
) {
}
