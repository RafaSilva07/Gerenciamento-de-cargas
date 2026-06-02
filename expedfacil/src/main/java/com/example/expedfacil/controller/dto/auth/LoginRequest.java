package com.example.expedfacil.controller.dto.auth;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record LoginRequest(
        @NotNull @Min(1) @Max(9999) Integer matricula,
        @NotNull String senha
) {
}
