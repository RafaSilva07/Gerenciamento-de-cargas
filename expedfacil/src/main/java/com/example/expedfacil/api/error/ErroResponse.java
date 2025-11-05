package com.example.expedfacil.api.error;

import java.time.OffsetDateTime;
import java.util.List;

public record ErroResponse(
        String type,   // Valores como: BAD_REQUEST , NOT_FOUND , CONFLICT
        String message, // Mensagem "humana" explicando o erro
        String path, // Caminho da requisiçao
        OffsetDateTime timestamp, // Data e Hora do Erro
        List<CampoErro> errors // Lista opcional com erros de campos e validaçao
) {

    public record CampoErro(String field, String message) {}

    public static ErroResponse of(String type, String message, String path) {
        return new ErroResponse(type, message, path, OffsetDateTime.now(), List.of());
    }

    public static ErroResponse of(String type, String message, String path, List<CampoErro> errors) {
        return new ErroResponse(type, message, path, OffsetDateTime.now(),
                errors == null ? List.of() : errors);
    }


}
