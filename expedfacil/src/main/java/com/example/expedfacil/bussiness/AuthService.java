package com.example.expedfacil.bussiness;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.example.expedfacil.controller.dto.auth.LoginRequest;
import com.example.expedfacil.controller.dto.auth.LoginResponse;
import com.example.expedfacil.controller.dto.auth.UsuarioLogadoResponse;
import com.example.expedfacil.infrastructure.entitys.Usuario;
import com.example.expedfacil.infrastructure.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(String.valueOf(request.matricula()), request.senha())
            );
        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Matricula ou senha invalidas.");
        }

        Usuario usuario = usuarioRepository.findByMatriculaAndAtivoTrue(request.matricula())
                .orElseThrow(() -> new BadCredentialsException("Matricula ou senha invalidas."));

        String token = jwtService.generateToken(usuario);

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationMs(),
                toUsuarioLogadoResponse(usuario)
        );
    }

    public UsuarioLogadoResponse me(Integer matricula) {
        Usuario usuario = usuarioRepository.findByMatriculaAndAtivoTrue(matricula)
                .orElseThrow(() -> new BadCredentialsException("Usuario nao autenticado."));

        return toUsuarioLogadoResponse(usuario);
    }

    private UsuarioLogadoResponse toUsuarioLogadoResponse(Usuario usuario) {
        return new UsuarioLogadoResponse(
                usuario.getId(),
                usuario.getMatricula(),
                usuario.getNome(),
                usuario.getCargo(),
                usuario.getRole()
        );
    }
}
