package com.example.expedfacil.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expedfacil.bussiness.AuthService;
import com.example.expedfacil.controller.dto.auth.LoginRequest;
import com.example.expedfacil.controller.dto.auth.LoginResponse;
import com.example.expedfacil.controller.dto.auth.UsuarioLogadoResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioLogadoResponse> me(Authentication authentication) {
        Integer matricula = Integer.valueOf(authentication.getName());
        return ResponseEntity.ok(authService.me(matricula));
    }
}
