package com.example.expedfacil.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expedfacil.bussiness.UsuarioService;
import com.example.expedfacil.controller.dto.usuario.UsuarioCreateRequest;
import com.example.expedfacil.controller.dto.usuario.UsuarioResponse;
import com.example.expedfacil.controller.dto.usuario.UsuarioSenhaUpdateRequest;
import com.example.expedfacil.controller.dto.usuario.UsuarioUpdateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuario")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<UsuarioResponse>> listar(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable
    ) {
        return ResponseEntity.ok(usuarioService.listarAtivos(pageable));
    }

    @PostMapping
    public ResponseEntity<String> criar(@Valid @RequestBody UsuarioCreateRequest request) {
        usuarioService.criarUsuario(request);
        return ResponseEntity.ok("Usuario criado com sucesso.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateRequest request) {
        usuarioService.atualizarUsuario(id, request);
        return ResponseEntity.ok("Usuario atualizado com sucesso.");
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<String> atualizarSenha(@PathVariable Long id,
                                                 @Valid @RequestBody UsuarioSenhaUpdateRequest request) {
        usuarioService.atualizarSenha(id, request);
        return ResponseEntity.ok("Senha atualizada com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> desativar(@PathVariable Long id, Authentication authentication) {
        Integer matriculaLogada = Integer.valueOf(authentication.getName());
        usuarioService.desativarUsuario(id, matriculaLogada);
        return ResponseEntity.ok("Usuario desativado com sucesso.");
    }
}
