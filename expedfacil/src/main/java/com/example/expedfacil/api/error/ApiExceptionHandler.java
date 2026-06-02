package com.example.expedfacil.api.error;


import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.bussiness.exception.RecursoNaoEncontradoException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice           // Ouvido Global de Erros
public class ApiExceptionHandler {

    @ExceptionHandler(Exception.class)      // Deve tratar exceÃƒÂ§oes do tipo Exception
    public ResponseEntity<ErroResponse> handleGenericException(Exception ex, HttpServletRequest req) {              // ERROR 500

        var body = ErroResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.name(),
                "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                req.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handleNotFound(RecursoNaoEncontradoException ex, HttpServletRequest req) {          // ERROR 404

        var body = ErroResponse.of(
                HttpStatus.NOT_FOUND.name(),
                ex.getMessage(),            // Mensagem que lanÃƒÂ§ar no service
                req.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroResponse> handleConflito(ConflitoException ex, HttpServletRequest req) {              // ERROR 409
        var body = ErroResponse.of(
                HttpStatus.CONFLICT.name(),
                ex.getMessage(),
                req.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        var body = ErroResponse.of(
                HttpStatus.UNAUTHORIZED.name(),
                ex.getMessage(),
                req.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new ErroResponse.CampoErro(err.getField(), err.getDefaultMessage()))
                .toList();

        var body = ErroResponse.of(
                HttpStatus.BAD_REQUEST.name(),
                "Erro de validacao nos dados enviados.",
                req.getRequestURI(),
                errors
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

}
